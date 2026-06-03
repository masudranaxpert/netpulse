import { Button } from "flowbite-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OltCard } from "@/features/olt/OltCard";
import { OltDeviceForm } from "@/features/olt/OltDeviceForm";
import { api } from "@/shared/api/client";
import { API } from "@/shared/api/endpoints";
import { ListPageSection } from "@/shared/components/data/ListPageSection";
import { Icon } from "@/shared/components/icons/Icon";
import { SearchField } from "@/shared/components/ui/SearchField";
import { useCrud } from "@/shared/hooks/useCrud";
import { useFilteredList } from "@/shared/hooks/useFilteredList";
import { apiError } from "@/shared/utils/apiError";
import type { OltDevice } from "@/shared/types/api";

type Props = { onViewOnus?: (olt: OltDevice) => void };

export function OltDevicesManager({ onViewOnus }: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<OltDevice | null>(null);
  const { create, update, remove } = useCrud("olt-devices", API.olt.devices);
  const { search, setSearch, query, results, total, isEmpty } = useFilteredList<OltDevice>("olt-devices", API.olt.devices);
  const qc = useQueryClient();
  const refresh = () => { qc.invalidateQueries({ queryKey: ["olt-devices"] }); qc.invalidateQueries({ queryKey: ["onus"] }); };
  const close = () => setOpen(false);

  const test = useMutation({
    mutationFn: (id: number) => api.post(API.olt.testConnection(id)).then((r) => r.data),
    onSuccess: (d) => window.alert(d.status === "online" ? `Connected.\n${d.system_info?.description ?? ""}` : d.message),
    onError: (e) => window.alert(apiError(e)),
    onSettled: refresh,
  });

  const onSubmit = (body: Record<string, unknown>) => {
    if (editing) update.mutate({ id: editing.id, body }, { onSuccess: close });
    else create.mutate(body, { onSuccess: close });
  };

  const del = (r: OltDevice) => {
    if (window.confirm(`Delete OLT "${r.name || r.host}" and its ONUs?`)) remove.mutate(r.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            OLT Monitoring System <span className="text-slate-400">(Total: {total})</span>
          </h2>
        </div>
        <Button color="primary" onClick={() => { setEditing(null); setOpen(true); }}>
          <Icon name="plus" className="mr-2 h-4 w-4" /> Add OLT
        </Button>
      </div>
      <SearchField value={search} onChange={setSearch} placeholder="Search OLTs…" />

      <ListPageSection
        isLoading={query.isLoading} isError={query.isError} isEmpty={isEmpty}
        emptyTitle="No OLTs yet"
        emptyDescription="Add a GPON/EPON OLT to monitor ONUs and optical signal." emptyIcon="signal">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((r) => (
            <OltCard key={r.id} device={r} testing={test.isPending}
              onEdit={() => { setEditing(r); setOpen(true); }}
              onTest={() => test.mutate(r.id)}
              onViewOnus={() => onViewOnus?.(r)}
              onDelete={() => del(r)} />
          ))}
        </div>
      </ListPageSection>

      <OltDeviceForm open={open} onClose={close} initial={editing} onSubmit={onSubmit}
        submitting={create.isPending || update.isPending}
        error={create.isError || update.isError ? apiError(create.error ?? update.error) : null} />
    </div>
  );
}
