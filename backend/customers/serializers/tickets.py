from rest_framework import serializers
from customers.models import SupportTicket, TicketReply

class TicketReplySerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    author_type = serializers.SerializerMethodField()

    class Meta:
        model = TicketReply
        fields = ['id', 'ticket', 'admin_user', 'customer', 'author_name', 'author_type', 'reply_text', 'created_at']
        read_only_fields = ['id', 'admin_user', 'customer', 'author_name', 'author_type', 'created_at']

    def get_author_name(self, obj):
        if obj.admin_user:
            return obj.admin_user.username
        if obj.customer:
            return obj.customer.customer_name
        return "System"

    def get_author_type(self, obj):
        if obj.admin_user:
            return "admin"
        if obj.customer:
            return "customer"
        return "system"

class AdminSupportTicketSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.customer_name', read_only=True)
    customer_id = serializers.CharField(source='customer.customer_id', read_only=True)

    class Meta:
        model = SupportTicket
        fields = ['id', 'title', 'description', 'status', 'priority', 'customer', 'customer_id', 'customer_name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class AdminSupportTicketDetailSerializer(AdminSupportTicketSerializer):
    replies = TicketReplySerializer(many=True, read_only=True)

    class Meta(AdminSupportTicketSerializer.Meta):
        fields = AdminSupportTicketSerializer.Meta.fields + ['replies']
