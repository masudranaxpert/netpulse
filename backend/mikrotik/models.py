from django.db import models
from customers.models import CustomerProfile


class MetaInfo(models.Model):
    class Meta:
        abstract = True
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class MikrotikRouter(MetaInfo):
    ROUTER_STATUS_CHOICES = [
        ("connected", "Connected"),
        ("disconnected", "Disconnected"),
        ("error", "Connection Error"),
    ]
    name = models.CharField(max_length=100, help_text="Router name for identification")
    host = models.CharField(max_length=255, help_text="Router IP address or hostname")
    port = models.IntegerField(default=8728, help_text="API port (default: 8728)")
    username = models.CharField(max_length=100, help_text="Router API username")
    password = models.CharField(max_length=255, help_text="Router API password (stored as plaintext)")
    use_ssl = models.BooleanField(default=False, help_text="Use SSL for connection")
    status = models.CharField(max_length=20, choices=ROUTER_STATUS_CHOICES, default="disconnected")
    last_checked = models.DateTimeField(null=True, blank=True, help_text="Last connection check time")
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.host}:{self.port}"

    class Meta:
        verbose_name = "MikroTik Router"
        verbose_name_plural = "MikroTik Routers"


class RouterInfo(MetaInfo):
    pppoe_name = models.CharField(max_length=255)
    pppoe_pass = models.CharField(max_length=255)
    profile_name = models.CharField(max_length=100, blank=True, default="")
    remote_ip = models.GenericIPAddressField(null=True, blank=True)
    customer = models.OneToOneField(CustomerProfile, on_delete=models.CASCADE, related_name="router_info")
    router = models.ForeignKey(MikrotikRouter, on_delete=models.CASCADE, related_name="customer_routers", null=True, blank=True)

    def __str__(self):
        return f"{self.pppoe_name} - {self.customer.customer_id}"

    class Meta:
        verbose_name = "Customer Router Info"
        verbose_name_plural = "Customer Router Infos"