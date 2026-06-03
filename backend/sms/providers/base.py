from dataclasses import dataclass, field
from typing import Callable, Dict, List


@dataclass
class RequestSpec:
    """Describes a single HTTP request to a gateway endpoint."""

    url: str
    method: str = "get"
    params: dict = field(default_factory=dict)
    data: dict = field(default_factory=dict)
    json: dict | None = None
    headers: dict = field(default_factory=dict)


# key -> {"key", "label", "fields": [...], "builder": callable}
REGISTRY: Dict[str, dict] = {}


def f(key: str, label: str, secret: bool = False, required: bool = True) -> dict:
    """Shorthand for a credential field descriptor used by the UI."""
    return {"key": key, "label": label, "secret": secret, "required": required}


def register(key: str, label: str, fields: List[dict]):
    def deco(builder: Callable[[dict, str, str], RequestSpec]):
        REGISTRY[key] = {"key": key, "label": label, "fields": fields, "builder": builder}
        return builder

    return deco


def build_spec(provider: str, creds: dict, mobile: str, message: str) -> RequestSpec:
    entry = REGISTRY.get(provider)
    if not entry:
        raise ValueError(f"Unknown SMS provider '{provider}'. Use the Custom Gateway instead.")
    return entry["builder"](creds, mobile, message)


def provider_metadata() -> List[dict]:
    return [
        {"key": e["key"], "label": e["label"], "fields": e["fields"]}
        for e in sorted(REGISTRY.values(), key=lambda x: x["label"].lower())
    ]
