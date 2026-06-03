from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import BasePermission
from django.utils import timezone
from .models import CustomerToken
from customers.models import CustomerProfile

class CustomerPortalAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None
        
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return None
            
        token_key = parts[1]
        try:
            token = CustomerToken.objects.select_related('customer').get(
                key=token_key,
                is_active=True,
                expires_at__gt=timezone.now()
            )
        except CustomerToken.DoesNotExist:
            raise AuthenticationFailed('Invalid or expired customer token.')
            
        return (token.customer, token)

class IsAuthenticatedCustomer(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user and 
            isinstance(request.user, CustomerProfile) and 
            request.user.customer_status == 'active'
        )
