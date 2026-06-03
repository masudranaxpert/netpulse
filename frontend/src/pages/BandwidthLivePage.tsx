import { LiveUsageView } from "@/features/bandwidth/LiveUsageView";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function BandwidthLivePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Live PPPoE Usage Dashboard"
        description="Real-time bandwidth parsing directly from active RouterOS API connections."
      />
      <LiveUsageView />
    </div>
  );
}
