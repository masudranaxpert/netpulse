import { AddCustomerButton } from "@/features/customers/AddCustomerButton";
import { ClientStatsGrid } from "@/features/dashboard/ClientStatsGrid";
import { DashboardCharts } from "@/features/dashboard/DashboardCharts";
import { MiniMetrics } from "@/features/dashboard/MiniMetrics";
import { RecentCustomers } from "@/features/dashboard/RecentCustomers";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Welcome back 👋"
        description="Here's what's happening across your network today."
        actions={<AddCustomerButton />}
      />
      <ClientStatsGrid />
      <MiniMetrics />
      <DashboardCharts />
      <RecentCustomers />
    </div>
  );
}
