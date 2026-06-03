import { AddCustomerButton } from "@/features/customers/AddCustomerButton";
import { SidebarNavItem } from "@/shared/components/layout/SidebarNavItem";
import { MAIN_NAV, NAV_GROUPS } from "@/shared/constants/nav";

type Props = { onNavigate?: () => void };

export function SidebarNav({ onNavigate }: Props) {
  return (
    <nav className="flex flex-col gap-6 px-3 py-4">
      <div className="px-1">
        <AddCustomerButton full onNavigate={onNavigate} />
      </div>
      {NAV_GROUPS.map((group) => (
        <div key={group}>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {group}
          </p>
          <ul className="space-y-1">
            {MAIN_NAV.filter((i) => i.group === group).map((item) => (
              <SidebarNavItem key={item.to} item={item} onNavigate={onNavigate} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
