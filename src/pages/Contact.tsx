import React from 'react';
import { useI18n } from '@/contexts/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export function Contact() {
  const { t } = useI18n();

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'hello@attraccess.com',
      href: 'mailto:hello@attraccess.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+49 40 123 456 789',
      href: 'tel:+4940123456789',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'Hamburg, Germany',
      href: '#',
    },
    {
      icon: Clock,
      title: 'Hours',
      value: 'Mon-Fri 9:00-17:00 CET',
      href: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('contact.form.name')}</Label>
                    <Input id="name" placeholder="Your name" />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('contact.form.email')}</Label>
                    <Input id="email" type="email" placeholder="you@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organization">{t('contact.form.organization')}</Label>
                    <Input id="organization" placeholder="Your organization" />
                  </div>
                  <div>
                    <Label htmlFor="role">{t('contact.form.role')}</Label>
                    <Input id="role" placeholder="Your role" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="usecase">{t('contact.form.usecase')}</Label>
                  <Textarea 
                    id="usecase" 
                    placeholder={t('contact.form.usecase.placeholder')}
                    className="min-h-[120px]"
                  />
                </div>
                <Button variant="hero" size="lg" className="w-full">
                  {t('contact.form.submit')}
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contactInfo.map((item, index) => (
                    <Card key={index} className="shadow-soft hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <item.icon className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold text-foreground">{item.title}</h4>
                        </div>
                        <p className="text-muted-foreground">{item.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Calendar Widget Placeholder */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">
                    Schedule a Demo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground text-center">
                      Calendar Widget<br />
                      <span className="text-sm">Book a 30-minute demo call</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}