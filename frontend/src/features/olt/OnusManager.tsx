import { Button, Select } from "flowbite-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onuColumns } from "@/features/olt/onuColumns";
import { OnuForm } from "@/features/olt/OnuForm";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import type { Column } from "@/shared/components/data/DataTable";
import { ResourceList } from "@/shared/components/data/ResourceList";
import { Icon } from "@/shared/components/icons/Icon";
import { IconButton, RowActions } from "@/shared/components/ui/RowActions";
import { usePaginatedList } from "@/shared/hooks/usePaginatedList";
import { useCrud } from "@/shared/hooks/useCrud";
import { apiError } from "@/shared/utils/apiError";
import type { Onu, OltDevice } from "@/shared/types/api";

type Props = { oltId?: string; onOltId?: (v: string) => void };

export function OnusManager({ oltId, onOltId }: Props = {}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Onu | null>(null);
  const [localOlt, setLocalOlt] = useState("");
  const olt = oltId ?? localOlt;
  const setOlt = onOltId ?? setLocalOlt;
  const { data: olts = [] } = usePaginatedList<OltDevice>("olt-devices", API.olt.devices);
  const { create, update, remove } = useCrud("onus", API.olt.onus);
  const qc = useQueryClient();
  const close = () => setOpen(false);

  const sync = useMutation({
    mutationFn: (id: number) => api.post(API.olt.syncOnus(id)).then((r) => r.data),
    onSuccess: (d) => window.alert(d.ok ? `Synced: ${d.found} ONUs (${d.created} new, ${d.updated} updated).` : d.message),
    onError: (e) => window.alert(apiError(e)),
    onSettled: () => { qc.invalidateQueries({ queryKey: ["onus"] }); qc.invalidateQueries({ queryKey: ["olt-devices"] }); },
  });

  const onSubmit = (body: Record<string, unknown>) => {
    if (editing) update.mutate({ id: editing.id, body }, { onSuccess: close });
    else create.mutate(body, { onSuccess: close });
  };

  const columns: Column<Onu>[] = [
    ...onuColumns,
    {
      key: "actions", header: "", align: "right",
      render: (r) => (
        <RowActions>
          <IconButton icon="edit" label="Edit" onClick={() => { setEditing(r); setOpen(true); }} />
          <IconButton icon="trash" label="Delete" tone="danger"
            onClick={() => window.confirm("Delete this ONU?") && remove.mutate(r.id)} />
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <ResourceList<Onu>
        queryKey="onus" url={API.olt.onus} columns={columns} rowKey={(r) => r.id}
        searchPlaceholder="Search by serial, port…" emptyTitle="No ONUs yet"
        emptyDescription="Sync from an OLT or add ONUs manually and link them to customers." emptyIcon="signal"
        params={{ olt }}
        filters={
          <Select sizing="sm" value={olt} onChange={(e) => setOlt(e.target.value)} className="w-44">
            <option value="">All OLTs</option>
            {olts.map((o) => <option key={o.id} value={o.id}>{o.name || o.host}</option>)}
          </Select>
        }
        toolbarAction={
          <div className="flex items-center gap-2">
            {olt ? (
              <Button color="light" disabled={sync.isPending} onClick={() => sync.mutate(Number(olt))}>
                <Icon name="refresh" className="mr-2 h-4 w-4" /> {sync.isPending ? "Syncing…" : "Sync ONUs"}
              </Button>
            ) : null}
            <Button color="primary" onClick={() => { setEditing(null); setOpen(true); }}>
              <Icon name="plus" className="mr-2 h-4 w-4" /> Add ONU
            </Button>
          </div>
        }
      />
      <OnuForm open={open} onClose={close} initial={editing} onSubmit={onSubmit}
        submitting={create.isPending || update.isPending}
        error={create.isError || update.isError ? apiError(create.error ?? update.error) : null} />
    </>
  );
}
