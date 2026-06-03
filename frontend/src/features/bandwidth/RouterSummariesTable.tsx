import type { Column } from "@/shared/components/data/DataTable";
import { DataTable } from "@/shared/components/data/DataTable";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { bytes } from "@/shared/utils/format";
import type { RouterSummary } from "./types";

const columns: Column<RouterSummary>[] = [
  { key: "router", header: "Router", render: (r) => <span className="font-semibold text-slate-800 dark:text-slate-100">{r.router}</span> },
  { key: "clients", header: "Clients", align: "right", render: (r) => r.clients },
  { key: "download", header: "Download", align: "right", render: (r) => <span className="text-sky-600 dark:text-sky-400">{bytes(r.download_bytes)}</span> },
  { key: "upload", header: "Upload", align: "right", render: (r) => <span className="text-violet-600 dark:text-violet-400">{bytes(r.upload_bytes)}</span> },
  { key: "total", header: "Total Combined", align: "right", render: (r) => <span className="font-semibold">{bytes(r.total_bytes)}</span> },
  { key: "sessions", header: "Records", align: "right", render: (r) => r.sessions },
];

export function RouterSummariesTable({ rows }: { rows: RouterSummary[] }) {
  if (rows.length === 0) {
    return <EmptyState icon="router" title="No router data" description="No usage has been recorded for any router in the selected period." />;
  }
  return <DataTable columns={columns} rows={rows} rowKey={(r) => r.router} />;
}
