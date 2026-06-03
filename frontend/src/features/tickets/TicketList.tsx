import { ticketColumns } from "@/features/tickets/ticketColumns";
import { API } from "@/shared/api/endpoints";
import { ResourceList } from "@/shared/components/data/ResourceList";
import type { Ticket } from "@/shared/types/api";

export function TicketList() {
  return (
    <ResourceList<Ticket>
      queryKey="tickets"
      url={API.tickets}
      columns={ticketColumns}
      rowKey={(r) => r.id}
      searchPlaceholder="Search tickets…"
      emptyTitle="No support tickets"
      emptyDescription="Customer issues and admin replies show up here."
      emptyIcon="ticket"
    />
  );
}
