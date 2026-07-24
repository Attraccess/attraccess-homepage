import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import seoMeta from "@/lib/seo-meta.json";
import { Features as FeaturesComponent } from "@/components/Features";
import {
  FEATURE_DETAILS,
  FeatureDeepDive,
} from "@/components/features/FeatureDeepDive";
import { FeatureExtras } from "@/components/features/FeatureExtras";
import { useI18n } from "@/contexts/i18n";
import { Button } from "@/components/ui/button";

export function Features() {
  useSEO(seoMeta["/features"]);
  const { t } = useI18n();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
            {t("features.title")}
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-white/90">
            {t("features.subtitle")}
          </p>
          <Button variant="cta" size="lg" className="gap-2" asChild>
            <Link to="/contact">
              {t("nav.demo")}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>

          {/* Jump links so the page reads as a menu, not a wall */}
          <nav aria-label={t("features.jump.label")} className="mt-12">
            <ul className="flex flex-wrap items-center justify-center gap-2.5">
              {FEATURE_DETAILS.map((detail) => (
                <li key={detail.key}>
                  <a
                    href={`#feature-${detail.key}`}
                    className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
                  >
                    {t(`features.detail.${detail.key}.label`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* Bento overview — the whole product at a glance */}
      <FeaturesComponent />

      {/* One section per feature */}
      <section className="py-24" aria-labelledby="feature-detail-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-[13px] font-bold uppercase tracking-[.14em] text-primary">
              {t("features.detail.label")}
            </div>
            <h2
              id="feature-detail-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              {t("features.detail.title")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {t("features.detail.subtitle")}
            </p>
          </div>

          <div className="mt-20">
            <FeatureDeepDive />
          </div>
        </div>
      </section>

      {/* Smaller capabilities + FAQ */}
      <FeatureExtras />

      {/* Closing CTA */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t("features.closing.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            {t("features.closing.text")}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="cta" size="lg" className="gap-2" asChild>
              <Link to="/contact">
                {t("features.cta")}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link to="/how-it-works">{t("features.closing.secondary")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
