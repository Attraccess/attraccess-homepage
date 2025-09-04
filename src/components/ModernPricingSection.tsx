import React, { useState } from "react";
import { useI18n } from "@/contexts/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, X, Info, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function ModernPricingSection() {
  const { t } = useI18n();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      id: "community",
      name: t("pricing.community.title"),
      maxUsers: 50,
      maxResources: 20,
      features: {
        sso: false,
        maintenance: false,
        billing: false,
        nfc: false,
      },
      support: "basic",
      monthlyPrice: 90,
      yearlyPrice: 900,
      popular: false,
      cta: t("pricing.get-started"),
    },
    {
      id: "standard",
      name: t("pricing.standard.title"),
      maxUsers: 150,
      maxResources: 50,
      features: {
        sso: true,
        maintenance: true,
        billing: false,
        nfc: false,
      },
      support: "standard",
      monthlyPrice: 350,
      yearlyPrice: 3500,
      popular: true,
      cta: t("pricing.get-started"),
    },
    {
      id: "small-business",
      name: t("pricing.small-business.title"),
      maxUsers: 250,
      maxResources: 75,
      features: {
        sso: true,
        maintenance: true,
        billing: true,
        nfc: false,
      },
      support: "priority",
      monthlyPrice: 950,
      yearlyPrice: 9500,
      popular: false,
      cta: t("pricing.get-started"),
    },
    {
      id: "business",
      name: t("pricing.business.title"),
      maxUsers: 500,
      maxResources: 100,
      features: {
        sso: true,
        maintenance: true,
        billing: true,
        nfc: true,
      },
      support: "priority",
      monthlyPrice: 2000,
      yearlyPrice: 20000,
      popular: false,
      cta: t("pricing.get-started"),
    },
    {
      id: "enterprise",
      name: t("pricing.enterprise.title"),
      maxUsers: "500+",
      maxResources: "100+",
      features: {
        sso: true,
        maintenance: true,
        billing: true,
        nfc: true,
      },
      support: "sla",
      monthlyPrice: null,
      yearlyPrice: null,
      popular: false,
      cta: t("pricing.contact-us"),
    },
  ];

  const getSupportBadgeVariant = (support: string) => {
    switch (support) {
      case "basic":
        return "secondary";
      case "standard":
        return "default";
      case "priority":
        return "destructive";
      case "sla":
        return "outline";
      default:
        return "secondary";
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return t("pricing.contact-sales");
    return `€${price.toLocaleString()}`;
  };

  const getResourceProgress = (resources: number | string) => {
    if (typeof resources === "string") return 100;
    return Math.min((resources / 100) * 100, 100);
  };

  return (
    <TooltipProvider>
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t("pricing.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t("pricing.subtitle")}
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex bg-muted rounded-lg p-1 mb-8">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all",
                  billingCycle === "monthly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t("pricing.monthly")}
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
                  billingCycle === "yearly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t("pricing.yearly")}
                <Badge variant="destructive" className="text-xs">
                  {t("pricing.yearly-savings")}
                </Badge>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {plans.map((plan, index) => (
              <Card
                key={plan.id}
                className={cn(
                  "relative hover-lift fade-in",
                  plan.popular
                    ? "border-primary shadow-large scale-105 z-10"
                    : "shadow-medium",
                  plan.id === "enterprise" ? "md:col-span-2 lg:col-span-1" : ""
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-primary text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {t("pricing.popular")}
                    </div>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-lg font-bold text-foreground mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="text-2xl font-bold text-foreground">
                    {billingCycle === "monthly"
                      ? formatPrice(plan.monthlyPrice)
                      : formatPrice(plan.yearlyPrice)}
                  </div>
                  {plan.monthlyPrice && (
                    <p className="text-xs text-muted-foreground">
                      {billingCycle === "monthly" ? "/month" : "/year"}
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Max Users */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("pricing.max-users")}</span>
                      <span className="font-medium">{plan.maxUsers}</span>
                    </div>
                  </div>

                  {/* Max Resources with Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("pricing.max-resources")}</span>
                      <span className="font-medium">{plan.maxResources}</span>
                    </div>
                    <Progress
                      value={getResourceProgress(plan.maxResources)}
                      className="h-2"
                    />
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-foreground">
                      {t("pricing.features")}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        {plan.features.sso ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {t("pricing.features.sso")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {plan.features.maintenance ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {t("pricing.features.maintenance")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {plan.features.billing ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {t("pricing.features.billing")}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {plan.features.nfc ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {t("pricing.features.nfc")}
                        </span>
                        {plan.features.nfc && (
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-3 h-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{t("pricing.features.nfc.tooltip")}</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Support */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {t("pricing.support")}
                      </span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant={getSupportBadgeVariant(plan.support)}>
                            {t(`pricing.support.${plan.support}`)}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t(`pricing.support.${plan.support}.tooltip`)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link to="/contact" className="block">
                    <Button
                      className="w-full mt-6"
                      variant={plan.popular ? "default" : "outline"}
                      size="sm"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
}