import { Button } from "flowbite-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { routerColumns } from "@/features/routers/routerColumns";
import { RouterForm } from "@/features/routers/RouterForm";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import type { Column } from "@/shared/components/data/DataTable";
import { ResourceList } from "@/shared/components/data/ResourceList";
import { Icon } from "@/shared/components/icons/Icon";
import { IconButton, RowActions } from "@/shared/components/ui/RowActions";
import { useCrud } from "@/shared/hooks/useCrud";
import { apiError } from "@/shared/utils/apiError";
import type { Router } from "@/shared/types/api";

export function RoutersManager() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Router | null>(null);
  const { create, update, remove } = useCrud("routers", API.routers);
  const qc = useQueryClient();

  const test = useMutation({
    mutationFn: (id: number) => api.post(`${API.routers}${id}/test_connection/`),
    onSettled: () => qc.invalidateQueries({ queryKey: ["routers"] }),
  });

  const close = () => setOpen(false);

  const onSubmit = (body: Record<string, unknown>) => {
    if (editing) update.mutate({ id: editing.id, body }, { onSuccess: close });
    else create.mutate(body, { onSuccess: close });
  };

  const columns: Column<Router>[] = [
    ...routerColumns,
    {
      key: "actions", header: "", align: "right",
      render: (r) => (
        <RowActions>
          <IconButton icon="refresh" label="Test connection" onClick={() => test.mutate(r.id)} />
          <IconButton icon="edit" label="Edit" onClick={() => { setEditing(r); setOpen(true); }} />
          <IconButton icon="trash" label="Delete" tone="danger"
            onClick={() => window.confirm(`Delete router "${r.name}"?`) && remove.mutate(r.id)} />
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <ResourceList<Router>
        queryKey="routers" url={API.routers} columns={columns} rowKey={(r) => r.id}
        searchPlaceholder="Search routers…" emptyTitle="No routers yet"
        emptyDescription="Add a MikroTik router to manage PPPoE users." emptyIcon="router"
        toolbarAction={<Button color="primary" onClick={() => { setEditing(null); setOpen(true); }}><Icon name="plus" className="mr-2 h-4 w-4" /> Add router</Button>}
      />
      <RouterForm open={open} onClose={close} initial={editing} onSubmit={onSubmit}
        submitting={create.isPending || update.isPending}
        error={create.isError || update.isError ? apiError(create.error ?? update.error) : null} />
    </>
  );
}
