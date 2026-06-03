from rest_framework import serializers

from .models import OltDevice, Onu


class OltDeviceSerializer(serializers.ModelSerializer):
    onu_count = serializers.IntegerField(source="onus.count", read_only=True)

    class Meta:
        model = OltDevice
        fields = [
            "id", "name", "host",
            "telnet_port", "web_port", "protocol",
            "olt_type", "vendor", "pon_type",
            "telnet_username", "telnet_password",
            "snmp_port", "snmp_community", "timeout",
            "status", "last_checked", "description", "is_active",
            "onu_count", "created_at",
        ]
        read_only_fields = ["id", "vendor", "pon_type", "status", "last_checked", "created_at"]


class OnuSerializer(serializers.ModelSerializer):
    olt_name = serializers.CharField(source="olt.name", read_only=True)
    customer_name = serializers.CharField(source="customer.customer_name", read_only=True)
    customer_code = serializers.CharField(source="customer.customer_id", read_only=True)

    class Meta:
        model = Onu
        fields = [
            "id", "olt", "olt_name", "onu_index", "serial_number", "name",
            "pon_port", "onu_model", "status", "rx_power", "tx_power",
            "olt_rx_power", "distance", "customer", "customer_name", "customer_code",
            "last_seen", "description", "created_at",
        ]
        read_only_fields = ["id", "last_seen", "created_at"]
