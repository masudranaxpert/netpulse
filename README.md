<div align="center">
<img src="docs/logo-512.png" width="120" alt="NetPulse logo">

# NetPulse

**Full-stack ISP management & billing platform** — customers, billing, MikroTik
PPPoE, OLT/ONU, live bandwidth, SMS and a customer self-service portal.

![CI](https://github.com/masudranaxpert/netpulse/actions/workflows/ci.yml/badge.svg)
![Django](https://img.shields.io/badge/Django-6-44B78B?logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/DRF-3.17-A30000)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-0c8a73)

[Overview](#overview) · [Screenshots](#screenshots) · [Quickstart](#quickstart) · [Architecture](#architecture) · [API](#api)

</div>

---

## Overview

NetPulse runs a small-to-medium ISP from one dashboard:

| Domain | What it does |
|---|---|
| **Customers** | Profiles, zones, packages, PPPoE provisioning, online monitoring |
| **Billing** | Monthly bill generation by billing-day, connection fees, payment allocation engine (payments auto-settle open invoices), invoice status history |
| **MikroTik** | Live RouterOS API integration — test connections, fetch PPP profiles, PPPoE secret management, live session stats |
| **OLT / ONU** | SNMP discovery (BDCOM, VSOL, C-Data, Photon, Huawei, ZTE, generic profiles) — ONU status, Rx power, PON port |
| **Bandwidth** | Live PPPoE throughput from the router, per-customer usage snapshots, reports |
| **SMS** | Multi-gateway support, templates, per-customer logs |
| **Support** | Support tickets with admin ⇄ customer threaded replies |
| **Portal** | Customer self-service: bills, payment history and ticket threads with PPPoE login |
| **Scheduler** | django-q2 powered background jobs |

## Screenshots

### Landing & Admin
| Landing | Admin login |
|---|---|
| ![Landing](docs/screenshots/01-landing.png) | ![Admin login](docs/screenshots/02-admin-login.png) |

| Dashboard | Customers |
|---|---|
| ![Dashboard](docs/screenshots/03-admin-dashboard.png) | ![Customers](docs/screenshots/07-customers.png) |

| New customer (PPPoE + router profiles) | Customer detail |
|---|---|
| ![Customer form](docs/screenshots/06-customer-form.png) | ![Customer detail](docs/screenshots/08-customer-detail.png) |

### Billing
| Monthly bills | Payments (auto-allocation) |
|---|---|
| ![Billing](docs/screenshots/10-billing.png) | ![Payments](docs/screenshots/11-payments.png) |

### Network
| MikroTik router (live) | Live usage (real sessions) |
|---|---|
| ![Routers](docs/screenshots/09-routers.png) | ![Live usage](docs/screenshots/16-live-usage.png) |

| OLT devices | ONU list (SNMP sync) |
|---|---|
| ![OLT](docs/screenshots/19-olt.png) | ![ONUs](docs/screenshots/20-onus.png) |

### Operations
| Packages | Support ticket thread |
|---|---|
| ![Packages](docs/screenshots/05-packages.png) | ![Tickets](docs/screenshots/13-ticket-thread.png) |

| SMS | Scheduler |
|---|---|
| ![SMS](docs/screenshots/14-sms.png) | ![Scheduler](docs/screenshots/15-scheduler.png) |

| Usage reports | Settings |
|---|---|
| ![Reports](docs/screenshots/17-usage-reports.png) | ![Settings](docs/screenshots/18-settings.png) |

### Customer portal
| Portal login | Portal dashboard |
|---|---|
| ![Portal login](docs/screenshots/21-portal-login.png) | ![Portal dashboard](docs/screenshots/22-portal-dashboard.png) |

| Portal bills | Portal tickets |
|---|---|
| ![Portal bills](docs/screenshots/23-portal-bills.png) | ![Portal tickets](docs/screenshots/24-portal-tickets.png) |

| API docs (Swagger) | Zones |
|---|---|
| ![Swagger](docs/screenshots/25-api-docs.png) | ![Zones](docs/screenshots/04-zones.png) |

## Quickstart

### Docker (production-style)

```bash
cp .env.example .env          # set DJANGO_SECRET_KEY and POSTGRES_PASSWORD
docker compose up -d --build
docker compose exec backend python manage.py createsuperuser
```

The `frontend` (Caddy) container listens on port `80` internally — attach your
own reverse proxy / tunnel to publish it. For local access add a
`docker-compose.override.yml`:

```yaml
services:
  frontend:
    ports:
      - "8080:80"
```

| Path | What |
|---|---|
| `/`                  | Admin SPA |
| `/api/docs/`         | Swagger UI |
| `/api/django-admin/` | Django admin |

### Local development (SQLite)

The backend falls back to SQLite when `DATABASE_URL` is unset — no Postgres
needed for development:

```bash
# backend — http://127.0.0.1:8000
cd backend
uv sync
uv run python manage.py migrate
uv run python manage.py createsuperuser
uv run python manage.py runserver

# frontend — http://localhost:5173 (proxies /api → :8000)
cd frontend
npm install
npm run dev
```

## Architecture

```
├── backend/                  Django 6 + DRF
│   ├── config/               settings, urls, env-driven configuration
│   ├── customers/            customers, zones, support tickets
│   ├── billing/              packages, bills, payments, allocations
│   ├── mikrotik/             RouterOS API integration (librouteros)
│   ├── olt/                  SNMP discovery — vendor profiles + ONUs
│   ├── bandwidth/            live stats, usage snapshots
│   ├── sms/                  gateways, templates, logs
│   ├── scheduler/            django-q2 scheduled jobs
│   ├── reports/              dashboard aggregates
│   └── customer_portal/      token auth, portal API
└── frontend/                 React 19 + Vite + Tailwind v4
    └── src/
        ├── app/              router, guards, providers
        ├── features/         feature modules (api hooks + UI)
        ├── pages/            routed pages
        └── shared/           api client, ui components, hooks, types
```

**Conventions**

- Backend: domain-per-app, service layer for business logic (`customers/service.py`, `billing/services.py`), drf-spectacular schema on every view.
- Frontend: feature-sliced structure; typed API layer (`shared/api/endpoints.ts`); TanStack Query for server state; shared `ResourceList`/`FormModal` primitives keep pages consistent.
- Config via environment variables only (see [.env.example](.env.example)); SQLite fallback for local dev, Postgres 16 in Docker.

## API

Interactive docs at **`/api/docs/`** (Swagger) and **`/api/redoc/`** (Redoc).
Every endpoint is schema-annotated with drf-spectacular.

Auth: `auth_kit` JWT (admin) · single-use portal tokens for customers (PPPoE login).

## Stack

Django 6 · DRF · auth_kit JWT · django-q2 · psycopg · gunicorn · WhiteNoise ·
Postgres 16 · React 19 · Vite · Tailwind v4 · Flowbite · TanStack Query ·
Recharts · Caddy.

## License

[MIT](LICENSE)
