import React from 'react';
import { useI18n } from '@/contexts/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MapPin, Calendar, Users } from 'lucide-react';

export function AboutPage() {
  const { t } = useI18n();

  const team = [
    {
      name: 'Alex Müller',
      titleEn: 'Co-Founder & CTO',
      titleDe: 'Mitgründer & CTO',
      bioEn: 'Alex leads engineering and open-source community engagement.',
      bioDe: 'Alex leitet die Entwicklung und das Open-Source-Community-Engagement.',
      imagePrompt: 'photorealistic headshot, friendly expression, tech background',
    },
    {
      name: 'Sarah Chen',
      titleEn: 'Co-Founder & CEO',
      titleDe: 'Mitgründerin & CEO',
      bioEn: 'Sarah drives product strategy and business development.',
      bioDe: 'Sarah treibt die Produktstrategie und Geschäftsentwicklung voran.',
      imagePrompt: 'photorealistic headshot, confident smile, office environment',
    },
    {
      name: 'Marcus Weber',
      titleEn: 'Lead Hardware Engineer',
      titleDe: 'Leitender Hardware-Ingenieur',
      bioEn: 'Marcus designs our NFC readers and IoT integration systems.',
      bioDe: 'Marcus entwirft unsere NFC-Leser und IoT-Integrationssysteme.',
      imagePrompt: 'photorealistic headshot, focused expression, electronics in background',
    },
  ];

  const timeline = [
    {
      year: '2023',
      titleEn: 'Project inception in Hamburg makerspace',
      titleDe: 'Projektbeginn im Hamburger Makerspace',
      descriptionEn: 'Founded by frustrated makerspace managers who needed better access control.',
      descriptionDe: 'Gegründet von frustrierten Makerspace-Managern, die bessere Zugangskontrollen benötigten.',
    },
    {
      year: '2024',
      titleEn: 'First public release & 5 pilot sites',
      titleDe: 'Erste öffentliche Veröffentlichung & 5 Pilotstandorte',
      descriptionEn: 'Open-sourced the platform and onboarded our first community deployments.',
      descriptionDe: 'Plattform als Open Source veröffentlicht und erste Community-Implementierungen gestartet.',
    },
    {
      year: '2025',
      titleEn: 'Roadmap: cloud SaaS & advanced analytics',
      titleDe: 'Roadmap: Cloud-SaaS & erweiterte Analytik',
      descriptionEn: 'Launching commercial cloud offerings and AI-powered workspace insights.',
      descriptionDe: 'Start kommerzieller Cloud-Angebote und KI-gestützter Arbeitsplatz-Einblicke.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:60px_60px] opacity-20" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            <span lang="en">About Attraccess</span>
            <span lang="de">Über Attraccess</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            <span lang="en">Empowering shared workspaces with enterprise-grade control—without complexity.</span>
            <span lang="de">Wir ermöglichen Gemeinschaftsarbeitsplätze mit Unternehmens-Kontrolle – ohne Komplexität.</span>
          </p>
          <div className="text-center text-white/80 text-sm">
            {/* Background image prompt: "subdued circuit-pattern overlay on workshop photo" */}
            <p className="opacity-50">Background: subdued circuit-pattern overlay on workshop photo</p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              <span lang="en">Our Mission</span>
              <span lang="de">Unsere Mission</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              <span lang="en">We believe that shared workspaces should be accessible, secure, and efficiently managed. Our open-source platform removes the barriers between makers and their tools, while providing operators with the insights they need to build thriving communities.</span>
              <span lang="de">Wir glauben, dass gemeinsame Arbeitsplätze zugänglich, sicher und effizient verwaltet werden sollten. Unsere Open-Source-Plattform beseitigt die Barrieren zwischen Makern und ihren Werkzeugen und bietet Betreibern die Einblicke, die sie für den Aufbau florierender Gemeinschaften benötigen.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            <span lang="en">Our Team</span>
            <span lang="de">Unser Team</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="hover-lift fade-in shadow-medium text-center">
                <CardContent className="p-8">
                  <div className="w-32 h-32 bg-gradient-card rounded-full mx-auto mb-6 flex items-center justify-center">
                    <div className="text-muted-foreground text-center">
                      <div className="text-xs font-medium mb-1">Avatar</div>
                      <div className="text-xs opacity-75">{member.name}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3">
                    <span lang="en">{member.titleEn}</span>
                    <span lang="de">{member.titleDe}</span>
                  </p>
                  <p className="text-muted-foreground">
                    <span lang="en">{member.bioEn}</span>
                    <span lang="de">{member.bioDe}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            <span lang="en">Our Journey</span>
            <span lang="de">Unsere Reise</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-6 fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                    {item.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      <span lang="en">{item.titleEn}</span>
                      <span lang="de">{item.titleDe}</span>
                    </h3>
                    <p className="text-muted-foreground">
                      <span lang="en">{item.descriptionEn}</span>
                      <span lang="de">{item.descriptionDe}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              <span lang="en">Join Our Team</span>
              <span lang="de">Werden Sie Teil unseres Teams</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              <span lang="en">Join us on our open-source journey to transform shared workspaces worldwide.</span>
              <span lang="de">Begleiten Sie uns auf unserer Open-Source-Reise zur Transformation gemeinsamer Arbeitsplätze weltweit.</span>
            </p>
            <Button variant="hero" size="lg" className="gap-2">
              <span lang="en">View Open Positions</span>
              <span lang="de">Offene Stellen ansehen</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}