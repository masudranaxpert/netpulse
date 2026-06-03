import { Select, TextInput } from "flowbite-react";
import { CustomerSearchSelect } from "@/features/payments/CustomerSearchSelect";
import { API } from "@/shared/api/endpoints";
import { FormField } from "@/shared/components/ui/FormField";
import { usePaginatedList } from "@/shared/hooks/usePaginatedList";
import type { Zone } from "@/shared/types/api";

export type ComposeState = {
  audience: string;
  mobile: string;
  customer_id: string;
  zone: string;
};

type Props = { state: ComposeState; update: (patch: Partial<ComposeState>) => void };

export const AUDIENCES: [string, string][] = [
  ["single", "A single number"],
  ["customer", "A specific customer"],
  ["active", "All active customers"],
  ["inactive", "All inactive customers"],
  ["paid", "All paid customers"],
  ["unpaid", "All unpaid customers"],
  ["dues", "Customers with dues"],
  ["zone", "Customers in a zone"],
];

export function AudienceFields({ state, update }: Props) {
  const { data: zones = [] } = usePaginatedList<Zone>("zones", API.zones);
  return (
    <>
      <FormField label="Send to" required>
        <Select value={state.audience} onChange={(e) => update({ audience: e.target.value })}>
          {AUDIENCES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </Select>
      </FormField>
      {state.audience === "single" ? (
        <FormField label="Mobile number" required>
          <TextInput value={state.mobile} onChange={(e) => update({ mobile: e.target.value })} placeholder="01XXXXXXXXX" />
        </FormField>
      ) : null}
      {state.audience === "customer" ? (
        <FormField label="Customer" required>
          <CustomerSearchSelect value={state.customer_id} onChange={(id) => update({ customer_id: id })} />
        </FormField>
      ) : null}
      {state.audience === "zone" ? (
        <FormField label="Zone" required>
          <Select value={state.zone} onChange={(e) => update({ zone: e.target.value })}>
            <option value="">Select a zone…</option>
            {zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
          </Select>
        </FormField>
      ) : null}
    </>
  );
}
