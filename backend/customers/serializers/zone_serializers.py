from rest_framework import serializers
from customers.models import AddressZone


class AddressZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddressZone
        fields = ['id', 'name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AddressZoneCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddressZone
        fields = ['name']
    
    def validate_name(self, value):
        if AddressZone.objects.filter(name__iexact=value).exists():
            raise serializers.ValidationError("A zone with this name already exists")
        return value.strip()
