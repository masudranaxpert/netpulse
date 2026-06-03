from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, AddressZoneViewSet, AdminSupportTicketViewSet

router = DefaultRouter()
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'zones', AddressZoneViewSet, basename='zone')
router.register(r'tickets', AdminSupportTicketViewSet, basename='admin-ticket')

urlpatterns = [
    path('', include(router.urls)),
]