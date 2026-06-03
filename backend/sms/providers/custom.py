"""Fully configurable custom gateway for providers not built in."""
from .base import RequestSpec, f, register

CUSTOM_FIELDS = [
    f("url", "Endpoint URL"),
    f("method", "HTTP method (get/post)", required=False),
    f("content_type", "Body type (json/form/query)", required=False),
    f("headers", "Headers (JSON object)", required=False),
    f("payload", "Payload (JSON, use {mobile} {message} {sender_id})"),
]


def _sub(value, mobile, message, sender_id):
    if isinstance(value, str):
        return value.replace("{mobile}", str(mobile)).replace("{message}", str(message)).replace("{sender_id}", str(sender_id))
    return value


@register("custom", "Custom Gateway", CUSTOM_FIELDS)
def custom(c, mobile, message):
    sender_id = c.get("sender_id", "")
    method = (c.get("method") or "post").lower()
    content_type = (c.get("content_type") or "json").lower()
    headers = {k: _sub(v, mobile, message, sender_id) for k, v in (c.get("headers") or {}).items()}
    payload = {k: _sub(v, mobile, message, sender_id) for k, v in (c.get("payload") or {}).items()}
    url = _sub(c["url"], mobile, message, sender_id)

    spec = RequestSpec(url=url, method=method, headers=headers)
    if content_type == "json":
        spec.json = payload
    elif content_type == "query":
        spec.params = payload
    else:
        spec.data = payload
    return spec
