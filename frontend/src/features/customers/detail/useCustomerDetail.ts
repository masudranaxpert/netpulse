import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import type { CustomerDetail } from "@/shared/types/api";

export function useCustomerDetail(customerId?: string) {
  return useQuery({
    queryKey: ["customer-detail", customerId],
    queryFn: async () => (await api.get<CustomerDetail>(API.customerDetail(customerId!))).data,
    enabled: !!customerId,
  });
}
