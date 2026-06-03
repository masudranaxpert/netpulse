import { Icon } from "@/shared/components/icons/Icon";
import type { IconName } from "@/shared/components/icons/Icon";
import { useDashboardSummary } from "@/features/dashboard/useDashboardSummary";

export type ClientCategory =
  | "all" | "active" | "due" | "free" | "inactive" | "expired" | "left" | "online";

type Meta = {
  title: string;
  description: string;
  icon: IconName;
  gradient: string;
  ring: string;
  label: string;
};

export const CATEGORY_META: Record<ClientCategory, Meta> = {
  all:      { title: "All clients",     description: "Every subscriber on this network.",                icon: "users",    gradient: "from-brand-500 via-brand-600 to-brand-700",      ring: "bg-brand-100/70 text-brand-700",       label: "Total" },
  active:   { title: "Active clients",  description: "Subscribers with an active connection.",           icon: "check",    gradient: "from-emerald-500 via-emerald-600 to-teal-600",   ring: "bg-emerald-100/70 text-emerald-700",   label: "Active" },
  due:      { title: "Due clients",     description: "Subscribers with an outstanding balance.",         icon: "billing",  gradient: "from-rose-500 via-rose-600 to-rose-700",         ring: "bg-rose-100/70 text-rose-700",         label: "Due" },
  free:     { title: "Free clients",    description: "Complimentary / non-billed subscribers.",          icon: "users",    gradient: "from-teal-500 via-cyan-600 to-sky-600",          ring: "bg-cyan-100/70 text-cyan-700",         label: "Free" },
  inactive: { title: "Inactive",        description: "Disconnected subscribers.",                        icon: "power",    gradient: "from-slate-500 via-slate-600 to-slate-700",      ring: "bg-slate-200/70 text-slate-700",       label: "Disconnected" },
  expired:  { title: "Expired clients", description: "Past their billing grace period.",                 icon: "clock",    gradient: "from-amber-500 via-orange-500 to-rose-500",      ring: "bg-amber-100/70 text-amber-700",       label: "Expired" },
  left:     { title: "Left clients",    description: "Churned subscribers who have left.",               icon: "logout",   gradient: "from-zinc-600 via-slate-700 to-slate-900",       ring: "bg-zinc-200/70 text-zinc-700",         label: "Left" },
  online:   { title: "Online monitoring", description: "Subscribers with a live PPPoE session right now.", icon: "activity", gradient: "from-violet-500 via-fuchsia-600 to-pink-600",   ring: "bg-violet-100/70 text-violet-700",     label: "Online" },
};

function pickCount(category: ClientCategory, c?: ReturnType<typeof useDashboardSummary>["data"]) {
  if (!c) return null;
  const k = c.customers;
  switch (category) {
    case "all":      return k.total;
    case "active":   return k.active;
    case "due":      return k.due;
    case "free":     return k.free;
    case "inactive": return k.disconnected;
    case "expired":  return k.expired;
    case "left":     return k.left;
    case "online":   return null;
  }
}

export function CategoryBanner({ category }: { category: ClientCategory }) {
  const meta = CATEGORY_META[category];
  const { data } = useDashboardSummary();
  const count = pickCount(category, data);

  return (
    <div
      className={`relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br ${meta.gradient} p-5 text-white shadow-lg sm:p-7`}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl sm:-right-8 sm:h-64 sm:w-64" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 sm:items-center sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30 backdrop-blur sm:h-14 sm:w-14">
            <Icon name={meta.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl md:text-[28px]">
              {meta.title}
            </h1>
            <p className="mt-1 text-sm text-white/80 sm:text-[15px]">{meta.description}</p>
          </div>
        </div>

        {count !== null ? (
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="rounded-2xl bg-white/15 px-4 py-2 ring-1 ring-white/25 backdrop-blur">
              <div className="text-[11px] font-medium uppercase tracking-wider text-white/70">
                {meta.label}
              </div>
              <div className="text-2xl font-bold leading-tight tabular-nums sm:text-3xl">
                {count.toLocaleString()}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
