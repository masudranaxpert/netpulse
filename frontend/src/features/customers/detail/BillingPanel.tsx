import { Button } from "flowbite-react";
import { useState } from "react";
import { BillingSettingsModal } from "@/features/customers/detail/BillingSettingsModal";
import { DetailCard, InfoRow } from "@/features/customers/detail/InfoRow";
import { Icon } from "@/shared/components/icons/Icon";
import { money } from "@/shared/utils/format";
import type { CustomerDetail } from "@/shared/types/api";

export function BillingPanel({ customer }: { customer: CustomerDetail }) {
  const [open, setOpen] = useState(false);
  const s = customer.billing_summary;
  const balance = Number(customer.balance);
  const day = customer.billing_date ? new Date(customer.billing_date).getDate() : null;

  return (
    <DetailCard title="Billing">
      <div className="mb-3 rounded-xl bg-slate-50 p-4 dark:bg-ink-800/60">
        <p className="text-xs text-slate-400">Account balance</p>
        <p className={`text-2xl font-bold ${balance < 0 ? "text-rose-600" : "text-emerald-600"}`}>
          {balance < 0 ? "−" : ""}{money(Math.abs(balance))}
        </p>
      </div>
      <InfoRow label="Billing day">{day ? `Day ${day} of each month` : "—"}</InfoRow>
      <InfoRow label="Extended days">{customer.extended_billing_days ?? 0}</InfoRow>
      {s ? (
        <>
          <InfoRow label="Total billed">{money(s.total_billed)}</InfoRow>
          <InfoRow label="Total paid">{money(s.total_paid)}</InfoRow>
          <InfoRow label="Outstanding"><span className="text-rose-600">{money(s.pending_amount)}</span></InfoRow>
        </>
      ) : null}
      <Button color="light" size="sm" className="mt-3 w-full" onClick={() => setOpen(true)}>
        <Icon name="calendar" className="mr-2 h-4 w-4" /> Change billing day / extend
      </Button>
      <BillingSettingsModal open={open} onClose={() => setOpen(false)} customer={customer} />
    </DetailCard>
  );
}
