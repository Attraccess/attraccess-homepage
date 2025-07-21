import React, { useState } from "react";
import { useI18n } from "@/contexts/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export function Contact() {
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

    const subject = encodeURIComponent("Inquiry about AttrAccess");
    const body = encodeURIComponent(`Hello,

I'm interested in learning more about AttrAccess. Here are my details:

Name: ${formData.name}
Email: ${formData.email}
Organization: ${formData.organization}
Role: ${formData.role}

Use Case:
${formData.usecase}

Best regards,
${formData.name}`);

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
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t("contact.form.email")}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
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
                        placeholder="Your organization"
                        value={formData.organization}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">{t("contact.form.role")}</Label>
                      <Input
                        id="role"
                        placeholder="Your role"
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
