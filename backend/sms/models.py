from django.contrib.auth.models import User
from django.db import models

from customers.models import CustomerProfile, MetaInfo


class SmsGateway(MetaInfo):
    """A configured SMS provider with its credentials."""

    provider = models.CharField(max_length=50)  # registry key, e.g. "bulksmsbd"
    label = models.CharField(max_length=100)
    sender_id = models.CharField(max_length=50, blank=True, default="")
    credentials = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)

    class Meta:
        ordering = ["-is_default", "label"]

    def __str__(self):
        return f"{self.label} ({self.provider})"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.is_default:
            SmsGateway.objects.exclude(pk=self.pk).filter(is_default=True).update(is_default=False)


class SmsTemplate(MetaInfo):
    CATEGORY_CHOICES = [
        ("bill", "Bill / Invoice"),
        ("payment", "Payment received"),
        ("reminder", "Due reminder"),
        ("welcome", "Welcome"),
        ("notice", "General notice"),
        ("custom", "Custom"),
    ]
    name = models.CharField(max_length=120)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="custom")
    body = models.TextField()

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class SmsLog(MetaInfo):
    STATUS_CHOICES = [("sent", "Sent"), ("failed", "Failed"), ("queued", "Queued")]

    customer = models.ForeignKey(
        CustomerProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name="sms_logs"
    )
    mobile = models.CharField(max_length=20)
    message = models.TextField()
    provider = models.CharField(max_length=50, blank=True, default="")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="sent")
    response = models.TextField(blank=True, default="")
    sent_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="sent_sms"
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.mobile} - {self.status}"
