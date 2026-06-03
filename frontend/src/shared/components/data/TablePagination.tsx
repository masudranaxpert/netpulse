type Props = {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
  rangeLabel: string;
};

export function TablePagination({ page, totalPages, onPage, rangeLabel }: Props) {
  if (totalPages <= 1) return null;

  const btn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-slate-200 px-3 text-sm font-medium transition disabled:opacity-40 enabled:hover:bg-slate-100 dark:border-slate-700 dark:enabled:hover:bg-slate-800";

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-1">
      <p className="text-sm text-slate-400">{rangeLabel}</p>
      <div className="flex items-center gap-1.5">
        <button className={btn} onClick={() => onPage(page - 1)} disabled={page <= 1}>
          Prev
        </button>
        {pages.map((p, i) => (
          <span key={p} className="flex items-center gap-1.5">
            {i > 0 && p - pages[i - 1] > 1 ? <span className="px-1 text-slate-400">…</span> : null}
            <button
              className={`${btn} ${p === page ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200" : ""}`}
              onClick={() => onPage(p)}
            >
              {p}
            </button>
          </span>
        ))}
        <button className={btn} onClick={() => onPage(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}
