import { Icon } from "@/shared/components/icons/Icon";
import { bytes } from "@/shared/utils/format";
import type { LiveStats } from "@/features/portal/types";

function Metric({ icon, label, value }: { icon: "trendDown" | "trendUp" | "clock"; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 dark:bg-ink-800">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Icon name={icon} className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}

export function LiveStatsCard({ stats, loading }: { stats?: LiveStats; loading?: boolean }) {
  if (loading) return <div className="card-surface h-72 animate-pulse" />;
  const online = stats?.status === "online";

  return (
    <div className="card-surface relative overflow-hidden p-6">
      <div className={`absolute right-6 top-6 h-24 w-24 rounded-full blur-3xl ${online ? "bg-emerald-400/30" : "bg-rose-400/20"}`} />
      <div className="relative flex items-center gap-3">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${online ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40" : "bg-rose-100 text-rose-600 dark:bg-rose-900/40"}`}>
          <Icon name="wifi" />
        </span>
        <div>
          <p className="text-sm text-slate-400">Connection status</p>
          <p className={`text-lg font-bold ${online ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {online ? (
        <div className="relative mt-5 grid grid-cols-3 gap-3">
          <Metric icon="clock" label="Uptime" value={stats?.uptime ?? "—"} />
          <Metric icon="trendDown" label="Download" value={bytes(stats?.bytes_out)} />
          <Metric icon="trendUp" label="Upload" value={bytes(stats?.bytes_in)} />
        </div>
      ) : (
        <p className="relative mt-5 rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-ink-800 dark:text-slate-400">
          {stats?.last_disconnect_reason
            ? `Last disconnect: ${stats.last_disconnect_reason}`
            : stats?.message ?? "Your session is currently not active."}
        </p>
      )}
    </div>
  );
}
