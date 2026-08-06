import React from "react";
import { Mail, Send } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { Reveal } from "@/components/home/Reveal";
import { trackEvent } from "@/lib/analytics";

const LISTS = [
  { id: "d21f9", lang: "de", value: "d21f9904-1a25-4ad7-8e7b-24379133163f", label: "Deutsch" },
  { id: "9764f", lang: "en", value: "9764fb4c-fddd-43eb-9eaf-5c7c3265940e", label: "English" },
  { id: "c0ffd", lang: "fr", value: "c0ffd276-036b-4e65-86dc-900ad6223727", label: "Français" },
  { id: "c97de", lang: "nl", value: "c97dec8d-cc33-4cac-8ad4-8a65fc159800", label: "Nederlands" },
];

export function NewsletterSection() {
  const { t, language } = useI18n();

  return (
    <section id="newsletter" className="bg-background px-6 py-28 sm:px-8">
      <Reveal className="mx-auto max-w-[860px] rounded-3xl border border-border bg-card p-10 shadow-[0_6px_16px_rgba(24,25,26,.07)] sm:p-14">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
            <Mail className="h-[26px] w-[26px] text-primary" />
          </span>
          <h2 className="font-display text-[clamp(28px,3.2vw,40px)] font-bold tracking-tight text-foreground">
            {t("home.newsletter.title")}
          </h2>
        </div>
        <p className="mt-4 text-[17px] font-medium leading-relaxed text-foreground/75 [text-wrap:pretty]">
          {t("home.newsletter.text")}
        </p>

        <form
          method="post"
          action="https://listmonk.attraccess.org/subscription/form"
          className="mt-8"
          onSubmit={() => trackEvent("newsletter-subscribe")}
        >
          {/* honeypot — listmonk discards submissions that fill this */}
          <input type="hidden" name="nonce" />

          <div className="grid gap-3.5 sm:grid-cols-2">
            <label className="block">
              <span className="sr-only">{t("home.newsletter.email")}</span>
              <input
                type="email"
                name="email"
                required
                placeholder={t("home.newsletter.email")}
                className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base font-medium text-foreground outline-none transition-colors placeholder:text-foreground/45 focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="sr-only">{t("home.newsletter.name")}</span>
              <input
                type="text"
                name="name"
                placeholder={t("home.newsletter.name")}
                className="w-full rounded-xl border border-border bg-background px-4 py-3.5 text-base font-medium text-foreground outline-none transition-colors placeholder:text-foreground/45 focus:border-primary"
              />
            </label>
          </div>

          <fieldset className="mt-6">
            <legend className="text-[13px] font-bold uppercase tracking-[.14em] text-foreground/55">
              {t("home.newsletter.lists")}
            </legend>
            <div className="mt-3.5 flex flex-wrap gap-x-6 gap-y-3">
              {LISTS.map((list) => (
                <label key={list.id} htmlFor={list.id} className="flex items-center gap-2.5 text-base font-medium text-foreground/80">
                  <input
                    id={list.id}
                    // remount so defaultChecked re-applies when the language is detected
                    key={language}
                    type="checkbox"
                    name="l"
                    value={list.value}
                    defaultChecked={list.lang === language}
                    className="h-[18px] w-[18px] rounded border-border text-primary accent-primary"
                  />
                  {list.label}
                </label>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-base font-bold text-primary-foreground shadow-[0_10px_28px_rgba(5,132,247,.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(5,132,247,.45)]"
          >
            {t("home.newsletter.submit")}
            <Send className="h-[19px] w-[19px]" />
          </button>
          <p className="mt-4 text-sm font-medium text-foreground/55">{t("home.newsletter.note")}</p>
        </form>
      </Reveal>
    </section>
  );
}
