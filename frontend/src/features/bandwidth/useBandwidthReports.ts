import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import type {
  ConsumptionSummary,
  ReportFilterState,
  RouterSummary,
  TopUser,
  UsageLogsResponse,
} from "./types";

export function useConsumptionSummary() {
  return useQuery({
    queryKey: ["bandwidth-summary"],
    queryFn: async () => (await api.get<ConsumptionSummary>(API.bandwidth.summary)).data,
  });
}

function cleanParams(filters: ReportFilterState) {
  return Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== "" && v != null),
  );
}

export function useUsageLogs(filters: ReportFilterState, enabled: boolean) {
  return useQuery({
    queryKey: ["bandwidth-logs", filters],
    queryFn: async () =>
      (await api.get<UsageLogsResponse>(API.bandwidth.logs, { params: cleanParams(filters) })).data,
    enabled,
  });
}

export function useTopUsers(filters: ReportFilterState, enabled: boolean) {
  return useQuery({
    queryKey: ["bandwidth-top-users", filters],
    queryFn: async () =>
      (await api.get<{ results: TopUser[] }>(API.bandwidth.topUsers, { params: cleanParams(filters) })).data.results,
    enabled,
  });
}

export function useRouterSummaries(filters: ReportFilterState, enabled: boolean) {
  return useQuery({
    queryKey: ["bandwidth-router-summaries", filters],
    queryFn: async () =>
      (await api.get<{ results: RouterSummary[] }>(API.bandwidth.routerSummaries, { params: cleanParams(filters) })).data.results,
    enabled,
  });
}
