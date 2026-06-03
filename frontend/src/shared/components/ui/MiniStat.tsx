import { Icon, type IconName } from "@/shared/components/icons/Icon";

type Props = {
  label: string;
  value: string | number;
  icon: IconName;
  tone?: "brand" | "sky" | "amber" | "violet" | "rose";
};

const TONES = {
  brand: "bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300",
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300",
};

export function MiniStat({ label, value, icon, tone = "brand" }: Props) {
  return (
    <div className="card-surface flex items-center gap-3 p-4">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}>
        <Icon name={icon} className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-slate-400">{label}</p>
        <p className="truncate text-lg font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
