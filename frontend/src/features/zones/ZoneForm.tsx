import { TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { FormField } from "@/shared/components/ui/FormField";
import { FormModal } from "@/shared/components/ui/FormModal";
import type { Zone } from "@/shared/types/api";

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: Zone | null;
  onSubmit: (body: Record<string, unknown>) => void;
  submitting?: boolean;
  error?: string | null;
};

export function ZoneForm({ open, onClose, initial, onSubmit, submitting, error }: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setName(initial?.name ?? "");
  }, [open, initial]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <FormModal open={open} onClose={onClose} title={initial ? "Edit zone" : "New zone"}
      onSubmit={submit} submitting={submitting} error={error} submitLabel={initial ? "Save changes" : "Create"}>
      <FormField label="Zone name" required full>
        <TextInput required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Mirpur-10" />
      </FormField>
    </FormModal>
  );
}
