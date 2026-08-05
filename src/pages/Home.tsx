import React from "react";
import { useSEO } from "@/hooks/use-seo";
import { HomeHero } from "@/components/home/HomeHero";
import { ProofMarquee } from "@/components/home/ProofMarquee";
import { ProblemSection } from "@/components/home/ProblemSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FeatureHighlights } from "@/components/home/FeatureHighlights";
import { NonProfitBanner } from "@/components/home/NonProfitBanner";
import { PricingTiers } from "@/components/home/PricingTiers";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { CtaSection } from "@/components/home/CtaSection";

export function Home() {
  useSEO({ canonicalPath: "/" });
  return (
    <div className="min-h-screen">
      <HomeHero />
      <ProofMarquee />
      <ProblemSection />
      <HowItWorksSection />
      <FeatureHighlights />
      <NonProfitBanner />
      <PricingTiers />
      <NewsletterSection />
      <CtaSection />
    </div>
  );
}
