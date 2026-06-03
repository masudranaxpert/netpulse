from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import OltDevice, Onu
from .serializers import OltDeviceSerializer, OnuSerializer
from .service.snmp import OltSnmp, diagnostic_message
from .service.sync import sync_onus


class OltDeviceViewSet(viewsets.ModelViewSet):
    queryset = OltDevice.objects.all()
    serializer_class = OltDeviceSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["olt_type", "status", "is_active"]
    search_fields = ["name", "host"]

    @action(detail=True, methods=["post"])
    def test_connection(self, request, pk=None):
        olt = self.get_object()
        snmp = OltSnmp(olt.host, olt.snmp_community, olt.snmp_port, timeout=olt.timeout or 10)
        info = snmp.system_info()
        olt.status = "online" if info else "error"
        olt.last_checked = timezone.now()
        olt.save(update_fields=["status", "last_checked"])
        if not info:
            return Response(
                {"status": "error", "message": diagnostic_message(olt, snmp)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({"status": "online", "system_info": info})

    @action(detail=True, methods=["post"])
    def sync_onus(self, request, pk=None):
        olt = self.get_object()
        result = sync_onus(olt)
        if result.get("ok"):
            olt.status = "online"
            olt.last_checked = timezone.now()
            olt.save(update_fields=["status", "last_checked"])
            return Response(result)
        return Response(result, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"])
    def onus(self, request, pk=None):
        olt = self.get_object()
        qs = olt.onus.select_related("customer").all()
        return Response(OnuSerializer(qs, many=True).data)


class OnuViewSet(viewsets.ModelViewSet):
    queryset = Onu.objects.all().select_related("olt", "customer")
    serializer_class = OnuSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["olt", "status", "customer"]
    search_fields = ["serial_number", "name", "onu_index", "pon_port"]
