import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import seoMeta from "@/lib/seo-meta.json";
import { useI18n } from "@/contexts/i18n";
import { Button } from "@/components/ui/button";
import { DemoVideo } from "@/components/DemoVideo";
import { StepList } from "@/components/how-it-works/StepList";
import { WorkshopGallery } from "@/components/how-it-works/WorkshopGallery";
import { HardwareSection } from "@/components/how-it-works/HardwareSection";

const HERO_STATS = ["setup", "tap", "hardware"] as const;

export function HowItWorksPage() {
  useSEO(seoMeta["/how-it-works"]);
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
            {t("how-it-works.title")}
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-white/90">
            {t("how-it-works.subtitle")}
          </p>

          <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
            {HERO_STATS.map((key) => (
              <div
                key={key}
                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-5 backdrop-blur"
              >
                <dt className="font-display text-3xl font-bold text-white">
                  {t(`how-it-works.hero.${key}.value`)}
                </dt>
                <dd className="mt-1 text-sm font-medium text-white/80">
                  {t(`how-it-works.hero.${key}.label`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Demo video — the fastest way to understand the whole loop */}
      <DemoVideo />

      {/* Real-world imagery */}
      <WorkshopGallery />

      {/* The companion gadget */}
      <HardwareSection />

      {/* The five steps */}
      <section className="py-20" aria-labelledby="steps-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="text-[13px] font-bold uppercase tracking-[.14em] text-primary">
              {t("how-it-works.steps.label")}
            </div>
            <h2
              id="steps-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              {t("how-it-works.steps.title")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {t("how-it-works.steps.subtitle")}
            </p>
          </div>

          <div className="mt-16">
            <StepList />
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t("how-it-works.cta.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            {t("how-it-works.cta.text")}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="cta" size="lg" className="gap-2" asChild>
              <Link to="/contact">
                {t("how-it-works.cta.primary")}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link to="/features">{t("how-it-works.cta.secondary")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
