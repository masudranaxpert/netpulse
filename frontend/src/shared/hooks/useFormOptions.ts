import { API } from "@/shared/api/endpoints";
import { usePaginatedList } from "@/shared/hooks/usePaginatedList";
import type { Package, Router, Zone } from "@/shared/types/api";

export function useFormOptions() {
  const zones = usePaginatedList<Zone>("zones", API.zones);
  const packages = usePaginatedList<Package>("packages", API.packages);
  const routers = usePaginatedList<Router>("routers", API.routers);
  return {
    zones: zones.data ?? [],
    packages: packages.data ?? [],
    routers: routers.data ?? [],
  };
}
