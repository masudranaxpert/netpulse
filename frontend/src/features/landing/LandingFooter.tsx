import { Brand } from "@/shared/components/layout/Brand";
import { ROUTES } from "@/shared/constants/routes";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-ink-950">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 md:flex-row md:px-6">
        <Brand />
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <a href={ROUTES.portalLogin} className="hover:text-white">Customer Login</a>
          <a href={ROUTES.login} className="hover:text-white">Admin</a>
        </nav>
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} NetPulse</p>
      </div>
    </footer>
  );
}
