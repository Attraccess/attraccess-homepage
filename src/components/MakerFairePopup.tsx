import React, { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
import { MapPin, CalendarDays, ArrowRight, X } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { cn } from "@/lib/utils";

// Popup no longer shows once the fair is over (end of 16 Aug 2026).
const EVENT_END = new Date("2026-08-17T00:00:00");

export function MakerFairePopup() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Never open during the postbuild prerender/automation snapshot, otherwise
    // the opened dialog (portaled to <body>) gets baked into the static HTML and
    // then shows up a second time — in the prerender language — once React
    // renders the live popup on top. navigator.webdriver is true under the
    // headless prerender (puppeteer) and false for real visitors.
    if (typeof navigator !== "undefined" && navigator.webdriver) return;
    if (new Date() > EVENT_END) return;
    // ponytail: shows on every load — no dismissal persistence by design
    // small delay so it appears gently after the page has painted
    const timer = setTimeout(() => setOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => setOpen(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && dismiss()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
            "overflow-hidden rounded-2xl bg-gradient-to-br from-brand-blue to-[#0366c4] text-white shadow-2xl",
            "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          )}
        >
          {/* decorative glow */}
          <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.25)_0%,rgba(255,255,255,0)_70%)]" />

          <div className="relative flex flex-col items-center gap-5 px-6 py-9 text-center sm:px-8">
            <DialogPrimitive.Title className="font-display text-[clamp(21px,5vw,28px)] font-bold leading-[1.2] tracking-tight [text-wrap:balance]">
              <span aria-hidden="true">📢 </span>
              {t("banner.makerfaire.visit")}{" "}
              <span className="whitespace-nowrap underline decoration-white/40 decoration-2 underline-offset-4">
                {t("banner.makerfaire.event")}
              </span>
              !
            </DialogPrimitive.Title>

            <DialogPrimitive.Description className="flex flex-col items-center gap-2 text-[15px] font-semibold text-white/95 sm:text-base">
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                {t("banner.makerfaire.when")}
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                {t("banner.makerfaire.where")}
              </span>
            </DialogPrimitive.Description>

            <Link
              to="/contact"
              onClick={dismiss}
              className="group mt-1 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[15px] font-bold text-brand-blue shadow-lg transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue"
            >
              {t("banner.makerfaire.cta")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>

          <DialogPrimitive.Close
            aria-label={t("banner.makerfaire.close")}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <X className="h-[18px] w-[18px]" aria-hidden="true" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
