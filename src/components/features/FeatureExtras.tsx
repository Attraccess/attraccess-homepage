import React from "react";
import {
  Bell,
  Building2,
  Clock,
  Download,
  Globe,
  KeyRound,
  QrCode,
  Radio,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const EXTRAS: readonly { key: string; icon: LucideIcon }[] = [
  { key: "sso", icon: KeyRound },
  { key: "pwa", icon: Smartphone },
  { key: "qr", icon: QrCode },
  { key: "mqtt", icon: Radio },
  { key: "notifications", icon: Bell },
  { key: "export", icon: Download },
  { key: "multitenant", icon: Building2 },
  { key: "i18n", icon: Globe },
  { key: "audit", icon: Clock },
] as const;

const FAQ_KEYS = [
  "hardware",
  "offline",
  "migrate",
  "license",
  "scale",
] as const;

/** Smaller capabilities that do not warrant their own section, plus an FAQ. */
export function FeatureExtras() {
  const { t } = useI18n();

  return (
    <>
      <section className="bg-muted/40 py-20" aria-labelledby="extras-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id="extras-heading"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              {t("features.extras.title")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {t("features.extras.subtitle")}
            </p>
          </div>

          <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {EXTRAS.map(({ key, icon: Icon }) => (
              <li
                key={key}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-soft"
              >
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    {t(`features.extras.${key}.title`)}
                  </h3>
                  <p className="mt-1 text-sm leading-snug text-muted-foreground">
                    {t(`features.extras.${key}.text`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20" aria-labelledby="features-faq-heading">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2
              id="features-faq-heading"
              className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
              {t("features.faq.title")}
            </h2>

            <Accordion type="single" collapsible className="mt-10">
              {FAQ_KEYS.map((key) => (
                <AccordionItem key={key} value={key}>
                  <AccordionTrigger className="text-left text-base font-semibold">
                    {t(`features.faq.${key}.question`)}
                  </AccordionTrigger>
                  <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                    {t(`features.faq.${key}.answer`)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  );
}
