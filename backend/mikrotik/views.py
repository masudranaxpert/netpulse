from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import MikrotikRouter
from .serializers import MikrotikRouterSerializer
from .schemas import mikrotik_router_schema_view
from .service.connection import MikrotikConnection
from .service.tools import (
    get_customers, get_active_customers, get_specific_customer,
    get_check_customer_status, get_profiles, create_customer,
    delete_customer, toggle_customer_status
)
from rest_framework.permissions import IsAuthenticated
from core.pagination import CustomPagination, paginate_list_data


@mikrotik_router_schema_view
class MikrotikRouterViewSet(viewsets.ModelViewSet):
    queryset = MikrotikRouter.objects.all()
    serializer_class = MikrotikRouterSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    
    @action(detail=True, methods=['post'])
    def test_connection(self, request, pk=None):
        """Test connection to the MikroTik router"""
        router = self.get_object()
        try:
            conn = MikrotikConnection(
                host=router.host,
                port=router.port,
                username=router.username,
                password=router.password
            )
            
            if conn.api:
                router.status = "connected"
                router.last_checked = timezone.now()
                router.save()
                info = conn.get_router_info()
                return Response({
                    "status": "success",
                    "message": "Successfully connected to router",
                    "router_info": info
                })
            else:
                router.status = "error"
                router.last_checked = timezone.now()
                router.save()
                return Response({
                    "status": "error",
                    "message": "Failed to connect to router"
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            router.status = "error"
            router.last_checked = timezone.now()
            router.save()
            return Response({
                "status": "error",
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def pppoe_customers(self, request, pk=None):
        """Get all PPPoE secrets from the router"""
        router = self.get_object()
        try:
            conn = MikrotikConnection(
                host=router.host,
                port=router.port,
                username=router.username,
                password=router.password
            )
            result = get_customers(conn.api)
            if result.get('status') == 'Success':
                paginated = paginate_list_data(result['customers'], request)
                customers_list = paginated.pop('results')
                paginated_response = {
                    **paginated,
                    'status': result['status'],
                    'customers': customers_list,
                    'customers_count': result['customers_count']
                }
                return Response(paginated_response)
            return Response(result)
        except Exception as e:
            return Response({
                "status": "error",
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def active_sessions(self, request, pk=None):
        """Get currently active PPPoE sessions"""
        router = self.get_object()
        try:
            conn = MikrotikConnection(
                host=router.host,
                port=router.port,
                username=router.username,
                password=router.password
            )
            result = get_active_customers(conn.api)
            if result.get('status') == 'Success':
                paginated = paginate_list_data(result['customers'], request)
                customers_list = paginated.pop('results')
                paginated_response = {
                    **paginated,
                    'status': result['status'],
                    'customers': customers_list,
                    'customers_count': result['customers_count']
                }
                return Response(paginated_response)
            return Response(result)
        except Exception as e:
            return Response({
                "status": "error",
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def get_profiles(self, request, pk=None):
        """Get all PPPoE profile names configured on this router"""
        router = self.get_object()
        try:
            conn = MikrotikConnection(
                host=router.host,
                port=router.port,
                username=router.username,
                password=router.password
            )
            result = get_profiles(conn.api)
            if result.get('status') == 'Found' and result.get('profiles') is not None:
                profile_names = [p['name'] for p in result['profiles'] if 'name' in p]
                return Response({
                    "status": "Success",
                    "profiles": profile_names,
                    "profiles_count": len(profile_names)
                })
            return Response(result)
        except Exception as e:
            return Response({
                "status": "error",
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


