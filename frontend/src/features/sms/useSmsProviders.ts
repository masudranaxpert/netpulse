import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import type { SmsProvider } from "@/shared/types/api";

export function useSmsProviders() {
  return useQuery({
    queryKey: ["sms-providers"],
    queryFn: async () => (await api.get<SmsProvider[]>(API.sms.providers)).data,
    staleTime: 1000 * 60 * 10,
  });
}
