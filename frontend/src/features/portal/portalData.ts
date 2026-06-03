import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { portalApi } from "@/shared/api/portalClient";
import type { LiveStats, PortalBill, PortalTicket, PortalTicketDetail } from "@/features/portal/types";

type Paged<T> = { results?: T[] } | T[];
const unwrap = <T,>(data: Paged<T>): T[] => (Array.isArray(data) ? data : (data.results ?? []));

export function useLiveStats() {
  return useQuery({
    queryKey: ["portal-stats"],
    queryFn: async (): Promise<LiveStats> => {
      const { data } = await portalApi.get<LiveStats>("/dashboard/stats/");
      return data;
    },
    refetchInterval: 30_000,
  });
}

export function usePortalBills() {
  return useQuery({
    queryKey: ["portal-bills"],
    queryFn: async (): Promise<PortalBill[]> => {
      const { data } = await portalApi.get<Paged<PortalBill>>("/billing/monthly_bills/", {
        params: { page_size: 100 },
      });
      return unwrap(data);
    },
  });
}

export function usePortalTickets() {
  return useQuery({
    queryKey: ["portal-tickets"],
    queryFn: async (): Promise<PortalTicket[]> => {
      const { data } = await portalApi.get<Paged<PortalTicket>>("/tickets/", { params: { page_size: 100 } });
      return unwrap(data);
    },
  });
}

export function useTicketDetail(id: number | null) {
  return useQuery({
    queryKey: ["portal-ticket", id],
    queryFn: async (): Promise<PortalTicketDetail> => {
      const { data } = await portalApi.get<PortalTicketDetail>(`/tickets/${id}/`);
      return data;
    },
    enabled: id != null,
  });
}

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: { title: string; description: string; priority: string }) => {
      const { data } = await portalApi.post<PortalTicket>("/tickets/", body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portal-tickets"] }),
  });
}

export function useReplyTicket(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reply_text: string) => {
      await portalApi.post(`/tickets/${id}/reply/`, { reply_text });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["portal-ticket", id] }),
  });
}
