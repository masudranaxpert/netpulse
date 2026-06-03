from customers.models import CustomerProfile


def _with_phone(qs):
    return [(c.phone_number, c) for c in qs.select_related("package", "zone") if c.phone_number]


def resolve_recipients(audience: str, payload: dict):
    """Return a list of (mobile, customer-or-None) tuples for the chosen audience."""
    if audience == "single":
        number = payload.get("mobile", "")
        return [(number, None)] if number else []

    if audience == "customer":
        c = CustomerProfile.objects.filter(customer_id=payload.get("customer_id")).select_related("package", "zone").first()
        return [(c.phone_number, c)] if c and c.phone_number else []

    qs = CustomerProfile.objects.all()
    if audience == "active":
        qs = qs.filter(customer_status="active")
    elif audience == "inactive":
        qs = qs.filter(customer_status="disconnected")
    elif audience == "zone":
        qs = qs.filter(zone_id=payload.get("zone"))
    elif audience in ("dues", "unpaid"):
        qs = qs.filter(balance__lt=0)
    elif audience == "paid":
        qs = qs.filter(balance__gte=0)
    else:
        return []
    return _with_phone(qs)
