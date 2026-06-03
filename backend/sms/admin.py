from django.contrib import admin

from .models import SmsGateway, SmsLog, SmsTemplate


@admin.register(SmsGateway)
class SmsGatewayAdmin(admin.ModelAdmin):
    list_display = ("label", "provider", "sender_id", "is_default", "is_active")
    list_filter = ("provider", "is_active", "is_default")


@admin.register(SmsTemplate)
class SmsTemplateAdmin(admin.ModelAdmin):
    list_display = ("name", "category")
    list_filter = ("category",)


@admin.register(SmsLog)
class SmsLogAdmin(admin.ModelAdmin):
    list_display = ("mobile", "status", "provider", "created_at")
    list_filter = ("status", "provider")
    search_fields = ("mobile", "message")
