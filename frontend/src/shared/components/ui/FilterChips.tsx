type Chip<T extends string> = { value: T; label: string; count?: number };

type Props<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: Chip<T>[];
};

export function FilterChips<T extends string>({ value, onChange, options }: Props<T>) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-brand-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-ink-800 dark:text-slate-300 dark:hover:bg-ink-700"
            }`}
          >
            {o.label}
            {typeof o.count === "number" ? (
              <span className={`rounded-full px-1.5 text-[10px] font-semibold ${active ? "bg-white/25" : "bg-slate-200 dark:bg-ink-700"}`}>
                {o.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
