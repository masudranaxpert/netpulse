from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PackageViewSet, BillingViewSet

router = DefaultRouter()
router.register(r'packages', PackageViewSet, basename='package')
router.register(r'billing', BillingViewSet, basename='billing')

urlpatterns = [
    path('', include(router.urls)),
]