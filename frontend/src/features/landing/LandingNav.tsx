import { Brand } from "@/shared/components/layout/Brand";
import { ROUTES } from "@/shared/constants/routes";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink-950/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Brand onDark />
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={ROUTES.login}
            className="hidden rounded-xl px-4 py-2 text-sm font-medium text-slate-300 hover:text-white sm:block"
          >
            Admin
          </a>
          <a
            href={ROUTES.portalLogin}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500"
          >
            Customer Login
          </a>
        </div>
      </div>
    </header>
  );
}
