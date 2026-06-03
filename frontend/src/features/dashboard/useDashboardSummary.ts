import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Counts = { total: number; active: number };

export type DashboardSummary = {
  customers: {
    total: number; active: number; disconnected: number; free: number;
    left: number; due: number; expired: number; expire_today: number;
  };
  packages: Counts;
  routers: Counts;
  tickets: { total: number; open: number; in_progress: number; resolved: number; closed: number };
  revenue: { billed: number; collected: number; outstanding: number; collection_rate: number; today: number };
  monthly: { month: number; billed: number; collected: number; due: number }[];
  yearly: { year: number; billed: number; collected: number }[];
};

export type DashboardView = Omit<DashboardSummary, "monthly" | "yearly"> & {
  monthly: { month: string; billed: number; collected: number; due: number }[];
  yearly: { year: string; billed: number; collected: number }[];
};

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async (): Promise<DashboardView> => {
      const { data } = await api.get<DashboardSummary>(API.reports.dashboard);
      return {
        ...data,
        monthly: data.monthly.map((m) => ({ ...m, month: MONTHS[m.month - 1] })),
        yearly: data.yearly.map((y) => ({ ...y, year: String(y.year) })),
      };
    },
  });
}
