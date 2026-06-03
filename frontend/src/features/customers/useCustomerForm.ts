import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import { ROUTES } from "@/shared/constants/routes";
import { useCrud } from "@/shared/hooks/useCrud";
import { useFormOptions } from "@/shared/hooks/useFormOptions";
import { apiError } from "@/shared/utils/apiError";
import type { CustomerDetail } from "@/shared/types/api";

const EMPTY = {
  customer_id: "", customer_name: "", phone_number: "", phone_number2: "", nid: "",
  address: "", zone: "", package: "", billing_day: "1",
  router: "", profile_name: "", pppoe_name: "", pppoe_pass: "", remote_ip: "", service_type: "PPPoE",
};
type FormState = typeof EMPTY;

export function useCustomerForm() {
  const { customerId } = useParams();
  const isEdit = !!customerId;
  const navigate = useNavigate();
  const qc = useQueryClient();
  const options = useFormOptions();
  const { create, update } = useCrud("customers", API.customers);
  const [f, setF] = useState<FormState>({ ...EMPTY });
  const set = (k: keyof FormState) => (e: { target: { value: string } }) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const { data: detail } = useQuery({
    queryKey: ["customer-detail", customerId],
    queryFn: async () => (await api.get<CustomerDetail>(`${API.customers}${customerId}/`)).data,
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && detail)
      setF({
        ...EMPTY, customer_id: detail.customer_id, customer_name: detail.customer_name,
        phone_number: detail.phone_number, phone_number2: detail.phone_number2 ?? "",
        nid: detail.nid ?? "", address: detail.address,
        zone: detail.zone ? String(detail.zone) : "", package: detail.package ? String(detail.package) : "",
      });
  }, [isEdit, detail]);

  const profilesQuery = useQuery({
    queryKey: ["router-profiles", f.router],
    queryFn: async () => {
      const { data } = await api.get<{ profiles?: string[] }>(API.routerProfiles(f.router));
      return data.profiles ?? [];
    },
    enabled: !isEdit && !!f.router,
    retry: false,
  });

  const mut = isEdit ? update : create;
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const done = () => navigate(ROUTES.customers);
    if (isEdit) {
      update.mutate({ id: customerId!, body: {
        customer_name: f.customer_name, phone_number: f.phone_number,
        phone_number2: f.phone_number2 || null, nid: f.nid || null, address: f.address,
        zone: Number(f.zone), package: f.package ? Number(f.package) : null,
      } }, { onSuccess: () => {
        qc.invalidateQueries({ queryKey: ["customer-detail", customerId] });
        done();
      } });
      return;
    }
    create.mutate({
      customer_id: f.customer_id || undefined,
      customer_name: f.customer_name, phone_number: f.phone_number,
      phone_number2: f.phone_number2 || null, nid: f.nid || null, address: f.address,
      zone_id: Number(f.zone), package_id: f.package ? Number(f.package) : null,
      billing_day: Number(f.billing_day), router_id: f.router ? Number(f.router) : null,
      profile_name: f.profile_name || undefined, pppoe_name: f.pppoe_name, pppoe_pass: f.pppoe_pass,
      remote_ip: f.remote_ip || null, service_type: f.service_type || "PPPoE",
    }, { onSuccess: done });
  };

  return {
    f, set, isEdit, options, submit,
    profiles: profilesQuery.data ?? [],
    profilesLoading: profilesQuery.isFetching && !!f.router,
    profilesError: profilesQuery.isError && !!f.router,
    submitting: mut.isPending,
    error: mut.isError ? apiError(mut.error) : null,
    cancel: () => navigate(ROUTES.customers),
  };
}
