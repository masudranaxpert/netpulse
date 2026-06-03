import { useMemo, useState } from "react";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import { usePaginatedList } from "@/shared/hooks/usePaginatedList";

type Params = Record<string, string | number | undefined>;

export function useFilteredList<T extends object>(key: string, url: string, params?: Params) {
  const [search, setSearch] = useState("");
  const debounced = useDebouncedValue(search).toLowerCase().trim();
  const query = usePaginatedList<T>(key, url, params);

  const results = useMemo(() => {
    const rows = query.data ?? [];
    if (!debounced) return rows;
    return rows.filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(debounced),
    );
  }, [query.data, debounced]);

  return {
    search,
    setSearch,
    query,
    results,
    total: query.data?.length ?? 0,
    isEmpty: !query.isLoading && results.length === 0,
  };
}
