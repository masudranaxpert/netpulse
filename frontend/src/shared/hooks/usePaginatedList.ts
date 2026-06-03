import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import type { Paginated } from "@/shared/types/api";

type Params = Record<string, string | number | undefined>;

function clean(params?: Params): Params {
  if (!params) return {};
  return Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""));
}

export function usePaginatedList<T>(key: string, url: string, params?: Params) {
  const active = clean(params);
  return useQuery({
    queryKey: [key, active],
    queryFn: async (): Promise<T[]> => {
      const { data } = await api.get<Paginated<T> | T[]>(url, {
        params: { page_size: 100, ...active },
      });
      return Array.isArray(data) ? data : (data.results ?? []);
    },
  });
}
