import React, { useState } from "react";
import { useSEO } from "@/hooks/use-seo";
import seoMeta from "@/lib/seo-meta.json";
import { useI18n } from "@/contexts/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";

export function Contact() {
  useSEO(seoMeta["/contact"]);
  const { t } = useI18n();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: Mail,
      title: t("contact.info.email"),
      value: "contact@attraccess.org",
      href: "mailto:contact@attraccess.org",
    },
    {
      icon: MapPin,
      title: t("contact.info.address"),
      value: "Hamburg, Germany",
      href: "#",
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
    trackEvent("contact-submit");

    const subject = encodeURIComponent(t("contact.email.subject"));
    const body = encodeURIComponent(
      t("contact.email.body").replace(/\{(\w+)\}/g, (_, key) =>
        key in formData ? formData[key as keyof typeof formData] : ""
      )
    );

    window.location.href = `mailto:contact@attraccess.org?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            {t("contact.title")}
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {t("contact.subtitle")}
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
                  {t("contact.form.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <Label htmlFor="message">{t("contact.form.message")}</Label>
                    <Textarea
                      id="message"
                      placeholder={t("contact.form.message.placeholder")}
                      className="min-h-[120px]"
                      value={formData.message}
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
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  {t("contact.info.title")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contactInfo.map((item, index) => (
                    <Link to={item.href} key={index}>
                      <Card className="shadow-soft hover-lift">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3 mb-2">
                            <item.icon className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold text-foreground">
                              {item.title}
                            </h4>
                          </div>
                          <p className="text-muted-foreground">{item.value}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
