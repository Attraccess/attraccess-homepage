import React from "react";
import { Link } from "react-router-dom";
import { Cable, Nfc, RefreshCw, Wifi } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { Button } from "@/components/ui/button";
import { PHOTOS } from "@/lib/media";

const SPECS = [
  { icon: Nfc, key: "nfc" },
  { icon: Wifi, key: "wifi" },
  { icon: Cable, key: "relay" },
  { icon: RefreshCw, key: "ota" },
] as const;

/**
 * The companion gadget — Attractap — shown next to a real machine, with what it
 * does and what it needs to run.
 */
export function HardwareSection() {
  const { t } = useI18n();

  return (
    <section className="bg-muted/40 py-20" aria-labelledby="hardware-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border shadow-large">
              <img
                src={PHOTOS.readerOnMachine.src}
                alt={t(PHOTOS.readerOnMachine.altKey)}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-5 right-5 rounded-xl border border-border bg-card px-5 py-4 shadow-medium sm:right-auto sm:max-w-xs">
              <div className="text-sm font-bold text-foreground">
                {t("how-it-works.hardware.badge.title")}
              </div>
              <div className="text-xs font-medium text-muted-foreground">
                {t("how-it-works.hardware.badge.text")}
              </div>
            </div>
          </div>

          <div className="mt-10 lg:mt-0">
            <div className="text-[13px] font-bold uppercase tracking-[.14em] text-primary">
              {t("how-it-works.hardware.label")}
            </div>
            <h2
              id="hardware-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              {t("how-it-works.hardware.title")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {t("how-it-works.hardware.text")}
            </p>

            <dl className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {SPECS.map(({ icon: Icon, key }) => (
                <div key={key} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-sm font-bold text-foreground">
                      {t(`how-it-works.hardware.${key}.title`)}
                    </dt>
                    <dd className="mt-0.5 text-sm leading-snug text-muted-foreground">
                      {t(`how-it-works.hardware.${key}.text`)}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="mt-8">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">{t("how-it-works.hardware.cta")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
