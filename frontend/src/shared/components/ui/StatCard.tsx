import { Icon, type IconName } from "@/shared/components/icons/Icon";

type Props = {
  label: string;
  value: string | number;
  icon: IconName;
  hint?: string;
  trend?: "up" | "down";
  accent?: "brand" | "sky" | "amber" | "violet";
};

const ACCENTS = {
  brand: "from-brand-500 to-brand-700 shadow-brand-600/30",
  sky: "from-sky-500 to-sky-700 shadow-sky-600/30",
  amber: "from-amber-500 to-orange-600 shadow-amber-600/30",
  violet: "from-violet-500 to-purple-700 shadow-violet-600/30",
};

export function StatCard({ label, value, icon, hint, trend, accent = "brand" }: Props) {
  return (
    <div className="card-surface group relative overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg ${ACCENTS[accent]}`}>
          <Icon name={icon} className="h-5 w-5" />
        </div>
      </div>
      {hint ? (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium">
          {trend ? (
            <span className={trend === "up" ? "text-emerald-600" : "text-rose-600"}>
              <Icon name={trend === "up" ? "trendUp" : "trendDown"} className="h-4 w-4" />
            </span>
          ) : null}
          <span className="text-slate-400">{hint}</span>
        </div>
      ) : null}
    </div>
  );
}
