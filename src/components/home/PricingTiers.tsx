import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/home/Reveal";
import { HOME_PLANS, planPriceDisplay } from "@/lib/pricing";

/** Per-tier presentation, keyed by the plan keys in `HOME_PLANS`. */
const PRESENTATION: Record<
  string,
  { items: number; highlighted?: boolean; badge?: boolean; green?: boolean }
> = {
  nonprofit: { items: 4, green: true },
  community: { items: 4, highlighted: true, badge: true },
  standard: { items: 4 },
};

export function PricingTiers() {
  const { t, language } = useI18n();

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-muted px-6 py-28 sm:px-8 noise-overlay"
    >
      <div className="relative mx-auto max-w-[1200px]">
        <Reveal className="mx-auto max-w-[640px] text-center">
          <div className="text-[13px] font-bold uppercase tracking-[.14em] text-primary">
            {t("home.pricing.label")}
          </div>
          <h2 className="mt-3.5 font-display text-[clamp(34px,4vw,52px)] font-bold leading-[1.05] tracking-tight text-foreground">
            {t("home.pricing.title")}
          </h2>
          <p className="mt-4 text-[17px] font-medium leading-relaxed text-foreground/75">
            {t("home.pricing.subtitle")}
          </p>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-6 md:grid-cols-3">
          {HOME_PLANS.map((plan, i) => {
            const { key } = plan;
            const { items, highlighted, badge, green } = PRESENTATION[key];
            const price = planPriceDisplay(plan, language);
            return (
              <Reveal
                key={key}
                delay={i * 80}
                className={cn(
                  "relative flex flex-col rounded-[20px] bg-card p-9",
                  highlighted
                    ? "border-2 border-primary shadow-[0_18px_44px_rgba(5,132,247,.20)]"
                    : "border border-border shadow-[0_6px_16px_rgba(24,25,26,.07)]"
                )}
              >
                {badge && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-[0_5px_14px_rgba(5,132,247,.4)]">
                    {t("home.pricing.community.badge")}
                  </span>
                )}
                <div
                  className={cn(
                    "text-[15px] font-bold uppercase tracking-widest",
                    green ? "text-brand-green-dark" : "text-primary"
                  )}
                >
                  {t(`home.pricing.${key}.name`)}
                </div>
                <div className="mt-4 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
                  {price.from && (
                    <span className="text-[15px] font-semibold text-muted-foreground">
                      {t("home.pricing.from")}
                    </span>
                  )}
                  <span className="font-display text-[44px] font-bold leading-none tracking-tight text-foreground">
                    {price.price}
                  </span>
                  <span className="text-[15px] font-semibold text-muted-foreground">
                    {price.free
                      ? t(`home.pricing.${key}.period`)
                      : t("home.pricing.per-month")}
                  </span>
                </div>
                <p className="mt-2 min-h-[20px] text-[13px] font-semibold leading-snug text-muted-foreground">
                  {price.annualTotal
                    ? t("home.pricing.billed-annually", {
                        total: price.annualTotal,
                      })
                    : t("home.pricing.no-card")}
                </p>
                <p className="mt-3 min-h-[46px] text-[15px] font-medium leading-snug text-foreground/70">
                  {t(`home.pricing.${key}.desc`)}
                </p>
                <div className="my-5 h-px bg-muted" />
                <div className="flex flex-1 flex-col gap-3">
                  {Array.from({ length: items }, (_, j) => (
                    <div
                      key={j}
                      className="flex items-start gap-2.5 text-[14.5px] font-medium leading-snug text-foreground/80"
                    >
                      <CheckCircle2 className="mt-px h-[17px] w-[17px] flex-none text-brand-green-dark" />
                      {t(`home.pricing.${key}.item${j + 1}`)}
                    </div>
                  ))}
                </div>
                <Link
                  to="/contact"
                  className={cn(
                    "mt-6 inline-flex items-center justify-center rounded-[11px] px-6 py-3 text-[15px] font-bold transition-transform hover:-translate-y-0.5",
                    highlighted
                      ? "bg-primary text-primary-foreground shadow-[0_6px_18px_rgba(5,132,247,.35)]"
                      : "border border-border bg-card text-foreground"
                  )}
                >
                  {t(`home.pricing.${key}.cta`)}
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-8 text-center text-sm font-semibold text-muted-foreground">
          {t("home.pricing.note")}
        </Reveal>
      </div>
    </section>
  );
}
