import { TicketsManager } from "@/features/tickets/TicketsManager";
import { PageHeader } from "@/shared/components/layout/PageHeader";

export function TicketsPage() {
  return (
    <>
      <PageHeader title="Support tickets" description="Customer issues and admin replies." />
      <TicketsManager />
    </>
  );
}
