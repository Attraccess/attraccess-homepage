import React from "react";
import { useI18n } from "@/contexts/i18n";
import { proofChips } from "@/components/home/proof-chips";

export function ProofMarquee() {
  const { t } = useI18n();
  const doubled = [...proofChips, ...proofChips];

  return (
    <section className="overflow-hidden border-b border-muted bg-background py-8">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-28 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[2] w-28 bg-gradient-to-l from-background to-transparent" />
        <div className="flex w-max gap-3.5 animate-marquee motion-reduce:animate-none">
          {doubled.map(({ icon: Icon, key }, i) => (
            <span
              key={`${key}-${i}`}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-muted px-5 py-2.5 text-sm font-bold text-foreground"
            >
              <Icon className="h-[17px] w-[17px] text-primary" />
              {t(key)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
