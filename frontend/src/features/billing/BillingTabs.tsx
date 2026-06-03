import { Tabs, TabItem } from "flowbite-react";
import { MonthlyBillsList } from "@/features/billing/MonthlyBillsList";
import { PaymentsHistory } from "@/features/payments/PaymentsHistory";

export function BillingTabs() {
  return (
    <Tabs variant="underline" aria-label="Billing tabs">
      <TabItem active title="Monthly Bills">
        <MonthlyBillsList />
      </TabItem>
      <TabItem title="Payments">
        <PaymentsHistory />
      </TabItem>
    </Tabs>
  );
}
