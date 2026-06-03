import csv

from django.http import HttpResponse
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from . import services


def _filters(request):
    return {
        "date_from": request.query_params.get("date_from") or None,
        "date_to": request.query_params.get("date_to") or None,
        "router": request.query_params.get("router") or None,
        "customer": request.query_params.get("customer") or None,
    }


class LiveUsageView(APIView):
    """Real-time aggregated PPPoE usage + active sessions from RouterOS."""

    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["bandwidth"], summary="Live PPPoE usage and active sessions")
    def get(self, request):
        router_id = request.query_params.get("router") or None
        return Response(services.live_usage(router_id))


class SyncBandwidthView(APIView):
    """Record a snapshot of current active sessions into BandwidthSample."""

    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["bandwidth"], summary="Sync (record) a bandwidth snapshot")
    def post(self, request):
        router_id = request.data.get("router") or request.query_params.get("router") or None
        return Response(services.record_snapshot(router_id))


class ConsumptionSummaryView(APIView):
    """Today / last 7 days / last 30 days consumption totals."""

    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["bandwidth"], summary="Consumption summary cards")
    def get(self, request):
        return Response({
            **services.consumption_summary(),
            "weekly": services.weekly_consumption(),
        })


class UsageLogsView(APIView):
    """Historical usage logs with totals (date range / router / customer filters)."""

    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["bandwidth"], summary="Historical usage logs")
    def get(self, request):
        return Response(services.usage_logs(_filters(request)))


class TopUsersView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["bandwidth"], summary="Top 50 users by consumption")
    def get(self, request):
        return Response({"results": services.top_users(_filters(request))})


class RouterSummariesView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["bandwidth"], summary="Per-router consumption summaries")
    def get(self, request):
        return Response({"results": services.router_summaries(_filters(request))})


class ExportUsageView(APIView):
    """Export filtered historical usage logs as CSV."""

    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["bandwidth"], summary="Export usage logs as CSV")
    def get(self, request):
        data = services.usage_logs(_filters(request), limit=100000)
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="bandwidth_usage.csv"'
        writer = csv.writer(response)
        writer.writerow([
            "Date", "PPPoE User ID", "Customer Name", "Upload (bytes)",
            "Download (bytes)", "Total Combined (bytes)", "Session Uptime", "Router Source",
        ])
        for r in data["results"]:
            writer.writerow([
                r["date"], r["pppoe_id"], r["customer_name"], r["upload_bytes"],
                r["download_bytes"], r["total_bytes"], r["uptime"], r["router"],
            ])
        return response
