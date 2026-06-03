from datetime import datetime, timedelta
from django.db import transaction
from django.db.models import Sum
from billing.models import MonthlyBill, ConnectionFee
from customers.models import CustomerProfile


class BillingService:
    @staticmethod
    def create_monthly_bills(target_month=None, target_year=None):
        if not target_month:
            target_month = datetime.now().month
        if not target_year:
            target_year = datetime.now().year
            
        active_customers = CustomerProfile.objects.filter(customer_status='active', package__isnull=False)
        created_bills = []
        
        for customer in active_customers:
            existing_bill = MonthlyBill.objects.filter(
                customer=customer,
                billing_month=target_month,
                billing_year=target_year
            ).exists()
            
            if not existing_bill and customer.package:
                bill = MonthlyBill.objects.create(
                    customer=customer,
                    package_name=customer.package.name,
                    package_price=customer.package.price,
                    billing_month=target_month,
                    billing_year=target_year,
                    invoice_date=datetime.now(),
                    total_amount=customer.package.price,
                    paid_amount=0
                )
                created_bills.append(bill)
        
        return created_bills
    
    @staticmethod
    def create_specific_monthly_bill(customer_id, billing_month, billing_year, notes=""):
        try:
            customer = CustomerProfile.objects.get(customer_id=customer_id)
            if not customer.package:
                return {"status": "error", "message": "Customer has no package assigned"}
            
            existing_bill = MonthlyBill.objects.filter(
                customer=customer,
                billing_month=billing_month,
                billing_year=billing_year
            ).exists()
            
            if existing_bill:
                return {"status": "error", "message": "Bill already exists for this month"}
            
            bill = MonthlyBill.objects.create(
                customer=customer,
                package_name=customer.package.name,
                package_price=customer.package.price,
                billing_month=billing_month,
                billing_year=billing_year,
                invoice_date=datetime.now(),
                total_amount=customer.package.price,
                paid_amount=0,
                notes=notes
            )
            return {"status": "success", "message": "Monthly bill created successfully", "bill": bill}
        except CustomerProfile.DoesNotExist:
            return {"status": "error", "message": "Customer not found"}
    
    @staticmethod
    def create_connection_fee(customer_id, total_amount, notes=""):
        try:
            customer = CustomerProfile.objects.get(customer_id=customer_id)
            
            fee = ConnectionFee.objects.create(
                customer=customer,
                invoice_date=datetime.now(),
                total_amount=total_amount,
                paid_amount=0,
                notes=notes
            )
            return {"status": "success", "message": "Connection fee created successfully", "fee": fee}
        except CustomerProfile.DoesNotExist:
            return {"status": "error", "message": "Customer not found"}
    
    @staticmethod
    def check_overdue_bills():
        today = datetime.now().date()
        overdue_customers = []
        
        unpaid_bills = MonthlyBill.objects.filter(
            payment_status__in=['unpaid', 'partial'],
            billing_year__lte=today.year,
            billing_month__lt=today.month if today.year == today.year else 12
        ).select_related('customer')
        
        for bill in unpaid_bills:
            if bill.customer.customer_status == 'active':
                if bill.customer.billing_date:
                    extended_date = bill.customer.billing_date + timedelta(days=bill.customer.extended_billing_days)
                    if today > extended_date:
                        bill.customer.customer_status = 'disconnected'
                        bill.customer.save()
                        overdue_customers.append(bill.customer)
        
        return overdue_customers
    
    @staticmethod
    def get_customer_billing_summary(customer_id):
        monthly_bills = MonthlyBill.objects.filter(customer__customer_id=customer_id)
        connection_fees = ConnectionFee.objects.filter(customer__customer_id=customer_id)
        
        total_monthly = monthly_bills.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_fees = connection_fees.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        total_billed = total_monthly + total_fees
        
        paid_monthly = monthly_bills.aggregate(Sum('paid_amount'))['paid_amount__sum'] or 0
        paid_fees = connection_fees.aggregate(Sum('paid_amount'))['paid_amount__sum'] or 0
        total_paid = paid_monthly + paid_fees
        
        pending = total_billed - total_paid
        
        return {
            'total_billed': total_billed,
            'total_paid': total_paid,
            'pending_amount': pending,
            'monthly_bill_count': monthly_bills.count(),
            'connection_fee_count': connection_fees.count()
        }

    @staticmethod
    @transaction.atomic
    def add_payment_transaction(customer_id, amount, payment_method, transaction_id=None, received_by=None, notes=""):
        from django.utils import timezone
        from billing.models import PaymentTransaction, PaymentAllocation, InvoiceStatusHistory, MonthlyBill, ConnectionFee
        from customers.models import CustomerProfile
        from rest_framework import serializers
        
        try:
            customer = CustomerProfile.objects.get(customer_id=customer_id)
        except CustomerProfile.DoesNotExist:
            raise serializers.ValidationError({"customer_id": ["Customer not found."]})
            
        if amount == 0:
            raise serializers.ValidationError({"amount": ["Amount cannot be zero."]})
            
        transaction_obj = PaymentTransaction.objects.create(
            customer=customer,
            amount=amount,
            payment_method=payment_method,
            transaction_id=transaction_id or None,
            received_by=received_by,
            notes=notes or ""
        )
        
        customer.balance += amount
        customer.save()
        
        # Negative amounts are manual debits/adjustments: only affect the balance,
        # never auto-allocate against outstanding invoices.
        if amount < 0:
            return transaction_obj
        
        connection_fees = ConnectionFee.objects.filter(
            customer=customer,
            payment_status__in=['unpaid', 'partial']
        ).order_by('created_at')
        
        for fee in connection_fees:
            if customer.balance <= 0:
                break
            remaining = fee.remaining_amount
            allocate_amount = min(customer.balance, remaining)
            if allocate_amount > 0:
                PaymentAllocation.objects.create(
                    payment_transaction=transaction_obj,
                    connection_fee=fee,
                    amount=allocate_amount
                )
                
                prev_status = fee.payment_status
                fee.paid_amount += allocate_amount
                if fee.paid_amount == fee.total_amount:
                    fee.payment_status = 'paid'
                    fee.payment_date = timezone.now().date()
                else:
                    fee.payment_status = 'partial'
                fee.save()
                
                InvoiceStatusHistory.objects.create(
                    connection_fee=fee,
                    payment_transaction=transaction_obj,
                    amount=allocate_amount,
                    previous_status=prev_status,
                    new_status=fee.payment_status
                )
                
                customer.balance -= allocate_amount
                customer.save()
                
        monthly_bills = MonthlyBill.objects.filter(
            customer=customer,
            payment_status__in=['unpaid', 'partial']
        ).order_by('billing_year', 'billing_month', 'created_at')
        
        for bill in monthly_bills:
            if customer.balance <= 0:
                break
            remaining = bill.remaining_amount
            allocate_amount = min(customer.balance, remaining)
            if allocate_amount > 0:
                PaymentAllocation.objects.create(
                    payment_transaction=transaction_obj,
                    monthly_bill=bill,
                    amount=allocate_amount
                )
                
                prev_status = bill.payment_status
                bill.paid_amount += allocate_amount
                if bill.paid_amount == bill.total_amount:
                    bill.payment_status = 'paid'
                    bill.payment_date = timezone.now().date()
                else:
                    bill.payment_status = 'partial'
                bill.save()
                
                InvoiceStatusHistory.objects.create(
                    monthly_bill=bill,
                    payment_transaction=transaction_obj,
                    amount=allocate_amount,
                    previous_status=prev_status,
                    new_status=bill.payment_status
                )
                
                customer.balance -= allocate_amount
                customer.save()
                
        return transaction_obj