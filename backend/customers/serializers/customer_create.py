from rest_framework import serializers
from django.db import transaction
from customers.models import CustomerProfile, AddressZone
from billing.models import Package
from mikrotik.models import MikrotikRouter, RouterInfo
class CustomerRouterInfoSerializer(serializers.ModelSerializer):
    router_name = serializers.CharField(source='router.name', read_only=True)
    
    class Meta:
        model = RouterInfo
        fields = [
            'id', 'pppoe_name', 'pppoe_pass', 'profile_name', 'remote_ip', 
            'router', 'router_name', 'created_at', 'updated_at'
        ]


class CustomerCreateSerializer(serializers.Serializer):
    customer_id = serializers.CharField(max_length=20, required=False, allow_blank=True, allow_null=True)
    customer_name = serializers.CharField(max_length=255)
    nid = serializers.CharField(max_length=15, required=False, allow_null=True)
    phone_number = serializers.CharField(max_length=15)
    phone_number2 = serializers.CharField(max_length=15, required=False, allow_null=True)
    address = serializers.CharField(max_length=255)
    zone_id = serializers.IntegerField()
    package_id = serializers.IntegerField(required=False, allow_null=True)
    billing_day = serializers.IntegerField(min_value=1, max_value=28, required=False, default=1, write_only=True)
    pppoe_name = serializers.CharField(max_length=255, write_only=True)
    pppoe_pass = serializers.CharField(max_length=255, write_only=True)
    remote_ip = serializers.IPAddressField(required=False, allow_null=True, write_only=True)
    router_id = serializers.IntegerField(required=False, allow_null=True, write_only=True)
    profile_name = serializers.CharField(max_length=255, required=False, write_only=True)
    service_type = serializers.CharField(max_length=50, required=False, default="PPPoE", write_only=True)
    
    # Read-only response fields
    id = serializers.IntegerField(read_only=True)
    billing_date = serializers.DateField(read_only=True)
    customer_status = serializers.CharField(read_only=True)
    balance = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    router_info = CustomerRouterInfoSerializer(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)

    
    def validate_customer_id(self, value):
        if value and CustomerProfile.objects.filter(customer_id=value).exists():
            raise serializers.ValidationError("This customer ID is already in use.")
        return value

    def validate_pppoe_name(self, value):
        if value:
            return value.lower()
        return value

    def validate_zone_id(self, value):
        try:
            AddressZone.objects.get(id=value)
        except AddressZone.DoesNotExist:
            raise serializers.ValidationError("Zone does not exist")
        return value
    
    def validate_package_id(self, value):
        if value:
            try:
                Package.objects.get(id=value)
            except Package.DoesNotExist:
                raise serializers.ValidationError("Package does not exist")
        return value
    
    def validate_router_id(self, value):
        if value:
            try:
                MikrotikRouter.objects.get(id=value)
            except MikrotikRouter.DoesNotExist:
                raise serializers.ValidationError("Router does not exist")
        return value
    
    def create(self, validated_data):
        from customers.service import CustomerService
        return CustomerService.create_customer(validated_data)


class CustomerLinkExistingSerializer(CustomerCreateSerializer):
    pppoe_pass = serializers.CharField(max_length=255, required=False, allow_blank=True, allow_null=True, write_only=True)

    def create(self, validated_data):
        from customers.service import CustomerService
        return CustomerService.link_existing_customer(validated_data)


class CustomerListSerializer(serializers.ModelSerializer):
    zone_name = serializers.CharField(source='zone.name', read_only=True)
    package_name = serializers.CharField(source='package.name', read_only=True)
    pppoe_name = serializers.SerializerMethodField()

    class Meta:
        model = CustomerProfile
        fields = [
            'id', 'customer_id', 'customer_name', 'phone_number', 'address',
            'customer_status', 'zone', 'zone_name', 'package_name', 'balance',
            'billing_date', 'extended_billing_days', 'pppoe_name', 'created_at'
        ]

    def get_pppoe_name(self, obj):
        info = getattr(obj, 'router_info', None)
        return info.pppoe_name if info else None


class CustomerDetailSerializer(serializers.ModelSerializer):
    """Used for retrieve + update of editable customer profile fields."""
    zone_name = serializers.CharField(source='zone.name', read_only=True)
    package_name = serializers.CharField(source='package.name', read_only=True)
    package_price = serializers.DecimalField(source='package.price', max_digits=10, decimal_places=2, read_only=True)
    router_info = serializers.SerializerMethodField()
    billing_summary = serializers.SerializerMethodField()

    class Meta:
        model = CustomerProfile
        fields = [
            'id', 'customer_id', 'customer_name', 'nid', 'phone_number', 'phone_number2',
            'address', 'zone', 'package', 'zone_name', 'package_name', 'package_price',
            'billing_date', 'extended_billing_days', 'customer_status', 'balance',
            'router_info', 'billing_summary', 'created_at'
        ]
        read_only_fields = [
            'id', 'customer_id', 'billing_date', 'extended_billing_days',
            'customer_status', 'balance', 'created_at'
        ]

    def get_router_info(self, obj):
        info = getattr(obj, 'router_info', None)
        if not info:
            return None
        return {
            'pppoe_name': info.pppoe_name,
            'pppoe_pass': info.pppoe_pass,
            'profile_name': info.profile_name,
            'remote_ip': info.remote_ip,
            'router': info.router_id,
            'router_name': info.router.name if info.router else None,
        }

    def get_billing_summary(self, obj):
        from billing.services import BillingService
        return BillingService.get_customer_billing_summary(obj.customer_id)