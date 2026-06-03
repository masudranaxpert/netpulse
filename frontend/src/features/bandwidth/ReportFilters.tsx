import { Button } from "flowbite-react";
import { Icon } from "@/shared/components/icons/Icon";
import { SelectField } from "./SelectField";
import type { ReportFilterState } from "./types";

type Option = { value: string; label: string };

type Props = {
  draft: ReportFilterState;
  onChange: (patch: Partial<ReportFilterState>) => void;
  routerOptions: Option[];
  customerOptions: Option[];
  onQuery: () => void;
  onSync: () => void;
  syncing: boolean;
};

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
      {label}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white py-2 px-3 text-sm text-slate-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-ink-800 dark:text-slate-200 dark:focus:ring-brand-900/40"
      />
    </label>
  );
}

export function ReportFilters({ draft, onChange, routerOptions, customerOptions, onQuery, onSync, syncing }: Props) {
  return (
    <section className="card-surface flex flex-col gap-3 p-4 lg:flex-row lg:flex-wrap lg:items-end">
      <DateInput label="Date From" value={draft.date_from} onChange={(v) => onChange({ date_from: v })} />
      <DateInput label="Date To" value={draft.date_to} onChange={(v) => onChange({ date_to: v })} />
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
        Router
        <SelectField value={draft.router} onChange={(v) => onChange({ router: v })} options={routerOptions} placeholder="All Routers" ariaLabel="Router" />
      </label>
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
        Customer
        <SelectField value={draft.customer} onChange={(v) => onChange({ customer: v })} options={customerOptions} placeholder="All Customers" ariaLabel="Customer" />
      </label>
      <div className="flex flex-1 items-end justify-end gap-2">
        <Button color="primary" onClick={onQuery}>
          <Icon name="search" className="mr-2 h-4 w-4" />
          Query Reports
        </Button>
        <Button color="light" onClick={onSync} disabled={syncing}>
          <Icon name="refresh" className={`mr-2 h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          Sync Bandwidth
        </Button>
      </div>
    </section>
  );
}
