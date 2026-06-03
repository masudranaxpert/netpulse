from django.apps import AppConfig
from django.db.models.signals import post_migrate


def _register_schedule(sender, **kwargs):
    from .tasks import ensure_snapshot_schedule

    ensure_snapshot_schedule()


class BandwidthConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "bandwidth"
    verbose_name = "Bandwidth Usage"

    def ready(self):
        # Auto-register the recurring snapshot schedule after migrations so the
        # Usage Reports populate themselves (requires the django_q cluster running).
        post_migrate.connect(_register_schedule, sender=self)
