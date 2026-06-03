from rest_framework import serializers
from mikrotik.models import MikrotikRouter, RouterInfo
from customers.models import CustomerProfile


class MikrotikRouterSerializer(serializers.ModelSerializer):
    class Meta:
        model = MikrotikRouter
        fields = ['id', 'name', 'host', 'port', 'username', 'password', 'use_ssl', 'status', 'last_checked', 'description', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'last_checked', 'status']


class RouterInfoSerializer(serializers.ModelSerializer):
    customer_id = serializers.CharField(source='customer.customer_id', read_only=True)
    router_name = serializers.CharField(source='router.name', read_only=True)
    
    class Meta:
        model = RouterInfo
        fields = ['id', 'pppoe_name', 'pppoe_pass', 'remote_ip', 'customer', 'customer_id', 'router', 'router_name', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']