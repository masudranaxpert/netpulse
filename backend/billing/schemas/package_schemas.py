from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse, OpenApiExample, OpenApiParameter
from billing.serializers import PackageSerializer


package_schema_view = extend_schema_view(
    list=extend_schema(
        summary="List all packages",
        description="Get a paginated list of all internet packages with filtering and search capabilities. Available package types: monthly, quarterly, yearly",
        tags=['packages'],
        parameters=[
            OpenApiParameter(
                name='ordering',
                location=OpenApiParameter.QUERY,
                description='Fields to order results by. Available fields: price, created_at, name, speed. Use "-" prefix for descending order. Examples: "price", "-created_at"',
                required=False,
                type=str
            ),
            OpenApiParameter(
                name='search',
                location=OpenApiParameter.QUERY,
                description='Search term to filter packages. Searches in: name, speed, description',
                required=False,
                type=str
            ),
            OpenApiParameter(
                name='is_active',
                location=OpenApiParameter.QUERY,
                description='Filter packages by active status. true = only active, false = only inactive. If not provided, returns all.',
                required=False,
                type=bool
            )
        ],
        responses={
            200: OpenApiResponse(
                description="Successfully retrieved packages list",
                response=PackageSerializer(many=True),
                examples=[
                    OpenApiExample(
                        'Packages list response',
                        value={
                            "count": 2,
                            "next": None,
                            "previous": None,
                            "results": [
                                {
                                    "id": 1,
                                    "name": "10 Mbps Premium",
                                    "package_type": "monthly",
                                    "speed": "10 Mbps",
                                    "price": "500.00",
                                    "description": "10 Mbps high-speed internet connection",
                                    "is_active": True,
                                    "created_at": "2026-05-22T02:57:10.363Z",
                                    "updated_at": "2026-05-22T02:57:10.363Z"
                                },
                                {
                                    "id": 2,
                                    "name": "20 Mbps Enterprise",
                                    "package_type": "yearly",
                                    "speed": "20 Mbps",
                                    "price": "5500.00",
                                    "description": "20 Mbps enterprise grade internet",
                                    "is_active": True,
                                    "created_at": "2026-05-22T02:57:10.363Z",
                                    "updated_at": "2026-05-22T02:57:10.363Z"
                                }
                            ]
                        }
                    )
                ]
            ),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    create=extend_schema(
        summary="Create new package",
        description="Create a new internet package with all required details. Package types: monthly, quarterly, yearly",
        tags=['packages'],
        request={"application/json": {
            "type": "object",
            "properties": {
                "name": {"type": "string", "example": "10 Mbps Premium"},
                "package_type": {"type": "string", "example": "monthly", "enum": ["monthly", "quarterly", "yearly"]},
                "speed": {"type": "string", "example": "10 Mbps"},
                "price": {"type": "number", "example": 500},
                "description": {"type": "string", "example": "10 Mbps high-speed internet connection"},
                "is_active": {"type": "boolean", "example": True}
            }
        }},
        examples=[
            OpenApiExample(
                'Create monthly package',
                value={
                    "name": "10 Mbps Premium",
                    "package_type": "monthly",
                    "speed": "10 Mbps",
                    "price": 500,
                    "description": "10 Mbps high-speed internet connection",
                    "is_active": True
                },
                request_only=True
            ),
            OpenApiExample(
                'Create yearly package',
                value={
                    "name": "20 Mbps Enterprise",
                    "package_type": "yearly",
                    "speed": "20 Mbps",
                    "price": 5500,
                    "description": "20 Mbps enterprise grade internet",
                    "is_active": True
                },
                request_only=True
            )
        ],
        responses={
            201: OpenApiResponse(
                description="Package created successfully",
                response=PackageSerializer,
                examples=[
                    OpenApiExample(
                        'Package created response',
                        value={
                            "id": 1,
                            "name": "10 Mbps Premium",
                            "package_type": "monthly",
                            "speed": "10 Mbps",
                            "price": "500.00",
                            "description": "10 Mbps high-speed internet connection",
                            "is_active": True,
                            "created_at": "2026-05-22T02:57:10.363Z",
                            "updated_at": "2026-05-22T02:57:10.363Z"
                        }
                    )
                ]
            ),
            400: OpenApiResponse(description="Bad Request - Invalid data"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    retrieve=extend_schema(
        summary="Get package details",
        description="Retrieve detailed information about a specific package",
        tags=['packages'],
        responses={
            200: OpenApiResponse(
                description="Successfully retrieved package details",
                response=PackageSerializer,
                examples=[
                    OpenApiExample(
                        'Package details response',
                        value={
                            "id": 1,
                            "name": "10 Mbps Premium",
                            "package_type": "monthly",
                            "speed": "10 Mbps",
                            "price": "500.00",
                            "description": "10 Mbps high-speed internet connection",
                            "is_active": True,
                            "created_at": "2026-05-22T02:57:10.363Z",
                            "updated_at": "2026-05-22T02:57:10.363Z"
                        }
                    )
                ]
            ),
            404: OpenApiResponse(description="Package not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    update=extend_schema(
        summary="Update package",
        description="Update all fields of an existing package. Package types: monthly, quarterly, yearly",
        tags=['packages'],
        request={"application/json": {
            "type": "object",
            "properties": {
                "name": {"type": "string", "example": "10 Mbps Premium Updated"},
                "package_type": {"type": "string", "example": "monthly", "enum": ["monthly", "quarterly", "yearly"]},
                "speed": {"type": "string", "example": "15 Mbps"},
                "price": {"type": "number", "example": 600},
                "description": {"type": "string", "example": "Updated 15 Mbps high-speed internet"},
                "is_active": {"type": "boolean", "example": True}
            }
        }},
        examples=[
            OpenApiExample(
                'Update package',
                value={
                    "name": "10 Mbps Premium Updated",
                    "package_type": "monthly",
                    "speed": "15 Mbps",
                    "price": 600,
                    "description": "Updated 15 Mbps high-speed internet",
                    "is_active": True
                },
                request_only=True
            )
        ],
        responses={
            200: PackageSerializer,
            400: OpenApiResponse(description="Bad Request - Invalid data"),
            404: OpenApiResponse(description="Package not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    partial_update=extend_schema(
        summary="Partial update package",
        description="Update one or more fields of an existing package. Package types: monthly, quarterly, yearly",
        tags=['packages'],
        request={"application/json": {
            "type": "object",
            "properties": {
                "price": {"type": "number", "example": 550},
                "is_active": {"type": "boolean", "example": False}
            }
        }},
        examples=[
            OpenApiExample(
                'Partial update - change price',
                value={
                    "price": 550
                },
                request_only=True
            ),
            OpenApiExample(
                'Partial update - deactivate package',
                value={
                    "is_active": False
                },
                request_only=True
            )
        ],
        responses={
            200: PackageSerializer,
            400: OpenApiResponse(description="Bad Request - Invalid data"),
            404: OpenApiResponse(description="Package not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    destroy=extend_schema(
        summary="Delete package",
        description="Delete an existing package from the system",
        tags=['packages'],
        responses={
            204: OpenApiResponse(description="Package deleted successfully"),
            404: OpenApiResponse(description="Package not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    toggle_status=extend_schema(
        summary="Toggle package active status",
        description="Activate or deactivate an internet package",
        tags=['packages'],
        methods=['patch'],
        responses={
            200: PackageSerializer,
            404: OpenApiResponse(description="Package not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    )
)