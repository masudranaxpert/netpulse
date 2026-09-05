from django.db import models

from customers.models import CustomerProfile, MetaInfo

# OLT type presets — each maps to an SNMP OID vendor profile + PON technology.
OLT_TYPE_CHOICES = [
    ("VSOL_EPON", "VSOL EPON"),
    ("VSOL_EPON_TYPE_2", "VSOL EPON (Type 2)"),
    ("VSOL_GPON", "VSOL GPON"),
    ("CDATA_EPON", "C-Data EPON"),
    ("CDATA_GPON", "C-Data GPON"),
    ("PHOTON_EPON", "Photon EPON"),
    ("ZTE_EPON", "ZTE EPON"),
    ("ZTE_GPON", "ZTE GPON"),
    ("HUAWEI_GPON", "Huawei GPON"),
    ("BDCOM_EPON", "BDCOM EPON"),
    ("BDCOM_GPON", "BDCOM GPON"),
    ("CORELINK_EPON", "CoreLink EPON"),
    ("AVEIS_EPON", "AVEIS EPON"),
    ("GENERIC_EPON", "Generic EPON"),
    ("GENERIC_GPON", "Generic GPON"),
]

# olt_type -> (snmp vendor profile, pon technology)
OLT_TYPE_MAP = {
    "VSOL_EPON": ("vsol", "epon"), "VSOL_EPON_TYPE_2": ("vsol", "epon"), "VSOL_GPON": ("vsol", "gpon"),
    "CDATA_EPON": ("cdata", "epon"), "CDATA_GPON": ("cdata", "gpon"),
    "PHOTON_EPON": ("cdata", "epon"),
    "ZTE_EPON": ("zte", "epon"), "ZTE_GPON": ("zte", "gpon"),
    "HUAWEI_GPON": ("huawei", "gpon"),
    "BDCOM_EPON": ("bdcom", "epon"), "BDCOM_GPON": ("bdcom", "gpon"),
    "CORELINK_EPON": ("cdata", "epon"),
    "AVEIS_EPON": ("cdata", "epon"),
    "GENERIC_EPON": ("generic", "epon"), "GENERIC_GPON": ("generic", "gpon"),
}


class OltDevice(MetaInfo):
    STATUS_CHOICES = [("online", "Online"), ("offline", "Offline"), ("error", "Error")]
    PROTOCOL_CHOICES = [("http", "HTTP"), ("https", "HTTPS")]

    name = models.CharField(max_length=100, blank=True, default="")
    host = models.CharField(max_length=255, help_text="OLT IP address")

    telnet_port = models.IntegerField(default=23)
    web_port = models.IntegerField(default=80)
    protocol = models.CharField(max_length=5, choices=PROTOCOL_CHOICES, default="http")

    olt_type = models.CharField(
        max_length=20, choices=OLT_TYPE_CHOICES, default="GENERIC_EPON",
        help_text="OLT brand & technology type",
    )
    vendor = models.CharField(max_length=20, default="generic")  # derived from olt_type
    pon_type = models.CharField(max_length=10, default="epon")    # derived from olt_type

    telnet_username = models.CharField(max_length=100, blank=True, default="")
    telnet_password = models.CharField(max_length=255, blank=True, default="")

    snmp_port = models.IntegerField(default=161)
    snmp_community = models.CharField(max_length=100, default="public")
    timeout = models.IntegerField(default=10, help_text="Connection timeout in seconds")

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="offline")
    last_checked = models.DateTimeField(null=True, blank=True)
    description = models.TextField(blank=True, default="")
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name", "host"]

    def save(self, *args, **kwargs):
        self.vendor, self.pon_type = OLT_TYPE_MAP.get(self.olt_type, ("generic", "epon"))
        if not self.name:
            self.name = self.host
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name or self.host} ({self.olt_type})"


class Onu(MetaInfo):
    STATUS_CHOICES = [
        ("online", "Online"), ("offline", "Offline"),
        ("los", "Loss of signal"), ("unknown", "Unknown"),
    ]
    olt = models.ForeignKey(OltDevice, on_delete=models.CASCADE, related_name="onus")
    onu_index = models.CharField(max_length=50, blank=True, default="", help_text="SNMP index / internal ONU id")
    serial_number = models.CharField(max_length=64, blank=True, default="")
    name = models.CharField(max_length=120, blank=True, default="")
    pon_port = models.CharField(max_length=40, blank=True, default="", help_text="e.g. 0/1/1")
    onu_model = models.CharField(max_length=80, blank=True, default="")

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="unknown")
    rx_power = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, help_text="ONU Rx power (dBm)")
    tx_power = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, help_text="ONU Tx power (dBm)")
    olt_rx_power = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, help_text="Rx power at OLT (dBm)")
    distance = models.IntegerField(null=True, blank=True, help_text="Distance in meters")

    customer = models.ForeignKey(
        CustomerProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name="onus"
    )
    last_seen = models.DateTimeField(null=True, blank=True)
    description = models.TextField(blank=True, default="")

    class Meta:
        ordering = ["olt", "pon_port", "onu_index"]
        unique_together = [("olt", "onu_index")]

    def __str__(self):
        return f"{self.serial_number or self.name or self.onu_index} @ {self.olt.name}"
