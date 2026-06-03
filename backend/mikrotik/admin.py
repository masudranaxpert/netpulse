from django.contrib import admin
from .models import MikrotikRouter, RouterInfo


@admin.register(MikrotikRouter)
class MikrotikRouterAdmin(admin.ModelAdmin):
    list_display = ["name", "host", "port", "username", "status", "is_active", "last_checked"]
    list_filter = ["status", "is_active", "use_ssl"]
    search_fields = ["name", "host", "username"]
    readonly_fields = ["created_at", "updated_at", "last_checked"]
    list_editable = ["is_active", "status"]


@admin.register(RouterInfo)
class RouterInfoAdmin(admin.ModelAdmin):
    list_display = ["pppoe_name", "customer", "router", "remote_ip", "created_at", "updated_at"]
    list_filter = ["router"]
    search_fields = ["pppoe_name", "customer__customer_id", "customer__phone_number"]
    readonly_fields = ["created_at", "updated_at"]