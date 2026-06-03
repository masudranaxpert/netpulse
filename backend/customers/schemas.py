from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse
from .serializers.tickets import (
    AdminSupportTicketSerializer,
    AdminSupportTicketDetailSerializer,
    TicketReplySerializer
)

admin_ticket_schema_view = extend_schema_view(
    list=extend_schema(
        summary="List support tickets (Admin)",
        description="Lists all support tickets submitted by customers. Supports status and priority filters.",
        tags=['customers - Tickets']
    ),
    retrieve=extend_schema(
        summary="Retrieve support ticket detail (Admin)",
        description="Gets detailed representation of a specific support ticket including nested replies.",
        tags=['customers - Tickets'],
        responses={200: AdminSupportTicketDetailSerializer}
    ),
    create=extend_schema(
        summary="Create support ticket (Admin)",
        description="Creates a support ticket on behalf of a customer.",
        tags=['customers - Tickets'],
        request=AdminSupportTicketSerializer,
        responses={201: AdminSupportTicketSerializer}
    ),
    update=extend_schema(
        summary="Update support ticket (Admin)",
        description="Updates support ticket details.",
        tags=['customers - Tickets'],
        request=AdminSupportTicketSerializer,
        responses={200: AdminSupportTicketSerializer}
    ),
    partial_update=extend_schema(
        summary="Partially update support ticket (Admin)",
        description="Partially updates support ticket status or details.",
        tags=['customers - Tickets'],
        request=AdminSupportTicketSerializer,
        responses={200: AdminSupportTicketSerializer}
    ),
    destroy=extend_schema(
        summary="Delete support ticket (Admin)",
        description="Permanently deletes a support ticket.",
        tags=['customers - Tickets'],
        responses={204: OpenApiResponse(description="No Content")}
    ),
    reply=extend_schema(
        summary="Submit support ticket reply (Admin)",
        description="Submits a reply on behalf of staff user to a support ticket.",
        tags=['customers - Tickets'],
        request={"application/json": {
            "type": "object",
            "properties": {
                "reply_text": {"type": "string", "example": "We are looking into this."}
            },
            "required": ["reply_text"]
        }},
        responses={201: TicketReplySerializer}
    )
)
