"""Root URL configuration — all routes live under ``/api/``."""
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path("api/django-admin/", admin.site.urls),
    # API documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    # Domain apps
    path("api/auth/", include("auth_kit.urls")),
    path("api/billing/", include("billing.urls")),
    path("api/mikrotik/", include("mikrotik.urls")),
    path("api/scheduler/", include("scheduler.urls")),
    path("api/portal/", include("customer_portal.urls")),
    path("api/reports/", include("reports.urls")),
    path("api/sms/", include("sms.urls")),
    path("api/olt/", include("olt.urls")),
    path("api/bandwidth/", include("bandwidth.urls")),
    # Registered last: catches /api/customers/, /api/zones/, /api/tickets/
    path("api/", include("customers.urls")),
]
