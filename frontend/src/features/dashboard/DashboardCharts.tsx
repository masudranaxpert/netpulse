import { CollectionDonut } from "@/features/dashboard/CollectionDonut";
import { MonthlyBillingChart } from "@/features/dashboard/MonthlyBillingChart";
import { YearlyRevenueChart } from "@/features/dashboard/YearlyRevenueChart";
import { useDashboardSummary } from "@/features/dashboard/useDashboardSummary";

export function DashboardCharts() {
  const { data, isLoading } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-surface h-[360px] animate-pulse lg:col-span-2" />
        <div className="card-surface h-[360px] animate-pulse" />
      </div>
    );
  }

  const monthly = data?.monthly ?? [];
  const yearly = data?.yearly ?? [];
  const collected = data?.revenue.collected ?? 0;
  const outstanding = data?.revenue.outstanding ?? 0;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <MonthlyBillingChart data={monthly} />
      </div>
      <CollectionDonut collected={collected} due={outstanding} />
      <div className="lg:col-span-3">
        <YearlyRevenueChart data={yearly} />
      </div>
    </div>
  );
}
