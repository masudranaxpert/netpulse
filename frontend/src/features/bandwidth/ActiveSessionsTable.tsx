import { Button } from "flowbite-react";
import { useMemo } from "react";
import type { Column } from "@/shared/components/data/DataTable";
import { DataTable } from "@/shared/components/data/DataTable";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { Icon } from "@/shared/components/icons/Icon";
import { SearchField } from "@/shared/components/ui/SearchField";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { bytes } from "@/shared/utils/format";
import { SelectField } from "./SelectField";
import type { LiveSession } from "./types";

type Props = {
  sessions: LiveSession[];
  search: string;
  onSearch: (value: string) => void;
  routerId: string;
  onRouterChange: (value: string) => void;
  routerOptions: { value: string; label: string }[];
  onSync: () => void;
  syncing: boolean;
};

const columns: Column<LiveSession>[] = [
  { key: "pppoe_id", header: "PPPoE ID", render: (r) => <span className="font-semibold text-slate-800 dark:text-slate-100">{r.pppoe_id}</span> },
  { key: "customer_name", header: "Client", render: (r) => r.customer_name },
  { key: "address", header: "IP Address", render: (r) => <span className="font-mono text-xs">{r.address || "—"}</span> },
  { key: "caller_id", header: "MAC / Caller", render: (r) => <span className="font-mono text-xs">{r.caller_id || "—"}</span> },
  { key: "uptime", header: "Uptime", render: (r) => r.uptime || "—" },
  { key: "download", header: "Download", align: "right", render: (r) => <span className="text-sky-600 dark:text-sky-400">{bytes(r.download_bytes)}</span> },
  { key: "upload", header: "Upload", align: "right", render: (r) => <span className="text-violet-600 dark:text-violet-400">{bytes(r.upload_bytes)}</span> },
  { key: "profile", header: "Package", render: (r) => r.profile || "—" },
  { key: "billing", header: "Billing", render: (r) => <StatusBadge status={r.billing_status} /> },
  { key: "router", header: "Router", render: (r) => r.router },
];

export function ActiveSessionsTable(props: Props) {
  const { sessions, search, onSearch, routerId, onRouterChange, routerOptions, onSync, syncing } = props;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return sessions;
    return sessions.filter((s) => `${s.pppoe_id} ${s.customer_name} ${s.address} ${s.caller_id} ${s.router}`.toLowerCase().includes(q));
  }, [sessions, search]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">Active PPPoE Session Monitor</h2>
          <p className="text-xs text-slate-400">{filtered.length} of {sessions.length} live sessions</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchField value={search} onChange={onSearch} placeholder="Search sessions…" />
          <SelectField value={routerId} onChange={onRouterChange} options={routerOptions} placeholder="All Connected Routers" ariaLabel="Filter by router" />
          <Button color="primary" onClick={onSync} disabled={syncing}>
            <Icon name="refresh" className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            Sync Now
          </Button>
        </div>
      </div>
      {filtered.length > 0 ? (
        <DataTable columns={columns} rows={filtered} rowKey={(r) => `${r.router_id}-${r.pppoe_id}`} />
      ) : (
        <EmptyState icon="activity" title="No active sessions" description="No PPPoE clients are currently connected on the selected router(s)." />
      )}
    </section>
  );
}
