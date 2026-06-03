import { BillingActions } from "@/features/billing/BillingActions";
import { BillingTabs } from "@/features/billing/BillingTabs";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function BillingPage() {
  return (
    <>
      <PageHeader title="Billing" description="Monthly bills, payments, and connection fees." actions={<BillingActions />} />
      <BillingTabs />
    </>
  );
}
