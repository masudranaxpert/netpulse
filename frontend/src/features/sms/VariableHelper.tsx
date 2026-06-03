import { useState } from "react";
import { Icon } from "@/shared/components/icons/Icon";

const VARIABLES: [string, string][] = [
  ["{name}", "Customer's full name"],
  ["{customer_id}", "Customer ID"],
  ["{phone}", "Primary phone number"],
  ["{package}", "Subscribed package"],
  ["{zone}", "Customer's zone"],
  ["{balance}", "Account balance"],
  ["{due}", "Outstanding amount"],
  ["{billing_day}", "Monthly billing day"],
];

function VariableRow({ token, desc }: { token: string; desc: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch { /* clipboard unavailable */ }
  };
  return (
    <button type="button" onClick={copy}
      className="group flex w-full items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2 text-left transition hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-800 dark:hover:border-emerald-800/60 dark:hover:bg-emerald-900/10">
      <span>
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-emerald-700 dark:bg-slate-800 dark:text-emerald-300">{token}</code>
        <span className="ml-2 text-xs text-slate-400">{desc}</span>
      </span>
      <Icon name={copied ? "check" : "copy"} className={`h-4 w-4 shrink-0 ${copied ? "text-emerald-500" : "text-slate-400 group-hover:text-slate-600"}`} />
    </button>
  );
}

export function VariableHelper() {
  return (
    <div className="card-surface p-5">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Message variables</h3>
      <p className="mt-0.5 text-xs text-slate-400">Tap any tag to copy it. It is replaced per customer when sending to a group.</p>
      <div className="mt-3 space-y-1.5">
        {VARIABLES.map(([token, desc]) => <VariableRow key={token} token={token} desc={desc} />)}
      </div>
    </div>
  );
}
