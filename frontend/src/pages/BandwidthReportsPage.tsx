import { UsageReportsView } from "@/features/bandwidth/UsageReportsView";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function BandwidthReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bandwidth Audits & Analytics Reports"
        description="Generate, analyze, and export network consumption records for PPPoE customers."
      />
      <UsageReportsView />
    </div>
  );
}
