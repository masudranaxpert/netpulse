import { Icon } from "@/shared/components/icons/Icon";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchField({ value, onChange, placeholder = "Search…" }: Props) {
  return (
    <div className="relative w-full max-w-xs">
      <Icon name="search" className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-ink-800 dark:focus:ring-brand-900/40"
      />
    </div>
  );
}
