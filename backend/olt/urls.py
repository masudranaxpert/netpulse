from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import OltDeviceViewSet, OnuViewSet

router = DefaultRouter()
router.register(r"devices", OltDeviceViewSet, basename="olt-device")
router.register(r"onus", OnuViewSet, basename="onu")

urlpatterns = [
    path("", include(router.urls)),
]
