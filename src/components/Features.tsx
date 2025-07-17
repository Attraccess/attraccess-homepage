import React from 'react';
import { useI18n } from '@/contexts/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, BarChart, Settings, Workflow, Lock, ArrowRight } from 'lucide-react';

export function Features() {
  const { t } = useI18n();

  const features = [
    {
      icon: Shield,
      title: t('features.access.title'),
      description: t('features.access.description'),
      imagePrompt: '3-panel mockup: NFC reader in action, QR code scan screen, PWA permissions list UI',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: BarChart,
      title: t('features.tracking.title'),
      description: t('features.tracking.description'),
      imagePrompt: 'Screenshot style: usage log table with user, time, notes; graph widget',
      gradient: 'from-green-500 to-teal-500',
    },
    {
      icon: Settings,
      title: t('features.maintenance.title'),
      description: t('features.maintenance.description'),
      imagePrompt: 'Flowchart: usage hours → maintenance trigger → auto-lock → notifier email',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Workflow,
      title: t('features.flows.title'),
      description: t('features.flows.description'),
      imagePrompt: 'Screenshot: node-based editor with MQTT, webhook, email nodes connected',
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Lock,
      title: t('features.security.title'),
      description: t('features.security.description'),
      imagePrompt: 'Diagram: on-prem server container, cloud icon forthcoming, NFC reader receiving OTA update',
      gradient: 'from-gray-500 to-slate-500',
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('features.title')}
          </h2>
        </div>
        
        <div className="space-y-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className={`fade-in ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="flex items-center mb-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mr-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  {feature.description}
                </p>
              </div>

              {/* Image */}
              <div className={`slide-up ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <Card className="overflow-hidden shadow-medium hover:shadow-large transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="aspect-video bg-gradient-card rounded-lg flex items-center justify-center text-center">
                      <div className="text-muted-foreground">
                        <div className="text-sm font-medium mb-2">Feature Image</div>
                        <div className="text-xs opacity-75 max-w-xs">
                          {/* {feature.imagePrompt} */}
                          Image: {feature.imagePrompt}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Button variant="hero" size="lg" className="gap-2">
            {t('features.cta')}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}