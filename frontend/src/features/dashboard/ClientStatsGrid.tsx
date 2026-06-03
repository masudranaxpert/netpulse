import { useNavigate } from "react-router-dom";
import { useDashboardSummary } from "@/features/dashboard/useDashboardSummary";
import { Icon } from "@/shared/components/icons/Icon";
import type { IconName } from "@/shared/components/icons/Icon";
import { ROUTES } from "@/shared/constants/routes";
import { money } from "@/shared/utils/format";

type Tile = {
  label: string; value: string | number; icon: IconName; gradient: string; to?: string;
};

export function ClientStatsGrid() {
  const { data, isLoading } = useDashboardSummary();
  const navigate = useNavigate();
  const c = data?.customers;

  const tiles: Tile[] = [
    { label: "Total clients", value: c?.total ?? 0, icon: "users", gradient: "from-indigo-500 to-indigo-600", to: ROUTES.customers },
    { label: "Active clients", value: c?.active ?? 0, icon: "check", gradient: "from-emerald-500 to-emerald-600", to: `${ROUTES.customers}?filter=active` },
    { label: "Free clients", value: c?.free ?? 0, icon: "users", gradient: "from-teal-500 to-cyan-600", to: `${ROUTES.customers}?filter=free` },
    { label: "Due clients", value: c?.due ?? 0, icon: "billing", gradient: "from-orange-500 to-amber-600", to: `${ROUTES.customers}?filter=due` },
    { label: "Expired", value: c?.expired ?? 0, icon: "power", gradient: "from-rose-500 to-rose-600", to: `${ROUTES.customers}?filter=expired` },
    { label: "Expire today", value: c?.expire_today ?? 0, icon: "clock", gradient: "from-amber-400 to-amber-500" },
    { label: "Inactive", value: c?.disconnected ?? 0, icon: "power", gradient: "from-slate-400 to-slate-500", to: `${ROUTES.customers}?filter=inactive` },
    { label: "Left clients", value: c?.left ?? 0, icon: "logout", gradient: "from-slate-700 to-slate-900", to: `${ROUTES.customers}?filter=left` },
    { label: "Open tickets", value: data?.tickets.open ?? 0, icon: "ticket", gradient: "from-violet-500 to-purple-600", to: ROUTES.tickets },
    { label: "Collected", value: money(data?.revenue.collected ?? 0), icon: "billing", gradient: "from-green-500 to-emerald-600" },
    { label: "Outstanding", value: money(data?.revenue.outstanding ?? 0), icon: "trendDown", gradient: "from-pink-500 to-rose-600" },
    { label: "Today's revenue", value: money(data?.revenue.today ?? 0), icon: "cash", gradient: "from-sky-500 to-blue-600", to: ROUTES.payments },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => <div key={i} className="h-[88px] animate-pulse rounded-2xl bg-slate-200/70 dark:bg-ink-800" />)}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tiles.map((t) => (
        <button
          key={t.label}
          type="button"
          onClick={() => t.to && navigate(t.to)}
          className={`group flex items-center justify-between rounded-2xl bg-gradient-to-br ${t.gradient} p-4 text-left text-white shadow-sm transition ${t.to ? "hover:-translate-y-0.5 hover:shadow-lg" : "cursor-default"}`}
        >
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/80">{t.label}</p>
            <p className="mt-1 text-2xl font-bold">{t.value}</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Icon name={t.icon} className="h-5 w-5" />
          </span>
        </button>
      ))}
    </div>
  );
}
