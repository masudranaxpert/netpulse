import type { Column } from "@/shared/components/data/DataTable";
import type { Transaction } from "@/shared/types/api";

export const paymentColumns: Column<Transaction>[] = [
  { key: "customer", header: "Customer", render: (r) => r.customer_name ?? "—" },
  {
    key: "amount", header: "Amount", align: "right",
    render: (r) => {
      const n = Number(r.amount);
      return (
        <span className={`font-semibold ${n < 0 ? "text-rose-600" : "text-emerald-600"}`}>
          {n < 0 ? "−" : "+"}৳{Math.abs(n).toLocaleString("en-IN")}
        </span>
      );
    },
  },
  {
    key: "method", header: "Via",
    render: (r) => (
      <div>
        <span className="capitalize">{r.payment_method.replace(/_/g, " ")}</span>
        {r.received_by_username ? <p className="text-xs text-slate-400">by {r.received_by_username}</p> : null}
      </div>
    ),
  },
  { key: "ref", header: "Reference", render: (r) => r.transaction_id || "—" },
  { key: "date", header: "Date", render: (r) => (r.created_at ? new Date(r.created_at).toLocaleString() : "—") },
];
