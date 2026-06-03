from drf_spectacular.utils import extend_schema_view, extend_schema, OpenApiResponse, OpenApiExample
from scheduler.serializers import SchedulerTaskSerializer, SchedulerToggleSerializer

scheduler_schema_view = extend_schema_view(
    list=extend_schema(
        summary="List all background tasks and schedules",
        description="Retrieve current status, next run times, and settings for the 3 key ISP scheduler tasks.",
        tags=['scheduler'],
        responses={
            200: SchedulerTaskSerializer(many=True),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    create_task=extend_schema(
        summary="Initialize task scheduler record",
        description="Initializes a new schedule configuration for the selected task. Starts as disabled (repeats = 0).",
        tags=['scheduler'],
        responses={
            201: OpenApiResponse(description="Task schedule record initialized successfully"),
            400: OpenApiResponse(description="Bad Request - Invalid task ID"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    delete_task=extend_schema(
        summary="Delete task scheduler record",
        description="Deletes the schedule configuration for the selected task from the database.",
        tags=['scheduler'],
        responses={
            200: OpenApiResponse(description="Task scheduler record deleted successfully"),
            400: OpenApiResponse(description="Bad Request - Invalid task ID"),
            404: OpenApiResponse(description="Task schedule record not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    ),
    toggle_task=extend_schema(
        summary="Toggle task scheduler on/off",
        description="Enables (repeats = -1) or disables (repeats = 0) the selected background task. If enabling the monthly billing task, day_of_month must be supplied.",
        tags=['scheduler'],
        request=SchedulerToggleSerializer,
        examples=[
            OpenApiExample(
                'Toggle Monthly Billing ON',
                value={"status": "on", "day_of_month": 15},
                request_only=True
            ),
            OpenApiExample(
                'Toggle task OFF',
                value={"status": "off"},
                request_only=True
            )
        ],
        responses={
            200: OpenApiResponse(description="Task status toggled successfully"),
            400: OpenApiResponse(description="Bad Request - Invalid task ID or configuration"),
            404: OpenApiResponse(description="Task schedule record not found"),
            401: OpenApiResponse(description="Unauthorized"),
        }
    )
)
