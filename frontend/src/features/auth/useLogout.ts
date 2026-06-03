import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import { ROUTES } from "@/shared/constants/routes";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await api.post(API.auth.logout);
      } catch {
        /* cookie may already be cleared */
      }
    },
    onSettled: async () => {
      queryClient.clear();
      navigate(ROUTES.login);
    },
  });
}
