import type { ReactNode } from "react";

export function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-2.5 last:border-0 dark:border-slate-800">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-right text-sm font-medium text-slate-900 dark:text-white">{children}</span>
    </div>
  );
}

export function DetailCard({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="card-surface p-5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">{title}</h2>
        {action}
      </div>
      <div>{children}</div>
    </section>
  );
}
