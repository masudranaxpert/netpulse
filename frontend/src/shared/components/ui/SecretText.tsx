import { useState } from "react";
import { Icon } from "@/shared/components/icons/Icon";

type Props = { value?: string | null; className?: string };

export function SecretText({ value, className = "" }: Props) {
  const [shown, setShown] = useState(false);
  if (!value) return <span className="text-slate-400">—</span>;
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="font-mono text-sm tabular-nums">{shown ? value : "•".repeat(Math.min(value.length, 10))}</span>
      <button type="button" onClick={() => setShown((s) => !s)}
        className="text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
        aria-label={shown ? "Hide" : "Show"}>
        <Icon name={shown ? "eyeOff" : "eye"} className="h-4 w-4" />
      </button>
    </span>
  );
}
