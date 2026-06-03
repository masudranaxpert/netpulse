import { Button, Select } from "flowbite-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { customerColumns } from "@/features/customers/customerColumns";
import { OnlineBadge } from "@/features/customers/OnlineBadge";
import { useOnlineStatus } from "@/features/customers/useOnlineStatus";
import { BillingSettingsModal } from "@/features/customers/detail/BillingSettingsModal";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import { ROUTES } from "@/shared/constants/routes";
import type { Column } from "@/shared/components/data/DataTable";
import { ResourceList } from "@/shared/components/data/ResourceList";
import { Icon } from "@/shared/components/icons/Icon";
import { ActionMenu } from "@/shared/components/ui/ActionMenu";
import { useCrud } from "@/shared/hooks/useCrud";
import { usePaginatedList } from "@/shared/hooks/usePaginatedList";
import type { Customer, Zone } from "@/shared/types/api";

type ClientFilter = "all" | "active" | "due" | "free" | "inactive" | "expired" | "left" | "online";

const FILTER_PARAMS: Record<ClientFilter, Record<string, string | number> | undefined> = {
  all: undefined,
  active: { status: "active" },
  due: { due: 1 },
  free: { free: 1 },
  inactive: { status: "disconnected" },
  expired: { expired: 1 },
  left: { status: "left" },
  online: undefined,
};

export function CustomersManager() {
  const navigate = useNavigate();
  const { remove } = useCrud("customers", API.customers);
  const qc = useQueryClient();
  const [billingFor, setBillingFor] = useState<Customer | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilter = searchParams.get("filter") as ClientFilter | null;
  const filter: ClientFilter = urlFilter && urlFilter in FILTER_PARAMS ? urlFilter : "all";
  const zoneParam = searchParams.get("zone") ?? "";
  const zones = usePaginatedList<Zone>("zones", API.zones);
  const online = useOnlineStatus();

  const updateZone = (zone: string) => {
    const params = new URLSearchParams(searchParams);
    if (zone) params.set("zone", zone); else params.delete("zone");
    setSearchParams(params, { replace: true });
  };

  const statusMut = useMutation({
    mutationFn: (v: { id: string; status: string }) => api.post(`${API.customers}${v.id}/update_status/`, { status: v.status }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      const w = (res.data as { warning?: string })?.warning;
      if (w) window.alert(w);
    },
  });

  const onDelete = (c: Customer) => {
    if (window.confirm(`Delete ${c.customer_name}? This also removes the PPPoE user from the router.`))
      remove.mutate(c.customer_id);
  };

  const columns: Column<Customer>[] = [
    ...customerColumns,
    {
      key: "online", header: "Online",
      render: (c) => (
        <OnlineBadge online={online.isOnline(c.pppoe_name)} ready={online.ready} hasPppoe={!!c.pppoe_name} />
      ),
    },
    {
      key: "actions", header: "", align: "right",
      render: (c) => (
        <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
          <ActionMenu actions={[
            { icon: "eye", label: "View profile", onClick: () => navigate(`${ROUTES.customers}/${c.customer_id}`) },
            { icon: "edit", label: "Edit client", onClick: () => navigate(`${ROUTES.customers}/${c.customer_id}/edit`) },
            { icon: "cash", label: "Take payment", onClick: () => navigate(`${ROUTES.payments}?customer=${c.customer_id}`) },
            { icon: "calendar", label: "Billing / grace days", onClick: () => setBillingFor(c) },
            { icon: "power", label: c.customer_status === "active" ? "Disconnect" : "Activate", tone: "warning",
              onClick: () => statusMut.mutate({ id: c.customer_id, status: c.customer_status === "active" ? "disconnected" : "active" }) },
            { icon: "trash", label: "Delete client", tone: "danger", onClick: () => onDelete(c) },
          ]} />
        </div>
      ),
    },
  ];

  const listParams = { ...(FILTER_PARAMS[filter] ?? {}), ...(zoneParam ? { zone: zoneParam } : {}) };
  const filterRows = filter === "online"
    ? (c: Customer) => !online.ready || online.isOnline(c.pppoe_name)
    : undefined;

  return (
    <>
      <ResourceList<Customer>
        queryKey="customers" url={API.customers} columns={columns} rowKey={(r) => r.id}
        params={listParams}
        filterRows={filterRows}
        onRowClick={(c) => navigate(`${ROUTES.customers}/${c.customer_id}`)}
        searchPlaceholder="Search name, ID, phone, address…" emptyTitle="No customers found"
        emptyDescription="No clients match this filter yet." emptyIcon="users"
        filters={
          <Select
            sizing="sm"
            value={zoneParam}
            onChange={(e) => updateZone(e.target.value)}
            className="min-w-[9rem]"
            aria-label="Filter by zone"
          >
            <option value="">All zones</option>
            {zones.data?.map((z) => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </Select>
        }
        toolbarAction={
          <Button color="primary" onClick={() => navigate(ROUTES.customerNew)}>
            <Icon name="plus" className="mr-2 h-4 w-4" /> Add customer
          </Button>
        }
      />
      {billingFor ? (
        <BillingSettingsModal open onClose={() => setBillingFor(null)} customer={billingFor} />
      ) : null}
    </>
  );
}
