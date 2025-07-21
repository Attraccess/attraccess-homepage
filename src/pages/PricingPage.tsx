import React from "react";
import { useI18n } from "@/contexts/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function PricingPage() {
  const { t } = useI18n();

  const tiers = [
    {
      name: t("pricing.nonprofit.title"),
      price: t("pricing.nonprofit.price"),
      features: [
        t("pricing.nonprofit.feature1"),
        t("pricing.nonprofit.feature2"),
        t("pricing.nonprofit.feature3"),
      ],
      cta: null,
      popular: false,
    },
    {
      name: t("pricing.pilot.title"),
      price: t("pricing.pilot.price"),
      features: [
        t("pricing.pilot.feature1"),
        t("pricing.pilot.feature2"),
        t("pricing.pilot.feature3"),
        t("pricing.pilot.feature4"),
      ],
      cta: t("pricing.pilot.cta"),
      popular: true,
      ctaLink: "/contact",
    },
    {
      name: t("pricing.enterprise.title"),
      price: t("pricing.contact-sales"),
      features: [
        t("pricing.enterprise.feature1"),
        t("pricing.enterprise.feature2"),
        t("pricing.enterprise.feature3"),
        t("pricing.enterprise.feature4"),
      ],
      cta: t("pricing.contact-sales"),
      popular: false,
      ctaLink: "/contact",
    },
  ];

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

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {tiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative hover-lift fade-in ${
                  tier.popular
                    ? "border-primary shadow-large scale-105"
                    : "shadow-medium"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {t("pricing.popular")}
                    </div>
                  </div>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold text-foreground mb-2">
                    {tier.name}
                  </CardTitle>
                  <div className="text-3xl font-bold text-foreground mb-4">
                    {tier.price}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {tier.cta && (
                    <Link to={tier.ctaLink || "/contact"}>
                      <Button
                        className="w-full mt-6"
                        variant={tier.popular ? "hero" : "outline"}
                        size="lg"
                      >
                        {tier.cta}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
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
