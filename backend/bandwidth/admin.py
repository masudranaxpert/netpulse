from django.contrib import admin

from .models import BandwidthSample


@admin.register(BandwidthSample)
class BandwidthSampleAdmin(admin.ModelAdmin):
    list_display = ("pppoe_id", "customer_name", "router", "download_bytes", "upload_bytes", "created_at")
    list_filter = ("router", "created_at")
    search_fields = ("pppoe_id", "customer_name")
    date_hierarchy = "created_at"
