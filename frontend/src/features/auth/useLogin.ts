import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import { ROUTES } from "@/shared/constants/routes";

type Credentials = { email: string; password: string };

export function useLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: Credentials) => {
      await api.post(API.auth.login, body);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["session"] });
      navigate(ROUTES.dashboard);
    },
  });
}
