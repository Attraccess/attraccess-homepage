import React from "react";
import { useSEO } from "@/hooks/use-seo";
import seoMeta from "@/lib/seo-meta.json";
import { Features as FeaturesComponent } from "@/components/Features";
import { useI18n } from "@/contexts/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function Features() {
  useSEO(seoMeta["/features"]);
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t("features.title")}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Everything you need to manage access, track usage, and automate your
            workspace
          </p>
          <Link to="/contact">
            <Button variant="cta" size="lg" className="gap-2">
              {t("nav.demo")}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <FeaturesComponent />
    </div>
  );
}
