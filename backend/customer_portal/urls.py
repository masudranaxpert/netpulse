from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuthViewSet, DashboardViewSet, BillingViewSet, SupportTicketViewSet, PublicPackageViewSet,
)

router = DefaultRouter()
router.register('auth', AuthViewSet, basename='portal-auth')
router.register('dashboard', DashboardViewSet, basename='portal-dashboard')
router.register('billing', BillingViewSet, basename='portal-billing')
router.register('tickets', SupportTicketViewSet, basename='portal-tickets')
router.register('packages', PublicPackageViewSet, basename='portal-packages')

urlpatterns = [
    path('', include(router.urls)),
]
