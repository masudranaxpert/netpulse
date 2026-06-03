type Props = { rows?: number; cols?: number };

export function TableSkeleton({ rows = 6, cols = 5 }: Props) {
  return (
    <div className="card-surface overflow-hidden p-0">
      <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800 dark:bg-ink-800/60">
        <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0 dark:border-slate-800">
          <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          {Array.from({ length: cols - 1 }).map((__, c) => (
            <div
              key={c}
              className="h-3 animate-pulse rounded bg-slate-200 dark:bg-slate-700"
              style={{ width: `${60 + ((r + c) % 4) * 30}px` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
