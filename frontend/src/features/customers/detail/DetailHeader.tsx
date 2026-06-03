import { Button } from "flowbite-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import { Icon } from "@/shared/components/icons/Icon";
import { ActionMenu } from "@/shared/components/ui/ActionMenu";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { ROUTES } from "@/shared/constants/routes";
import type { CustomerDetail } from "@/shared/types/api";

type Status = "active" | "disconnected" | "free" | "left";

const STATUS_META: Record<
  Status,
  { label: string; icon: "check" | "power" | "users" | "logout"; tone?: "default" | "warning" | "danger" }
> = {
  active: { label: "Activate", icon: "check" },
  disconnected: { label: "Disconnect", icon: "power", tone: "warning" },
  free: { label: "Mark as Free", icon: "users" },
  left: { label: "Mark as Left", icon: "logout", tone: "danger" },
};

export function DetailHeader({ customer }: { customer: CustomerDetail }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const id = customer.customer_id;
  const current = customer.customer_status as Status;

  const statusMut = useMutation({
    mutationFn: (status: Status) => api.post(API.customerStatus(id), { status }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["customer-detail", id] });
      qc.invalidateQueries({ queryKey: ["customers"] });
      const w = (res.data as { warning?: string })?.warning;
      if (w) window.alert(w);
    },
    onError: (e) => window.alert((e as Error)?.message ?? "Status change failed."),
  });

  const removeMut = useMutation({
    mutationFn: () => api.delete(API.customerDetail(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      navigate(ROUTES.customers);
    },
  });

  const statusActions = (["active", "disconnected", "free", "left"] as Status[])
    .filter((s) => s !== current)
    .map((s) => ({
      icon: STATUS_META[s].icon,
      label: STATUS_META[s].label,
      tone: STATUS_META[s].tone,
      onClick: () => {
        if (s === "left" && !window.confirm(`Mark ${customer.customer_name} as Left? This stops billing.`)) return;
        statusMut.mutate(s);
      },
    }));

  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(ROUTES.customers)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-ink-800"
          aria-label="Back to customers"
        >
          <Icon name="arrowLeft" className="h-4 w-4" />
        </button>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {customer.customer_name}
            </h1>
            <StatusBadge status={customer.customer_status} />
          </div>
          <p className="mt-0.5 text-sm text-slate-400">
            ID {id} · {customer.phone_number}
          </p>
          {customer.address ? (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <Icon name="mapPin" className="h-4 w-4 shrink-0 text-slate-400" />
              {customer.address}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button color="primary" size="sm" onClick={() => navigate(`${ROUTES.payments}?customer=${id}`)}>
          <Icon name="cash" className="mr-1.5 h-4 w-4" /> Payment
        </Button>
        <Button color="light" size="sm" onClick={() => navigate(`${ROUTES.customers}/${id}/edit`)}>
          <Icon name="edit" className="mr-1.5 h-4 w-4" /> Edit
        </Button>
        <ActionMenu
          actions={statusActions}
          trigger={
            <span
              className={`inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-ink-800 dark:text-slate-200 dark:hover:bg-ink-700 ${
                statusMut.isPending ? "opacity-60" : ""
              }`}
            >
              <Icon name="power" className="mr-1.5 h-4 w-4" />
              {statusMut.isPending ? "Updating…" : "Change status"}
              <Icon name="chevronDown" className="ml-1 h-3.5 w-3.5" />
            </span>
          }
        />
        <Button
          color="light"
          size="sm"
          onClick={() =>
            window.confirm("Delete this customer? This removes the PPPoE user from the router.") && removeMut.mutate()
          }
        >
          <Icon name="trash" className="h-4 w-4 text-rose-500" />
        </Button>
      </div>
    </div>
  );
}
