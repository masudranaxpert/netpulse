#!/usr/bin/env bash
set -euo pipefail

if [ -n "${DATABASE_URL:-}" ]; then
  python - <<'PY'
import os, socket, time
from urllib.parse import urlparse
u = urlparse(os.environ["DATABASE_URL"])
host, port = u.hostname or "db", u.port or 5432
print(f"Waiting for database at {host}:{port}...")
for _ in range(60):
    try:
        with socket.create_connection((host, port), timeout=2):
            print("Database reachable.")
            break
    except OSError:
        time.sleep(1)
else:
    raise SystemExit("Database did not become reachable in time.")
PY
fi

case "${1:-web}" in
  web)
    python manage.py migrate --noinput
    exec gunicorn config.wsgi:application \
      --bind 0.0.0.0:8000 \
      --workers "${GUNICORN_WORKERS:-3}" \
      --timeout "${GUNICORN_TIMEOUT:-60}" \
      --access-logfile - --error-logfile -
    ;;
  qcluster)
    exec python manage.py qcluster
    ;;
  migrate)
    exec python manage.py migrate --noinput
    ;;
  shell)
    exec python manage.py shell
    ;;
  *)
    exec "$@"
    ;;
esac
