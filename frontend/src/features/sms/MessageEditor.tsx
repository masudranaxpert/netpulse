import { Select, Textarea } from "flowbite-react";
import { FormField } from "@/shared/components/ui/FormField";
import type { SmsTemplate } from "@/shared/types/api";

const VARS = ["{name}", "{customer_id}", "{package}", "{balance}", "{due}", "{billing_day}"];

function segments(text: string) {
  const unicode = /[^\u0000-\u007F]/.test(text);
  const per = unicode ? 70 : 160;
  return { unicode, count: text.length, parts: text ? Math.ceil(text.length / per) : 0 };
}

type Props = {
  message: string;
  onMessage: (v: string) => void;
  templates: SmsTemplate[];
  showVars?: boolean;
};

export function MessageEditor({ message, onMessage, templates, showVars = true }: Props) {
  const s = segments(message);
  return (
    <>
      {templates.length ? (
        <FormField label="Use a template">
          <Select defaultValue="" onChange={(e) => { const t = templates.find((x) => String(x.id) === e.target.value); if (t) onMessage(t.body); }}>
            <option value="">Start from scratch…</option>
            {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Select>
        </FormField>
      ) : null}
      <FormField label="Message" required full>
        <Textarea rows={5} required value={message} onChange={(e) => onMessage(e.target.value)} placeholder="Type your message…" />
        <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
          <span>{showVars ? <>Variables: {VARS.join("  ")}</> : null}</span>
          <span>{s.count} chars · {s.parts} SMS {s.unicode ? "(unicode)" : ""}</span>
        </div>
      </FormField>
    </>
  );
}
