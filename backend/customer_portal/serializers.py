from rest_framework import serializers
from customers.models import CustomerProfile, SupportTicket
from billing.models import Package, MonthlyBill, ConnectionFee, PaymentTransaction, InvoiceStatusHistory
from mikrotik.models import RouterInfo
from customers.serializers.tickets import TicketReplySerializer


class CustomerPortalLoginSerializer(serializers.Serializer):
    pppoe_name = serializers.CharField(max_length=255)
    pppoe_pass = serializers.CharField(max_length=255)

class PublicPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = ['id', 'name', 'package_type', 'speed', 'price', 'description']
        read_only_fields = fields

class CustomerPortalProfileSerializer(serializers.ModelSerializer):
    zone_name = serializers.CharField(source='zone.name', read_only=True)
    package_name = serializers.CharField(source='package.name', read_only=True)
    pppoe_name = serializers.CharField(source='router_info.pppoe_name', read_only=True)

    class Meta:
        model = CustomerProfile
        fields = [
            'customer_id', 'customer_name', 'nid', 'phone_number', 'phone_number2',
            'address', 'zone_name', 'package_name', 'billing_date',
            'customer_status', 'balance', 'pppoe_name'
        ]
        read_only_fields = fields

class PortalMonthlyBillSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyBill
        fields = [
            'id', 'package_name', 'package_price', 'billing_month', 'billing_year',
            'invoice_date', 'total_amount', 'payment_status', 'paid_amount',
            'payment_date', 'notes', 'remaining_amount', 'billing_period', 'created_at'
        ]
        read_only_fields = fields

class PortalConnectionFeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConnectionFee
        fields = [
            'id', 'invoice_date', 'total_amount', 'payment_status', 'paid_amount',
            'payment_date', 'notes', 'remaining_amount', 'created_at'
        ]
        read_only_fields = fields

class PortalPaymentTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentTransaction
        fields = [
            'id', 'amount', 'payment_method', 'transaction_id', 'notes', 'created_at'
        ]
        read_only_fields = fields

class PortalInvoiceStatusHistorySerializer(serializers.ModelSerializer):
    invoice_type = serializers.SerializerMethodField()
    invoice_id = serializers.SerializerMethodField()
    transaction_reference_id = serializers.CharField(source='payment_transaction.transaction_id', read_only=True)

    def get_invoice_type(self, obj):
        return "MonthlyBill" if obj.monthly_bill else "ConnectionFee"

    def get_invoice_id(self, obj):
        return obj.monthly_bill.id if obj.monthly_bill else obj.connection_fee.id

    class Meta:
        model = InvoiceStatusHistory
        fields = [
            'id', 'invoice_type', 'invoice_id', 'payment_transaction',
            'transaction_reference_id', 'amount', 'previous_status',
            'new_status', 'created_at'
        ]
        read_only_fields = fields

class PortalSupportTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = ['id', 'title', 'description', 'status', 'priority', 'created_at', 'updated_at']
        read_only_fields = ['status', 'created_at', 'updated_at']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['customer'] = request.user
        return super().create(validated_data)

class PortalSupportTicketDetailSerializer(PortalSupportTicketSerializer):
    replies = TicketReplySerializer(many=True, read_only=True)

    class Meta(PortalSupportTicketSerializer.Meta):
        fields = PortalSupportTicketSerializer.Meta.fields + ['replies']

