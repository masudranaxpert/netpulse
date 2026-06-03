from rest_framework import serializers
from billing.models import MonthlyBill, ConnectionFee, PaymentTransaction, InvoiceStatusHistory
from customers.models import CustomerProfile


class MonthlyBillCreateSerializer(serializers.Serializer):
    customer_id = serializers.CharField(max_length=20)
    billing_month = serializers.IntegerField(min_value=1, max_value=12)
    billing_year = serializers.IntegerField()
    notes = serializers.CharField(required=False, allow_blank=True)


class ConnectionFeeCreateSerializer(serializers.Serializer):
    customer_id = serializers.CharField(max_length=20)
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    notes = serializers.CharField(required=False, allow_blank=True)


class MonthlyBillSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.customer_name', read_only=True)
    
    class Meta:
        model = MonthlyBill
        fields = [
            'id', 'customer', 'customer_name', 'package_name', 'package_price',
            'billing_month', 'billing_year', 'invoice_date', 'total_amount',
            'payment_status', 'paid_amount', 'payment_date',
            'notes', 'remaining_amount', 'billing_period', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class ConnectionFeeSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.customer_name', read_only=True)
    
    class Meta:
        model = ConnectionFee
        fields = [
            'id', 'customer', 'customer_name',
            'invoice_date', 'total_amount', 'payment_status', 'paid_amount',
            'payment_date', 'notes', 'remaining_amount',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']


class PaymentTransactionSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.customer_name', read_only=True)
    received_by_username = serializers.CharField(source='received_by.username', read_only=True)
    
    class Meta:
        model = PaymentTransaction
        fields = [
            'id', 'customer', 'customer_name', 'amount', 'payment_method',
            'transaction_id', 'received_by', 'received_by_username', 'notes', 'created_at'
        ]
        read_only_fields = ['created_at']


class PaymentTransactionCreateSerializer(serializers.Serializer):
    customer_id = serializers.CharField(max_length=20)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    payment_method = serializers.ChoiceField(choices=PaymentTransaction.PAYMENT_METHOD_CHOICES, default="cash")
    transaction_id = serializers.CharField(max_length=100, required=False, allow_blank=True, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    def validate_amount(self, value):
        if value == 0:
            raise serializers.ValidationError("Amount cannot be zero. Use a negative value for an adjustment.")
        return value


class InvoiceStatusHistorySerializer(serializers.ModelSerializer):
    customer_id = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()
    invoice_type = serializers.SerializerMethodField()
    invoice_id = serializers.SerializerMethodField()
    transaction_reference_id = serializers.CharField(source='payment_transaction.transaction_id', read_only=True)

    def get_customer_id(self, obj):
        if obj.monthly_bill:
            return obj.monthly_bill.customer.customer_id
        if obj.connection_fee:
            return obj.connection_fee.customer.customer_id
        return None

    def get_customer_name(self, obj):
        if obj.monthly_bill:
            return obj.monthly_bill.customer.customer_name
        if obj.connection_fee:
            return obj.connection_fee.customer.customer_name
        return None

    def get_invoice_type(self, obj):
        return "MonthlyBill" if obj.monthly_bill else "ConnectionFee"

    def get_invoice_id(self, obj):
        return obj.monthly_bill.id if obj.monthly_bill else obj.connection_fee.id
        
    class Meta:
        model = InvoiceStatusHistory
        fields = [
            'id', 'customer_id', 'customer_name', 'invoice_type', 'invoice_id',
            'payment_transaction', 'transaction_reference_id', 'amount',
            'previous_status', 'new_status', 'created_at', 'updated_at'
        ]
