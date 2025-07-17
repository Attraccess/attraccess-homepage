import React from 'react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/i18n';
import { ArrowRight, Play } from 'lucide-react';

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 sm:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:60px_60px] opacity-20" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="cta" size="lg" className="gap-2">
                {t('hero.cta.primary')}
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline-white" size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                {t('hero.cta.secondary')}
              </Button>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative slide-up">
            <div className="relative">
              {/* Generated image placeholder */}
              <div className="aspect-video bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 p-8 flex items-center justify-center">
                <div className="text-center text-white">
                  {/* Image prompt: "Flat-vector: makerspace with NFC tap icon, PWA dashboard, flowchart arrows" */}
                  <p className="text-sm opacity-75 mb-4">Hero Image Placeholder</p>
                  <p className="text-xs opacity-50">Flat-vector: makerspace with NFC tap icon, PWA dashboard, flowchart arrows</p>
                </div>
              </div>
              
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