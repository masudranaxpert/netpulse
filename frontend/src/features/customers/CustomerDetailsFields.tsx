import { Select, TextInput } from "flowbite-react";
import { FormField } from "@/shared/components/ui/FormField";
import type { useCustomerForm } from "@/features/customers/useCustomerForm";

type Ctx = ReturnType<typeof useCustomerForm>;

export function CustomerDetailsFields({ f, set, isEdit, options }: Ctx) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField label="Customer ID">
        <TextInput value={f.customer_id} onChange={set("customer_id")} disabled={isEdit}
          placeholder="Auto-generated if left blank" />
      </FormField>
      <FormField label="Full name" required>
        <TextInput required value={f.customer_name} onChange={set("customer_name")} />
      </FormField>
      <FormField label="Phone" required>
        <TextInput required value={f.phone_number} onChange={set("phone_number")} />
      </FormField>
      <FormField label="Alt. phone">
        <TextInput value={f.phone_number2} onChange={set("phone_number2")} />
      </FormField>
      <FormField label="NID">
        <TextInput value={f.nid} onChange={set("nid")} />
      </FormField>
      <FormField label="Billing day">
        <TextInput type="number" min={1} max={28} value={f.billing_day} onChange={set("billing_day")} disabled={isEdit} />
      </FormField>
      <FormField label="Address" required full>
        <TextInput required value={f.address} onChange={set("address")} />
      </FormField>
      <FormField label="Zone" required>
        <Select required value={f.zone} onChange={set("zone")}>
          <option value="">Select zone</option>
          {options.zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
        </Select>
      </FormField>
      <FormField label="Package">
        <Select value={f.package} onChange={set("package")}>
          <option value="">No package</option>
          {options.packages.map((p) => <option key={p.id} value={p.id}>{p.name} — ৳{p.price}</option>)}
        </Select>
      </FormField>
    </div>
  );
}
