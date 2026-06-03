import { Button } from "flowbite-react";
import { useState } from "react";
import { zoneColumns } from "@/features/zones/zoneColumns";
import { ZoneForm } from "@/features/zones/ZoneForm";
import { API } from "@/shared/api/endpoints";
import type { Column } from "@/shared/components/data/DataTable";
import { ResourceList } from "@/shared/components/data/ResourceList";
import { Icon } from "@/shared/components/icons/Icon";
import { IconButton, RowActions } from "@/shared/components/ui/RowActions";
import { useCrud } from "@/shared/hooks/useCrud";
import { apiError } from "@/shared/utils/apiError";
import type { Zone } from "@/shared/types/api";

export function ZonesManager() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Zone | null>(null);
  const { create, update, remove } = useCrud("zones", API.zones);

  const close = () => setOpen(false);

  const onSubmit = (body: Record<string, unknown>) => {
    if (editing) update.mutate({ id: editing.id, body }, { onSuccess: close });
    else create.mutate(body, { onSuccess: close });
  };

  const columns: Column<Zone>[] = [
    ...zoneColumns,
    {
      key: "actions", header: "", align: "right",
      render: (z) => (
        <RowActions>
          <IconButton icon="edit" label="Edit" onClick={() => { setEditing(z); setOpen(true); }} />
          <IconButton icon="trash" label="Delete" tone="danger"
            onClick={() => window.confirm(`Delete zone "${z.name}"?`) && remove.mutate(z.id)} />
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <ResourceList<Zone>
        queryKey="zones" url={API.zones} columns={columns} rowKey={(r) => r.id}
        searchPlaceholder="Search zones…" emptyTitle="No zones yet"
        emptyDescription="Add geographic zones for customer addressing." emptyIcon="map"
        toolbarAction={<Button color="primary" onClick={() => { setEditing(null); setOpen(true); }}><Icon name="plus" className="mr-2 h-4 w-4" /> Add zone</Button>}
      />
      <ZoneForm open={open} onClose={close} initial={editing} onSubmit={onSubmit}
        submitting={create.isPending || update.isPending}
        error={create.isError || update.isError ? apiError(create.error ?? update.error) : null} />
    </>
  );
}
