import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";

/**
 * Fetches the set of PPPoE names currently online on MikroTik.
 * Runs as a separate, non-blocking query so the table renders immediately.
 */
export function useOnlineStatus() {
  const query = useQuery({
    queryKey: ["customers-online"],
    queryFn: async () => (await api.get<{ online: string[] }>(API.customerOnlineStatus)).data.online,
    staleTime: 15_000,
    refetchInterval: 30_000,
    retry: false,
  });

  const onlineSet = useMemo(
    () => new Set((query.data ?? []).map((n) => n.toLowerCase())),
    [query.data],
  );

  const isOnline = (pppoeName?: string | null) =>
    !!pppoeName && onlineSet.has(pppoeName.toLowerCase());

  return { isOnline, isLoading: query.isLoading, ready: query.isSuccess };
}
