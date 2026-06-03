from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from billing.models import Package, MonthlyBill, ConnectionFee, PaymentTransaction, InvoiceStatusHistory
from .serializers import PackageSerializer
from .serializers.invoices import (
    MonthlyBillSerializer, ConnectionFeeSerializer,
    MonthlyBillCreateSerializer, ConnectionFeeCreateSerializer,
    PaymentTransactionSerializer, PaymentTransactionCreateSerializer,
    InvoiceStatusHistorySerializer
)
from .schemas import package_schema_view
from .schemas.billing_schemas import billing_schema_view
from .services import BillingService
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters
from django_filters.rest_framework import DjangoFilterBackend
from core.pagination import CustomPagination
from .filters import (
    MonthlyBillFilter, ConnectionFeeFilter,
    PaymentTransactionFilter, InvoiceStatusHistoryFilter
)



@package_schema_view
class PackageViewSet(viewsets.ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['name', 'speed', 'description']
    ordering_fields = ['price', 'created_at', 'name', 'speed']
    filterset_fields = ['is_active']
    ordering = ['price']
    pagination_class = CustomPagination
    
    @action(detail=True, methods=['patch'])
    def toggle_status(self, request, pk=None):
        package = self.get_object()
        package.is_active = not package.is_active
        package.save()
        serializer = self.get_serializer(package)
        return Response(serializer.data)


@billing_schema_view
class BillingViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'])
    def generate_monthly_bills(self, request):
        billing_month = request.data.get('billing_month')
        billing_year = request.data.get('billing_year')
        
        if billing_month and billing_year:
            created = BillingService.create_monthly_bills(int(billing_month), int(billing_year))
        else:
            created = BillingService.create_monthly_bills()
        
        return Response({
            "status": "success",
            "message": f"Created {len(created)} monthly bills",
            "bills_created": len(created)
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def generate_customer_monthly_bill(self, request):
        serializer = MonthlyBillCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        result = BillingService.create_specific_monthly_bill(
            serializer.validated_data['customer_id'],
            serializer.validated_data['billing_month'],
            serializer.validated_data['billing_year'],
            serializer.validated_data.get('notes', '')
        )
        
        if result['status'] == 'error':
            return Response({"status": "error", "message": result['message']}, status=status.HTTP_400_BAD_REQUEST)
        
        response_serializer = MonthlyBillSerializer(result['bill'])
        return Response({
            "status": "success",
            "message": result['message'],
            "bill": response_serializer.data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def generate_connection_fee(self, request):
        serializer = ConnectionFeeCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        result = BillingService.create_connection_fee(
            serializer.validated_data['customer_id'],
            serializer.validated_data['total_amount'],
            serializer.validated_data.get('notes', '')
        )
        
        if result['status'] == 'error':
            return Response({"status": "error", "message": result['message']}, status=status.HTTP_400_BAD_REQUEST)
        
        response_serializer = ConnectionFeeSerializer(result['fee'])
        return Response({
            "status": "success",
            "message": result['message'],
            "fee": response_serializer.data
        }, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def monthly_bills(self, request):
        """
        List all monthly bills, optionally filtered by customer_id using MonthlyBillFilter.
        """
        bills = MonthlyBill.objects.all().select_related('customer')
        filterset = MonthlyBillFilter(request.query_params, queryset=bills)
        if filterset.is_valid():
            bills = filterset.qs
        
        paginator = CustomPagination()
        page = paginator.paginate_queryset(bills, request, view=self)
        if page is not None:
            serializer = MonthlyBillSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = MonthlyBillSerializer(bills, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def connection_fees(self, request):
        """
        List all connection fees, optionally filtered by customer_id using ConnectionFeeFilter.
        """
        fees = ConnectionFee.objects.all().select_related('customer')
        filterset = ConnectionFeeFilter(request.query_params, queryset=fees)
        if filterset.is_valid():
            fees = filterset.qs
            
        paginator = CustomPagination()
        page = paginator.paginate_queryset(fees, request, view=self)
        if page is not None:
            serializer = ConnectionFeeSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = ConnectionFeeSerializer(fees, many=True)
        return Response(serializer.data)



    @action(detail=False, methods=['post'])
    def add_transaction(self, request):
        serializer = PaymentTransactionCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        transaction_obj = BillingService.add_payment_transaction(
            customer_id=serializer.validated_data['customer_id'],
            amount=serializer.validated_data['amount'],
            payment_method=serializer.validated_data['payment_method'],
            transaction_id=serializer.validated_data.get('transaction_id'),
            received_by=request.user,
            notes=serializer.validated_data.get('notes', '')
        )
        
        response_serializer = PaymentTransactionSerializer(transaction_obj)
        return Response({
            "status": "success",
            "message": "Payment transaction recorded and allocated successfully.",
            "transaction": response_serializer.data
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def transactions(self, request):
        """
        List all payment transactions, optionally filtered by customer_id using PaymentTransactionFilter.
        """
        txs = PaymentTransaction.objects.all().select_related('customer', 'received_by')
        filterset = PaymentTransactionFilter(request.query_params, queryset=txs)
        if filterset.is_valid():
            txs = filterset.qs
            
        paginator = CustomPagination()
        page = paginator.paginate_queryset(txs, request, view=self)
        if page is not None:
            serializer = PaymentTransactionSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = PaymentTransactionSerializer(txs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def status_histories(self, request):
        """
        List all invoice status histories, optionally filtered by customer_id using InvoiceStatusHistoryFilter.
        """
        histories = InvoiceStatusHistory.objects.all().select_related(
            'monthly_bill__customer',
            'connection_fee__customer',
            'payment_transaction'
        )
        filterset = InvoiceStatusHistoryFilter(request.query_params, queryset=histories)
        if filterset.is_valid():
            histories = filterset.qs
            
        paginator = CustomPagination()
        page = paginator.paginate_queryset(histories, request, view=self)
        if page is not None:
            serializer = InvoiceStatusHistorySerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = InvoiceStatusHistorySerializer(histories, many=True)
        return Response(serializer.data)