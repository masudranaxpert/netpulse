type Props = { online: boolean; ready: boolean; hasPppoe: boolean };

export function OnlineBadge({ online, ready, hasPppoe }: Props) {
  if (!hasPppoe) return <span className="text-xs text-slate-400">—</span>;
  if (!ready) return <span className="text-xs text-slate-400">…</span>;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
        online
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
          : "bg-slate-100 text-slate-500 dark:bg-ink-800 dark:text-slate-400"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-emerald-500" : "bg-slate-400"}`} />
      {online ? "Online" : "Offline"}
    </span>
  );
}
