import type { Column } from "@/shared/components/data/DataTable";
import type { Zone } from "@/shared/types/api";

export const zoneColumns: Column<Zone>[] = [
  {
    key: "name",
    header: "Zone",
    render: (r) => <span className="font-medium text-slate-900 dark:text-white">{r.name}</span>,
  },
  {
    key: "created",
    header: "Created",
    render: (r) => (r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"),
  },
];
