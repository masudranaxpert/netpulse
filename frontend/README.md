# NetPulse · Frontend

React 19 + TypeScript SPA — admin dashboard, customer portal and landing site —
built with **Flowbite React**, **Tailwind CSS v4** and **Vite**.

## Stack

- [Flowbite React](https://flowbite-react.com/) — accessible components
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router, TanStack Query, Axios (JWT via httponly cookies from Django)

## Structure

```
src/
├── app/           # Router, providers, auth guard
├── pages/         # Thin route screens
├── features/      # Domain UI + hooks (customers, billing, portal, …)
└── shared/        # Layout, tables, API client, theme
```

Files stay under **100 lines**; reuse `shared/components` across pages.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typechecks (tsc) then bundles
```

Start the Django API on port 8000; Vite proxies `/api` to `http://127.0.0.1:8000`.
