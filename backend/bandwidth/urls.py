from django.urls import path

from .views import (
    ConsumptionSummaryView,
    ExportUsageView,
    LiveUsageView,
    RouterSummariesView,
    SyncBandwidthView,
    TopUsersView,
    UsageLogsView,
)

urlpatterns = [
    path("live/", LiveUsageView.as_view(), name="bandwidth-live"),
    path("sync/", SyncBandwidthView.as_view(), name="bandwidth-sync"),
    path("summary/", ConsumptionSummaryView.as_view(), name="bandwidth-summary"),
    path("logs/", UsageLogsView.as_view(), name="bandwidth-logs"),
    path("top-users/", TopUsersView.as_view(), name="bandwidth-top-users"),
    path("router-summaries/", RouterSummariesView.as_view(), name="bandwidth-router-summaries"),
    path("export/", ExportUsageView.as_view(), name="bandwidth-export"),
]
