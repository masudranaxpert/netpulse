import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import { ErrorAlert } from "@/shared/components/feedback/ErrorAlert";
import { Icon } from "@/shared/components/icons/Icon";
import { usePaginatedList } from "@/shared/hooks/usePaginatedList";
import { apiError } from "@/shared/utils/apiError";
import type { Router } from "@/shared/types/api";
import { ActiveSessionsTable } from "./ActiveSessionsTable";
import { LiveStatCards } from "./LiveStatCards";
import { ThroughputChart } from "./ThroughputChart";
import { WeeklyTrafficChart } from "./WeeklyTrafficChart";
import { useConsumptionSummary } from "./useBandwidthReports";
import { useLiveBandwidth } from "./useLiveBandwidth";

export function LiveUsageView() {
  const [routerId, setRouterId] = useState("");
  const [search, setSearch] = useState("");
  const qc = useQueryClient();

  const { data, speed, points, query } = useLiveBandwidth(routerId);
  const routers = usePaginatedList<Router>("routers", API.routers);
  const summary = useConsumptionSummary();

  const routerOptions = (routers.data ?? []).map((r) => ({ value: String(r.id), label: r.name }));

  const [note, setNote] = useState<string | null>(null);

  const sync = useMutation({
    mutationFn: () =>
      api.post<{ recorded: number }>(API.bandwidth.sync, { router: routerId || undefined }).then((r) => r.data),
    onSuccess: (res) => {
      query.refetch();
      qc.invalidateQueries({ queryKey: ["bandwidth-summary"] });
      qc.invalidateQueries({ queryKey: ["bandwidth-logs"] });
      const n = res?.recorded ?? 0;
      setNote(
        n > 0
          ? `Snapshot saved — ${n} active session${n === 1 ? "" : "s"} recorded into reports.`
          : "Synced, but there are no active sessions to record right now.",
      );
      window.setTimeout(() => setNote(null), 5000);
    },
    onError: (e) => {
      setNote(null);
      window.alert(apiError(e));
    },
  });

  return (
    <div className="space-y-6">
      {query.isError ? <ErrorAlert message="Unable to reach the live bandwidth endpoint." /> : null}

      {note ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300">
          <Icon name="check" className="h-4 w-4 shrink-0" />
          <span>{note}</span>
        </div>
      ) : null}

      <LiveStatCards
        onlineClients={data?.online_clients ?? 0}
        downloadBps={speed.down}
        uploadBps={speed.up}
        connected={Boolean(data?.router_connected)}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <ThroughputChart points={points} />
        <WeeklyTrafficChart data={summary.data?.weekly ?? []} />
      </div>

      <ActiveSessionsTable
        sessions={data?.sessions ?? []}
        search={search}
        onSearch={setSearch}
        routerId={routerId}
        onRouterChange={setRouterId}
        routerOptions={routerOptions}
        onSync={() => sync.mutate()}
        syncing={sync.isPending}
      />
    </div>
  );
}
