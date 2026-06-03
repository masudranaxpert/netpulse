import { useState } from "react";
import { TicketComposer } from "@/features/portal/TicketComposer";
import { TicketThread } from "@/features/portal/TicketThread";
import { usePortalTickets } from "@/features/portal/portalData";
import { PageHeader } from "@/shared/components/layout/PageHeader";
import { StatusBadge } from "@/shared/components/ui/StatusBadge";
import { Icon } from "@/shared/components/icons/Icon";

export function PortalTicketsPage() {
  const { data, isLoading } = usePortalTickets();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader title="Support" description="Raise an issue and chat with our support team." />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <TicketComposer />
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="card-surface h-16 animate-pulse" />)
          ) : !data?.length ? (
            <div className="card-surface flex flex-col items-center gap-2 py-12 text-center">
              <Icon name="ticket" className="h-8 w-8 text-slate-300" />
              <p className="text-sm text-slate-400">No tickets yet.</p>
            </div>
          ) : (
            data.map((t) => (
              <div key={t.id} className="card-surface p-4">
                <button
                  onClick={() => setSelected(selected === t.id ? null : t.id)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">{t.title}</p>
                    <p className="text-xs text-slate-400">{new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                  <StatusBadge status={t.status} />
                </button>
                {selected === t.id ? <TicketThread id={t.id} /> : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
