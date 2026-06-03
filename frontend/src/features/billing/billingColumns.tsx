import type { Column } from "@/shared/components/data/DataTable";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import type { MonthlyBill, Transaction } from "@/shared/types/api";

export const billColumns: Column<MonthlyBill>[] = [
  {
    key: "customer",
    header: "Customer",
    render: (r) => (
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{r.customer_name ?? "—"}</p>
        <p className="text-xs text-slate-400">{r.billing_period ?? r.package_name ?? ""}</p>
      </div>
    ),
  },
  { key: "total", header: "Total", align: "right", render: (r) => <span className="font-semibold">৳{r.total_amount}</span> },
  { key: "paid", header: "Paid", align: "right", render: (r) => `৳${r.paid_amount}` },
  { key: "due", header: "Due", align: "right", render: (r) => <span className="font-medium text-rose-600">৳{r.remaining_amount}</span> },
  { key: "status", header: "Status", render: (r) => <StatusBadge status={r.payment_status} /> },
];

export const txColumns: Column<Transaction>[] = [
  { key: "customer", header: "Customer", render: (r) => r.customer_name ?? "—" },
  { key: "amount", header: "Amount", align: "right", render: (r) => <span className="font-semibold text-emerald-600">৳{r.amount}</span> },
  {
    key: "method",
    header: "Method",
    render: (r) => <span className="capitalize">{r.payment_method}</span>,
  },
  { key: "ref", header: "Reference", render: (r) => r.transaction_id || "—" },
  {
    key: "date",
    header: "Date",
    render: (r) => (r.created_at ? new Date(r.created_at).toLocaleDateString() : "—"),
  },
];
