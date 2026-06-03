"""Background task that records a bandwidth snapshot.

Each run captures the current active PPPoE sessions (cumulative bytes) into
``BandwidthSample`` rows. The Usage Reports are pure aggregations over these rows,
so the more often this runs, the richer the historical reports become. It is the
automatic equivalent of pressing "Sync Now" on the Live Usage page.
"""

SNAPSHOT_FUNC = "bandwidth.tasks.record_snapshot_job"
SNAPSHOT_SCHEDULE_NAME = "Bandwidth Snapshot"
SNAPSHOT_MINUTES = 15


def record_snapshot_job():
    from .services import record_snapshot

    return record_snapshot(None)


def ensure_snapshot_schedule():
    """Idempotently register a recurring snapshot schedule (no-op if it exists)."""
    try:
        from django_q.models import Schedule
    except Exception:  # noqa: BLE001 — django_q not ready
        return
    Schedule.objects.get_or_create(
        func=SNAPSHOT_FUNC,
        defaults={
            "name": SNAPSHOT_SCHEDULE_NAME,
            "schedule_type": Schedule.MINUTES,
            "minutes": SNAPSHOT_MINUTES,
            "repeats": -1,
        },
    )
