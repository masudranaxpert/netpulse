import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { portalApi, setPortalToken, clearPortalToken, getPortalToken } from "@/shared/api/portalClient";
import { ROUTES } from "@/shared/constants/routes";
import type { PortalProfile } from "@/features/portal/types";

type Credentials = { pppoe_name: string; pppoe_pass: string };

export function usePortalLogin() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: Credentials) => {
      const { data } = await portalApi.post<{ token: string }>("/auth/login/", body);
      return data;
    },
    onSuccess: async (data) => {
      setPortalToken(data.token);
      await qc.invalidateQueries({ queryKey: ["portal-profile"] });
      navigate(ROUTES.portal);
    },
  });
}

export function usePortalProfile() {
  return useQuery({
    queryKey: ["portal-profile"],
    queryFn: async (): Promise<PortalProfile> => {
      const { data } = await portalApi.get<PortalProfile>("/auth/profile/");
      return data;
    },
    enabled: !!getPortalToken(),
    retry: false,
  });
}

export function usePortalLogout() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        await portalApi.post("/auth/logout/");
      } catch {
        /* token may already be invalid */
      }
    },
    onSettled: () => {
      clearPortalToken();
      qc.clear();
      navigate(ROUTES.portalLogin);
    },
  });
}
