import type { Column } from "@/shared/components/data/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { Ticket } from "@/shared/types/api";

export const ticketColumns: Column<Ticket>[] = [
  {
    key: "title",
    header: "Subject",
    render: (r) => (
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{r.title}</p>
        <p className="text-xs text-slate-400">{r.customer_name ?? r.customer_id ?? "—"}</p>
      </div>
    ),
  },
  { key: "priority", header: "Priority", render: (r) => <StatusBadge status={r.priority} /> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  {
    key: "created",
    header: "Opened",
    render: (r) => (r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"),
  },
];
