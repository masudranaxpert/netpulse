from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse
from .serializers import (
    CustomerPortalLoginSerializer,
    CustomerPortalProfileSerializer,
    PortalMonthlyBillSerializer,
    PortalConnectionFeeSerializer,
    PortalPaymentTransactionSerializer,
    PortalInvoiceStatusHistorySerializer,
    PortalSupportTicketSerializer
)

portal_schema_view = extend_schema_view(
    login=extend_schema(
        summary="Customer portal login",
        description="Authenticates PPPoE name & pass against RouterInfo, returning a secure CustomerToken.",
        tags=['customer_portal'],
        request=CustomerPortalLoginSerializer,
        responses={
            201: OpenApiResponse(description="Logged in successfully"),
            401: OpenApiResponse(description="Invalid credentials"),
            403: OpenApiResponse(description="Customer is inactive")
        }
    ),
    profile=extend_schema(
        summary="Customer portal profile",
        description="Retrieves the logged-in customer's profile info. Requires bearer token authentication in request headers: 'Authorization: Bearer <your_token>'.",
        tags=['customer_portal'],
        responses={200: CustomerPortalProfileSerializer}
    ),
    logout=extend_schema(
        summary="Customer portal logout",
        description="Deactivates the active customer access token. Requires bearer token authentication in request headers: 'Authorization: Bearer <your_token>'.",
        tags=['customer_portal'],
        responses={200: OpenApiResponse(description="Logged out successfully")}
    ),
    stats=extend_schema(
        summary="Customer live session stats",
        description="Retrieves live Uptime/Bandwidth stats from MikroTik, or fallback to offline status. Requires bearer token authentication in request headers: 'Authorization: Bearer <your_token>'.",
        tags=['customer_portal'],
        responses={200: OpenApiResponse(description="Live stats payload")}
    ),
    monthly_bills=extend_schema(
        summary="Customer monthly bills",
        description="Lists all monthly bills for the logged-in customer with pagination. Requires bearer token authentication in request headers: 'Authorization: Bearer <your_token>'.",
        tags=['customer_portal'],
        responses={200: PortalMonthlyBillSerializer(many=True)}
    ),
    connection_fees=extend_schema(
        summary="Customer connection fees",
        description="Lists all connection fees for the logged-in customer with pagination. Requires bearer token authentication in request headers: 'Authorization: Bearer <your_token>'.",
        tags=['customer_portal'],
        responses={200: PortalConnectionFeeSerializer(many=True)}
    ),
    transactions=extend_schema(
        summary="Customer payment transactions",
        description="Lists all payment transactions for the logged-in customer with pagination. Requires bearer token authentication in request headers: 'Authorization: Bearer <your_token>'.",
        tags=['customer_portal'],
        responses={200: PortalPaymentTransactionSerializer(many=True)}
    ),
    status_histories=extend_schema(
        summary="Customer invoice status histories",
        description="Lists status history logs of invoices belonging to the logged-in customer. Requires bearer token authentication in request headers: 'Authorization: Bearer <your_token>'.",
        tags=['customer_portal'],
        responses={200: PortalInvoiceStatusHistorySerializer(many=True)}
    ),
)

portal_ticket_schema_view = extend_schema_view(
    list=extend_schema(
        summary="List customer support tickets",
        description="Lists all support tickets submitted by the authenticated customer. Requires bearer token authentication in request headers: 'Authorization: Bearer <your_token>'.",
        tags=['customer_portal'],
        responses={200: PortalSupportTicketSerializer(many=True)}
    ),
    create=extend_schema(
        summary="Create customer support ticket",
        description="Creates a new support ticket under the authenticated customer. Requires bearer token authentication in request headers: 'Authorization: Bearer <your_token>'.",
        tags=['customer_portal'],
        request=PortalSupportTicketSerializer,
        responses={201: PortalSupportTicketSerializer}
    ),
    retrieve=extend_schema(
        summary="Get customer support ticket details",
        description="Retrieves details of a specific support ticket. Requires bearer token authentication in request headers: 'Authorization: Bearer <your_token>'.",
        tags=['customer_portal'],
        responses={200: PortalSupportTicketSerializer}
    ),
    update=extend_schema(
        summary="Update customer support ticket",
        description="Updates an existing support ticket. Requires bearer token authentication in request headers: 'Authorization: Bearer <your_token>'.",
        tags=['customer_portal'],
        request=PortalSupportTicketSerializer,
        responses={200: PortalSupportTicketSerializer}
    ),
    partial_update=extend_schema(
        summary="Partially update customer support ticket",
        description="Partially updates an existing support ticket. Requires bearer token authentication in request headers: 'Authorization: Bearer <your_token>'.",
        tags=['customer_portal'],
        request=PortalSupportTicketSerializer,
        responses={200: PortalSupportTicketSerializer}
    ),
    destroy=extend_schema(
        summary="Delete customer support ticket",
        description="Deletes a specific support ticket. Requires bearer token authentication in request headers: 'Authorization: Bearer <your_token>'.",
        tags=['customer_portal'],
        responses={204: OpenApiResponse(description="No Content")}
    )
)

