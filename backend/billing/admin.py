from django.contrib import admin
from .models import Package, MonthlyBill, ConnectionFee, PaymentTransaction, PaymentAllocation, InvoiceStatusHistory


class PaymentAllocationInline(admin.TabularInline):
    model = PaymentAllocation
    extra = 0
    fields = ["monthly_bill", "connection_fee", "amount", "created_at"]
    readonly_fields = ["created_at"]


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ["name", "package_type", "speed", "price", "is_active", "created_at"]
    list_filter = ["package_type", "is_active", "created_at"]
    search_fields = ["name", "speed", "description"]
    list_editable = ["is_active"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(MonthlyBill)
class MonthlyBillAdmin(admin.ModelAdmin):
    list_display = ["id", "customer", "package_name", "package_price", "billing_month", "billing_year", "invoice_date", "total_amount", "paid_amount", "payment_status", "payment_date"]
    list_filter = ["payment_status", "billing_year", "billing_month", "invoice_date"]
    search_fields = ["customer__customer_id", "customer__customer_name", "package_name"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(ConnectionFee)
class ConnectionFeeAdmin(admin.ModelAdmin):
    list_display = ["id", "customer", "invoice_date", "total_amount", "paid_amount", "payment_status", "payment_date"]
    list_filter = ["payment_status", "invoice_date"]
    search_fields = ["customer__customer_id", "customer__customer_name"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(PaymentTransaction)
class PaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ["id", "customer", "amount", "payment_method", "transaction_id", "received_by", "created_at"]
    list_filter = ["payment_method", "created_at"]
    search_fields = ["customer__customer_id", "customer__customer_name", "transaction_id"]
    readonly_fields = ["created_at", "updated_at"]
    inlines = [PaymentAllocationInline]


@admin.register(PaymentAllocation)
class PaymentAllocationAdmin(admin.ModelAdmin):
    list_display = ["id", "payment_transaction", "monthly_bill", "connection_fee", "amount", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["payment_transaction__customer__customer_id", "payment_transaction__transaction_id"]
    readonly_fields = ["created_at", "updated_at"]


@admin.register(InvoiceStatusHistory)
class InvoiceStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ["id", "monthly_bill", "connection_fee", "payment_transaction", "amount", "previous_status", "new_status", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["monthly_bill__customer__customer_id", "connection_fee__customer__customer_id", "payment_transaction__transaction_id"]
    readonly_fields = ["created_at", "updated_at"]
