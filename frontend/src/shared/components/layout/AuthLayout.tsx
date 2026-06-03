import type { ReactNode } from "react";
import { Brand } from "@/shared/components/layout/Brand";
import { Icon } from "@/shared/components/icons/Icon";

const HIGHLIGHTS = [
  "Realtime PPPoE & bandwidth control",
  "Automated monthly billing runs",
  "Customer support ticketing",
];

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-ink-900 p-12 text-white lg:flex">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl" />
        <Brand />
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold leading-tight">Run your ISP from one calm dashboard.</h2>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((h) => (
              <li key={h} className="flex items-center gap-3 text-brand-50">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <Icon name="bolt" className="h-3.5 w-3.5" />
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 text-sm text-brand-100/70">© {new Date().getFullYear()} NetPulse</p>
      </div>
      <div className="flex items-center justify-center bg-slate-100 p-6 dark:bg-ink-950">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
