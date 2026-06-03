import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/client";

type UpdateVars = { id: string | number; body: unknown };

export function useCrud(queryKey: string, baseUrl: string) {
  const qc = useQueryClient();
  const onSuccess = () => qc.invalidateQueries({ queryKey: [queryKey] });

  const create = useMutation({
    mutationFn: (body: unknown) => api.post(baseUrl, body).then((r) => r.data),
    onSuccess,
  });
  const update = useMutation({
    mutationFn: ({ id, body }: UpdateVars) => api.patch(`${baseUrl}${id}/`, body).then((r) => r.data),
    onSuccess,
  });
  const remove = useMutation({
    mutationFn: (id: string | number) => api.delete(`${baseUrl}${id}/`),
    onSuccess,
  });

  return { create, update, remove };
}
