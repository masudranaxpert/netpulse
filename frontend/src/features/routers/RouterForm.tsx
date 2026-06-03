import { Select, Textarea, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { Icon } from "@/shared/components/icons/Icon";
import { FormField } from "@/shared/components/ui/FormField";
import { FormModal } from "@/shared/components/ui/FormModal";
import type { Router } from "@/shared/types/api";

const EMPTY = { name: "", host: "", port: "8728", username: "", password: "", use_ssl: "false", description: "", is_active: "true" };

type Props = {
  open: boolean;
  onClose: () => void;
  initial?: Router | null;
  onSubmit: (body: Record<string, unknown>) => void;
  submitting?: boolean;
  error?: string | null;
};

export function RouterForm({ open, onClose, initial, onSubmit, submitting, error }: Props) {
  const [f, setF] = useState({ ...EMPTY });
  const [showPass, setShowPass] = useState(false);
  const set = (k: keyof typeof EMPTY) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    if (!open) return;
    setShowPass(false);
    setF(
      initial
        ? {
            ...EMPTY, name: initial.name, host: initial.host, port: String(initial.port ?? 8728),
            username: initial.username ?? "", password: initial.password ?? "", use_ssl: String(initial.use_ssl ?? false),
            description: initial.description ?? "", is_active: String(initial.is_active),
          }
        : { ...EMPTY },
    );
  }, [open, initial]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body: Record<string, unknown> = {
      name: f.name, host: f.host, port: Number(f.port), username: f.username,
      use_ssl: f.use_ssl === "true", description: f.description, is_active: f.is_active === "true",
    };
    if (!initial || f.password) body.password = f.password;
    onSubmit(body);
  };

  return (
    <FormModal open={open} onClose={onClose} title={initial ? "Edit router" : "New router"}
      onSubmit={submit} submitting={submitting} error={error} submitLabel={initial ? "Save changes" : "Create"}>
      <FormField label="Router name" required><TextInput required value={f.name} onChange={set("name")} placeholder="e.g. Core-Router-1" /></FormField>
      <FormField label="Host / IP" required><TextInput required value={f.host} onChange={set("host")} placeholder="192.168.88.1" /></FormField>
      <FormField label="API port"><TextInput type="number" value={f.port} onChange={set("port")} /></FormField>
      <FormField label="Use SSL">
        <Select value={f.use_ssl} onChange={set("use_ssl")}>
          <option value="false">No</option>
          <option value="true">Yes</option>
        </Select>
      </FormField>
      <FormField label="API username" required><TextInput required value={f.username} onChange={set("username")} /></FormField>
      <FormField label="API password" required={!initial}>
        <TextInput type={showPass ? "text" : "password"} required={!initial} value={f.password} onChange={set("password")}
          placeholder={initial ? "Leave blank to keep current" : ""}
          rightIcon={() => (
            <button type="button" onClick={() => setShowPass((s) => !s)} className="pointer-events-auto text-slate-400 hover:text-slate-600">
              <Icon name={showPass ? "eyeOff" : "eye"} className="h-4 w-4" />
            </button>
          )} />
      </FormField>
      <FormField label="Status">
        <Select value={f.is_active} onChange={set("is_active")}>
          <option value="true">Enabled</option>
          <option value="false">Disabled</option>
        </Select>
      </FormField>
      <FormField label="Description" full><Textarea rows={2} value={f.description} onChange={set("description")} /></FormField>
    </FormModal>
  );
}
