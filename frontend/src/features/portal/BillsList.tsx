import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { money } from "@/shared/utils/format";
import type { PortalBill } from "@/features/portal/types";

export function BillsList({ bills, loading }: { bills?: PortalBill[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-surface h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!bills?.length) {
    return (
      <div className="card-surface flex flex-col items-center gap-2 py-12 text-center">
        <p className="font-medium text-slate-700 dark:text-slate-200">No bills yet</p>
        <p className="text-sm text-slate-400">Your monthly invoices will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bills.map((b) => (
        <div key={b.id} className="card-surface flex items-center justify-between p-4">
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">{b.billing_period ?? b.package_name}</p>
            <p className="text-xs text-slate-400">Invoice {b.invoice_date}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-slate-900 dark:text-white">{money(b.total_amount)}</p>
              {Number(b.remaining_amount) > 0 ? (
                <p className="text-xs text-amber-600">Due {money(b.remaining_amount)}</p>
              ) : (
                <p className="text-xs text-emerald-600">Paid</p>
              )}
            </div>
            <StatusBadge status={b.payment_status} />
          </div>
        </div>
      ))}
    </div>
  );
}
