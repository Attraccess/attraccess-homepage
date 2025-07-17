import React from 'react';
import { useI18n } from '@/contexts/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, Star, ArrowRight } from 'lucide-react';

export function PricingPage() {
  const { t } = useI18n();

  const tiers = [
    {
      nameEn: 'Non-Profit & Individual',
      nameDe: 'Non-Profit & Privat',
      price: '€0 / forever',
      featuresEn: [
        'Source-available & free',
        'Unlimited users & resources',
        'Community support',
      ],
      featuresDe: [
        'Quelloffen & kostenlos',
        'Unbegrenzte Benutzer & Ressourcen',
        'Community-Support',
      ],
      cta: null,
      popular: false,
    },
    {
      nameEn: 'Commercial Pilot',
      nameDe: 'Kommerzieller Pilot',
      price: 'Free 3-month trial',
      priceDe: '3-monatiger Gratis-Test',
      featuresEn: [
        'Onboarding support',
        'Usage metrics review',
        'Priority bug fixes',
        'Custom deployment assistance',
      ],
      featuresDe: [
        'Onboarding-Support',
        'Review der Nutzungsmetriken',
        'Prioritäre Fehlerbehebung',
        'Individuelle Bereitstellungshilfe',
      ],
      ctaEn: 'Apply for Pilot',
      ctaDe: 'Pilot beantragen',
      popular: true,
    },
    {
      nameEn: 'Enterprise (Coming Soon)',
      nameDe: 'Enterprise (Bald)',
      price: 'Contact us',
      priceDe: 'Kontaktieren Sie uns',
      featuresEn: [
        'Hybrid cloud SaaS',
        'SLA & premium support',
        'Custom integrations',
        'Advanced analytics',
      ],
      featuresDe: [
        'Hybrid-Cloud-SaaS',
        'SLA & Premium-Support',
        'Individuelle Integrationen',
        'Erweiterte Analytik',
      ],
      ctaEn: 'Contact Sales',
      ctaDe: 'Vertrieb kontaktieren',
      popular: false,
    },
  ];

  const faqItems = [
    {
      questionEn: 'When will commercial licensing be available?',
      questionDe: 'Wann werden kommerzielle Lizenzen verfügbar sein?',
      answerEn: 'We plan to launch commercial pricing in Q4 2025.',
      answerDe: 'Wir planen, kommerzielle Preise im Q4 2025 zu veröffentlichen.',
    },
    {
      questionEn: 'Is the source code really free for non-profits?',
      questionDe: 'Ist der Quellcode wirklich kostenlos für Non-Profits?',
      answerEn: 'Yes, Attraccess is completely free for non-profit organizations and individual makers.',
      answerDe: 'Ja, Attraccess ist vollständig kostenlos für Non-Profit-Organisationen und einzelne Maker.',
    },
    {
      questionEn: 'What\'s included in the commercial pilot program?',
      questionDe: 'Was ist im kommerziellen Pilotprogramm enthalten?',
      answerEn: 'Full access to all features, dedicated support, and help optimizing your deployment.',
      answerDe: 'Vollzugriff auf alle Features, dedizierter Support und Hilfe bei der Optimierung Ihrer Bereitstellung.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            <span lang="en">Flexible Pricing for Every Organization</span>
            <span lang="de">Flexible Preise für jede Organisation</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            <span lang="en">Choose the plan that fits your workspace needs</span>
            <span lang="de">Wählen Sie den Plan, der zu Ihren Arbeitsplatz-Bedürfnissen passt</span>
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
                  tier.popular ? 'border-primary shadow-large scale-105' : 'shadow-medium'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span lang="en">Most Popular</span>
                      <span lang="de">Beliebteste</span>
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-bold text-foreground mb-2">
                    <span lang="en">{tier.nameEn}</span>
                    <span lang="de">{tier.nameDe}</span>
                  </CardTitle>
                  <div className="text-3xl font-bold text-foreground mb-4">
                    <span lang="en">{tier.price}</span>
                    <span lang="de">{tier.priceDe || tier.price}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    <span lang="en">
                      {tier.featuresEn.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </span>
                    <span lang="de">
                      {tier.featuresDe.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </span>
                  </ul>
                  
                  {(tier.ctaEn || tier.ctaDe) && (
                    <Button 
                      className="w-full mt-6" 
                      variant={tier.popular ? "hero" : "outline"}
                      size="lg"
                    >
                      <span lang="en">{tier.ctaEn}</span>
                      <span lang="de">{tier.ctaDe}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-center text-foreground mb-12">
              <span lang="en">Frequently Asked Questions</span>
              <span lang="de">Häufig gestellte Fragen</span>
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <span lang="en">{item.questionEn}</span>
                    <span lang="de">{item.questionDe}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <span lang="en">{item.answerEn}</span>
                    <span lang="de">{item.answerDe}</span>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}