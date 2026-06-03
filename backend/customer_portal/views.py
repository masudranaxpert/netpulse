from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from datetime import timedelta
from drf_spectacular.utils import extend_schema

from customers.models import CustomerProfile, SupportTicket
from billing.models import Package, MonthlyBill, ConnectionFee, PaymentTransaction, InvoiceStatusHistory
from mikrotik.models import RouterInfo
from core.pagination import CustomPagination

from .models import CustomerToken
from .authentication import CustomerPortalAuthentication, IsAuthenticatedCustomer
from .schemas import portal_schema_view, portal_ticket_schema_view
from .serializers import (
    CustomerPortalLoginSerializer,
    CustomerPortalProfileSerializer,
    PublicPackageSerializer,
    PortalMonthlyBillSerializer,
    PortalConnectionFeeSerializer,
    PortalPaymentTransactionSerializer,
    PortalInvoiceStatusHistorySerializer,
    PortalSupportTicketSerializer,
    PortalSupportTicketDetailSerializer
)
from customers.serializers.tickets import TicketReplySerializer


@extend_schema(tags=['customer_portal'])
class PublicPackageViewSet(viewsets.ReadOnlyModelViewSet):
    """Publicly listable active internet packages for the marketing site."""
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = PublicPackageSerializer
    pagination_class = None
    queryset = Package.objects.filter(is_active=True)


