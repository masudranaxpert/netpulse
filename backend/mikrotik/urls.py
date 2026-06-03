from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MikrotikRouterViewSet

router = DefaultRouter()
router.register(r'routers', MikrotikRouterViewSet, basename='mikrotik-router')

urlpatterns = [
    path('', include(router.urls)),
]