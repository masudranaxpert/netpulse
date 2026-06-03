from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse, OpenApiExample, OpenApiParameter
from billing.serializers.invoices import (
    MonthlyBillSerializer, ConnectionFeeSerializer,
    MonthlyBillCreateSerializer, ConnectionFeeCreateSerializer,
    PaymentTransactionSerializer, PaymentTransactionCreateSerializer,
    InvoiceStatusHistorySerializer
)


billing_schema_view = extend_schema_view(
    generate_monthly_bills=extend_schema(
        summary="Generate monthly bills for all active customers",
        description="Create monthly internet bills for all currently active customers with active packages. Can specify target month and year, defaults to current month.",
        tags=['billing'],
        request={"application/json": {
            "type": "object",
            "properties": {
                "billing_month": {"type": "integer", "example": 5},
                "billing_year": {"type": "integer", "example": 2026}
            }
        }},
        examples=[
            OpenApiExample(
                'Generate current month bills',
                value={},
                request_only=True
            ),
            OpenApiExample(
                'Generate specific month bills',
                value={
                    "billing_month": 5,
                    "billing_year": 2026
                },
                request_only=True
            )
        ],
        responses={
            201: OpenApiResponse(description="Bills created successfully", response={
                "type": "object",
                "properties": {
                    "status": {"type": "string", "example": "success"},
                    "message": {"type": "string", "example": "Created 15 monthly bills"},
                    "bills_created": {"type": "integer", "example": 15}
                }
            }),
            401: OpenApiResponse(description="Unauthorized")
        }
    ),
    generate_customer_monthly_bill=extend_schema(
        summary="Generate monthly bill for specific customer",
        description="Create a monthly internet bill for a specific customer by providing customer ID, month and year.",
        tags=['billing'],
        request=MonthlyBillCreateSerializer,
        examples=[
            OpenApiExample(
                'Create customer monthly bill',
                value={
                    "customer_id": "000001",
                    "billing_month": 5,
                    "billing_year": 2026,
                    "notes": "May 2026 internet bill for Rahul"
                },
                request_only=True
            )
        ],
        responses={
            201: MonthlyBillSerializer,
            400: OpenApiResponse(description="Bad request - invalid data"),
            401: OpenApiResponse(description="Unauthorized"),
            404: OpenApiResponse(description="Customer not found")
        }
    ),
    generate_connection_fee=extend_schema(
        summary="Generate connection fee for new customer",
        description="Create a connection fee invoice for a new customer connection. Requires customer ID and total amount.",
        tags=['billing'],
        request=ConnectionFeeCreateSerializer,
        examples=[
            OpenApiExample(
                'Create connection fee',
                value={
                    "customer_id": "000001",
                    "total_amount": 500,
                    "notes": "New connection installation fee"
                },
                request_only=True
            )
        ],
        responses={
            201: ConnectionFeeSerializer,
            400: OpenApiResponse(description="Bad request - invalid data"),
            401: OpenApiResponse(description="Unauthorized"),
            404: OpenApiResponse(description="Customer not found")
        }
    ),
    monthly_bills=extend_schema(
        summary="List all monthly bills",
        description="Get a list of all monthly internet bills with customer details. Supports pagination and customer filtering.",
        tags=['billing'],
        parameters=[
            OpenApiParameter(
                name="customer_id",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Filter bills by customer ID (e.g., 000001)",
                required=False
            )
        ],
        responses={
            200: MonthlyBillSerializer(many=True),
            401: OpenApiResponse(description="Unauthorized")
        }
    ),
    connection_fees=extend_schema(
        summary="List all connection fees",
        description="Get a list of all connection fee invoices with customer details. Supports pagination and customer filtering.",
        tags=['billing'],
        parameters=[
            OpenApiParameter(
                name="customer_id",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Filter connection fees by customer ID (e.g., 000001)",
                required=False
            )
        ],
        responses={
            200: ConnectionFeeSerializer(many=True),
            401: OpenApiResponse(description="Unauthorized")
        }
    ),
    add_transaction=extend_schema(
        summary="Record a payment transaction and auto-allocate to bills",
        description="Records a customer payment transaction (cash, bkash, etc.), updates the customer's balance, and automatically allocates it to unpaid connection fees and monthly bills.",
        tags=['billing'],
        request=PaymentTransactionCreateSerializer,
        examples=[
            OpenApiExample(
                'Record payment transaction',
                value={
                    "customer_id": "000001",
                    "amount": 500.00,
                    "payment_method": "bkash",
                    "transaction_id": "TRX987654321",
                    "notes": "Paid by customer via bKash"
                },
                request_only=True
            )
        ],
        responses={
            201: OpenApiResponse(
                description="Payment transaction created and allocated successfully",
                response=PaymentTransactionSerializer
              ),
            400: OpenApiResponse(description="Bad request - invalid data"),
            401: OpenApiResponse(description="Unauthorized"),
            404: OpenApiResponse(description="Customer not found")
        }
    ),
    transactions=extend_schema(
        summary="List all payment transactions",
        description="Get a list of all payment transactions, optionally filtered by customer ID. Supports pagination.",
        tags=['billing'],
        parameters=[
            OpenApiParameter(
                name="customer_id",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Filter transactions by customer ID (e.g., 000001)",
                required=False
            )
        ],
        responses={
            200: PaymentTransactionSerializer(many=True),
            401: OpenApiResponse(description="Unauthorized")
        }
    ),
    status_histories=extend_schema(
        summary="List all invoice status histories",
        description="Get a list of all invoice status history logs, optionally filtered by customer ID. Supports pagination.",
        tags=['billing'],
        parameters=[
            OpenApiParameter(
                name="customer_id",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Filter status histories by customer ID (e.g., 000001)",
                required=False
            )
        ],
        responses={
            200: InvoiceStatusHistorySerializer(many=True),
            401: OpenApiResponse(description="Unauthorized")
        }
    )
)
