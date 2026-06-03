# ISP Backend

Django REST API for billing, customers, MikroTik routers, scheduling, and customer portal.

## Setup

```bash
uv sync
uv run python manage.py migrate
uv run python manage.py runserver
```

## Environment (optional)

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG` (default `True`)
- `DJANGO_ALLOWED_HOSTS` (comma-separated)
