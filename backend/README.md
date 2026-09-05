# NetPulse · Backend

Django REST API — customers, billing, MikroTik routers, OLT/ONU (SNMP),
bandwidth, SMS, scheduling and the customer portal.

## Setup

```bash
uv sync
uv run python manage.py migrate
uv run python manage.py createsuperuser
uv run python manage.py runserver
```

No Postgres needed for local dev — the app falls back to SQLite when
`DATABASE_URL` is unset.

## Environment

Copy [../.env.example](../.env.example) for the full list. The essentials:

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG` (default `True`)
- `DJANGO_ALLOWED_HOSTS` (comma-separated)
- `DATABASE_URL` — Postgres; unset = SQLite
