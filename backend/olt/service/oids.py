"""SNMP OID maps.

Standard SNMPv2-MIB / IF-MIB OIDs work on any SNMP-capable device. Most EPON/GPON
OLTs (BDCOM, VSOL, C-Data, generic) expose each ONU as an IF-MIB interface such as
``EPON0/1:5``, so they are discovered generically via IF-MIB and enriched with
vendor-specific tables where available. Huawei/ZTE expose a dedicated serial column
that is walked directly.
"""

# Standard SNMPv2-MIB (works everywhere)
SYS_DESCR = "1.3.6.1.2.1.1.1.0"
SYS_UPTIME = "1.3.6.1.2.1.1.3.0"
SYS_NAME = "1.3.6.1.2.1.1.5.0"
SYS_LOCATION = "1.3.6.1.2.1.1.6.0"

# Standard IF-MIB — used to enumerate ONU interfaces on EPON-style OLTs.
IF_DESCR = "1.3.6.1.2.1.2.2.1.2"        # interface name, e.g. "EPON0/1:5"
IF_OPER_STATUS = "1.3.6.1.2.1.2.2.1.8"  # 1=up(online), 2=down(offline)
IF_ALIAS = "1.3.6.1.2.1.31.1.1.1.18"    # configured ONU description/alias

# Vendors whose ONUs are discovered through IF-MIB interface walking.
IFMIB_VENDORS = {"bdcom", "vsol", "cdata", "generic"}

# BDCOM enterprise ONU tables (indexed by ifIndex), used to enrich IF-MIB data.
# status: 0=authenticated 1=registered 2=deregistered 3=discovered 4=lost 5=auto.
BDCOM = {
    "onu_mac": "1.3.6.1.4.1.3320.101.10.1.1.3",       # ONU MAC (octet string)
    "onu_status": "1.3.6.1.4.1.3320.101.11.4.1.5",    # LLID/ONU binding status
    "onu_rx_power": "1.3.6.1.4.1.3320.101.10.5.1.5",  # 0.1 dBm units (value / 10)
}
BDCOM_ONLINE = {"0", "1", "5"}  # authenticated / registered / auto-configured

# Vendors that expose a dedicated ONU serial column that we walk directly.
# rx_power scale is the multiplier applied to the raw integer to get dBm.
VENDOR_OIDS = {
    "huawei": {
        "onu_serial": "1.3.6.1.4.1.2011.6.128.1.1.2.43.1.3",
        "onu_run_status": "1.3.6.1.4.1.2011.6.128.1.1.2.46.1.15",
        "onu_rx_power": "1.3.6.1.4.1.2011.6.128.1.1.2.51.1.4",
        "rx_scale": 0.01,
    },
    "zte": {
        "onu_serial": "1.3.6.1.4.1.3902.1012.3.28.1.1.5",
        "onu_run_status": "1.3.6.1.4.1.3902.1012.3.28.2.1.4",
        "onu_rx_power": "1.3.6.1.4.1.3902.1012.3.50.12.1.1.10",
        "rx_scale": 0.001,
    },
}


def vendor_profile(vendor: str) -> dict:
    return VENDOR_OIDS.get(vendor, {})
