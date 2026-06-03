import { Button } from "flowbite-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SmsGatewayForm } from "@/features/sms/SmsGatewayForm";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import type { Column } from "@/shared/components/data/DataTable";
import { ResourceList } from "@/shared/components/data/ResourceList";
import { Icon } from "@/shared/components/icons/Icon";
import { IconButton, RowActions } from "@/shared/components/ui/RowActions";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { useCrud } from "@/shared/hooks/useCrud";
import { apiError } from "@/shared/utils/apiError";
import type { SmsGateway } from "@/shared/types/api";

export function SmsGateways() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SmsGateway | null>(null);
  const { create, update, remove } = useCrud("sms-gateways", API.sms.gateways);
  const qc = useQueryClient();
  const close = () => setOpen(false);
  const refresh = () => qc.invalidateQueries({ queryKey: ["sms-gateways"] });

  const setDefault = useMutation({ mutationFn: (id: number) => api.post(API.sms.setDefault(id)), onSuccess: refresh });
  const test = useMutation({
    mutationFn: ({ id, mobile }: { id: number; mobile: string }) => api.post(API.sms.test(id), { mobile }).then((r) => r.data),
    onSuccess: (d) => { qc.invalidateQueries({ queryKey: ["sms-logs"] }); window.alert(d.status === "sent" ? "Test SMS sent." : `Failed: ${d.response}`); },
    onError: (e) => window.alert(apiError(e)),
  });

  const onSubmit = (body: Record<string, unknown>) => {
    if (editing) update.mutate({ id: editing.id, body }, { onSuccess: close });
    else create.mutate(body, { onSuccess: close });
  };

  const columns: Column<SmsGateway>[] = [
    {
      key: "label", header: "Gateway",
      render: (r) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-white">{r.label}</p>
          <p className="text-xs capitalize text-slate-400">{r.provider}</p>
        </div>
      ),
    },
    { key: "default", header: "Default", render: (r) => (r.is_default ? <StatusBadge status="active" /> : <span className="text-slate-300">—</span>) },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.is_active ? "active" : "inactive"} /> },
    {
      key: "actions", header: "", align: "right",
      render: (r) => (
        <RowActions>
          {!r.is_default ? <IconButton icon="bolt" label="Set default" onClick={() => setDefault.mutate(r.id)} /> : null}
          <IconButton icon="send" label="Send test" onClick={() => { const m = window.prompt("Send a test SMS to which number?"); if (m) test.mutate({ id: r.id, mobile: m }); }} />
          <IconButton icon="edit" label="Edit" onClick={() => { setEditing(r); setOpen(true); }} />
          <IconButton icon="trash" label="Delete" tone="danger" onClick={() => window.confirm(`Delete gateway "${r.label}"?`) && remove.mutate(r.id)} />
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <ResourceList<SmsGateway>
        queryKey="sms-gateways" url={API.sms.gateways} columns={columns} rowKey={(r) => r.id}
        searchPlaceholder="Search gateways…" emptyTitle="No gateways configured"
        emptyDescription="Add a Bangladeshi SMS provider (BulkSMS BD, SMS.net.bd, Mim SMS…) or a custom gateway." emptyIcon="settings"
        toolbarAction={<Button color="primary" onClick={() => { setEditing(null); setOpen(true); }}><Icon name="plus" className="mr-2 h-4 w-4" /> Add gateway</Button>}
      />
      <SmsGatewayForm open={open} onClose={close} initial={editing} onSubmit={onSubmit}
        submitting={create.isPending || update.isPending}
        error={create.isError || update.isError ? apiError(create.error ?? update.error) : null} />
    </>
  );
}
