import { Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { MessageEditor } from "@/features/sms/MessageEditor";
import { FormField } from "@/shared/components/ui/FormField";
import { FormModal } from "@/shared/components/ui/FormModal";
import type { SmsTemplate } from "@/shared/types/api";

const CATEGORIES: [string, string][] = [
  ["bill", "Bill / Invoice"], ["payment", "Payment received"], ["reminder", "Due reminder"],
  ["welcome", "Welcome"], ["notice", "General notice"], ["custom", "Custom"],
];

type Props = {
  open: boolean; onClose: () => void; initial?: SmsTemplate | null;
  onSubmit: (body: Record<string, unknown>) => void; submitting?: boolean; error?: string | null;
};

export function SmsTemplateForm({ open, onClose, initial, onSubmit, submitting, error }: Props) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("custom");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setCategory(initial?.category ?? "custom");
    setBody(initial?.body ?? "");
  }, [open, initial]);

  const submit = (e: React.FormEvent) => { e.preventDefault(); onSubmit({ name, category, body }); };

  return (
    <FormModal open={open} onClose={onClose} title={initial ? "Edit template" : "New template"}
      onSubmit={submit} submitting={submitting} error={error} submitLabel={initial ? "Save changes" : "Create"}>
      <FormField label="Template name" required><TextInput required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Monthly bill reminder" /></FormField>
      <FormField label="Category">
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </Select>
      </FormField>
      <div className="sm:col-span-2">
        <MessageEditor message={body} onMessage={setBody} templates={[]} />
      </div>
    </FormModal>
  );
}
