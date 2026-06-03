from django_filters import rest_framework as filters
from billing.models import MonthlyBill, ConnectionFee, PaymentTransaction, InvoiceStatusHistory

class MonthlyBillFilter(filters.FilterSet):
    customer_id = filters.CharFilter(field_name="customer__customer_id")

    class Meta:
        model = MonthlyBill
        fields = ['customer_id', 'payment_status', 'billing_month', 'billing_year']

class ConnectionFeeFilter(filters.FilterSet):
    customer_id = filters.CharFilter(field_name="customer__customer_id")

    class Meta:
        model = ConnectionFee
        fields = ['customer_id']

class PaymentTransactionFilter(filters.FilterSet):
    customer_id = filters.CharFilter(field_name="customer__customer_id")

    class Meta:
        model = PaymentTransaction
        fields = ['customer_id', 'payment_method']

class InvoiceStatusHistoryFilter(filters.FilterSet):
    customer_id = filters.CharFilter(method="filter_customer_id")

    class Meta:
        model = InvoiceStatusHistory
        fields = ['customer_id']

    def filter_customer_id(self, queryset, name, value):
        from django.db.models import Q
        return queryset.filter(
            Q(monthly_bill__customer__customer_id=value) |
            Q(connection_fee__customer__customer_id=value)
        )
