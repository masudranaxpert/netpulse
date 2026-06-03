import uuid
from django.db import models
from django.utils import timezone
from customers.models import CustomerProfile

class CustomerToken(models.Model):
    key = models.CharField(max_length=64, unique=True, default=uuid.uuid4)
    customer = models.ForeignKey(CustomerProfile, on_delete=models.CASCADE, related_name="portal_tokens")
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"Token for {self.customer.customer_id} - {self.key[:10]}..."
