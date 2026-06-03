import { Textarea, TextInput } from "flowbite-react";
import { useState } from "react";
import { Icon } from "@/shared/components/icons/Icon";
import { FormField } from "@/shared/components/ui/FormField";
import type { SmsProviderField } from "@/shared/types/api";

const JSON_KEYS = ["headers", "payload"];

type Props = { field: SmsProviderField; value: string; onChange: (v: string) => void };

export function GatewayField({ field, value, onChange }: Props) {
  const [show, setShow] = useState(false);
  const isJson = JSON_KEYS.includes(field.key);
  return (
    <FormField label={field.label} required={field.required} full={isJson}>
      {isJson ? (
        <Textarea rows={3} className="font-mono text-xs" value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={field.key === "headers" ? '{"Authorization": "Bearer xxx"}' : '{"to": "{mobile}", "text": "{message}"}'} />
      ) : (
        <TextInput type={field.secret && !show ? "password" : "text"} required={field.required}
          value={value} onChange={(e) => onChange(e.target.value)}
          rightIcon={field.secret ? () => (
            <button type="button" onClick={() => setShow((s) => !s)} className="pointer-events-auto text-slate-400 hover:text-slate-600">
              <Icon name={show ? "eyeOff" : "eye"} className="h-4 w-4" />
            </button>
          ) : undefined} />
      )}
    </FormField>
  );
}
