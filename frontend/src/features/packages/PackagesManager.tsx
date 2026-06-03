import { Button } from "flowbite-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { packageColumns } from "@/features/packages/packageColumns";
import { PackageForm } from "@/features/packages/PackageForm";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import type { Column } from "@/shared/components/data/DataTable";
import { ResourceList } from "@/shared/components/data/ResourceList";
import { Icon } from "@/shared/components/icons/Icon";
import { IconButton, RowActions } from "@/shared/components/ui/RowActions";
import { useCrud } from "@/shared/hooks/useCrud";
import { apiError } from "@/shared/utils/apiError";
import type { Package } from "@/shared/types/api";

export function PackagesManager() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Package | null>(null);
  const { create, update, remove } = useCrud("packages", API.packages);
  const qc = useQueryClient();

  const toggle = useMutation({
    mutationFn: (id: number) => api.patch(`${API.packages}${id}/toggle_status/`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["packages"] }),
  });

  const close = () => setOpen(false);
  const startCreate = () => { setEditing(null); setOpen(true); };
  const startEdit = (p: Package) => { setEditing(p); setOpen(true); };

  const onSubmit = (body: Record<string, unknown>) => {
    if (editing) update.mutate({ id: editing.id, body }, { onSuccess: close });
    else create.mutate(body, { onSuccess: close });
  };

  const columns: Column<Package>[] = [
    ...packageColumns,
    {
      key: "actions", header: "", align: "right",
      render: (p) => (
        <RowActions>
          <IconButton icon="power" label={p.is_active ? "Deactivate" : "Activate"} onClick={() => toggle.mutate(p.id)} />
          <IconButton icon="edit" label="Edit" onClick={() => startEdit(p)} />
          <IconButton icon="trash" label="Delete" tone="danger"
            onClick={() => window.confirm(`Delete package "${p.name}"?`) && remove.mutate(p.id)} />
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <ResourceList<Package>
        queryKey="packages" url={API.packages} columns={columns} rowKey={(r) => r.id}
        searchPlaceholder="Search packages…" emptyTitle="No packages yet"
        emptyDescription="Create internet packages to assign to customers." emptyIcon="package"
        toolbarAction={<Button color="primary" onClick={startCreate}><Icon name="plus" className="mr-2 h-4 w-4" /> Add package</Button>}
      />
      <PackageForm open={open} onClose={close} initial={editing} onSubmit={onSubmit}
        submitting={create.isPending || update.isPending}
        error={create.isError || update.isError ? apiError(create.error ?? update.error) : null} />
    </>
  );
}
