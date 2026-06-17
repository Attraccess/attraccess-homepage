import React from "react";
import { useSEO } from "@/hooks/use-seo";
import { useI18n } from "@/contexts/i18n";
import { ModernPricingSection } from "@/components/ModernPricingSection";

export function PricingPage() {
  useSEO({
    title: "Pricing",
    description: "Attraccess is free for non-profits and open-source makerspaces. Explore community and commercial plans for your organization.",
    canonicalPath: "/pricing",
  });
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t("pricing.title")}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {t("pricing.subtitle")}
          </p>
        </div>
      </section>

      {/* Modern Pricing Section */}
      <ModernPricingSection />
    </div>
  );
}
