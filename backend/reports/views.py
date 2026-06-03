from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import ReportService


class DashboardReportView(APIView):
    """Aggregated KPIs, revenue totals, and monthly/yearly billing series."""

    permission_classes = [IsAuthenticated]

    @extend_schema(tags=["reports"], summary="Admin dashboard summary")
    def get(self, request):
        return Response(ReportService.dashboard_summary())
