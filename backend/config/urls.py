"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/django-admin/', admin.site.urls),
]




from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns += [
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('api/auth/', include('auth_kit.urls')),
    path('api/billing/', include('billing.urls')),
    path('api/mikrotik/', include('mikrotik.urls')),
    path('api/scheduler/', include('scheduler.urls')),
    path('api/portal/', include('customer_portal.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/sms/', include('sms.urls')),
    path('api/olt/', include('olt.urls')),
    path('api/bandwidth/', include('bandwidth.urls')),
    path('api/', include('customers.urls')),
]