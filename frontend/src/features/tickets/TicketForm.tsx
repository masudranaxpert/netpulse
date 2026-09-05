import { Select, Textarea, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { FormField } from "@/shared/components/ui/FormField";
import { FormModal } from "@/shared/components/ui/FormModal";
import { API } from "@/shared/api/endpoints";
import { usePaginatedList } from "@/shared/hooks/usePaginatedList";

const EMPTY = { customer: "", title: "", priority: "medium", description: "" };

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (body: Record<string, unknown>) => void;
  submitting?: boolean;
  error?: string | null;
};

type CustomerOption = {
  id: number;
  customer_id: string;
  customer_name: string;
};

export function TicketForm({ open, onClose, onSubmit, submitting, error }: Props) {
  const [f, setF] = useState({ ...EMPTY });
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));
  const customers = usePaginatedList<CustomerOption>("customer-options", API.customers);

  useEffect(() => {
    if (open) setF({ ...EMPTY });
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      customer: Number(f.customer),
      title: f.title,
      priority: f.priority,
      description: f.description,
    });
  };

  return (
    <FormModal open={open} onClose={onClose} title="New ticket"
      onSubmit={submit} submitting={submitting} error={error} submitLabel="Create">
      <FormField label="Customer" required>
        <Select required value={f.customer} onChange={set("customer")}>
          <option value="">Select customer</option>
          {customers.data?.map((c) => (
            <option key={c.id} value={c.id}>{c.customer_name} · {c.customer_id}</option>
          ))}
        </Select>
      </FormField>
      <FormField label="Priority">
        <Select value={f.priority} onChange={set("priority")}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </Select>
      </FormField>
      <FormField label="Subject" required full>
        <TextInput required value={f.title} onChange={set("title")} placeholder="e.g. Frequent disconnection at night" />
      </FormField>
      <FormField label="Description" required full>
        <Textarea required rows={3} value={f.description} onChange={set("description")} placeholder="Describe the issue reported by the customer…" />
      </FormField>
    </FormModal>
  );
}
