import { usePackages } from "@/features/landing/usePackages";
import { Icon } from "@/shared/components/icons/Icon";
import { ROUTES } from "@/shared/constants/routes";
import { money } from "@/shared/utils/format";

export function LandingPricing() {
  const { data, isLoading } = usePackages();

  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Simple, honest pricing</h2>
        <p className="mt-3 text-slate-400">Pick a plan that fits your needs. Upgrade anytime.</p>
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
            ))
          : data?.map((p, idx) => (
              <div
                key={p.id}
                className={`relative rounded-3xl border p-7 ${
                  idx === 1
                    ? "border-brand-500/60 bg-gradient-to-b from-brand-600/20 to-white/5"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {idx === 1 ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-[11px] font-semibold text-white">
                    Popular
                  </span>
                ) : null}
                <h3 className="font-semibold text-white">{p.name}</h3>
                <p className="mt-1 text-sm capitalize text-slate-400">{p.package_type} plan</p>
                <p className="mt-5 text-4xl font-extrabold text-white">
                  {money(p.price)}
                  <span className="text-base font-medium text-slate-400">/{p.package_type === "yearly" ? "yr" : "mo"}</span>
                </p>
                <p className="mt-2 flex items-center gap-2 text-brand-300">
                  <Icon name="bolt" className="h-4 w-4" /> {p.speed} speed
                </p>
                <a
                  href={ROUTES.portalLogin}
                  className={`mt-6 block rounded-xl py-3 text-center text-sm font-semibold transition ${
                    idx === 1
                      ? "bg-brand-600 text-white hover:bg-brand-500"
                      : "border border-white/15 text-white hover:bg-white/10"
                  }`}
                >
                  Get started
                </a>
              </div>
            ))}
      </div>
    </section>
  );
}
