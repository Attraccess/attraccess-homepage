import React from "react";
import { useSEO } from "@/hooks/use-seo";
import seoMeta from "@/lib/seo-meta.json";
import { useI18n } from "@/contexts/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Hand, Zap, BarChart, Wrench } from "lucide-react";

export function HowItWorksPage() {
  useSEO(seoMeta["/how-it-works"]);
  const { t } = useI18n();

  const steps = [
    {
      id: 1,
      icon: Plus,
      title: t("how-it-works.step1.title"),
      description: t("how-it-works.step1.description"),
      image: "/how-it-works/define-resource.webp",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      icon: Hand,
      title: t("how-it-works.step2.title"),
      description: t("how-it-works.step2.description"),
      image: "/how-it-works/assign-access.webp",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 3,
      icon: Zap,
      title: t("how-it-works.step3.title"),
      description: t("how-it-works.step3.description"),
      image: "/how-it-works/deploy-use.webp",
      color: "from-orange-500 to-red-500",
    },
    {
      id: 4,
      icon: BarChart,
      title: t("how-it-works.step4.title"),
      description: t("how-it-works.step4.description"),
      image: "/how-it-works/track-automate.webp",
      color: "from-purple-500 to-indigo-500",
    },
    {
      id: 5,
      icon: Wrench,
      title: t("how-it-works.step5.title"),
      description: t("how-it-works.step5.description"),
      image: "/how-it-works/maintain-scale.webp",
      color: "from-pink-500 to-rose-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t("how-it-works.title")}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {t("how-it-works.subtitle")}
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div
                  className={`fade-in ${index % 2 === 1 ? "lg:order-2" : ""}`}
                >
                  <div className="flex items-center mb-6">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-lg mr-4`}
                    >
                      {step.id}
                    </div>
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${step.color} flex items-center justify-center mr-4`}
                    >
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Image */}
                <div
                  className={`slide-up ${index % 2 === 1 ? "lg:order-1" : ""}`}
                >
                  <Card className="overflow-hidden shadow-medium hover:shadow-large transition-shadow duration-300">
                    <CardContent className="p-8">
                      <div className="aspect-video bg-gradient-card rounded-lg overflow-hidden">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
