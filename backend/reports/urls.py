from django.urls import path
from .views import DashboardReportView

urlpatterns = [
    path("dashboard/", DashboardReportView.as_view(), name="reports-dashboard"),
]
