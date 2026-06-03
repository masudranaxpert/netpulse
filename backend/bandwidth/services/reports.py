"""Historical bandwidth analytics derived from persisted BandwidthSample rows."""
from datetime import timedelta

from django.db.models import Count, Sum
from django.utils import timezone

from mikrotik.models import MikrotikRouter, RouterInfo

from ..models import BandwidthSample
from .live import live_usage


def _i(value):
    return int(value or 0)


def record_snapshot(router_id=None):
    """Capture current active sessions as BandwidthSample rows ("Sync Bandwidth")."""
    data = live_usage(router_id)
    info_map = {ri.pppoe_name.lower(): ri for ri in RouterInfo.objects.select_related("customer").all()}
    router_map = {r.id: r for r in MikrotikRouter.objects.all()}

    samples = []
    for s in data["sessions"]:
        info = info_map.get(s["pppoe_id"].lower())
        samples.append(BandwidthSample(
            customer=info.customer if info else None,
            router=router_map.get(s["router_id"]),
            pppoe_id=s["pppoe_id"],
            customer_name=s["customer_name"],
            upload_bytes=s["upload_bytes"],
            download_bytes=s["download_bytes"],
            uptime=s["uptime"],
        ))
    if samples:
        BandwidthSample.objects.bulk_create(samples)

    return {
        "status": "ok",
        "recorded": len(samples),
        "router_connected": data["router_connected"],
    }


def _window(start_date):
    agg = BandwidthSample.objects.filter(created_at__date__gte=start_date).aggregate(
        upload=Sum("upload_bytes"), download=Sum("download_bytes"),
    )
    up, down = _i(agg["upload"]), _i(agg["download"])
    return {"upload_bytes": up, "download_bytes": down, "total_bytes": up + down}


def consumption_summary():
    today = timezone.now().date()
    return {
        "today": _window(today),
        "last_7_days": _window(today - timedelta(days=6)),
        "last_30_days": _window(today - timedelta(days=29)),
    }


def _filtered(filters):
    qs = BandwidthSample.objects.select_related("router", "customer")
    if filters.get("date_from"):
        qs = qs.filter(created_at__date__gte=filters["date_from"])
    if filters.get("date_to"):
        qs = qs.filter(created_at__date__lte=filters["date_to"])
    if filters.get("router"):
        qs = qs.filter(router_id=filters["router"])
    if filters.get("customer"):
        qs = qs.filter(customer__customer_id=filters["customer"])
    return qs


def usage_logs(filters, limit=1000):
    qs = _filtered(filters)
    totals = qs.aggregate(upload=Sum("upload_bytes"), download=Sum("download_bytes"))
    rows = [
        {
            "id": s.id,
            "date": s.created_at.isoformat(),
            "pppoe_id": s.pppoe_id,
            "customer_name": s.customer_name,
            "upload_bytes": s.upload_bytes,
            "download_bytes": s.download_bytes,
            "total_bytes": s.upload_bytes + s.download_bytes,
            "uptime": s.uptime,
            "router": s.router.name if s.router else "—",
        }
        for s in qs.order_by("-created_at")[:limit]
    ]
    up, down = _i(totals["upload"]), _i(totals["download"])
    return {
        "results": rows,
        "totals": {"upload_bytes": up, "download_bytes": down, "total_bytes": up + down},
    }


def top_users(filters, limit=50):
    qs = _filtered(filters)
    rows = (
        qs.values("pppoe_id", "customer_name")
        .annotate(
            upload_bytes=Sum("upload_bytes"),
            download_bytes=Sum("download_bytes"),
            sessions=Count("id"),
        )
        .order_by("-download_bytes")[:limit]
    )
    return [
        {
            "pppoe_id": r["pppoe_id"],
            "customer_name": r["customer_name"],
            "upload_bytes": _i(r["upload_bytes"]),
            "download_bytes": _i(r["download_bytes"]),
            "total_bytes": _i(r["upload_bytes"]) + _i(r["download_bytes"]),
            "sessions": r["sessions"],
        }
        for r in rows
    ]


def router_summaries(filters):
    qs = _filtered(filters)
    rows = (
        qs.values("router__name")
        .annotate(
            upload_bytes=Sum("upload_bytes"),
            download_bytes=Sum("download_bytes"),
            sessions=Count("id"),
            clients=Count("pppoe_id", distinct=True),
        )
        .order_by("-download_bytes")
    )
    return [
        {
            "router": r["router__name"] or "—",
            "upload_bytes": _i(r["upload_bytes"]),
            "download_bytes": _i(r["download_bytes"]),
            "total_bytes": _i(r["upload_bytes"]) + _i(r["download_bytes"]),
            "sessions": r["sessions"],
            "clients": r["clients"],
        }
        for r in rows
    ]


def weekly_consumption():
    """Per-day download/upload totals for the last 7 days (best-effort bar chart)."""
    today = timezone.now().date()
    rows = []
    for offset in range(6, -1, -1):
        day = today - timedelta(days=offset)
        agg = BandwidthSample.objects.filter(created_at__date=day).aggregate(
            upload=Sum("upload_bytes"), download=Sum("download_bytes"),
        )
        rows.append({
            "date": day.isoformat(),
            "label": day.strftime("%a"),
            "download_bytes": _i(agg["download"]),
            "upload_bytes": _i(agg["upload"]),
        })
    return rows
