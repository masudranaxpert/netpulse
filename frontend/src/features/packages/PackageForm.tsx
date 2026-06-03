import { Select, Textarea, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { FormField } from "@/shared/components/ui/FormField";
import { FormModal } from "@/shared/components/ui/FormModal";
import type { Package } from "@/shared/types/api";

const EMPTY = { name: "", package_type: "monthly", speed: "", price: "", description: "", is_active: "true" };

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: Package | null;
  onSubmit: (body: Record<string, unknown>) => void;
  submitting?: boolean;
  error?: string | null;
};

export function PackageForm({ open, onClose, initial, onSubmit, submitting, error }: Props) {
  const [f, setF] = useState({ ...EMPTY });
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    if (!open) return;
    setF(
      initial
        ? {
            name: initial.name, package_type: initial.package_type ?? "monthly", speed: initial.speed ?? "",
            price: String(initial.price), description: initial.description ?? "", is_active: String(initial.is_active),
          }
        : { ...EMPTY },
    );
  }, [open, initial]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: f.name, package_type: f.package_type, speed: f.speed,
      price: f.price, description: f.description, is_active: f.is_active === "true",
    });
  };

  return (
    <FormModal open={open} onClose={onClose} title={initial ? "Edit package" : "New package"}
      onSubmit={submit} submitting={submitting} error={error} submitLabel={initial ? "Save changes" : "Create"}>
      <FormField label="Package name" required><TextInput required value={f.name} onChange={set("name")} placeholder="e.g. Home 20 Mbps" /></FormField>
      <FormField label="Billing cycle">
        <Select value={f.package_type} onChange={set("package_type")}>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </Select>
      </FormField>
      <FormField label="Speed" required><TextInput required value={f.speed} onChange={set("speed")} placeholder="e.g. 20 Mbps" /></FormField>
      <FormField label="Price (৳)" required><TextInput type="number" min={0} step="0.01" required value={f.price} onChange={set("price")} /></FormField>
      <FormField label="Status">
        <Select value={f.is_active} onChange={set("is_active")}>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </Select>
      </FormField>
      <FormField label="Description" full><Textarea rows={2} value={f.description} onChange={set("description")} /></FormField>
    </FormModal>
  );
}
