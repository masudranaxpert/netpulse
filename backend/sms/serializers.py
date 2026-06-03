from rest_framework import serializers

from .models import SmsGateway, SmsLog, SmsTemplate


class SmsGatewaySerializer(serializers.ModelSerializer):
    class Meta:
        model = SmsGateway
        fields = ["id", "provider", "label", "sender_id", "credentials", "is_active", "is_default", "created_at"]
        read_only_fields = ["id", "created_at"]


class SmsTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SmsTemplate
        fields = ["id", "name", "category", "body", "created_at"]
        read_only_fields = ["id", "created_at"]


class SmsLogSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer.customer_name", read_only=True)
    sent_by_username = serializers.CharField(source="sent_by.username", read_only=True)

    class Meta:
        model = SmsLog
        fields = [
            "id", "customer", "customer_name", "mobile", "message", "provider",
            "status", "response", "sent_by_username", "created_at",
        ]


class SendSmsSerializer(serializers.Serializer):
    audience = serializers.ChoiceField(
        choices=["single", "customer", "active", "inactive", "zone", "dues", "paid", "unpaid"]
    )
    message = serializers.CharField()
    mobile = serializers.CharField(required=False, allow_blank=True)
    customer_id = serializers.CharField(required=False, allow_blank=True)
    zone = serializers.IntegerField(required=False)
    gateway = serializers.IntegerField(required=False)
