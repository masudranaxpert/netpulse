import { Link } from "react-router-dom";
import { API } from "@/shared/api/endpoints";
import { NameCell } from "@/shared/components/ui/NameCell";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { ROUTES } from "@/shared/constants/routes";
import { usePaginatedList } from "@/shared/hooks/usePaginatedList";
import type { Customer } from "@/shared/types/api";

export function RecentCustomers() {
  const { data, isLoading } = usePaginatedList<Customer>("customers", API.customers);
  const rows = (data ?? []).slice(0, 5);

  return (
    <section className="card-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900 dark:text-white">Recent customers</h2>
        <Link to={ROUTES.customers} className="text-sm font-medium text-brand-600 hover:underline">
          View all
        </Link>
      </div>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">No customers yet.</p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 py-3">
              <NameCell name={c.customer_name} subtitle={c.zone_name ?? c.customer_id} />
              <StatusBadge status={c.customer_status} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
