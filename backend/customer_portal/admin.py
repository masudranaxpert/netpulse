from django.contrib import admin
from .models import CustomerToken

@admin.register(CustomerToken)
class CustomerTokenAdmin(admin.ModelAdmin):
    list_display = ['get_customer_name', 'get_customer_id', 'key', 'expires_at', 'is_active', 'created_at']
    search_fields = ['customer__customer_id', 'customer__customer_name', 'key']
    list_filter = ['is_active', 'expires_at']

    def get_customer_name(self, obj):
        return obj.customer.customer_name
    get_customer_name.short_description = 'Customer Name'

    def get_customer_id(self, obj):
        return obj.customer.customer_id
    get_customer_id.short_description = 'Customer ID'

