import { TextInput } from "flowbite-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import { FormField } from "@/shared/components/ui/FormField";
import { FormModal } from "@/shared/components/ui/FormModal";
import { apiError } from "@/shared/utils/apiError";

type BillingTarget = { customer_id: string; billing_date?: string | null; extended_billing_days?: number };
type Props = { open: boolean; onClose: () => void; customer: BillingTarget };

export function BillingSettingsModal({ open, onClose, customer }: Props) {
  const qc = useQueryClient();
  const currentDay = customer.billing_date ? new Date(customer.billing_date).getDate() : 1;
  const [day, setDay] = useState(String(currentDay));
  const [extended, setExtended] = useState(String(customer.extended_billing_days ?? 0));

  const mut = useMutation({
    mutationFn: () => api.post(API.customerUpdateBilling(customer.customer_id), {
      billing_day: Number(day), extended_billing_days: Number(extended),
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customer-detail", customer.customer_id] });
      qc.invalidateQueries({ queryKey: ["customers"] });
      onClose();
    },
  });

  return (
    <FormModal open={open} onClose={onClose} title="Billing schedule"
      onSubmit={(e) => { e.preventDefault(); mut.mutate(); }} submitting={mut.isPending}
      submitLabel="Save" error={mut.isError ? apiError(mut.error) : null}>
      <FormField label="Billing day (1–28)">
        <TextInput type="number" min={1} max={28} value={day} onChange={(e) => setDay(e.target.value)} />
      </FormField>
      <FormField label="Extended / grace days">
        <TextInput type="number" min={0} value={extended} onChange={(e) => setExtended(e.target.value)} />
      </FormField>
    </FormModal>
  );
}
