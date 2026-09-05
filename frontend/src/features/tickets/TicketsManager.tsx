import { Button } from "flowbite-react";
import { useState } from "react";
import { ticketColumns } from "@/features/tickets/ticketColumns";
import { TicketDetail } from "@/features/tickets/TicketDetail";
import { TicketForm } from "@/features/tickets/TicketForm";
import { API } from "@/shared/api/endpoints";
import type { Column } from "@/shared/components/data/DataTable";
import { ResourceList } from "@/shared/components/data/ResourceList";
import { Icon } from "@/shared/components/icons/Icon";
import { IconButton, RowActions } from "@/shared/components/ui/RowActions";
import { useCrud } from "@/shared/hooks/useCrud";
import { apiError } from "@/shared/utils/apiError";
import type { Ticket } from "@/shared/types/api";

export function TicketsManager() {
  const [createOpen, setCreateOpen] = useState(false);
  const [detailId, setDetailId] = useState<number | null>(null);
  const { create, remove } = useCrud("tickets", API.tickets);

  const columns: Column<Ticket>[] = [
    ...ticketColumns,
    {
      key: "actions", header: "", align: "right",
      render: (t) => (
        <RowActions>
          <IconButton icon="eye" label="View thread" onClick={() => setDetailId(t.id)} />
          <IconButton icon="trash" label="Delete" tone="danger"
            onClick={() => window.confirm(`Delete ticket "${t.title}"?`) && remove.mutate(t.id)} />
        </RowActions>
      ),
    },
  ];

  return (
    <>
      <ResourceList<Ticket>
        queryKey="tickets" url={API.tickets} columns={columns} rowKey={(r) => r.id}
        searchPlaceholder="Search tickets…" emptyTitle="No support tickets"
        emptyDescription="Customer issues and admin replies show up here." emptyIcon="ticket"
        onRowClick={(t) => setDetailId(t.id)}
        toolbarAction={
          <Button color="primary" onClick={() => setCreateOpen(true)}>
            <Icon name="plus" className="mr-2 h-4 w-4" /> Add ticket
          </Button>
        }
      />
      <TicketForm open={createOpen} onClose={() => setCreateOpen(false)}
        onSubmit={(body) => create.mutate(body, { onSuccess: () => setCreateOpen(false) })}
        submitting={create.isPending}
        error={create.isError ? apiError(create.error) : null} />
      <TicketDetail ticketId={detailId} onClose={() => setDetailId(null)} />
    </>
  );
}
