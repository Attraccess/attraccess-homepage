import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, AtSign } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { Reveal } from "@/components/home/Reveal";

export function CtaSection() {
  const { t } = useI18n();

  return (
    <section id="cta" className="relative overflow-hidden bg-brand-ink px-6 py-28 sm:px-8">
      <div className="pointer-events-none absolute -top-56 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(5,132,247,.22)_0%,rgba(5,132,247,0)_68%)]" />
      <div className="relative mx-auto max-w-[760px]">
        <Reveal>
          <img src="/design/lockup-dark.png" alt="Attraccess" className="block h-[30px] w-auto" />
          <h2 className="mt-6 font-display text-[clamp(36px,4.5vw,58px)] font-bold leading-[1.05] tracking-tight text-white">
            {t("home.cta.title.line1")}
            <br />
            {t("home.cta.title.line2")}
          </h2>
          <p className="mt-4 max-w-[480px] text-lg font-medium leading-relaxed text-white/75 [text-wrap:pretty]">
            {t("home.cta.text")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3.5">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-bold text-primary-foreground shadow-[0_10px_28px_rgba(5,132,247,.45)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(5,132,247,.55)]"
            >
              {t("home.cta.primary")}
              <ArrowRight className="h-[19px] w-[19px]" />
            </Link>
            <a
              href="mailto:contact@attraccess.org"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[.08] px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-white/[.14]"
            >
              <AtSign className="h-[19px] w-[19px]" />
              contact@attraccess.org
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
