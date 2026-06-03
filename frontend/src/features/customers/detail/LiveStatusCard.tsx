import { Button } from "flowbite-react";
import { useQuery } from "@tanstack/react-query";
import { DetailCard, InfoRow } from "@/features/customers/detail/InfoRow";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import { Icon } from "@/shared/components/icons/Icon";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { bytes } from "@/shared/utils/format";
import type { LiveStats } from "@/shared/types/api";

export function LiveStatusCard({ customerId }: { customerId: string }) {
  const q = useQuery({
    queryKey: ["customer-live", customerId],
    queryFn: async () => (await api.get<LiveStats>(API.customerLiveStats(customerId))).data,
    refetchInterval: 20000,
    retry: false,
  });
  const d = q.data;
  return (
    <DetailCard title="MikroTik live status">
      <div className="mb-3 flex items-center justify-between">
        <StatusBadge status={d?.status === "online" ? "active" : "inactive"} />
        <Button size="xs" color="light" onClick={() => q.refetch()} disabled={q.isFetching}>
          <Icon name="refresh" className={`h-4 w-4 ${q.isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>
      {q.isLoading ? <p className="py-4 text-sm text-slate-400">Checking router…</p> : null}
      {d?.live_stats_available ? (
        <>
          <InfoRow label="Uptime">{d.uptime}</InfoRow>
          <InfoRow label="IP address">{d.address}</InfoRow>
          <InfoRow label="Download">
            <span className="inline-flex items-center gap-1"><Icon name="download" className="h-3.5 w-3.5 text-emerald-500" />{bytes(d.bytes_out)}</span>
          </InfoRow>
          <InfoRow label="Upload">
            <span className="inline-flex items-center gap-1"><Icon name="upload" className="h-3.5 w-3.5 text-sky-500" />{bytes(d.bytes_in)}</span>
          </InfoRow>
          <InfoRow label="Caller ID">{d.caller_id}</InfoRow>
        </>
      ) : d && !q.isLoading ? (
        <div className="py-2 text-sm text-slate-500 dark:text-slate-400">
          <p>{d.message ?? "Session is offline."}</p>
          {d.last_disconnect_reason ? <p className="mt-1 text-xs text-slate-400">Last disconnect: {d.last_disconnect_reason}</p> : null}
        </div>
      ) : null}
    </DetailCard>
  );
}
