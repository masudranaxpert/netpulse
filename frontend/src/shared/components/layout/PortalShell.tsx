import { DarkThemeToggle } from "flowbite-react";
import { NavLink, Outlet } from "react-router-dom";
import { Brand } from "@/shared/components/layout/Brand";
import { Icon } from "@/shared/components/icons/Icon";
import { PORTAL_NAV } from "@/features/portal/portalNav";
import { ROUTES } from "@/shared/constants/routes";
import { usePortalLogout, usePortalProfile } from "@/features/portal/portalAuth";

function navClass(isActive: boolean) {
  return `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
  }`;
}

export function PortalShell() {
  const logout = usePortalLogout();
  const { data } = usePortalProfile();

  return (
    <div className="min-h-screen bg-slate-100 pb-20 dark:bg-ink-950 lg:pb-0">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl md:px-6 dark:border-slate-800 dark:bg-ink-900/80">
        <Brand />
        <nav className="hidden items-center gap-1 lg:flex">
          {PORTAL_NAV.map((i) => (
            <NavLink key={i.to} to={i.to} end={i.to === ROUTES.portal} className={({ isActive }) => navClass(isActive)}>
              <Icon name={i.icon} className="h-4 w-4" />
              {i.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm font-medium text-slate-600 sm:block dark:text-slate-300">
            {data?.customer_name ?? "Customer"}
          </span>
          <DarkThemeToggle className="rounded-lg" />
          <button
            onClick={() => logout.mutate()}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Sign out"
          >
            <Icon name="logout" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl animate-rise p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 grid grid-cols-3 border-t border-slate-200 bg-white/95 backdrop-blur-xl lg:hidden dark:border-slate-800 dark:bg-ink-900/95">
        {PORTAL_NAV.map((i) => (
          <NavLink
            key={i.to}
            to={i.to}
            end={i.to === ROUTES.portal}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                isActive ? "text-brand-600 dark:text-brand-300" : "text-slate-400"
              }`
            }
          >
            <Icon name={i.icon} className="h-5 w-5" />
            {i.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
