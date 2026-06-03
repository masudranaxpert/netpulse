import { Checkbox, Label, Select, TextInput } from "flowbite-react";
import { useEffect, useMemo, useState } from "react";
import { GatewayField } from "@/features/sms/GatewayField";
import { useSmsProviders } from "@/features/sms/useSmsProviders";
import { FormField } from "@/shared/components/ui/FormField";
import { FormModal } from "@/shared/components/ui/FormModal";
import type { SmsGateway } from "@/shared/types/api";

const JSON_KEYS = ["headers", "payload"];

type Props = {
  open: boolean; onClose: () => void; initial?: SmsGateway | null;
  onSubmit: (body: Record<string, unknown>) => void; submitting?: boolean; error?: string | null;
};

export function SmsGatewayForm({ open, onClose, initial, onSubmit, submitting, error }: Props) {
  const { data: providers = [] } = useSmsProviders();
  const [provider, setProvider] = useState("");
  const [label, setLabel] = useState("");
  const [isDefault, setIsDefault] = useState(true);
  const [creds, setCreds] = useState<Record<string, string>>({});
  const [jsonError, setJsonError] = useState<string | null>(null);

  const meta = useMemo(() => providers.find((p) => p.key === provider), [providers, provider]);

  useEffect(() => {
    if (!open) return;
    setProvider(initial?.provider ?? providers[0]?.key ?? "");
    setLabel(initial?.label ?? "");
    setIsDefault(initial?.is_default ?? true);
    const c = (initial?.credentials ?? {}) as Record<string, unknown>;
    setCreds(Object.fromEntries(Object.entries(c).map(([k, v]) => [k, JSON_KEYS.includes(k) ? JSON.stringify(v, null, 2) : String(v ?? "")])));
    setJsonError(null);
  }, [open, initial, providers]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setJsonError(null);
    const out: Record<string, unknown> = {};
    for (const f of meta?.fields ?? []) {
      const raw = creds[f.key] ?? "";
      if (JSON_KEYS.includes(f.key)) {
        try { out[f.key] = raw ? JSON.parse(raw) : {}; }
        catch { setJsonError(`Invalid JSON in "${f.label}"`); return; }
      } else if (raw !== "") out[f.key] = raw;
    }
    onSubmit({ provider, label: label || meta?.label || provider, credentials: out, is_default: isDefault, is_active: true });
  };

  return (
    <FormModal open={open} onClose={onClose} title={initial ? "Edit gateway" : "Add SMS gateway"}
      onSubmit={submit} submitting={submitting} error={error ?? jsonError} submitLabel={initial ? "Save changes" : "Add gateway"}>
      <FormField label="Provider" required>
        <Select value={provider} onChange={(e) => { setProvider(e.target.value); setCreds({}); }} disabled={!!initial}>
          {providers.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
        </Select>
      </FormField>
      <FormField label="Display name"><TextInput value={label} onChange={(e) => setLabel(e.target.value)} placeholder={meta?.label} /></FormField>
      {meta?.fields.map((f) => (
        <GatewayField key={f.key} field={f} value={creds[f.key] ?? ""} onChange={(v) => setCreds((p) => ({ ...p, [f.key]: v }))} />
      ))}
      <div className="flex items-center gap-2 sm:col-span-2">
        <Checkbox id="gw-default" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
        <Label htmlFor="gw-default">Use this gateway by default for sending</Label>
      </div>
    </FormModal>
  );
}
