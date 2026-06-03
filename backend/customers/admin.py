from django.contrib import admin
from .models import AddressZone, CustomerProfile, SupportTicket, TicketReply
from mikrotik.models import RouterInfo


class RouterInfoInline(admin.StackedInline):
    model = RouterInfo
    can_delete = False
    verbose_name_plural = "Router Info"
    fields = ["pppoe_name", "pppoe_pass", "remote_ip", "router"]


class TicketReplyInline(admin.TabularInline):
    model = TicketReply
    extra = 1
    fields = ["admin_user", "customer", "reply_text", "created_at"]
    readonly_fields = ["created_at"]


@admin.register(AddressZone)
class AddressZoneAdmin(admin.ModelAdmin):
    list_display = ["name", "created_at", "updated_at"]
    search_fields = ["name"]


@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ["customer_id", "customer_name", "nid", "phone_number", "customer_status", "billing_date", "extended_billing_days", "zone"]
    list_filter = ["zone", "customer_status", "created_at", "updated_at"]
    search_fields = ["customer_id", "customer_name", "nid", "phone_number", "phone_number2", "address", "zone__name"]
    readonly_fields = ["created_at", "updated_at"]
    inlines = [RouterInfoInline]


@admin.register(SupportTicket)
class SupportTicketAdmin(admin.ModelAdmin):
    list_display = ["title", "customer", "status", "priority", "created_at", "updated_at"]
    list_filter = ["status", "priority", "created_at"]
    search_fields = ["title", "description", "customer__customer_id", "customer__phone_number", "customer__nid"]
    readonly_fields = ["created_at", "updated_at"]
    inlines = [TicketReplyInline]


@admin.register(TicketReply)
class TicketReplyAdmin(admin.ModelAdmin):
    list_display = ["id", "ticket", "admin_user", "customer", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["reply_text", "ticket__title", "admin_user__username", "customer__customer_name"]
    readonly_fields = ["created_at", "updated_at"]

