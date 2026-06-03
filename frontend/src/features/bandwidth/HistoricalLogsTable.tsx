import { Button } from "flowbite-react";
import type { Column } from "@/shared/components/data/DataTable";
import { DataTable } from "@/shared/components/data/DataTable";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Icon } from "@/shared/components/icons/Icon";
import { bytes } from "@/shared/utils/format";
import type { UsageLog, UsageLogsResponse } from "./types";

const columns: Column<UsageLog>[] = [
  { key: "date", header: "Date", render: (r) => new Date(r.date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) },
  { key: "pppoe_id", header: "PPPoE User ID", render: (r) => <span className="font-semibold text-slate-800 dark:text-slate-100">{r.pppoe_id}</span> },
  { key: "customer_name", header: "Customer", render: (r) => r.customer_name || "—" },
  { key: "upload", header: "Upload", align: "right", render: (r) => <span className="text-violet-600 dark:text-violet-400">{bytes(r.upload_bytes)}</span> },
  { key: "download", header: "Download", align: "right", render: (r) => <span className="text-sky-600 dark:text-sky-400">{bytes(r.download_bytes)}</span> },
  { key: "total", header: "Total Combined", align: "right", render: (r) => <span className="font-semibold">{bytes(r.total_bytes)}</span> },
  { key: "uptime", header: "Session Uptime", render: (r) => r.uptime || "—" },
  { key: "router", header: "Router Source", render: (r) => r.router },
];

function TotalChip({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold ${tone}`}>
      <span className="text-[11px] font-medium uppercase tracking-wide opacity-70">{label}</span>
      {value}
    </span>
  );
}

export function HistoricalLogsTable({ data, onExport }: { data?: UsageLogsResponse; onExport: () => void }) {
  const rows = data?.results ?? [];
  const totals = data?.totals ?? { upload_bytes: 0, download_bytes: 0, total_bytes: 0 };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <TotalChip label="Upload" value={bytes(totals.upload_bytes)} tone="bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" />
          <TotalChip label="Download" value={bytes(totals.download_bytes)} tone="bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300" />
          <TotalChip label="Combined" value={bytes(totals.total_bytes)} tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" />
        </div>
        <Button color="light" onClick={onExport} disabled={rows.length === 0}>
          <Icon name="download" className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      {rows.length > 0 ? (
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />
      ) : (
        <EmptyState icon="fileText" title="No usage logs" description="No records match the current filters. Run “Sync Bandwidth” to capture snapshots." />
      )}
    </div>
  );
}
