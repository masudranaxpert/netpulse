import { TextInput } from "flowbite-react";
import { useMemo, useState } from "react";
import { API } from "@/shared/api/endpoints";
import { usePaginatedList } from "@/shared/hooks/usePaginatedList";
import type { Customer } from "@/shared/types/api";

type Props = { value: string; onChange: (id: string) => void };

export function CustomerSearchSelect({ value, onChange }: Props) {
  const { data: customers = [] } = usePaginatedList<Customer>("customers", API.customers);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const selected = customers.find((c) => c.customer_id === value);

  const matches = useMemo(() => {
    const term = q.toLowerCase().trim();
    const rows = !term
      ? customers
      : customers.filter((c) => `${c.customer_id} ${c.customer_name} ${c.phone_number}`.toLowerCase().includes(term));
    return rows.slice(0, 8);
  }, [customers, q]);

  return (
    <div className="relative">
      <TextInput
        value={selected && !open ? `${selected.customer_id} — ${selected.customer_name}` : q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); if (value) onChange(""); }}
        onFocus={() => setOpen(true)}
        placeholder="Search by name, ID or phone…"
      />
      {open ? (
        <>
          <button type="button" aria-hidden className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} />
          <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-ink-900">
            {matches.length === 0 ? (
              <p className="px-3 py-3 text-sm text-slate-400">No customers found</p>
            ) : matches.map((c) => (
              <button key={c.id} type="button"
                onClick={() => { onChange(c.customer_id); setQ(""); setOpen(false); }}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-ink-800">
                <span><span className="font-medium text-slate-900 dark:text-white">{c.customer_name}</span> <span className="text-slate-400">· {c.customer_id}</span></span>
                <span className="text-xs text-slate-400">{c.phone_number}</span>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
