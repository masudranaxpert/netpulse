from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CustomerProfile, AddressZone, SupportTicket, TicketReply
from .serializers import (
    CustomerCreateSerializer, CustomerListSerializer, CustomerDetailSerializer,
    AddressZoneSerializer, AddressZoneCreateSerializer, 
    CustomerLinkExistingSerializer
)
from .serializers.tickets import (
    AdminSupportTicketSerializer,
    AdminSupportTicketDetailSerializer,
    TicketReplySerializer
)
from .schemas import customer_schema_view, zone_schema_view, admin_ticket_schema_view
from .service import CustomerService
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from core.pagination import CustomPagination


@customer_schema_view
class CustomerViewSet(viewsets.ModelViewSet):
    queryset = CustomerProfile.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'customer_id'
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CustomerListSerializer
        if self.action in ['retrieve', 'update', 'partial_update']:
            return CustomerDetailSerializer
        return CustomerCreateSerializer

    def update(self, request, *args, **kwargs):
        instance = CustomerService.get_customer_details(kwargs.get('customer_id'))
        if not instance:
            return Response({"status": "error", "message": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CustomerDetailSerializer(instance, data=request.data, partial=kwargs.get('partial', False))
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    def get_queryset(self):
        queryset = CustomerService.get_all_customers()
        params = self.request.query_params
        status = params.get('status', None)
        if status:
            queryset = queryset.filter(customer_status=status)
        zone = params.get('zone', None)
        if zone:
            queryset = queryset.filter(zone_id=zone)
        if params.get('due'):
            queryset = queryset.filter(balance__lt=0)
        if params.get('free'):
            queryset = queryset.filter(customer_status='free')
        if params.get('expired'):
            from datetime import date, timedelta
            today = date.today()
            expired_ids = [
                c.id for c in queryset
                if c.billing_date and (c.billing_date + timedelta(days=c.extended_billing_days or 0)) < today
            ]
            queryset = queryset.filter(id__in=expired_ids)
        return queryset
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        customer = CustomerService.create_customer(serializer.validated_data)
        response_serializer = CustomerCreateSerializer(customer)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    def retrieve(self, request, *args, **kwargs):
        instance = CustomerService.get_customer_details(kwargs.get('customer_id'))
        if not instance:
            return Response({"status": "error", "message": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """Delete customer locally and from MikroTik router"""
        customer_id = self.kwargs.get('customer_id')
        try:
            CustomerService.delete_customer_profile(customer_id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({
                "status": "error", 
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='online_status')
    def online_status(self, request):
        """Return the set of PPPoE names currently online on MikroTik.

        Cached briefly so the customer list can poll cheaply without hammering
        the routers on every render.
        """
        from django.core.cache import cache
        cached = cache.get('pppoe_online_names')
        if cached is None:
            cached = list(CustomerService.get_online_pppoe_names())
            cache.set('pppoe_online_names', cached, 20)
        return Response({"online": cached})

    @action(detail=False, methods=['post'])
    def link_existing(self, request):
        """Link a customer with an existing MikroTik PPPoE profile"""
        serializer = CustomerLinkExistingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        customer = CustomerService.link_existing_customer(serializer.validated_data)
        response_serializer = CustomerCreateSerializer(customer)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='update_billing')
    def update_billing(self, request, customer_id=None):
        """Change the billing day (1-28) and/or extended grace days."""
        billing_day = request.data.get('billing_day')
        extended = request.data.get('extended_billing_days')

        if billing_day is not None:
            try:
                bd = int(billing_day)
            except (TypeError, ValueError):
                return Response({"status": "error", "message": "billing_day must be an integer."}, status=status.HTTP_400_BAD_REQUEST)
            if bd < 1 or bd > 28:
                return Response({"status": "error", "message": "billing_day must be between 1 and 28."}, status=status.HTTP_400_BAD_REQUEST)

        if extended is not None:
            try:
                ed = int(extended)
            except (TypeError, ValueError):
                return Response({"status": "error", "message": "extended_billing_days must be an integer."}, status=status.HTTP_400_BAD_REQUEST)
            if ed < 0:
                return Response({"status": "error", "message": "extended_billing_days cannot be negative."}, status=status.HTTP_400_BAD_REQUEST)

        customer = CustomerService.update_billing_settings(customer_id, billing_day, extended)
        if not customer:
            return Response({"status": "error", "message": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(CustomerDetailSerializer(customer).data)

    @action(detail=True, methods=['get'], url_path='live_stats')
    def live_stats(self, request, customer_id=None):
        """Live MikroTik PPPoE session stats (uptime, bandwidth) for this customer."""
        customer = CustomerService.get_customer_details(customer_id)
        if not customer:
            return Response({"status": "error", "message": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)

        info = getattr(customer, 'router_info', None)
        if not info or not info.router:
            return Response({"status": "offline", "live_stats_available": False, "message": "No router/PPPoE configured for this customer."})

        from mikrotik.service.connection import MikrotikConnection
        try:
            conn = MikrotikConnection(host=info.router.host, port=info.router.port, username=info.router.username, password=info.router.password)
            if not conn.api:
                return Response({"status": "offline", "live_stats_available": False, "message": "Unable to connect to router."})

            name = info.pppoe_name.lower()
            secret_list = conn.api.get_resource('/ppp/secret').get(name=name)
            secret = secret_list[0] if secret_list else {}

            base = {
                "profile": secret.get('profile', 'unknown'),
                "service": secret.get('service', 'pppoe'),
                "last_logged_in": secret.get('last-logged-in', 'unknown'),
                "last_logged_out": secret.get('last-logged-out', 'unknown'),
                "last_caller": secret.get('last-caller-id', secret.get('last-caller', 'unknown')),
                "last_disconnect_reason": secret.get('last-disconnect-reason', 'unknown'),
                "limit_bytes_in": secret.get('limit-bytes-in', '0'),
                "limit_bytes_out": secret.get('limit-bytes-out', '0'),
                "disabled": secret.get('disabled', 'false'),
            }

            active = conn.api.get_resource('/ppp/active').get(name=name)
            if active and len(active) > 0:
                d = active[0]
                return Response({
                    **base,
                    "status": "online", "live_stats_available": True,
                    "uptime": d.get('uptime', 'unknown'),
                    "bytes_in": d.get('bytes-in', '0'), "bytes_out": d.get('bytes-out', '0'),
                    "packets_in": d.get('packets-in', '0'), "packets_out": d.get('packets-out', '0'),
                    "caller_id": d.get('caller-id', 'unknown'), "address": d.get('address', 'unknown'),
                    "session_id": d.get('session-id', 'unknown'), "encoding": d.get('encoding', 'unknown'),
                })
            return Response({**base, "status": "offline", "live_stats_available": False})
        except Exception as e:
            return Response({"status": "offline", "live_stats_available": False, "message": str(e)})

    @action(detail=True, methods=['post'], url_path='update_status')
    def update_status(self, request, customer_id=None):
        """Update customer status locally and on MikroTik"""
        status_value = request.data.get('status')
        if status_value not in ['active', 'disconnected']:
            return Response({
                "status": "error", 
                "message": "Invalid status value. Allowed: active, disconnected"
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            customer, warning = CustomerService.update_customer_status(customer_id, status_value)
            data = CustomerCreateSerializer(customer).data
            if warning:
                data["warning"] = warning
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                "status": "error", 
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='update_connection')
    def update_connection(self, request, customer_id=None):
        """Update PPPoE/router connection and best-effort push to MikroTik."""
        try:
            customer, warning = CustomerService.update_customer_connection(customer_id, request.data)
            instance = CustomerService.get_customer_details(customer.customer_id)
            data = CustomerDetailSerializer(instance).data
            if warning:
                data["warning"] = warning
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@zone_schema_view
class AddressZoneViewSet(viewsets.ModelViewSet):
    queryset = AddressZone.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return AddressZoneSerializer
        return AddressZoneCreateSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        zone = serializer.save()
        response_serializer = AddressZoneSerializer(zone)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get('partial', False))
        serializer.is_valid(raise_exception=True)
        zone = serializer.save()
        response_serializer = AddressZoneSerializer(zone)
        return Response(response_serializer.data, status=status.HTTP_200_OK)


@admin_ticket_schema_view
class AdminSupportTicketViewSet(viewsets.ModelViewSet):
    """
    ViewSet for admin staff to manage customer support tickets.
    """
    queryset = SupportTicket.objects.all().select_related('customer').prefetch_related(
        'replies__admin_user', 'replies__customer'
    )
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'priority']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AdminSupportTicketDetailSerializer
        return AdminSupportTicketSerializer

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        """
        Post a reply on behalf of the admin/staff.
        """
        ticket = self.get_object()
        reply_text = request.data.get('reply_text')
        if not reply_text:
            return Response(
                {"status": "error", "message": "reply_text field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reply = TicketReply.objects.create(
            ticket=ticket,
            admin_user=request.user,
            reply_text=reply_text
        )
        
        if ticket.status == 'open':
            ticket.status = 'in_progress'
            ticket.save()
            
        serializer = TicketReplySerializer(reply)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
