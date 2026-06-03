import type { Column } from "@/shared/components/data/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { Package } from "@/shared/types/api";

export const packageColumns: Column<Package>[] = [
  {
    key: "name",
    header: "Package",
    render: (r) => (
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{r.name}</p>
        {r.package_type ? <p className="text-xs text-slate-400">{r.package_type}</p> : null}
      </div>
    ),
  },
  {
    key: "speed",
    header: "Speed",
    render: (r) =>
      r.speed ? (
        <span className="inline-flex items-center gap-1 font-medium text-brand-600 dark:text-brand-300">
          {r.speed}
        </span>
      ) : (
        "—"
      ),
  },
  { key: "price", header: "Price", align: "right", render: (r) => <span className="font-semibold">৳{r.price}</span> },
  {
    key: "active",
    header: "Status",
    render: (r) => <StatusBadge status={r.is_active ? "active" : "inactive"} />,
  },
];
