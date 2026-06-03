import { Button } from "flowbite-react";
import { Icon } from "@/shared/components/icons/Icon";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { bitrate, bytes } from "@/shared/utils/format";
import { InfoRow } from "./InfoRow";
import { LiveUsageChart } from "./LiveUsageChart";
import { useLiveUsage } from "./useLiveUsage";

function SpeedStat({ kind, value }: { kind: "down" | "up"; value: number }) {
  const down = kind === "down";
  return (
    <div className={`rounded-xl border p-4 ${down ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-900/40 dark:bg-emerald-900/10" : "border-sky-200 bg-sky-50/60 dark:border-sky-900/40 dark:bg-sky-900/10"}`}>
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        <Icon name={down ? "download" : "upload"} className={`h-4 w-4 ${down ? "text-emerald-500" : "text-sky-500"}`} />
        {down ? "Download" : "Upload"}
      </div>
      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{bitrate(value)}</p>
    </div>
  );
}

export function LiveUsagePanel({ customerId, active = true }: { customerId: string; active?: boolean }) {
  const { data: d, speed, points, isFetching, refetch } = useLiveUsage(customerId, active);
  const online = d?.live_stats_available;

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusBadge status={d?.status === "online" ? "active" : "inactive"} />
          {d?.profile ? <span className="text-xs text-slate-400">profile: <span className="font-semibold text-slate-600 dark:text-slate-300">{d.profile}</span></span> : null}
        </div>
        <Button size="xs" color="light" onClick={() => refetch()} disabled={isFetching}>
          <Icon name="refresh" className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          <span className="ml-1">Refresh</span>
        </Button>
      </div>

      {online ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <SpeedStat kind="down" value={speed.down} />
            <SpeedStat kind="up" value={speed.up} />
          </div>
          {points.length > 1 ? <LiveUsageChart points={points} /> : (
            <p className="py-6 text-center text-sm text-slate-400">Measuring live throughput…</p>
          )}
          <div className="rounded-xl border border-slate-100 px-4 dark:border-slate-800">
            <InfoRow label="Uptime">{d?.uptime}</InfoRow>
            <InfoRow label="IP address">{d?.address}</InfoRow>
            <InfoRow label="Caller ID (MAC)">{d?.caller_id}</InfoRow>
            <InfoRow label="Session download">{bytes(d?.bytes_out)}</InfoRow>
            <InfoRow label="Session upload">{bytes(d?.bytes_in)}</InfoRow>
            <InfoRow label="Encoding">{d?.encoding || "—"}</InfoRow>
            <InfoRow label="Service">{d?.service || "pppoe"}</InfoRow>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-slate-100 px-4 dark:border-slate-800">
          <InfoRow label="Profile">{d?.profile || "unknown"}</InfoRow>
          <InfoRow label="Last logged in">{d?.last_logged_in || "unknown"}</InfoRow>
          <InfoRow label="Last logged out">{d?.last_logged_out || "unknown"}</InfoRow>
          <InfoRow label="Last caller">{d?.last_caller || "unknown"}</InfoRow>
          <InfoRow label="Disconnect reason">{d?.last_disconnect_reason || "unknown"}</InfoRow>
          {d?.message ? <InfoRow label="Note">{d.message}</InfoRow> : null}
        </div>
      )}
    </div>
  );
}
