from datetime import date, timedelta
from decimal import Decimal

from django.db.models import Sum, Count, Q

from customers.models import CustomerProfile, SupportTicket
from billing.models import Package, MonthlyBill, ConnectionFee, PaymentTransaction
from mikrotik.models import MikrotikRouter


def _f(value):
    return float(value or 0)


class ReportService:
    """Aggregated analytics for the admin dashboard."""

    @staticmethod
    def _revenue_totals():
        bill = MonthlyBill.objects.aggregate(
            billed=Sum("total_amount"), collected=Sum("paid_amount")
        )
        fee = ConnectionFee.objects.aggregate(
            billed=Sum("total_amount"), collected=Sum("paid_amount")
        )
        billed = _f(bill["billed"]) + _f(fee["billed"])
        collected = _f(bill["collected"]) + _f(fee["collected"])
        outstanding = billed - collected
        rate = round((collected / billed) * 100) if billed else 0
        return {"billed": billed, "collected": collected, "outstanding": outstanding, "collection_rate": rate}

    @staticmethod
    def _monthly(year):
        rows = (
            MonthlyBill.objects.filter(billing_year=year)
            .values("billing_month")
            .annotate(billed=Sum("total_amount"), collected=Sum("paid_amount"))
        )
        table = {r["billing_month"]: r for r in rows}
        out = []
        for m in range(1, 13):
            r = table.get(m, {})
            billed, collected = _f(r.get("billed")), _f(r.get("collected"))
            out.append({"month": m, "billed": billed, "collected": collected, "due": billed - collected})
        return out

    @staticmethod
    def _yearly():
        rows = (
            MonthlyBill.objects.values("billing_year")
            .annotate(billed=Sum("total_amount"), collected=Sum("paid_amount"))
            .order_by("billing_year")
        )
        return [
            {"year": r["billing_year"], "billed": _f(r["billed"]), "collected": _f(r["collected"])}
            for r in rows
        ]

    @staticmethod
    def _customer_breakdown():
        today = date.today()
        agg = CustomerProfile.objects.aggregate(
            total=Count("id"),
            active=Count("id", filter=Q(customer_status="active")),
            disconnected=Count("id", filter=Q(customer_status="disconnected")),
            free=Count("id", filter=Q(customer_status="free")),
            left=Count("id", filter=Q(customer_status="left")),
            due=Count("id", filter=Q(balance__lt=0)),
        )
        expired = expire_today = 0
        for c in CustomerProfile.objects.exclude(customer_status="left").only(
            "billing_date", "extended_billing_days"
        ):
            if not c.billing_date:
                continue
            due_date = c.billing_date + timedelta(days=c.extended_billing_days or 0)
            if due_date < today:
                expired += 1
            elif due_date == today:
                expire_today += 1
        agg["expired"] = expired
        agg["expire_today"] = expire_today
        return agg

    @staticmethod
    def _revenue_today():
        agg = PaymentTransaction.objects.filter(created_at__date=date.today()).aggregate(
            total=Sum("amount")
        )
        return _f(agg["total"])

    @staticmethod
    def dashboard_summary():
        cust = ReportService._customer_breakdown()
        tickets = SupportTicket.objects.aggregate(
            total=Count("id"),
            open=Count("id", filter=Q(status="open")),
            in_progress=Count("id", filter=Q(status="in_progress")),
            resolved=Count("id", filter=Q(status="resolved")),
            closed=Count("id", filter=Q(status="closed")),
        )
        return {
            "customers": cust,
            "packages": {
                "total": Package.objects.count(),
                "active": Package.objects.filter(is_active=True).count(),
            },
            "routers": {
                "total": MikrotikRouter.objects.count(),
                "active": MikrotikRouter.objects.filter(is_active=True).count(),
            },
            "tickets": tickets,
            "revenue": {**ReportService._revenue_totals(), "today": ReportService._revenue_today()},
            "monthly": ReportService._monthly(date.today().year),
            "yearly": ReportService._yearly(),
        }
