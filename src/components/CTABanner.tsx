import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/contexts/i18n";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTABanner() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden">
      {/* Split background */}
      <div className="absolute inset-0 flex">
        <div className="flex-1" style={{ background: "#003d5c" }} />
        <div className="flex-1" style={{ background: "hsl(var(--orange-accent))" }} />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left copy (on dark background) */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-lg max-w-md" style={{ color: "rgba(255,255,255,0.7)" }}>
              {t("cta.subtitle")}
            </p>
          </div>

          {/* Right CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
            <Link to="/contact">
              <Button
                size="lg"
                className="gap-2 font-semibold shadow-xl w-full sm:w-auto"
                style={{ background: "white", color: "#003d5c", border: "none" }}
              >
                <ArrowRight className="w-4 h-4" />
                {t("cta.primary")}
              </Button>
            </Link>
            <a
              href="https://docs.attraccess.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="gap-2 font-semibold w-full sm:w-auto"
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", color: "white" }}
              >
                <BookOpen className="w-4 h-4" />
                {t("cta.secondary")}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
