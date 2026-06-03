import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function ChartCard({ title, subtitle, action, children }: Props) {
  return (
    <section className="card-surface p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-white">{title}</h2>
          {subtitle ? <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
