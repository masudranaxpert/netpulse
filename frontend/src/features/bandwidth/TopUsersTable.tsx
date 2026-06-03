import type { Column } from "@/shared/components/data/DataTable";
import { DataTable } from "@/shared/components/data/DataTable";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { bytes } from "@/shared/utils/format";
import type { TopUser } from "./types";

const columns: Column<TopUser>[] = [
  { key: "pppoe_id", header: "PPPoE User ID", render: (r) => <span className="font-semibold text-slate-800 dark:text-slate-100">{r.pppoe_id}</span> },
  { key: "customer_name", header: "Customer", render: (r) => r.customer_name || "—" },
  { key: "download", header: "Download", align: "right", render: (r) => <span className="text-sky-600 dark:text-sky-400">{bytes(r.download_bytes)}</span> },
  { key: "upload", header: "Upload", align: "right", render: (r) => <span className="text-violet-600 dark:text-violet-400">{bytes(r.upload_bytes)}</span> },
  { key: "total", header: "Total Combined", align: "right", render: (r) => <span className="font-semibold">{bytes(r.total_bytes)}</span> },
  { key: "sessions", header: "Records", align: "right", render: (r) => r.sessions },
];

export function TopUsersTable({ rows }: { rows: TopUser[] }) {
  if (rows.length === 0) {
    return <EmptyState icon="users" title="No top users" description="No usage has been recorded for the selected period yet." />;
  }
  return <DataTable columns={columns} rows={rows} rowKey={(r) => r.pppoe_id} />;
}
