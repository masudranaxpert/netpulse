import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Icon } from "@/shared/components/icons/Icon";
import { ROUTES } from "@/shared/constants/routes";
import type { NavItem } from "@/shared/constants/nav";

const LINK = "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all";
const ACTIVE = "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200";
const IDLE = "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white";

type Props = { item: NavItem; onNavigate?: () => void };

export function SidebarNavItem({ item, onNavigate }: Props) {
  const location = useLocation();
  const onSection = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
  const [open, setOpen] = useState(onSection);
  useEffect(() => {
    if (onSection) setOpen(true);
  }, [onSection]);

  if (!item.children) {
    return (
      <li>
        <NavLink
          to={item.to}
          end={item.to === ROUTES.dashboard}
          onClick={onNavigate}
          className={({ isActive }) => `${LINK} ${isActive ? ACTIVE : IDLE}`}
        >
          {({ isActive }) => (
            <>
              {isActive ? <span className="absolute left-0 h-6 w-1 rounded-r-full bg-brand-600" /> : null}
              <Icon name={item.icon} className="h-5 w-5 shrink-0" />
              {item.label}
            </>
          )}
        </NavLink>
      </li>
    );
  }

  const currentFilter = new URLSearchParams(location.search).get("filter");
  const childActive = (to: string) => {
    const [path, query] = to.split("?");
    if (location.pathname !== path) return false;
    const f = query ? new URLSearchParams(query).get("filter") : null;
    return (f ?? null) === (currentFilter ?? null);
  };

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`${LINK} w-full justify-between ${onSection ? ACTIVE : IDLE}`}
      >
        <span className="flex items-center gap-3">
          {onSection ? <span className="absolute left-0 h-6 w-1 rounded-r-full bg-brand-600" /> : null}
          <Icon name={item.icon} className="h-5 w-5 shrink-0" />
          {item.label}
        </span>
        <Icon name="chevronDown" className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? (
        <ul className="ml-5 mt-1 space-y-0.5 border-l border-slate-200 pl-3 dark:border-slate-700">
          {item.children.map((child) => (
            <li key={child.to}>
              <NavLink
                to={child.to}
                onClick={onNavigate}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  childActive(child.to)
                    ? "bg-brand-50 font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {child.label}
              </NavLink>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
