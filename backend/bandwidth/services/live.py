"""Live PPPoE usage parsing directly from active RouterOS API connections.

Everything here is best-effort: if a router is unreachable we simply skip it and
flag the connection status, never raising so the endpoint can never 500.
"""
import time

from mikrotik.models import MikrotikRouter, RouterInfo
from mikrotik.service.connection import MikrotikConnection


def _to_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return 0


def customer_map():
    """Map lowercased PPPoE username -> customer metadata (name, package, billing)."""
    out = {}
    qs = RouterInfo.objects.select_related("customer", "customer__package").all()
    for info in qs:
        customer = info.customer
        if not customer:
            continue
        out[info.pppoe_name.lower()] = {
            "customer_id": customer.customer_id,
            "customer_name": customer.customer_name,
            "package": customer.package.name if customer.package_id else None,
            "billing_status": customer.customer_status,
            "balance": float(customer.balance or 0),
        }
    return out


def _collect_router(router, cust_map):
    """Return (sessions, connected) for a single router. Never raises."""
    try:
        conn = MikrotikConnection(
            host=router.host, port=router.port,
            username=router.username, password=router.password,
        )
        if not conn.api:
            return [], False

        active = conn.api.get_resource("/ppp/active").get()
        try:
            secrets = conn.api.get_resource("/ppp/secret").get()
            profiles = {s.get("name", "").lower(): s.get("profile", "") for s in secrets}
        except Exception:
            profiles = {}

        sessions = []
        for a in active:
            name = a.get("name", "")
            meta = cust_map.get(name.lower(), {})
            sessions.append({
                "pppoe_id": name,
                "customer_id": meta.get("customer_id"),
                "customer_name": meta.get("customer_name") or name,
                "address": a.get("address", ""),
                "caller_id": a.get("caller-id", ""),
                "uptime": a.get("uptime", ""),
                # On MikroTik bytes-out is traffic sent TO the customer (download).
                "download_bytes": _to_int(a.get("bytes-out")),
                "upload_bytes": _to_int(a.get("bytes-in")),
                "profile": meta.get("package") or profiles.get(name.lower(), ""),
                "billing_status": meta.get("billing_status", "unknown"),
                "balance": meta.get("balance", 0),
                "router": router.name,
                "router_id": router.id,
            })
        return sessions, True
    except Exception:
        return [], False


def live_usage(router_id=None):
    """Aggregate live active-session stats across active routers.

    Speeds (Mbps) are intentionally NOT computed here — the client derives them
    from byte-counter deltas between ~10s polls. We return cumulative byte totals
    plus a server timestamp to support that derivation.
    """
    routers = MikrotikRouter.objects.filter(is_active=True)
    if router_id:
        routers = routers.filter(id=router_id)

    cust_map = customer_map()
    sessions = []
    connected = False
    for router in routers:
        router_sessions, ok = _collect_router(router, cust_map)
        connected = connected or ok
        sessions.extend(router_sessions)

    return {
        "router_connected": connected,
        "router_count": routers.count(),
        "online_clients": len(sessions),
        "total_download_bytes": sum(s["download_bytes"] for s in sessions),
        "total_upload_bytes": sum(s["upload_bytes"] for s in sessions),
        "timestamp": int(time.time() * 1000),
        "sessions": sessions,
    }
