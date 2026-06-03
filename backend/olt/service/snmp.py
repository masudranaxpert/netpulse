"""Thin synchronous SNMP wrapper around puresnmp with graceful failure + diagnostics.

Real-world OLTs (especially the BDCOM/VSOL families common in Bangladesh) are
frequently configured for SNMP **v2c only** and have slow CPUs that answer SNMP
with low priority. So we:
  * try v2c first, then fall back to v1,
  * remember whichever version answered,
  * keep a small retry budget and a generous timeout,
  * never raise (callers treat ``None`` / empty walks as "unreachable").
"""
from . import oids

try:
    import puresnmp
    _AVAILABLE = True
except Exception:  # noqa: BLE001
    _AVAILABLE = False

# Raw SNMP version numbers used by puresnmp (v1 = 0, v2c = 1).
V1 = 0
V2C = 1


def _decode(value):
    if isinstance(value, bytes):
        try:
            return value.decode("utf-8", "replace").strip()
        except Exception:  # noqa: BLE001
            return value.hex()
    return value


def format_mac(value) -> str:
    """Format a 6-byte SNMP OCTET STRING as a colon MAC; pass through otherwise."""
    if isinstance(value, bytes) and len(value) == 6:
        return ":".join(f"{b:02x}" for b in value)
    text = _decode(value)
    return str(text).strip() if text is not None else ""


class OltSnmp:
    def __init__(self, host, community="public", port=161, timeout=10, retries=1):
        self.host = host
        self.community = community
        self.port = port or 161
        self.timeout = max(int(timeout or 10), 3)
        self.retries = retries
        self.version = None  # set to whichever version first answers
        self.last_error = None

    @property
    def available(self) -> bool:
        return _AVAILABLE

    def _versions(self):
        return [self.version] if self.version is not None else [V2C, V1]

    def get(self, oid):
        if not _AVAILABLE:
            self.last_error = "SNMP client library is not installed on the server."
            return None
        for version in self._versions():
            for _ in range(self.retries + 1):
                try:
                    value = puresnmp.get(
                        self.host, self.community, oid,
                        port=self.port, timeout=self.timeout, version=version,
                    )
                    self.version = version
                    return _decode(value)
                except Exception as exc:  # noqa: BLE001
                    self.last_error = str(exc) or exc.__class__.__name__
        return None

    def walk(self, base_oid, raw=False):
        """Yield (index, value) pairs; ``index`` is the trailing OID part.

        ``raw=True`` returns the undecoded value (needed for MAC octet strings).
        """
        if not _AVAILABLE:
            return
        for version in self._versions():
            produced = False
            try:
                for full_oid, value in puresnmp.walk(
                    self.host, self.community, base_oid,
                    port=self.port, timeout=self.timeout, version=version,
                ):
                    produced = True
                    self.version = version
                    index = str(full_oid)[len(base_oid):].lstrip(".")
                    yield index, (value if raw else _decode(value))
            except Exception as exc:  # noqa: BLE001
                self.last_error = str(exc) or exc.__class__.__name__
            if produced:
                return

    def system_info(self) -> dict | None:
        descr = self.get(oids.SYS_DESCR)
        if descr is None:
            return None
        return {
            "description": descr,
            "name": self.get(oids.SYS_NAME),
            "uptime": str(self.get(oids.SYS_UPTIME)),
            "location": self.get(oids.SYS_LOCATION),
            "snmp_version": "v2c" if self.version == V2C else "v1",
        }


def diagnostic_message(olt, snmp: "OltSnmp") -> str:
    """Actionable explanation shown when an OLT does not answer SNMP."""
    if not snmp.available:
        return "SNMP client library is not installed on the server."
    detail = f" Last error: {snmp.last_error}." if snmp.last_error else ""
    return (
        f"No SNMP reply from {olt.host}:{olt.snmp_port} using community "
        f"'{olt.snmp_community}' (tried v2c and v1, {snmp.timeout}s timeout).{detail} "
        "Checklist — (1) Enable SNMP on the OLT, e.g. BDCOM: "
        "'snmp-server community <name> ro' and "
        "'snmp-server host <this-server-ip> version 2c <name>'. "
        "(2) The community name must match exactly (case-sensitive). "
        "(3) UDP port 161 must be reachable end-to-end — check ACLs, firewall and NAT, "
        "and confirm the host/IP is correct. "
        "(4) BDCOM/VSOL CPUs answer SNMP slowly; increase the device Timeout if the OLT "
        "has many ONUs."
    )
