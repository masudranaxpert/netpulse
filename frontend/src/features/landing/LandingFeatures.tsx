import { Icon } from "@/shared/components/icons/Icon";
import type { IconName } from "@/shared/components/icons/Icon";

const FEATURES: { icon: IconName; title: string; text: string }[] = [
  { icon: "bolt", title: "Blazing speeds", text: "Fiber-grade bandwidth with consistent low latency, day and night." },
  { icon: "wifi", title: "Live monitoring", text: "Check your connection status and data usage in real time." },
  { icon: "billing", title: "Transparent billing", text: "See every invoice, payment, and due amount in one place." },
  { icon: "ticket", title: "Instant support", text: "Raise a ticket and chat directly with our support team." },
];

export function LandingFeatures() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Everything you need, nothing you don't</h2>
        <p className="mt-3 text-slate-400">A modern ISP experience built around your convenience.</p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-brand-500/40 hover:bg-white/10">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300">
              <Icon name={f.icon} />
            </span>
            <h3 className="mt-4 font-semibold text-white">{f.title}</h3>
            <p className="mt-1.5 text-sm text-slate-400">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
