import { useDashboardSummary } from "@/features/dashboard/useDashboardSummary";
import { MiniStat } from "@/shared/components/ui/MiniStat";
import { money } from "@/shared/utils/format";

export function MiniMetrics() {
  const { data } = useDashboardSummary();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MiniStat label="Active packages" value={data?.packages.active ?? 0} icon="package" tone="brand" />
      <MiniStat label="Routers online" value={data?.routers.active ?? 0} icon="router" tone="violet" />
      <MiniStat label="Collection rate" value={`${data?.revenue.collection_rate ?? 0}%`} icon="trendUp" tone="sky" />
      <MiniStat label="Total billed" value={money(data?.revenue.billed ?? 0)} icon="billing" tone="amber" />
    </div>
  );
}
