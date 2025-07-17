import React from 'react';
import { useI18n } from '@/contexts/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Star, ArrowRight } from 'lucide-react';

export function PricingSection() {
  const { t } = useI18n();

  const tiers = [
    {
      name: t('pricing.nonprofit.title'),
      price: t('pricing.nonprofit.price'),
      features: [
        t('pricing.nonprofit.feature1'),
        t('pricing.nonprofit.feature2'),
        t('pricing.nonprofit.feature3'),
      ],
      cta: null,
      popular: false,
    },
    {
      name: t('pricing.pilot.title'),
      price: t('pricing.pilot.price'),
      features: [
        t('pricing.pilot.feature1'),
        t('pricing.pilot.feature2'),
      ],
      cta: t('pricing.pilot.cta'),
      popular: true,
    },
    {
      name: t('pricing.enterprise.title'),
      price: 'Contact us',
      features: [
        t('pricing.enterprise.feature1'),
        t('pricing.enterprise.feature2'),
        t('pricing.enterprise.feature3'),
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('pricing.title')}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <Card 
              key={index} 
              className={`relative hover-lift fade-in ${
                tier.popular ? 'border-primary shadow-large' : 'shadow-medium'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Popular
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
                  <Button 
                    className="w-full mt-6" 
                    variant={tier.popular ? "hero" : "outline"}
                    size="lg"
                  >
                    {tier.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* FAQ Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-foreground mb-12">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Is the source code really free?
                </h4>
                <p className="text-muted-foreground">
                  Yes, Attraccess is source-available and free for non-profit and individual use.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  What's included in the commercial pilot?
                </h4>
                <p className="text-muted-foreground">
                  Full access to all features, dedicated onboarding support, and usage metrics analysis.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  When will enterprise features be available?
                </h4>
                <p className="text-muted-foreground">
                  Enterprise features including hybrid cloud SaaS are coming in Q2 2024.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">
                  Can I upgrade or downgrade anytime?
                </h4>
                <p className="text-muted-foreground">
                  Yes, you can change your plan at any time. We'll help you migrate your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}