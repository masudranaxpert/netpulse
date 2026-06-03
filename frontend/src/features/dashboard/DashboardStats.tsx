import { useDashboardSummary } from "@/features/dashboard/useDashboardSummary";
import { StatCard } from "@/shared/components/ui/StatCard";
import { money } from "@/shared/utils/format";

export function DashboardStats() {
  const { data, isLoading } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-surface h-[116px] animate-pulse p-5" />
        ))}
      </div>
    );
  }

  const customers = data?.customers.total ?? 0;
  const collected = data?.revenue.collected ?? 0;
  const outstanding = data?.revenue.outstanding ?? 0;
  const openTickets = data?.tickets.open ?? 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total customers" value={customers} icon="users" accent="brand" hint="All subscriber accounts" trend="up" />
      <StatCard label="Revenue collected" value={money(collected)} icon="billing" accent="sky" hint="All-time payments" trend="up" />
      <StatCard label="Outstanding" value={money(outstanding)} icon="trendDown" accent="amber" hint="Pending dues" trend="down" />
      <StatCard label="Open tickets" value={openTickets} icon="ticket" accent="violet" hint="Support queue" />
    </div>
  );
}
