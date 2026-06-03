from django.urls import path, include
from rest_framework.routers import DefaultRouter
from scheduler.views import SchedulerViewSet

router = DefaultRouter()
router.register(r'tasks', SchedulerViewSet, basename='tasks')

urlpatterns = [
    path('', include(router.urls)),
]
