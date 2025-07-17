import React from 'react';
import { Hero } from '@/components/Hero';
import { Problems } from '@/components/Problems';
import { Benefits } from '@/components/Benefits';
import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { PricingSection } from '@/components/PricingSection';

export function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Problems />
      <Benefits />
      <Features />
      <HowItWorks />
      <PricingSection />
    </div>
  );
}