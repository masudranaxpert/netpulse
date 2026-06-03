import { DarkThemeToggle } from "flowbite-react";
import { Icon } from "@/shared/components/icons/Icon";
import { UserMenu } from "@/shared/components/layout/UserMenu";

type Props = { onMenuClick: () => void };

export function TopBar({ onMenuClick }: Props) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl md:px-6 dark:border-slate-800 dark:bg-ink-900/80">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden dark:hover:bg-slate-800"
          aria-label="Open menu"
        >
          <Icon name="menu" />
        </button>
        <div className="relative hidden sm:block">
          <Icon name="search" className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search anything…"
            className="w-56 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:w-72 focus:border-brand-400 focus:bg-white lg:w-72 dark:border-slate-700 dark:bg-ink-800"
          />
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Notifications">
          <Icon name="bell" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-ink-900" />
        </button>
        <DarkThemeToggle className="rounded-lg" />
        <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700" />
        <UserMenu />
      </div>
    </header>
  );
}
