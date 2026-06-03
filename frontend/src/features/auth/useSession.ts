import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";

type User = { email?: string; pk?: number };

export function useSession() {
  const query = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await api.get<User>(API.auth.user);
      return data;
    },
    retry: false,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data && !query.isError,
    refetch: query.refetch,
  };
}
