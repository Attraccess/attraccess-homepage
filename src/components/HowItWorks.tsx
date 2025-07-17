import React from 'react';
import { useI18n } from '@/contexts/i18n';
import { Button } from '@/components/ui/button';
import { Plus, Users, Zap, BarChart, Wrench } from 'lucide-react';

export function HowItWorks() {
  const { t } = useI18n();

  const steps = [
    {
      icon: Plus,
      title: t('how-it-works.step1.title'),
      description: t('how-it-works.step1.description'),
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: Users,
      title: t('how-it-works.step2.title'),
      description: t('how-it-works.step2.description'),
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: Zap,
      title: t('how-it-works.step3.title'),
      description: t('how-it-works.step3.description'),
      color: 'text-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      icon: BarChart,
      title: t('how-it-works.step4.title'),
      description: t('how-it-works.step4.description'),
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: Wrench,
      title: t('how-it-works.step5.title'),
      description: t('how-it-works.step5.description'),
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('how-it-works.title')}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative text-center group hover-lift fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                {index + 1}
              </div>
              
              {/* Card */}
              <div className="bg-card rounded-lg p-6 shadow-soft group-hover:shadow-medium transition-shadow duration-300 h-full">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${step.bgColor} mb-4`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              
              {/* Connector Line (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent z-0" />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            {t('how-it-works.cta')}
          </Button>
        </div>
      </div>
    </section>
  );
}