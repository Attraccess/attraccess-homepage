import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, ShieldCheck } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import seoMeta from "@/lib/seo-meta.json";
import { useI18n } from "@/contexts/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MediaSlot } from "@/components/MediaSlot";
import { TrustLogos } from "@/components/contact/TrustLogos";
import { WhatHappensNext } from "@/components/contact/WhatHappensNext";
import { PENDING_PHOTOS, PHOTOS } from "@/lib/media";

const CONTACT_EMAIL = "contact@attraccess.org";

const HERO_BADGES = [
  { key: "response", icon: Clock },
  { key: "nosales", icon: ShieldCheck },
  { key: "german", icon: MapPin },
] as const;

export function Contact() {
  useSEO(seoMeta["/contact"]);
  const { t } = useI18n();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    usecase: "",
  });

  const contactInfo = [
    {
      icon: Mail,
      title: t("contact.info.email"),
      value: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
    },
    {
      icon: MapPin,
      title: t("contact.info.address"),
      value: "Hamburg, Germany",
      href: null,
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(t("contact.email.subject"));
    const body = encodeURIComponent(t("contact.email.body", formData));

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
            {t("contact.title")}
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-white/90">
            {t("contact.subtitle")}
          </p>

          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3">
            {HERO_BADGES.map(({ key, icon: Icon }) => (
              <li
                key={key}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {t(`contact.badge.${key}`)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Form + what happens next */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* items-start: the form card must not stretch to the height of the
              taller right column and leave a block of empty space inside it. */}
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
            {/* Form */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {t("contact.form.title")}
                </CardTitle>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {t("contact.form.intro")}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">{t("contact.form.name")}</Label>
                      <Input
                        id="name"
                        placeholder={t("contact.form.name.placeholder")}
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t("contact.form.email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t("contact.form.email.placeholder")}
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="organization">
                        {t("contact.form.organization")}
                      </Label>
                      <Input
                        id="organization"
                        placeholder={t("contact.form.organization.placeholder")}
                        value={formData.organization}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">{t("contact.form.role")}</Label>
                      <Input
                        id="role"
                        placeholder={t("contact.form.role.placeholder")}
                        value={formData.role}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="usecase">{t("contact.form.usecase")}</Label>
                    <Textarea
                      id="usecase"
                      placeholder={t("contact.form.usecase.placeholder")}
                      className="min-h-[120px]"
                      value={formData.usecase}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    type="submit"
                  >
                    {t("contact.form.submit")}
                  </Button>
                  <p className="text-center text-xs leading-relaxed text-muted-foreground">
                    {t("contact.form.privacy")}
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Right column */}
            <div className="space-y-10">
              <div className="overflow-hidden rounded-2xl border border-border shadow-medium">
                <img
                  src={PHOTOS.readerOnMachine.src}
                  alt={t(PHOTOS.readerOnMachine.altKey)}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover"
                />
                <p className="bg-card px-6 py-4 text-sm font-medium leading-snug text-muted-foreground">
                  {t("contact.photo.caption")}
                </p>
              </div>

              <WhatHappensNext />

              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {t("contact.info.title")}
                </h3>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {contactInfo.map((item) => {
                    const body = (
                      <Card className="h-full shadow-soft hover-lift">
                        <CardContent className="p-6">
                          <div className="mb-2 flex items-center gap-3">
                            <item.icon
                              className="h-5 w-5 text-primary"
                              aria-hidden="true"
                            />
                            <h4 className="font-semibold text-foreground">
                              {item.title}
                            </h4>
                          </div>
                          <p className="text-muted-foreground">{item.value}</p>
                        </CardContent>
                      </Card>
                    );

                    return (
                      <div key={item.title}>
                        {item.href ? (
                          <a href={item.href} className="block h-full">
                            {body}
                          </a>
                        ) : (
                          body
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <TrustLogos className="mt-20" />
        </div>
      </section>

      {/* Who you'll be talking to */}
      <section
        className="bg-muted/40 py-20"
        aria-labelledby="contact-team-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted shadow-medium">
              <MediaSlot
                asset={PENDING_PHOTOS.team}
                className="absolute inset-0"
              />
            </div>
            <div>
              <div className="text-[13px] font-bold uppercase tracking-[.14em] text-primary">
                {t("contact.team.label")}
              </div>
              <h2
                id="contact-team-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
              >
                {t("contact.team.title")}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                {t("contact.team.text")}
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {t("contact.team.text2")}
              </p>
              <div className="mt-8">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/how-it-works">{t("contact.team.cta")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
