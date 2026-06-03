import { Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import { FormField } from "@/shared/components/ui/FormField";
import { FormModal } from "@/shared/components/ui/FormModal";
import { useFormOptions } from "@/shared/hooks/useFormOptions";
import { apiError } from "@/shared/utils/apiError";
import type { CustomerDetail } from "@/shared/types/api";

type Props = { open: boolean; onClose: () => void; customer: CustomerDetail };

export function ConnectionEditModal({ open, onClose, customer }: Props) {
  const r = customer.router_info;
  const { routers } = useFormOptions();
  const qc = useQueryClient();
  const [f, setF] = useState({
    router: r?.router ? String(r.router) : "", profile_name: r?.profile_name ?? "",
    pppoe_name: r?.pppoe_name ?? "", pppoe_pass: r?.pppoe_pass ?? "", remote_ip: r?.remote_ip ?? "",
  });
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    if (open) setF({
      router: r?.router ? String(r.router) : "", profile_name: r?.profile_name ?? "",
      pppoe_name: r?.pppoe_name ?? "", pppoe_pass: r?.pppoe_pass ?? "", remote_ip: r?.remote_ip ?? "",
    });
  }, [open, r]);

  const profilesQ = useQuery({
    queryKey: ["router-profiles", f.router],
    queryFn: async () => (await api.get<{ profiles?: string[] }>(API.routerProfiles(f.router))).data.profiles ?? [],
    enabled: open && !!f.router, retry: false,
  });
  const profiles = profilesQ.data ?? [];

  const mut = useMutation({
    mutationFn: () => api.post(API.customerConnection(customer.customer_id), {
      router: f.router ? Number(f.router) : null, profile_name: f.profile_name,
      pppoe_name: f.pppoe_name, pppoe_pass: f.pppoe_pass, remote_ip: f.remote_ip || null,
    }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["customer-detail", customer.customer_id] });
      const w = (res.data as { warning?: string })?.warning;
      if (w) window.alert(w);
      onClose();
    },
  });

  return (
    <FormModal open={open} onClose={onClose} title="Edit connection"
      onSubmit={(e) => { e.preventDefault(); mut.mutate(); }} submitting={mut.isPending}
      error={mut.isError ? apiError(mut.error) : null} submitLabel="Save connection">
      <FormField label="Router">
        <Select value={f.router} onChange={set("router")}>
          <option value="">No router</option>
          {routers.map((rt) => <option key={rt.id} value={rt.id}>{rt.name}</option>)}
        </Select>
      </FormField>
      <FormField label="MikroTik profile">
        {profiles.length ? (
          <Select value={f.profile_name} onChange={set("profile_name")}>
            <option value="">Select profile</option>
            {profiles.map((p) => <option key={p} value={p}>{p}</option>)}
          </Select>
        ) : (
          <TextInput value={f.profile_name} onChange={set("profile_name")}
            placeholder={profilesQ.isFetching ? "Loading profiles…" : "e.g. 10Mbps"} />
        )}
        {profilesQ.isError ? <p className="mt-1 text-xs text-amber-600">Router unreachable — type the profile name manually.</p> : null}
      </FormField>
      <FormField label="PPPoE name" required><TextInput required value={f.pppoe_name} onChange={set("pppoe_name")} /></FormField>
      <FormField label="PPPoE password" required><TextInput required value={f.pppoe_pass} onChange={set("pppoe_pass")} /></FormField>
      <FormField label="Remote IP" full><TextInput value={f.remote_ip} onChange={set("remote_ip")} placeholder="Optional static IP" /></FormField>
    </FormModal>
  );
}
