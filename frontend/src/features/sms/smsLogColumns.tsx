import type { Column } from "@/shared/components/data/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { SmsLog } from "@/shared/types/api";

export const smsLogColumns: Column<SmsLog>[] = [
  {
    key: "to", header: "Recipient",
    render: (r) => (
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{r.mobile}</p>
        {r.customer_name ? <p className="text-xs text-slate-400">{r.customer_name}</p> : null}
      </div>
    ),
  },
  {
    key: "message", header: "Message",
    render: (r) => <span className="line-clamp-2 max-w-md text-sm text-slate-600 dark:text-slate-300">{r.message}</span>,
  },
  { key: "provider", header: "Gateway", render: (r) => <span className="text-sm capitalize">{r.provider || "—"}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  {
    key: "date", header: "Sent",
    render: (r) => (
      <div className="text-sm">
        {r.created_at ? new Date(r.created_at).toLocaleString() : "—"}
        {r.sent_by_username ? <p className="text-xs text-slate-400">by {r.sent_by_username}</p> : null}
      </div>
    ),
  },
];
