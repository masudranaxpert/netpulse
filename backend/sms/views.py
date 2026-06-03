from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import SmsGateway, SmsLog, SmsTemplate
from .providers import provider_metadata
from .recipients import resolve_recipients
from .serializers import (
    SendSmsSerializer, SmsGatewaySerializer, SmsLogSerializer, SmsTemplateSerializer,
)
from .service import SmsService


class SmsGatewayViewSet(viewsets.ModelViewSet):
    queryset = SmsGateway.objects.all()
    serializer_class = SmsGatewaySerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["post"])
    def set_default(self, request, pk=None):
        gateway = self.get_object()
        gateway.is_default = True
        gateway.is_active = True
        gateway.save()
        return Response(self.get_serializer(gateway).data)

    @action(detail=True, methods=["post"])
    def test(self, request, pk=None):
        gateway = self.get_object()
        mobile = request.data.get("mobile")
        message = request.data.get("message") or "Test SMS from your ISP billing system."
        if not mobile:
            return Response({"detail": "mobile is required"}, status=400)
        log = SmsService.send_one(mobile, message, gateway=gateway, user=request.user)
        return Response(SmsLogSerializer(log).data, status=200 if log.status == "sent" else 502)


class SmsTemplateViewSet(viewsets.ModelViewSet):
    queryset = SmsTemplate.objects.all()
    serializer_class = SmsTemplateSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["category"]
    search_fields = ["name", "body"]


class SmsLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SmsLog.objects.all().select_related("customer", "sent_by")
    serializer_class = SmsLogSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["status", "provider", "customer__customer_id"]
    search_fields = ["mobile", "message"]


class SmsSendViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["get"])
    def providers(self, request):
        return Response(provider_metadata())

    @action(detail=False, methods=["post"])
    def send(self, request):
        ser = SendSmsSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data
        gateway = SmsGateway.objects.filter(pk=data.get("gateway")).first() if data.get("gateway") else None
        recipients = resolve_recipients(data["audience"], data)
        if not recipients:
            return Response({"detail": "No valid recipients for this audience."}, status=400)
        result = SmsService.send_bulk(recipients, data["message"], gateway=gateway, user=request.user)
        return Response(result)
