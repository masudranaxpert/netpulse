from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import SmsGatewayViewSet, SmsLogViewSet, SmsSendViewSet, SmsTemplateViewSet

router = DefaultRouter()
router.register(r"gateways", SmsGatewayViewSet, basename="sms-gateway")
router.register(r"templates", SmsTemplateViewSet, basename="sms-template")
router.register(r"logs", SmsLogViewSet, basename="sms-log")
router.register(r"sms", SmsSendViewSet, basename="sms")

urlpatterns = [
    path("", include(router.urls)),
]
