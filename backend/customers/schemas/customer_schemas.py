from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse
from customers.serializers import CustomerCreateSerializer, CustomerListSerializer, CustomerLinkExistingSerializer


customer_schema_view = extend_schema_view(
    list=extend_schema(
        summary="List all customers",
        description="Get paginated list of all customers with basic information",
        tags=['customers - Customers'],
        responses={
            200: CustomerListSerializer(many=True),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    create=extend_schema(
        summary="Create new customer",
        description="Create a new customer with profile, PPPoE info, and automatically add to MikroTik router if specified. Validates that the PPPoE name does not exist on the MikroTik router.",
        tags=['customers - Customers'],
        request=CustomerCreateSerializer,
        responses={
            201: CustomerCreateSerializer,
            400: OpenApiResponse(description="Bad Request - Invalid data or PPPoE user already exists on MikroTik"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    retrieve=extend_schema(
        summary="Get customer details",
        description="Get detailed information about a specific customer",
        tags=['customers - Customers'],
        responses={
            200: CustomerCreateSerializer,
            404: OpenApiResponse(description="Customer not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    update=extend_schema(
        summary="Update customer",
        description="Update all customer information",
        tags=['customers - Customers'],
        request=CustomerCreateSerializer,
        responses={
            200: CustomerCreateSerializer,
            400: OpenApiResponse(description="Bad Request"),
            404: OpenApiResponse(description="Customer not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    partial_update=extend_schema(
        summary="Patch customer info",
        description="Partially update customer information",
        tags=['customers - Customers'],
        request=CustomerCreateSerializer(partial=True),
        responses={
            200: CustomerCreateSerializer,
            400: OpenApiResponse(description="Bad Request"),
            404: OpenApiResponse(description="Customer not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    destroy=extend_schema(
        summary="Delete customer",
        description="Delete a customer from the system",
        tags=['customers - Customers'],
        responses={
            204: OpenApiResponse(description="Customer deleted"),
            404: OpenApiResponse(description="Customer not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    link_existing=extend_schema(
        summary="Link existing customer",
        description="Link a customer with an existing MikroTik PPPoE profile. Fetches router settings like password and IP if not specified.",
        tags=['customers - Customers'],
        request=CustomerLinkExistingSerializer,
        responses={
            201: CustomerCreateSerializer,
            400: OpenApiResponse(description="Bad Request - Invalid data or user not found on MikroTik"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    update_status=extend_schema(
        summary="Update customer connection status",
        description="Updates customer status to active or disconnected. If disconnected, removes active PPPoE session and disables secret on MikroTik router. If active, re-enables the secret.",
        tags=['customers - Customers'],
        request={"application/json": {
            "type": "object",
            "required": ["status"],
            "properties": {
                "status": {"type": "string", "enum": ["active", "disconnected"], "example": "disconnected"}
            }
        }},
        responses={
            200: CustomerCreateSerializer,
            400: OpenApiResponse(description="Bad Request - Invalid status or MikroTik sync error"),
            401: OpenApiResponse(description="Unauthorized"),
            404: OpenApiResponse(description="Customer not found"),
        }
    )
)