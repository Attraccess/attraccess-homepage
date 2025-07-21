import React from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 sm:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:60px_60px] opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left fade-in z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/contact">
                <Button variant="cta" size="lg" className="gap-2">
                  {t("hero.cta.primary")}
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/features">
                <Button variant="outline-white" size="lg" className="gap-2">
                  <Play className="w-5 h-5" />
                  {t("hero.cta.secondary")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative slide-up">
            <div className="relative">
              <img
                src="/hero/overview.jpg"
                alt="AttracCess Platform Overview"
                className="w-full rounded-lg shadow-lg object-contain"
              />

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center shadow-large">
                <div className="w-6 h-6 bg-white rounded-full" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
