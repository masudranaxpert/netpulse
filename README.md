# ISP

Full-stack ISP management — customers, billing, MikroTik, OLT/ONU, live
bandwidth, SMS and a Flowbite admin UI.

```
backend/    Django REST API
frontend/   React + Vite + Tailwind v4
```

## Quickstart (Docker)

```bash
cp .env.example .env          # set DJANGO_SECRET_KEY and POSTGRES_PASSWORD
docker compose up -d --build
docker compose exec backend python manage.py createsuperuser
```

Open <http://localhost:8080>.

| Path | What |
|---|---|
| `/`                       | Admin SPA |
| `/api/docs/`              | Swagger UI |
| `/api/django-admin/`      | Django admin |

## Local dev

```bash
# backend
cd backend && uv sync
uv run python manage.py migrate
uv run python manage.py runserver

# frontend (new terminal)
cd frontend && npm install && npm run dev
```

SPA on <http://localhost:5173>, Vite proxies `/api` to Django on `:8000`.

## Stack

Django 6 · DRF · auth_kit JWT · django_q2 · psycopg · gunicorn · WhiteNoise
· Postgres 16 · React 19 · Vite 8 · Tailwind v4 · Flowbite · TanStack Query
· Recharts · Caddy.
