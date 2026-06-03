import requests

from customers.models import CustomerProfile
from .models import SmsGateway, SmsLog
from .providers import build_spec

TIMEOUT = 20


def normalize_mobile(num: str) -> str:
    return "".join(ch for ch in str(num or "") if ch.isdigit() or ch == "+")


def render_message(text: str, customer: CustomerProfile | None) -> str:
    if not customer:
        return text
    pkg = customer.package.name if customer.package_id else ""
    bal = float(customer.balance or 0)
    values = {
        "name": customer.customer_name,
        "customer_id": customer.customer_id,
        "phone": customer.phone_number,
        "package": pkg,
        "zone": customer.zone.name if customer.zone_id else "",
        "balance": f"{bal:.0f}",
        "due": f"{abs(bal):.0f}" if bal < 0 else "0",
        "billing_day": customer.billing_date.day if customer.billing_date else "",
    }
    for key, val in values.items():
        text = text.replace("{" + key + "}", str(val))
    return text


def get_default_gateway() -> SmsGateway | None:
    return (
        SmsGateway.objects.filter(is_default=True, is_active=True).first()
        or SmsGateway.objects.filter(is_active=True).first()
    )


class SmsService:
    @staticmethod
    def send_one(mobile, message, gateway=None, customer=None, user=None) -> SmsLog:
        gateway = gateway or get_default_gateway()
        mobile = normalize_mobile(mobile)
        status, response = "failed", ""
        if not gateway:
            response = "No active SMS gateway configured."
        else:
            try:
                spec = build_spec(gateway.provider, gateway.credentials or {}, mobile, message)
                r = requests.request(
                    spec.method, spec.url, params=spec.params or None, data=spec.data or None,
                    json=spec.json, headers=spec.headers or None, timeout=TIMEOUT,
                )
                response = (r.text or "")[:2000]
                status = "sent" if r.ok else "failed"
            except Exception as exc:  # noqa: BLE001
                response = str(exc)[:2000]

        return SmsLog.objects.create(
            customer=customer, mobile=mobile, message=message,
            provider=gateway.provider if gateway else "", status=status,
            response=response,
            sent_by=user if getattr(user, "is_authenticated", False) else None,
        )

    @staticmethod
    def send_bulk(recipients, message_template, gateway=None, user=None) -> dict:
        """recipients: iterable of (mobile, customer-or-None)."""
        gateway = gateway or get_default_gateway()
        sent = failed = 0
        for mobile, customer in recipients:
            log = SmsService.send_one(
                mobile, render_message(message_template, customer), gateway, customer, user
            )
            if log.status == "sent":
                sent += 1
            else:
                failed += 1
        return {"sent": sent, "failed": failed, "total": sent + failed}
