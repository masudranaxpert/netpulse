from django.db import models
from django.contrib.auth.models import User
from customers.models import CustomerProfile


class MetaInfo(models.Model):
    class Meta:
        abstract = True
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Package(MetaInfo):
    PACKAGE_TYPE_CHOICES = [
        ("monthly", "Monthly"),
        ("quarterly", "Quarterly"),
        ("yearly", "Yearly"),
    ]
    name = models.CharField(max_length=100, unique=True)
    package_type = models.CharField(max_length=20, choices=PACKAGE_TYPE_CHOICES, default="monthly")
    speed = models.CharField(max_length=50, help_text="e.g., 10 Mbps, 20 Mbps")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - {self.speed} - {self.price}"

    class Meta:
        ordering = ["price"]
        verbose_name = "Internet Package"
        verbose_name_plural = "Internet Packages"


class MonthlyBill(MetaInfo):
    PAYMENT_STATUS_CHOICES = [
        ("free", "Free - No Charge"),
        ("paid", "Paid"),
        ("unpaid", "Unpaid"),
        ("partial", "Partially Paid"),
    ]

    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name="monthly_bills")
    package_name = models.CharField(max_length=100, blank=True, null=True)
    package_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    
    billing_month = models.IntegerField()
    billing_year = models.IntegerField()
    invoice_date = models.DateField()
    
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default="unpaid")
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    payment_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    @property
    def remaining_amount(self):
        return self.total_amount - self.paid_amount
    
    @property
    def billing_period(self):
        months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        return f"{months[self.billing_month - 1]} {self.billing_year}"

    def __str__(self):
        return f"MonthlyBill #{self.id} - {self.customer.customer_id} - {self.billing_period}"

    class Meta:
        ordering = ["-billing_year", "-billing_month", "-created_at"]
        verbose_name = "Monthly Internet Bill"
        verbose_name_plural = "Monthly Internet Bills"
        unique_together = ["customer", "billing_month", "billing_year"]


class ConnectionFee(MetaInfo):
    PAYMENT_STATUS_CHOICES = [
        ("free", "Free - No Charge"),
        ("paid", "Paid"),
        ("unpaid", "Unpaid"),
        ("partial", "Partially Paid"),
    ]

    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name="connection_fees")
    
    invoice_date = models.DateField()
    
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=10, choices=PAYMENT_STATUS_CHOICES, default="unpaid")
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    payment_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)

    @property
    def remaining_amount(self):
        return self.total_amount - self.paid_amount

    def __str__(self):
        return f"ConnectionFee #{self.id} - {self.customer.customer_id}"

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "New Connection Fee"
        verbose_name_plural = "New Connection Fees"

class PaymentTransaction(MetaInfo):
    PAYMENT_METHOD_CHOICES = [
        ("cash", "Cash Payment"),
        ("bkash", "bKash"),
        ("nagad", "Nagad"),
        ("rocket", "Rocket"),
        ("bank_transfer", "Bank Transfer"),
        ("card", "Credit/Debit Card"),
        ("adjustment", "Manual Adjustment"),
        ("other", "Other"),
    ]
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name="payment_transactions")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default="cash")
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    received_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="received_transactions")
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"Transaction #{self.id} - {self.customer.customer_id} - {self.amount}"

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Payment Transaction"
        verbose_name_plural = "Payment Transactions"


class PaymentAllocation(MetaInfo):
    payment_transaction = models.ForeignKey(PaymentTransaction, on_delete=models.CASCADE, related_name="allocations")
    monthly_bill = models.ForeignKey(MonthlyBill, on_delete=models.CASCADE, related_name="allocations", null=True, blank=True)
    connection_fee = models.ForeignKey(ConnectionFee, on_delete=models.CASCADE, related_name="allocations", null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        bill_type = "MonthlyBill" if self.monthly_bill else "ConnectionFee"
        bill_id = self.monthly_bill.id if self.monthly_bill else self.connection_fee.id
        return f"Allocation #{self.id} - Trans #{self.payment_transaction.id} to {bill_type} #{bill_id} - {self.amount}"

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Payment Allocation"
        verbose_name_plural = "Payment Allocations"


class InvoiceStatusHistory(MetaInfo):
    monthly_bill = models.ForeignKey(MonthlyBill, on_delete=models.CASCADE, related_name="status_history", null=True, blank=True)
    connection_fee = models.ForeignKey(ConnectionFee, on_delete=models.CASCADE, related_name="status_history", null=True, blank=True)
    payment_transaction = models.ForeignKey(PaymentTransaction, on_delete=models.SET_NULL, related_name="status_history", null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    previous_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)

    def __str__(self):
        bill_type = "MonthlyBill" if self.monthly_bill else "ConnectionFee"
        bill_id = self.monthly_bill.id if self.monthly_bill else self.connection_fee.id
        return f"History #{self.id} - {bill_type} #{bill_id} changed from {self.previous_status} to {self.new_status}"

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Invoice Status History"
        verbose_name_plural = "Invoice Status Histories"
