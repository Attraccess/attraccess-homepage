import React from 'react';
import { useI18n } from '@/contexts/i18n';
import { Zap, DollarSign, Shield, Workflow } from 'lucide-react';

export function Benefits() {
  const { t } = useI18n();

  const benefits = [
    {
      icon: Zap,
      title: t('benefits.access.title'),
      description: t('benefits.access.description'),
      color: 'text-orange-accent',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      icon: DollarSign,
      title: t('benefits.revenue.title'),
      description: t('benefits.revenue.description'),
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: Shield,
      title: t('benefits.maintenance.title'),
      description: t('benefits.maintenance.description'),
      color: 'text-tech-blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: Workflow,
      title: t('benefits.automation.title'),
      description: t('benefits.automation.description'),
      color: 'text-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('benefits.title')}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="text-center group hover-lift fade-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${benefit.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}