@portal_schema_view
class AuthViewSet(viewsets.ViewSet):
    """
    ViewSet for handling customer authentication and profile operations.
    """
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """
        Verify PPPoE credentials and generate a CustomerToken.
        """
        serializer = CustomerPortalLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        username = serializer.validated_data['pppoe_name'].lower()
        password = serializer.validated_data['pppoe_pass']
        
        router_info = RouterInfo.objects.select_related('customer').filter(
            pppoe_name__iexact=username,
            pppoe_pass=password
        ).first()
        if router_info is None:
            return Response(
                {"status": "error", "message": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        customer = router_info.customer
        if customer.customer_status != 'active':
            return Response(
                {"status": "error", "message": "Customer profile is deactivated."},
                status=status.HTTP_403_FORBIDDEN
            )
            
        CustomerToken.objects.filter(customer=customer, expires_at__lt=timezone.now()).delete()
        
        token = CustomerToken.objects.create(
            customer=customer,
            expires_at=timezone.now() + timedelta(days=7)
        )
        
        return Response({
            "status": "success",
            "token": token.key,
            "expires_at": token.expires_at,
            "customer_name": customer.customer_name,
            "customer_id": customer.customer_id
        }, status=status.HTTP_200_OK)

    @action(
        detail=False,
        methods=['get'],
        authentication_classes=[CustomerPortalAuthentication],
        permission_classes=[IsAuthenticatedCustomer]
    )
    def profile(self, request):
        """
        Retrieve the authenticated customer's profile info.
        """
        serializer = CustomerPortalProfileSerializer(request.user)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=['post'],
        authentication_classes=[CustomerPortalAuthentication],
        permission_classes=[IsAuthenticatedCustomer]
    )
    def logout(self, request):
        """
        Deactivate the customer's current access token.
        """
        token = request.auth
        token.is_active = False
        token.save()
        return Response({"status": "success", "message": "Logged out successfully."})


@portal_schema_view
class DashboardViewSet(viewsets.ViewSet):
    """
    ViewSet to fetch real-time session stats from the MikroTik router.
    """
    authentication_classes = [CustomerPortalAuthentication]
    permission_classes = [IsAuthenticatedCustomer]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Query router to check if the PPPoE session is active and fetch uptime/bandwidth.
        """
        customer = request.user
        try:
            router_info = customer.router_info
            router = router_info.router
        except RouterInfo.DoesNotExist:
            return Response(
                {"status": "error", "message": "Router configuration not found."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        if not router:
            return Response(
                {"status": "error", "message": "Router connection info not assigned."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        from mikrotik.service.connection import MikrotikConnection
        try:
            conn = MikrotikConnection(
                host=router.host,
                port=router.port,
                username=router.username,
                password=router.password
            )
            if not conn.api:
                return Response({
                    "status": "offline",
                    "message": "Unable to connect to router to fetch live stats.",
                    "live_stats_available": False
                })
                
            active_resource = conn.api.get_resource('/ppp/active')
            active = active_resource.get(name=router_info.pppoe_name.lower())
            
            if active and len(active) > 0:
                stats_data = active[0]
                return Response({
                    "status": "online",
                    "live_stats_available": True,
                    "uptime": stats_data.get('uptime', 'unknown'),
                    "bytes_in": stats_data.get('bytes-in', '0'),
                    "bytes_out": stats_data.get('bytes-out', '0'),
                    "caller_id": stats_data.get('caller-id', 'unknown'),
                    "address": stats_data.get('address', 'unknown')
                })
            else:
                secret_resource = conn.api.get_resource('/ppp/secret')
                secret = secret_resource.get(name=router_info.pppoe_name.lower())
                last_caller = "unknown"
                last_disconnect = "unknown"
                if secret and len(secret) > 0:
                    last_caller = secret[0].get('last-caller', 'unknown')
                    last_disconnect = secret[0].get('last-disconnect-reason', 'unknown')
                return Response({
                    "status": "offline",
                    "live_stats_available": False,
                    "last_caller": last_caller,
                    "last_disconnect_reason": last_disconnect
                })
        except Exception as e:
            return Response({
                "status": "offline",
                "message": f"Router stats retrieval error: {str(e)}",
                "live_stats_available": False
            })


@portal_schema_view
class BillingViewSet(viewsets.ViewSet):
    """
    ViewSet for customer portal billing, invoices, and transaction histories.
    """
    authentication_classes = [CustomerPortalAuthentication]
    permission_classes = [IsAuthenticatedCustomer]

    @action(detail=False, methods=['get'])
    def monthly_bills(self, request):
        """
        List all monthly bills for the authenticated customer.
        """
        bills = MonthlyBill.objects.filter(customer=request.user)
        paginator = CustomPagination()
        page = paginator.paginate_queryset(bills, request, view=self)
        if page is not None:
            serializer = PortalMonthlyBillSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = PortalMonthlyBillSerializer(bills, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def connection_fees(self, request):
        """
        List all connection fees for the authenticated customer.
        """
        fees = ConnectionFee.objects.filter(customer=request.user)
        paginator = CustomPagination()
        page = paginator.paginate_queryset(fees, request, view=self)
        if page is not None:
            serializer = PortalConnectionFeeSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = PortalConnectionFeeSerializer(fees, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def transactions(self, request):
        """
        List all payment transactions for the authenticated customer.
        """
        txs = PaymentTransaction.objects.filter(customer=request.user)
        paginator = CustomPagination()
        page = paginator.paginate_queryset(txs, request, view=self)
        if page is not None:
            serializer = PortalPaymentTransactionSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = PortalPaymentTransactionSerializer(txs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def status_histories(self, request):
        """
        List all status histories of bills belonging to the authenticated customer.
        """
        histories = InvoiceStatusHistory.objects.filter(
            Q(monthly_bill__customer=request.user) |
            Q(connection_fee__customer=request.user)
        ).select_related('payment_transaction')
        
        paginator = CustomPagination()
        page = paginator.paginate_queryset(histories, request, view=self)
        if page is not None:
            serializer = PortalInvoiceStatusHistorySerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = PortalInvoiceStatusHistorySerializer(histories, many=True)
        return Response(serializer.data)


@portal_ticket_schema_view
class SupportTicketViewSet(viewsets.ModelViewSet):
    """
    ViewSet for listing and creating support tickets.
    """
    serializer_class = PortalSupportTicketSerializer
    authentication_classes = [CustomerPortalAuthentication]
    permission_classes = [IsAuthenticatedCustomer]
    queryset = SupportTicket.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PortalSupportTicketDetailSerializer
        return PortalSupportTicketSerializer

    def get_queryset(self):
        """
        Filter tickets to only return those belonging to the authenticated customer.
        """
        return self.queryset.filter(customer=self.request.user)

    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        """
        Post a reply to the customer's own ticket.
        """
        ticket = self.get_object()
        reply_text = request.data.get('reply_text')
        if not reply_text:
            return Response(
                {"status": "error", "message": "reply_text field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from customers.models import TicketReply
        reply = TicketReply.objects.create(
            ticket=ticket,
            customer=request.user,
            reply_text=reply_text
        )
        
        if ticket.status == 'closed':
            ticket.status = 'open'
            ticket.save()
            
        serializer = TicketReplySerializer(reply)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


