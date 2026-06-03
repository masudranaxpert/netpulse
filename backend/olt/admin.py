from django.contrib import admin

from .models import OltDevice, Onu


@admin.register(OltDevice)
class OltDeviceAdmin(admin.ModelAdmin):
    list_display = ("name", "host", "olt_type", "protocol", "web_port", "telnet_port", "status", "is_active")
    list_filter = ("olt_type", "protocol", "status", "is_active")
    search_fields = ("name", "host")


@admin.register(Onu)
class OnuAdmin(admin.ModelAdmin):
    list_display = ("serial_number", "olt", "pon_port", "status", "rx_power", "customer")
    list_filter = ("olt", "status")
    search_fields = ("serial_number", "name", "onu_index")
