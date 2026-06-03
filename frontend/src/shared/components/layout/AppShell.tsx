import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Brand } from "@/shared/components/layout/Brand";
import { SidebarNav } from "@/shared/components/layout/SidebarNav";
import { TopBar } from "@/shared/components/layout/TopBar";

export function AppShell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="hidden border-r border-slate-200/70 bg-white lg:flex lg:flex-col dark:border-slate-800 dark:bg-ink-900">
        <div className="flex h-16 items-center border-b border-slate-200/70 px-5 dark:border-slate-800">
          <Brand />
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
      </aside>

      <Drawer open={open} onClose={() => setOpen(false)} className="lg:hidden">
        <DrawerHeader title="Menu" titleIcon={() => null} />
        <DrawerItems>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </DrawerItems>
      </Drawer>

      <div className="flex min-h-screen flex-col">
        <TopBar onMenuClick={() => setOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl animate-rise">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
