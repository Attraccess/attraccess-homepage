import React from "react";
import { useSEO } from "@/hooks/use-seo";
import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { CustomersPartners } from "@/components/CustomersPartners";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { CTABanner } from "@/components/CTABanner";

export function Home() {
  useSEO({ canonicalPath: "/" });
  return (
    <div className="min-h-screen">
      <Hero />
      <StatsBar />
      <CustomersPartners />
      <Features />
      <HowItWorks />
      <CTABanner />
    </div>
  );
}
