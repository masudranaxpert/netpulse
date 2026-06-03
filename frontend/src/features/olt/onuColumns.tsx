import type { Column } from "@/shared/components/data/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { Onu } from "@/shared/types/api";

function Signal({ dbm }: { dbm?: string | null }) {
  if (dbm === null || dbm === undefined || dbm === "") return <span className="text-slate-400">—</span>;
  const v = Number(dbm);
  const tone = v >= -25 && v <= -8 ? "text-emerald-600" : v > -28 ? "text-amber-600" : "text-rose-600";
  return <span className={`font-semibold tabular-nums ${tone}`}>{v.toFixed(2)} dBm</span>;
}

export const onuColumns: Column<Onu>[] = [
  {
    key: "onu", header: "ONU",
    render: (r) => (
      <div>
        <p className="font-mono text-sm font-medium text-slate-900 dark:text-white">{r.serial_number || r.onu_index || "—"}</p>
        {r.name ? <p className="text-xs text-slate-400">{r.name}</p> : null}
      </div>
    ),
  },
  { key: "olt", header: "OLT", render: (r) => <span className="text-sm">{r.olt_name}</span> },
  { key: "port", header: "PON port", render: (r) => <span className="font-mono text-sm">{r.pon_port || "—"}</span> },
  { key: "rx", header: "Rx power", align: "right", render: (r) => <Signal dbm={r.rx_power} /> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  {
    key: "customer", header: "Customer",
    render: (r) => (r.customer_name ? (
      <div><p className="text-sm">{r.customer_name}</p><p className="text-xs text-slate-400">{r.customer_code}</p></div>
    ) : <span className="text-slate-400">—</span>),
  },
];
