import type { Column } from "@/shared/components/data/DataTable";
import { NameCell } from "@/shared/components/ui/NameCell";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { Customer } from "@/shared/types/api";

export const customerColumns: Column<Customer>[] = [
  {
    key: "name",
    header: "Customer",
    render: (r) => (
      <NameCell name={r.customer_name} subtitle={r.address ? `${r.customer_id} · ${r.address}` : r.customer_id} />
    ),
  },
  { key: "phone", header: "Phone", render: (r) => r.phone_number || "—" },
  {
    key: "address",
    header: "Address",
    render: (r) => (
      <span className="block max-w-[14rem] truncate text-slate-500 dark:text-slate-400" title={r.address || undefined}>
        {r.address || "—"}
      </span>
    ),
  },
  {
    key: "package",
    header: "Package",
    render: (r) =>
      r.package_name ? (
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {r.package_name}
        </span>
      ) : (
        "—"
      ),
  },
  {
    key: "billing_day",
    header: "Billing day",
    align: "right",
    render: (r) => (r.billing_date ? new Date(r.billing_date).getDate() : "—"),
  },
  {
    key: "extended",
    header: "Grace days",
    align: "right",
    render: (r) =>
      r.extended_billing_days ? (
        <span className="font-medium text-amber-600">+{r.extended_billing_days}</span>
      ) : (
        <span className="text-slate-400">0</span>
      ),
  },
  {
    key: "balance",
    header: "Balance",
    align: "right",
    render: (r) => (
      <span className={Number(r.balance) < 0 ? "font-semibold text-rose-600" : "font-medium"}>
        ৳{r.balance}
      </span>
    ),
  },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.customer_status} /> },
];
