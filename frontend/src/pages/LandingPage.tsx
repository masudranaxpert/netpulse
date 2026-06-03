import { LandingNav } from "@/features/landing/LandingNav";
import { LandingHero } from "@/features/landing/LandingHero";
import { LandingFeatures } from "@/features/landing/LandingFeatures";
import { LandingPricing } from "@/features/landing/LandingPricing";
import { LandingFooter } from "@/features/landing/LandingFooter";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <LandingNav />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingPricing />
      </main>
      <LandingFooter />
    </div>
  );
}
