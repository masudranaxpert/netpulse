import type { Column } from "@/shared/components/data/DataTable";
import { Icon } from "@/shared/components/icons/Icon";
import { SecretText } from "@/shared/components/ui/SecretText";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { Router } from "@/shared/types/api";

export const routerColumns: Column<Router>[] = [
  {
    key: "name",
    header: "Router",
    render: (r) => (
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800">
          <Icon name="router" className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{r.name}</p>
          <p className="text-xs text-slate-400">{r.host}:{r.port ?? 8728}</p>
        </div>
      </div>
    ),
  },
  { key: "user", header: "Username", render: (r) => <span className="font-mono text-sm">{r.username || "—"}</span> },
  { key: "pass", header: "Password", render: (r) => <SecretText value={r.password} /> },
  { key: "conn", header: "Connection", render: (r) => <StatusBadge status={r.status ?? "unknown"} /> },
  {
    key: "active",
    header: "Enabled",
    render: (r) => <StatusBadge status={r.is_active ? "active" : "inactive"} />,
  },
];
