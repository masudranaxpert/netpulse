import calendar
from datetime import timedelta
from django.utils import timezone
from django.db import transaction

def monthly_bill_job():
    """Task to automatically generate monthly bills for active customers"""
    from billing.services import BillingService
    BillingService.create_monthly_bills()

def bill_due_disconnect_job():
    """Task to check for past due invoices and disconnect customers locally and on MikroTik"""
    from customers.models import CustomerProfile
    from customers.service import CustomerService
    from billing.models import MonthlyBill, ConnectionFee
    
    today = timezone.now().date()
    active_customers = CustomerProfile.objects.filter(
        customer_status='active', 
        billing_date__isnull=False
    )
    
    for customer in active_customers:
        due_date = customer.billing_date + timedelta(days=customer.extended_billing_days)
        if today > due_date:
            has_unpaid_monthly = MonthlyBill.objects.filter(
                customer=customer, 
                payment_status__in=['unpaid', 'partial']
            ).exists()
            has_unpaid_connection = ConnectionFee.objects.filter(
                customer=customer,
                payment_status__in=['unpaid', 'partial']
            ).exists()
            
            if has_unpaid_monthly or has_unpaid_connection:
                try:
                    CustomerService.update_customer_status(customer.customer_id, 'disconnected')
                except Exception as e:
                    pass

def billing_date_update_job():
    """Task to update billing date to the current month and reset extended days on new billing cycles"""
    from customers.models import CustomerProfile
    
    today = timezone.now().date()
    past_billing_customers = CustomerProfile.objects.filter(billing_date__isnull=False)
    
    for customer in past_billing_customers:
        bdate = customer.billing_date
        if bdate.year < today.year or (bdate.year == today.year and bdate.month < today.month):
            day = bdate.day
            last_day = calendar.monthrange(today.year, today.month)[1]
            target_day = min(day, last_day)
            
            customer.billing_date = bdate.replace(year=today.year, month=today.month, day=target_day)
            customer.extended_billing_days = 0
            customer.save()
