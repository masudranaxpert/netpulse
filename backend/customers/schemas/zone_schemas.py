from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse
from customers.serializers import AddressZoneSerializer, AddressZoneCreateSerializer


zone_schema_view = extend_schema_view(
    list=extend_schema(
        summary="List all zones",
        description="Get list of all address zones in the system",
        tags=['customers - Zones'],
        responses={
            200: AddressZoneSerializer(many=True),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    create=extend_schema(
        summary="Create new zone",
        description="Create a new address zone for customer locations",
        tags=['customers - Zones'],
        request=AddressZoneCreateSerializer,
        responses={
            201: AddressZoneSerializer,
            400: OpenApiResponse(description="Bad Request - Invalid data"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    retrieve=extend_schema(
        summary="Get zone details",
        description="Get detailed information about a specific zone",
        tags=['customers - Zones'],
        responses={
            200: AddressZoneSerializer,
            404: OpenApiResponse(description="Zone not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    update=extend_schema(
        summary="Update zone",
        description="Update zone information",
        tags=['customers - Zones'],
        request=AddressZoneCreateSerializer,
        responses={
            200: AddressZoneSerializer,
            400: OpenApiResponse(description="Bad Request"),
            404: OpenApiResponse(description="Zone not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    partial_update=extend_schema(
        summary="Patch zone info",
        description="Partially update zone information",
        tags=['customers - Zones'],
        request=AddressZoneCreateSerializer,
        responses={
            200: AddressZoneSerializer,
            400: OpenApiResponse(description="Bad Request"),
            404: OpenApiResponse(description="Zone not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    destroy=extend_schema(
        summary="Delete zone",
        description="Delete an address zone from the system",
        tags=['customers - Zones'],
        responses={
            204: OpenApiResponse(description="Zone deleted successfully"),
            404: OpenApiResponse(description="Zone not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
)
