"""Discover/refresh ONUs for an OLT via SNMP. Best-effort and vendor specific.

Two discovery strategies:
  * serial-table walk  — Huawei/ZTE expose an ONU serial column directly.
  * IF-MIB walk         — BDCOM/VSOL/C-Data/generic EPON OLTs expose each ONU as an
                          interface (``EPON0/1:5``); BDCOM is further enriched with
                          MAC / status / Rx-power from its enterprise tables.
"""
from decimal import Decimal, InvalidOperation

from django.utils import timezone

from . import oids
from ..models import Onu
from .snmp import OltSnmp, diagnostic_message, format_mac


def _to_decimal(value, scale):
    try:
        return (Decimal(str(value)) * Decimal(str(scale))).quantize(Decimal("0.01"))
    except (InvalidOperation, TypeError, ValueError):
        return None


def _bdcom_rx(value):
    try:
        raw = int(str(value).strip())
    except (TypeError, ValueError):
        return None
    return Decimal(raw) / Decimal(10) if raw else None  # 0 means "no reading"


def _is_onu_iface(descr: str) -> bool:
    s = (descr or "").lower()
    return ":" in s and any(k in s for k in ("epon", "gpon", "pon", "onu"))


def sync_onus(olt) -> dict:
    vendor = (olt.vendor or "generic").lower()
    snmp = OltSnmp(
        olt.host, olt.snmp_community, olt.snmp_port,
        timeout=getattr(olt, "timeout", None) or 10,
    )
    if not snmp.available:
        return {"ok": False, "message": "SNMP client library is not installed on the server."}

    # Reachability probe first so unreachable OLTs get a clear, actionable message.
    if snmp.system_info() is None:
        return {"ok": False, "message": diagnostic_message(olt, snmp)}

    if vendor in oids.VENDOR_OIDS:
        return _sync_serial(olt, snmp, oids.VENDOR_OIDS[vendor])
    return _sync_ifmib(olt, snmp, vendor)


def _sync_serial(olt, snmp, profile) -> dict:
    rx = {i: v for i, v in snmp.walk(profile["onu_rx_power"])} if profile.get("onu_rx_power") else {}
    st = {i: v for i, v in snmp.walk(profile["onu_run_status"])} if profile.get("onu_run_status") else {}
    scale = profile.get("rx_scale", 0.01)

    serials = list(snmp.walk(profile["onu_serial"]))
    if not serials:
        return {"ok": True, "found": 0, "created": 0, "updated": 0,
                "message": "Connected, but the OLT returned no ONUs on the serial table."}

    created = updated = 0
    for index, serial in serials:
        defaults = {
            "serial_number": str(serial),
            "status": "online" if str(st.get(index, "")).strip() in ("1", "up", "online") else "offline",
            "rx_power": _to_decimal(rx.get(index), scale),
            "last_seen": timezone.now(),
        }
        _, was_created = Onu.objects.update_or_create(olt=olt, onu_index=str(index), defaults=defaults)
        created += int(was_created)
        updated += int(not was_created)
    return {"ok": True, "found": len(serials), "created": created, "updated": updated}


def _sync_ifmib(olt, snmp, vendor) -> dict:
    descrs = dict(snmp.walk(oids.IF_DESCR))
    onu_ifaces = {i: d for i, d in descrs.items() if _is_onu_iface(d)}
    if not onu_ifaces:
        return {"ok": True, "found": 0, "created": 0, "updated": 0,
                "message": "Connected to the OLT, but no ONU interfaces were found via "
                           "IF-MIB. If ONUs are only listed over Telnet on this model, "
                           "add them manually."}

    oper = dict(snmp.walk(oids.IF_OPER_STATUS))
    alias = dict(snmp.walk(oids.IF_ALIAS))

    macs, bstatus, rxp = {}, {}, {}
    if vendor == "bdcom":
        macs = {i: format_mac(v) for i, v in snmp.walk(oids.BDCOM["onu_mac"], raw=True)}
        bstatus = dict(snmp.walk(oids.BDCOM["onu_status"]))
        rxp = dict(snmp.walk(oids.BDCOM["onu_rx_power"]))

    created = updated = 0
    for idx, descr in onu_ifaces.items():
        if vendor == "bdcom" and idx in bstatus:
            status = "online" if str(bstatus[idx]).strip() in oids.BDCOM_ONLINE else "offline"
        else:
            status = "online" if str(oper.get(idx, "")).strip() in ("1", "up") else "offline"
        defaults = {
            "name": (alias.get(idx) or descr).strip(),
            "pon_port": str(descr).split(":")[0].strip(),
            "serial_number": macs.get(idx, ""),
            "status": status,
            "rx_power": _bdcom_rx(rxp.get(idx)) if vendor == "bdcom" else None,
            "last_seen": timezone.now(),
        }
        _, was_created = Onu.objects.update_or_create(olt=olt, onu_index=str(idx), defaults=defaults)
        created += int(was_created)
        updated += int(not was_created)
    return {"ok": True, "found": len(onu_ifaces), "created": created, "updated": updated}
