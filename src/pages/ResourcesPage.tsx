import React from 'react';
import { useI18n } from '@/contexts/i18n';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, ExternalLink, Calendar, ArrowRight } from 'lucide-react';

export function ResourcesPage() {
  const { t } = useI18n();

  const caseStudies = [
    {
      titleEn: 'Streamlining Attraktor e.V.\'s Workshop',
      titleDe: 'Optimierung des Attraktor e.V. Workshops',
      teaserEn: 'Learn how Attraccess reduced unauthorized sessions by 80% and saved 5 staff hours weekly.',
      teaserDe: 'Erfahren Sie, wie Attraccess unbefugte Sitzungen um 80% reduzierte und wöchentlich 5 Personalstunden einsparte.',
      imagePrompt: 'photo-style: makerspace with people around CNC router, warm lighting',
      location: 'Hamburg, Germany',
      date: 'March 2024',
    },
    {
      titleEn: 'How MakerLab Berlin Boosted Utilization by 50%',
      titleDe: 'Wie MakerLab Berlin die Auslastung um 50% steigerte',
      teaserEn: 'Discover how automated access control and usage tracking transformed their membership model.',
      teaserDe: 'Entdecken Sie, wie automatisierte Zugangskontrollen und Nutzungserfassung ihr Mitgliedschaftsmodell transformierten.',
      imagePrompt: 'photo-style: vibrant lab with 3D printers and users',
      location: 'Berlin, Germany',
      date: 'January 2024',
    },
  ];

  const downloads = [
    {
      titleEn: 'Feature Sheet',
      titleDe: 'Datenblatt',
      descriptionEn: 'Complete overview of all Attraccess features and capabilities',
      descriptionDe: 'Vollständige Übersicht aller Attraccess-Features und -Funktionen',
      ctaEn: 'Download our Feature Sheet',
      ctaDe: 'Datenblatt herunterladen',
      fileSize: '2.3 MB',
      format: 'PDF',
    },
    {
      titleEn: 'Security Whitepaper',
      titleDe: 'Sicherheits-Whitepaper',
      descriptionEn: 'Deep dive into our security architecture and compliance measures',
      descriptionDe: 'Tiefgehende Analyse unserer Sicherheitsarchitektur und Compliance-Maßnahmen',
      ctaEn: 'Download Security Whitepaper',
      ctaDe: 'Sicherheits-Whitepaper herunterladen',
      fileSize: '4.7 MB',
      format: 'PDF',
    },
  ];

  const blogPosts = [
    {
      titleEn: 'The Future of Shared Workspaces: Automation Trends',
      titleDe: 'Die Zukunft gemeinsamer Arbeitsplätze: Automatisierungstrends',
      date: 'March 15, 2024',
      snippetEn: 'Exploring how automation is reshaping collaborative work environments.',
      snippetDe: 'Erkunden Sie, wie Automatisierung kollaborative Arbeitsumgebungen verändert.',
      readTime: '5 min read',
    },
    {
      titleEn: 'Open Source vs. Commercial: Finding the Right Balance',
      titleDe: 'Open Source vs. Kommerziell: Das richtige Gleichgewicht finden',
      date: 'March 8, 2024',
      snippetEn: 'How we balance open source principles with sustainable business models.',
      snippetDe: 'Wie wir Open-Source-Prinzipien mit nachhaltigen Geschäftsmodellen vereinen.',
      readTime: '7 min read',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            <span lang="en">Resources & Support</span>
            <span lang="de">Ressourcen & Support</span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            <span lang="en">Case studies, downloads, and insights to help you succeed</span>
            <span lang="de">Fallstudien, Downloads und Einblicke für Ihren Erfolg</span>
          </p>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            <span lang="en">Success Stories</span>
            <span lang="de">Erfolgsgeschichten</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {caseStudies.map((study, index) => (
              <Card key={index} className="hover-lift fade-in shadow-medium">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-card rounded-t-lg flex items-center justify-center text-center p-8">
                    <div className="text-muted-foreground">
                      <div className="text-sm font-medium mb-2">Case Study Image</div>
                      <div className="text-xs opacity-75 max-w-xs">
                        {/* {study.imagePrompt} */}
                        Image: {study.imagePrompt}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-muted-foreground mb-2">
                      {study.location} • {study.date}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      <span lang="en">{study.titleEn}</span>
                      <span lang="de">{study.titleDe}</span>
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      <span lang="en">{study.teaserEn}</span>
                      <span lang="de">{study.teaserDe}</span>
                    </p>
                    <Button variant="outline" className="gap-2">
                      <span lang="en">Read Case Study</span>
                      <span lang="de">Fallstudie lesen</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            <span lang="en">Downloads</span>
            <span lang="de">Downloads</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {downloads.map((download, index) => (
              <Card key={index} className="hover-lift fade-in shadow-medium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Download className="w-6 h-6 text-primary" />
                    <div>
                      <div className="text-xl font-bold text-foreground">
                        <span lang="en">{download.titleEn}</span>
                        <span lang="de">{download.titleDe}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {download.format} • {download.fileSize}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    <span lang="en">{download.descriptionEn}</span>
                    <span lang="de">{download.descriptionDe}</span>
                  </p>
                  <Button variant="hero" className="gap-2">
                    <span lang="en">{download.ctaEn}</span>
                    <span lang="de">{download.ctaDe}</span>
                    <Download className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            <span lang="en">Latest Updates</span>
            <span lang="de">Neueste Updates</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <Card key={index} className="hover-lift fade-in shadow-medium">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    {post.date} • {post.readTime}
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    <span lang="en">{post.titleEn}</span>
                    <span lang="de">{post.titleDe}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    <span lang="en">{post.snippetEn}</span>
                    <span lang="de">{post.snippetDe}</span>
                  </p>
                  <Button variant="outline" className="gap-2">
                    <span lang="en">Read More</span>
                    <span lang="de">Mehr lesen</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}