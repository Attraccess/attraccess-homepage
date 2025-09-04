import React from "react";
import { useI18n } from "@/contexts/i18n";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ModernPricingSection } from "@/components/ModernPricingSection";

export function PricingPage() {
  const { t } = useI18n();

  const faqItems = [
    {
      question: t("pricing.faq.q1"),
      answer: t("pricing.faq.a1"),
    },
    {
      question: t("pricing.faq.q2"),
      answer: t("pricing.faq.a2"),
    },
    {
      question: t("pricing.faq.q3"),
      answer: t("pricing.faq.a3"),
    },
    {
      question: t("pricing.faq.q4"),
      answer: t("pricing.faq.a4"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t("pricing.title")}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {t("pricing.subtitle")}
          </p>
        </div>
      </section>

      {/* Modern Pricing Section */}
      <ModernPricingSection />

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-foreground mb-12">
              {t("pricing.faq.title")}
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
