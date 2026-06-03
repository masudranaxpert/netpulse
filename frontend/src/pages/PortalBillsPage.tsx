import { BillsList } from "@/features/portal/BillsList";
import { usePortalBills } from "@/features/portal/portalData";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function PortalBillsPage() {
  const { data, isLoading } = usePortalBills();
  return (
    <div className="space-y-6">
      <PageHeader title="My Bills" description="All your monthly invoices and their payment status." />
      <BillsList bills={data} loading={isLoading} />
    </div>
  );
}
