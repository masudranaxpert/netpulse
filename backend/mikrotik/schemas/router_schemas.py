from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse, OpenApiParameter
from mikrotik.serializers import MikrotikRouterSerializer, RouterInfoSerializer


# Router Management Schemas
mikrotik_router_schema_view = extend_schema_view(
    list=extend_schema(
        summary="List all MikroTik routers",
        description="Get list of all configured MikroTik routers in the system",
        tags=['mikrotik - Routers'],
        responses={
            200: MikrotikRouterSerializer(many=True),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    create=extend_schema(
        summary="Add new MikroTik router",
        description="Add a new MikroTik router to the system",
        tags=['mikrotik - Routers'],
        request=MikrotikRouterSerializer,
        responses={
            201: MikrotikRouterSerializer,
            400: OpenApiResponse(description="Bad Request"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    retrieve=extend_schema(
        summary="Get router details",
        description="Get detailed information about a specific router",
        tags=['mikrotik - Routers'],
        responses={
            200: MikrotikRouterSerializer,
            404: OpenApiResponse(description="Router not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    update=extend_schema(
        summary="Update router",
        description="Update router configuration",
        tags=['mikrotik - Routers'],
        request=MikrotikRouterSerializer,
        responses={
            200: MikrotikRouterSerializer,
            400: OpenApiResponse(description="Bad Request"),
            404: OpenApiResponse(description="Router not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    partial_update=extend_schema(
        summary="Patch router info",
        description="Partially update router configuration",
        tags=['mikrotik - Routers'],
        request=MikrotikRouterSerializer(partial=True),
        responses={
            200: MikrotikRouterSerializer,
            400: OpenApiResponse(description="Bad Request"),
            404: OpenApiResponse(description="Router not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    destroy=extend_schema(
        summary="Delete router",
        description="Remove a router from the system",
        tags=['mikrotik - Routers'],
        responses={
            204: OpenApiResponse(description="Router deleted"),
            404: OpenApiResponse(description="Router not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    test_connection=extend_schema(
        summary="Test router connection",
        description="Test connection to a MikroTik router",
        tags=['mikrotik - Routers'],
        methods=['post'],
        responses={
            200: OpenApiResponse(description="Connection successful"),
            400: OpenApiResponse(description="Connection failed"),
            404: OpenApiResponse(description="Router not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    pppoe_customers=extend_schema(
        summary="Get router PPPoE customers",
        description="Get all PPPoE secrets configured on this router. Supports pagination with page and page_size parameters.",
        tags=['mikrotik - Routers'],
        methods=['get'],
        parameters=[
            OpenApiParameter(name='page', description='Page number within the paginated result set', required=False, type=int),
            OpenApiParameter(name='page_size', description='Number of results to return per page (default: 10, max: 100)', required=False, type=int),
        ],
        responses={
            200: OpenApiResponse(description="List of PPPoE customers with pagination metadata"),
            404: OpenApiResponse(description="Router not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    active_sessions=extend_schema(
        summary="Get active sessions",
        description="Get currently active PPPoE sessions on this router. Supports pagination with page and page_size parameters.",
        tags=['mikrotik - Routers'],
        methods=['get'],
        parameters=[
            OpenApiParameter(name='page', description='Page number within the paginated result set', required=False, type=int),
            OpenApiParameter(name='page_size', description='Number of results to return per page (default: 10, max: 100)', required=False, type=int),
        ],
        responses={
            200: OpenApiResponse(description="List of active sessions with pagination metadata"),
            404: OpenApiResponse(description="Router not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    get_profiles=extend_schema(
        summary="Get router profiles",
        description="Get all PPPoE profile names configured on this MikroTik router",
        tags=['mikrotik - Profiles'],
        methods=['get'],
        responses={
            200: OpenApiResponse(description="List of PPPoE profile names"),
            404: OpenApiResponse(description="Router not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    )
)


# PPPoE Customer Management Schemas
pppoe_customer_schema_view = extend_schema_view(
    list=extend_schema(
        summary="List all PPPoE customers",
        description="Get list of all customers with PPPoE info across all routers",
        tags=['mikrotik - PPPoE Customers'],
        responses={
            200: RouterInfoSerializer(many=True),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    create=extend_schema(
        summary="Create PPPoE customer",
        description="Create a new PPPoE customer on a router",
        tags=['mikrotik - PPPoE Customers'],
        request=RouterInfoSerializer,
        responses={
            201: RouterInfoSerializer,
            400: OpenApiResponse(description="Bad Request"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    retrieve=extend_schema(
        summary="Get customer details",
        description="Get detailed information about a specific PPPoE customer",
        tags=['mikrotik - PPPoE Customers'],
        responses={
            200: RouterInfoSerializer,
            404: OpenApiResponse(description="Customer not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    update=extend_schema(
        summary="Update customer info",
        description="Update PPPoE customer information",
        tags=['mikrotik - PPPoE Customers'],
        request=RouterInfoSerializer(partial=True),
        responses={
            200: RouterInfoSerializer,
            400: OpenApiResponse(description="Bad Request - Invalid data"),
            404: OpenApiResponse(description="Customer not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    partial_update=extend_schema(
        summary="Patch customer info",
        description="Partially update PPPoE customer information",
        tags=['mikrotik - PPPoE Customers'],
        request=RouterInfoSerializer(partial=True),
        responses={
            200: RouterInfoSerializer,
            400: OpenApiResponse(description="Bad Request - Invalid data"),
            404: OpenApiResponse(description="Customer not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    destroy=extend_schema(
        summary="Delete customer",
        description="Remove a PPPoE customer from router",
        tags=['mikrotik - PPPoE Customers'],
        responses={
            204: OpenApiResponse(description="Customer deleted"),
            404: OpenApiResponse(description="Customer not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    get_status=extend_schema(
        summary="Check customer status",
        description="Check if a PPPoE customer is currently active",
        tags=['mikrotik - PPPoE Customers'],
        methods=['get'],
        responses={
            200: OpenApiResponse(description="Customer status"),
            404: OpenApiResponse(description="Customer not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    toggle_status=extend_schema(
        summary="Toggle customer status",
        description="Enable/disable a PPPoE customer on the router",
        tags=['mikrotik - PPPoE Customers'],
        methods=['post'],
        responses={
            200: OpenApiResponse(description="Status updated"),
            404: OpenApiResponse(description="Customer not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    )
)