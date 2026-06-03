type Tone = "success" | "danger" | "warning" | "info" | "neutral";

const TONE: Record<string, Tone> = {
  active: "success", connected: "success", paid: "success", resolved: "success", sent: "success", online: "success",
  disconnected: "danger", error: "danger", urgent: "danger", overdue: "danger", failed: "danger", los: "danger",
  open: "warning", pending: "warning", partial: "warning", high: "warning", queued: "warning", expired: "warning",
  offline: "neutral", unknown: "neutral", left: "neutral",
  in_progress: "info", on: "info", medium: "info", free: "info",
  closed: "neutral", off: "neutral", not_created: "neutral", inactive: "neutral", low: "neutral",
};

const STYLES: Record<Tone, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/30 dark:text-emerald-300",
  danger: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-900/30 dark:text-rose-300",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-300",
  info: "bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-900/30 dark:text-sky-300",
  neutral: "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-300",
};

const DOT: Record<Tone, string> = {
  success: "bg-emerald-500", danger: "bg-rose-500", warning: "bg-amber-500",
  info: "bg-sky-500", neutral: "bg-slate-400",
};

type Props = { status?: string };

export function StatusBadge({ status }: Props) {
  const key = (status ?? "unknown").toLowerCase();
  const tone = TONE[key] ?? "info";
  const label = (status ?? "—").replace(/_/g, " ");
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${STYLES[tone]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[tone]}`} />
      {label}
    </span>
  );
}
