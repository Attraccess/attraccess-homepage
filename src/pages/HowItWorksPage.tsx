import React from 'react';
import { useI18n } from '@/contexts/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Hand, Zap, BarChart, Wrench, ArrowRight } from 'lucide-react';

export function HowItWorksPage() {
  const { t } = useI18n();

  const steps = [
    {
      id: 1,
      icon: Plus,
      titleEn: 'Define Resources',
      titleDe: 'Ressourcen definieren',
      descriptionEn: 'Create machines, doors, and tools in the PWA. Add name, description, image, and docs link.',
      descriptionDe: 'Erstellen Sie Maschinen, Türen und Werkzeuge in der PWA. Fügen Sie Name, Beschreibung, Bild und Dokumentationslink hinzu.',
      imagePrompt: 'flat vector: card labeled Resource with plus sign',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      icon: Hand,
      titleEn: 'Assign Access',
      titleDe: 'Zugriffe zuweisen',
      descriptionEn: 'Grant \'introduced\' or \'isIntroducer\' permissions via PWA, NFC, or OIDC in seconds.',
      descriptionDe: 'Weisen Sie \'introduced\'- oder \'isIntroducer\'-Berechtigungen in Sekunden per PWA, NFC oder OIDC zu.',
      imagePrompt: 'vector: hand holding NFC card next to machine',
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 3,
      icon: Zap,
      titleEn: 'Deploy & Use',
      titleDe: 'Ausrollen & Nutzen',
      descriptionEn: 'Install our NFC readers, print QR labels, or share PWA links. Users tap, scan, or click to start sessions.',
      descriptionDe: 'Installieren Sie unsere NFC-Leser, drucken Sie QR-Etiketten oder teilen Sie PWA-Links. Nutzer tippen, scannen oder klicken, um Sitzungen zu starten.',
      imagePrompt: 'flat illustration: NFC reader on wall and QR code on sticker',
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 4,
      icon: BarChart,
      titleEn: 'Track & Automate',
      titleDe: 'Verfolgen & Automatisieren',
      descriptionEn: 'Monitor live usage, export CSV logs, and trigger automations like ventilation or email alerts.',
      descriptionDe: 'Überwachen Sie Live-Nutzungen, exportieren Sie CSV-Protokolle und lösen Sie Automatisierungen wie Belüftung oder E-Mail-Benachrichtigungen aus.',
      imagePrompt: 'vector: chart with upward trend and gear icon',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      id: 5,
      icon: Wrench,
      titleEn: 'Maintain & Scale',
      titleDe: 'Warten & Skalieren',
      descriptionEn: 'Define maintenance rules, auto-disable resources, notify technicians, and deploy OTA updates.',
      descriptionDe: 'Legen Sie Wartungsregeln fest, sperren Sie Ressourcen automatisch, benachrichtigen Sie Techniker und verteilen Sie OTA-Updates.',
      imagePrompt: 'vector: wrench and shield with checkmark',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            <span lang="en">Simple Setup, Powerful Results</span>
            <span lang="de">Einfache Einrichtung, Starke Ergebnisse</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            <span lang="en">Get your workspace automation running in 5 simple steps</span>
            <span lang="de">Bringen Sie Ihre Arbeitsplatz-Automatisierung in 5 einfachen Schritten zum Laufen</span>
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className={`fade-in ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center mb-6">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-lg mr-4`}>
                      {step.id}
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${step.color} flex items-center justify-center mr-4`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      <span lang="en">{step.titleEn}</span>
                      <span lang="de">{step.titleDe}</span>
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    <span lang="en">{step.descriptionEn}</span>
                    <span lang="de">{step.descriptionDe}</span>
                  </p>
                </div>

                {/* Image */}
                <div className={`slide-up ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <Card className="overflow-hidden shadow-medium hover:shadow-large transition-shadow duration-300">
                    <CardContent className="p-8">
                      <div className="aspect-video bg-gradient-card rounded-lg flex items-center justify-center text-center">
                        <div className="text-muted-foreground">
                          <div className="text-sm font-medium mb-2">Step {step.id} Visual</div>
                          <div className="text-xs opacity-75 max-w-xs">
                            {/* {step.imagePrompt} */}
                            Image: {step.imagePrompt}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20">
            <div className="bg-gradient-card rounded-lg p-8 shadow-medium">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                <span lang="en">Ready to get started?</span>
                <span lang="de">Bereit anzufangen?</span>
              </h3>
              <p className="text-muted-foreground mb-6">
                <span lang="en">Our engineers are here to help you set up your perfect workspace automation.</span>
                <span lang="de">Unsere Ingenieure helfen Ihnen dabei, Ihre perfekte Arbeitsplatz-Automatisierung einzurichten.</span>
              </p>
              <Button variant="hero" size="lg" className="gap-2">
                <span lang="en">Speak to an Engineer</span>
                <span lang="de">Mit einem Ingenieur sprechen</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}