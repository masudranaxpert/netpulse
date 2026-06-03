from django.db import transaction
from django.utils import timezone
from .models import CustomerProfile, AddressZone
from billing.models import Package
from mikrotik.models import MikrotikRouter, RouterInfo


class CustomerService:
    @staticmethod
    def generate_customer_id():
        """Generate unique customer ID"""
        last_customer = CustomerProfile.objects.all().order_by('-id').first()
        if last_customer:
            try:
                num = int(last_customer.customer_id)
                return f"{num + 1:06d}"
            except:
                pass
        return "000001"
    
    @staticmethod
    def check_pppoe_user_exists(router_id, pppoe_name):
        """Check if a PPPoE secret exists on the specified MikroTik router"""
        if not router_id or not pppoe_name:
            return None
        
        from mikrotik.models import MikrotikRouter
        from mikrotik.service.helpers import check_pppoe_user_exists_on_router
        
        try:
            router = MikrotikRouter.objects.get(id=router_id)
            return check_pppoe_user_exists_on_router(router, pppoe_name)
        except Exception as e:
            raise e
        return None

    @staticmethod
    @transaction.atomic
    def create_customer(validated_data):
        """Create customer with all related information"""
        from rest_framework import serializers
        
        router_id = validated_data.get('router_id')
        pppoe_name = validated_data.get('pppoe_name')
        if pppoe_name:
            pppoe_name = pppoe_name.lower()
            validated_data['pppoe_name'] = pppoe_name

        if router_id and pppoe_name:
            if RouterInfo.objects.filter(router_id=router_id, pppoe_name__iexact=pppoe_name).exists():
                raise serializers.ValidationError({
                    "pppoe_name": ["PPPoE user already exists in local database for this router."]
                })

            try:
                existing_info = CustomerService.check_pppoe_user_exists(router_id, pppoe_name)
            except Exception as e:
                raise serializers.ValidationError({
                    "pppoe_name": [f"Error checking PPPoE user on router: {str(e)}"]
                })
            
            if existing_info:
                raise serializers.ValidationError({
                    "pppoe_name": ["PPPoE user already exists on this MikroTik router."]
                })
        
        customer_id = validated_data.get('customer_id') or CustomerService.generate_customer_id()
        
        zone = AddressZone.objects.get(id=validated_data['zone_id'])
        package = None
        if validated_data.get('package_id'):
            package = Package.objects.get(id=validated_data['package_id'])
        
        billing_day = validated_data.get('billing_day', 1)
        today = timezone.now()
        if today.month == 12:
            next_month = today.replace(year=today.year + 1, month=1, day=1)
        else:
            next_month = today.replace(month=today.month + 1, day=1)
        
        import calendar
        last_day = calendar.monthrange(next_month.year, next_month.month)[1]
        billing_day = min(billing_day, last_day)
        final_billing_date = next_month.replace(day=billing_day).date()
        
        customer = CustomerProfile.objects.create(
            customer_id=customer_id,
            customer_name=validated_data['customer_name'],
            nid=validated_data.get('nid'),
            phone_number=validated_data['phone_number'],
            phone_number2=validated_data.get('phone_number2'),
            address=validated_data['address'],
            zone=zone,
            package=package,
            billing_date=final_billing_date
        )
        
        router = None
        if validated_data.get('router_id'):
            router = MikrotikRouter.objects.get(id=validated_data['router_id'])

            profile = validated_data.get('profile_name')
            if not profile and package:
                profile = package.name
            if not profile:
                profile = 'default'

            router_info = RouterInfo.objects.create(
                pppoe_name=validated_data['pppoe_name'],
                pppoe_pass=validated_data['pppoe_pass'],
                profile_name=profile,
                remote_ip=validated_data.get('remote_ip'),
                customer=customer,
                router=router
            )
            
            try:
                from mikrotik.service.helpers import (
                    generate_customer_comment, 
                    create_pppoe_user_on_router
                )

                service = validated_data.get('service_type') or 'pppoe'
                service = service.lower()
                
                comment = generate_customer_comment(
                    customer_id=customer.customer_id,
                    customer_name=customer.customer_name,
                    phone_number=customer.phone_number,
                    address=customer.address,
                    zone_name=zone.name
                )
                
                create_pppoe_user_on_router(
                    router=router,
                    pppoe_name=validated_data['pppoe_name'],
                    pppoe_pass=validated_data['pppoe_pass'],
                    profile=profile,
                    service=service,
                    comment=comment
                )
            except Exception as e:
                raise serializers.ValidationError({
                    "router_info": [f"MikroTik Error: {str(e)}"]
                })
        
        return customer

    @staticmethod
    @transaction.atomic
    def link_existing_customer(validated_data):
        """Link customer with an existing PPPoE profile on MikroTik"""
        from rest_framework import serializers
        
        router_id = validated_data.get('router_id')
        pppoe_name = validated_data.get('pppoe_name')
        if pppoe_name:
            pppoe_name = pppoe_name.lower()
            validated_data['pppoe_name'] = pppoe_name
            
        if router_id and pppoe_name:
            if RouterInfo.objects.filter(router_id=router_id, pppoe_name__iexact=pppoe_name).exists():
                raise serializers.ValidationError({
                    "pppoe_name": ["PPPoE user is already linked to a customer in the database."]
                })
            
        try:
            existing_info = CustomerService.check_pppoe_user_exists(router_id, pppoe_name)
        except Exception as e:
            raise serializers.ValidationError({
                "pppoe_name": [f"Error checking PPPoE user on router: {str(e)}"]
            })
            
        if not existing_info:
            raise serializers.ValidationError({
                "pppoe_name": ["PPPoE user does not exist on this router. Cannot link."]
            })
            
        pppoe_pass = validated_data.get('pppoe_pass') or existing_info.get('password')
        profile_name = validated_data.get('profile_name') or existing_info.get('profile', 'default')
        remote_ip = validated_data.get('remote_ip') or existing_info.get('remote-address')
        service_type = validated_data.get('service_type') or existing_info.get('service', 'pppoe')
        
        customer_id = validated_data.get('customer_id') or CustomerService.generate_customer_id()
        zone = AddressZone.objects.get(id=validated_data['zone_id'])
        
        package = None
        if validated_data.get('package_id'):
            package = Package.objects.get(id=validated_data['package_id'])
        
        billing_day = validated_data.get('billing_day', 1)
        today = timezone.now()
        if today.month == 12:
            next_month = today.replace(year=today.year + 1, month=1, day=1)
        else:
            next_month = today.replace(month=today.month + 1, day=1)
        
        import calendar
        last_day = calendar.monthrange(next_month.year, next_month.month)[1]
        billing_day = min(billing_day, last_day)
        final_billing_date = next_month.replace(day=billing_day).date()
        
        customer = CustomerProfile.objects.create(
            customer_id=customer_id,
            customer_name=validated_data['customer_name'],
            nid=validated_data.get('nid'),
            phone_number=validated_data['phone_number'],
            phone_number2=validated_data.get('phone_number2'),
            address=validated_data['address'],
            zone=zone,
            package=package,
            billing_date=final_billing_date
        )
        
        router = MikrotikRouter.objects.get(id=router_id)
        router_info = RouterInfo.objects.create(
            pppoe_name=pppoe_name,
            pppoe_pass=pppoe_pass,
            profile_name=profile_name,
            remote_ip=remote_ip,
            customer=customer,
            router=router
        )
        
        try:
            from mikrotik.service.helpers import (
                generate_customer_comment,
                update_pppoe_comment_on_router
            )
            
            comment = generate_customer_comment(
                customer_id=customer.customer_id,
                customer_name=customer.customer_name,
                phone_number=customer.phone_number,
                address=customer.address,
                zone_name=zone.name
            )
            
            update_pppoe_comment_on_router(
                router=router,
                pppoe_name=pppoe_name,
                comment=comment
            )
        except Exception as e:
            raise serializers.ValidationError({
                "router_info": [f"MikroTik Error during linking: {str(e)}"]
            })
            
        return customer
    
    @staticmethod
    def get_all_customers():
        """Get all customers with basic info"""
        return CustomerProfile.objects.select_related('zone', 'package', 'router_info').all()

    @staticmethod
    def get_online_pppoe_names():
        """Return a set of PPPoE names with an active session across all active routers.

        Best-effort: routers that are unreachable are skipped silently so a single
        offline router never breaks the whole lookup.
        """
        from mikrotik.models import MikrotikRouter
        from mikrotik.service.connection import MikrotikConnection
        from mikrotik.service.tools import get_active_customers

        names = set()
        for router in MikrotikRouter.objects.filter(is_active=True):
            try:
                conn = MikrotikConnection(
                    host=router.host, port=router.port,
                    username=router.username, password=router.password,
                )
                if not conn.api:
                    continue
                result = get_active_customers(conn.api)
                if result.get('status') == 'Success':
                    for c in result.get('customers', []):
                        name = c.get('name')
                        if name:
                            names.add(name.lower())
            except Exception:
                continue
        return names
    
    @staticmethod
    def get_customer_details(customer_id):
        """Get detailed customer info with router info"""
        return CustomerProfile.objects.filter(customer_id=customer_id).select_related('zone', 'package', 'router_info__router').first()

    @staticmethod
    def update_billing_settings(customer_id, billing_day=None, extended_billing_days=None):
        """Set the customer's billing day (1-28) and/or grace/extended days."""
        import calendar
        from django.utils import timezone

        customer = CustomerProfile.objects.filter(customer_id=customer_id).first()
        if not customer:
            return None

        if billing_day is not None:
            base = customer.billing_date or timezone.now().date()
            last_day = calendar.monthrange(base.year, base.month)[1]
            day = min(int(billing_day), last_day, 28)
            customer.billing_date = base.replace(day=day)

        if extended_billing_days is not None:
            customer.extended_billing_days = max(0, int(extended_billing_days))

        customer.save()
        return customer

    @staticmethod
    def update_customer_status(customer_id, status_value):
        """Update customer status locally, then best-effort sync to MikroTik.

        The local status change is always persisted. If the router is unreachable
        we keep the local change and return a warning instead of failing.
        Returns: (customer, warning_or_None)
        """
        from mikrotik.service.helpers import update_pppoe_status_on_router

        customer = CustomerProfile.objects.filter(customer_id=customer_id).select_related('router_info__router').first()
        if not customer:
            raise Exception("Customer not found.")

        if customer.customer_status == status_value:
            return customer, None

        customer.customer_status = status_value
        customer.save(update_fields=["customer_status", "updated_at"])

        warning = None
        if getattr(customer, 'router_info', None) and customer.router_info.router:
            router = customer.router_info.router
            pppoe_name = customer.router_info.pppoe_name
            disabled = (status_value == 'disconnected')
            try:
                update_pppoe_status_on_router(router, pppoe_name, disabled)
            except Exception as e:
                warning = f"Status saved locally, but router sync failed: {str(e)}"

        return customer, warning

    @staticmethod
    def update_customer_connection(customer_id, data):
        """Update a customer's PPPoE/router connection and best-effort push to MikroTik.

        Returns: (customer, warning_or_None)
        """
        from mikrotik.service.helpers import update_pppoe_secret_on_router

        customer = CustomerProfile.objects.filter(customer_id=customer_id).select_related('router_info__router').first()
        if not customer:
            raise Exception("Customer not found.")
        info = getattr(customer, 'router_info', None)
        if not info:
            raise Exception("This customer has no PPPoE connection to edit.")

        for field in ("pppoe_name", "pppoe_pass", "profile_name", "remote_ip"):
            if field in data and data[field] is not None:
                setattr(info, field, data[field])
        if data.get("router") is not None:
            info.router_id = data["router"] or None
        info.save()

        warning = None
        if info.router:
            try:
                update_pppoe_secret_on_router(
                    info.router, info.pppoe_name,
                    profile=info.profile_name or None,
                    password=info.pppoe_pass or None,
                )
            except Exception as e:
                warning = f"Saved locally, but router sync failed: {str(e)}"
        return customer, warning

    @staticmethod
    @transaction.atomic
    def delete_customer_profile(customer_id):
        """Delete customer profile from database and remove PPPoE secret and active sessions from MikroTik"""
        from rest_framework import serializers
        from mikrotik.service.helpers import delete_pppoe_user_from_router
        
        customer = CustomerProfile.objects.filter(customer_id=customer_id).select_related('router_info__router').first()
        if not customer:
            raise Exception("Customer not found.")
            
        if hasattr(customer, 'router_info') and customer.router_info and customer.router_info.router:
            router = customer.router_info.router
            pppoe_name = customer.router_info.pppoe_name
            
            try:
                delete_pppoe_user_from_router(router, pppoe_name)
            except Exception as e:
                raise serializers.ValidationError({
                    "customer": [f"Failed to delete user from MikroTik router: {str(e)}. Deletion rolled back."]
                })
                
        customer.delete()