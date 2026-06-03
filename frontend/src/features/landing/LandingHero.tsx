import { ROUTES } from "@/shared/constants/routes";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-500/30 blur-3xl" />
      <div className="absolute right-0 top-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-4 py-24 text-center md:py-32">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-brand-200">
          ⚡ Lightning-fast fiber internet
        </span>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
          Internet that just <span className="bg-gradient-to-r from-brand-400 to-emerald-300 bg-clip-text text-transparent">works</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          Reliable high-speed connections, transparent billing, and instant support — all managed from one beautiful portal.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#pricing"
            className="w-full rounded-xl bg-brand-600 px-7 py-3 text-base font-semibold text-white shadow-xl shadow-brand-600/30 transition hover:bg-brand-500 sm:w-auto"
          >
            View packages
          </a>
          <a
            href={ROUTES.portalLogin}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-7 py-3 text-base font-semibold text-white transition hover:bg-white/10 sm:w-auto"
          >
            Customer login
          </a>
        </div>
      </div>
    </section>
  );
}
