import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import type { SchedulerTask } from "@/shared/types/api";

export function useSchedulerTasks() {
  return useQuery({
    queryKey: ["scheduler"],
    queryFn: async (): Promise<SchedulerTask[]> => {
      const { data } = await api.get<SchedulerTask[]>(API.scheduler);
      return Array.isArray(data) ? data : [];
    },
  });
}
