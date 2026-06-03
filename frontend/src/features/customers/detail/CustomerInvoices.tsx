import { useState } from "react";
import { Tabs, TabItem } from "flowbite-react";
import { billColumns } from "@/features/billing/billingColumns";
import { paymentColumns } from "@/features/payments/paymentColumns";
import { API } from "@/shared/api/endpoints";
import { ResourceList } from "@/shared/components/data/ResourceList";
import type { MonthlyBill, Transaction } from "@/shared/types/api";
import { LiveUsagePanel } from "./LiveUsagePanel";

export function CustomerInvoices({ customerId }: { customerId: string }) {
  const [tab, setTab] = useState(0);
  return (
    <Tabs variant="underline" aria-label="Customer invoices" onActiveTabChange={setTab}>
      <TabItem active title="Live usage">
        <LiveUsagePanel customerId={customerId} active={tab === 0} />
      </TabItem>
      <TabItem title="Bills">
        <ResourceList<MonthlyBill>
          queryKey="monthly-bills" url={API.billing.monthlyBills} columns={billColumns} rowKey={(r) => r.id}
          params={{ customer_id: customerId }} pageSize={6} searchPlaceholder="Search bills…"
          emptyTitle="No bills" emptyDescription="No bills generated for this customer yet." emptyIcon="billing" />
      </TabItem>
      <TabItem title="Payments">
        <ResourceList<Transaction>
          queryKey="transactions" url={API.billing.transactions} columns={paymentColumns} rowKey={(r) => r.id}
          params={{ customer_id: customerId }} pageSize={6} searchPlaceholder="Search payments…"
          emptyTitle="No payments" emptyDescription="No payments recorded for this customer yet." emptyIcon="cash" />
      </TabItem>
    </Tabs>
  );
}
