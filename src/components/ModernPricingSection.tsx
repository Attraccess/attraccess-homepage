import React, { useState } from "react";
import { useI18n } from "@/contexts/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Check,
  X,
  Info,
  Star,
  Shield,
  Wrench,
  CreditCard,
  Wifi,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatEur, monthlyEquivalentEur } from "@/lib/pricing";

export function ModernPricingSection() {
  const { t, language } = useI18n();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );

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
        return "secondary"; // Gray
      case "standard":
        return "default"; // Blue/Primary
      case "priority":
        return "destructive"; // Orange/Red-ish (will customize)
      case "sla":
        return "outline"; // Red outline
      default:
        return "secondary";
    }
  };

  const getSupportBadgeStyle = (support: string) => {
    switch (support) {
      case "priority":
        return "bg-orange-500 text-white hover:bg-orange-600";
      case "sla":
        return "border-red-500 text-red-500 hover:bg-red-50";
      default:
        return "";
    }
  };

  /**
   * Both billing cycles are quoted as a monthly figure — annual plans show the
   * monthly equivalent with the annual total spelled out underneath, so the
   * cheaper-looking number is never presented without its real commitment.
   */
  const priceDisplay = (plan: {
    monthlyPrice: number | null;
    yearlyPrice: number | null;
  }) => {
    if (plan.monthlyPrice === null || plan.yearlyPrice === null) {
      return { headline: t("pricing.contact-sales"), period: null, note: null };
    }
    if (billingCycle === "monthly") {
      return {
        headline: formatEur(plan.monthlyPrice, language),
        period: t("pricing.per-month"),
        note: null,
      };
    }
    return {
      headline: formatEur(monthlyEquivalentEur(plan.yearlyPrice), language),
      period: t("pricing.per-month"),
      note: t("pricing.billed-annually", {
        total: formatEur(plan.yearlyPrice, language),
      }),
    };
  };

  const getResourceProgress = (resources: number | string) => {
    if (typeof resources === "string") return 100;
    return Math.min((resources / 100) * 100, 100);
  };

  const getUserProgress = (users: number | string) => {
    if (typeof users === "string") return 100;
    return Math.min((users / 500) * 100, 100);
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case "sso":
        return Shield;
      case "maintenance":
        return Wrench;
      case "billing":
        return CreditCard;
      case "nfc":
        return Wifi;
      default:
        return Shield;
    }
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
                  "pricing-card relative hover-lift fade-in",
                  plan.popular
                    ? "border-primary shadow-large scale-105 z-10"
                    : "shadow-medium z-1",
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
                  {(() => {
                    const price = priceDisplay(plan);
                    return (
                      <>
                        <div className="text-2xl font-bold text-foreground">
                          {price.headline}
                        </div>
                        {price.period && (
                          <p className="text-xs text-muted-foreground">
                            {price.period}
                          </p>
                        )}
                        {price.note && (
                          <p className="text-xs font-medium text-muted-foreground">
                            {price.note}
                          </p>
                        )}
                      </>
                    );
                  })()}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Max Users */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {t("pricing.max-users")}
                      </span>
                      <span className="font-medium">{plan.maxUsers}</span>
                    </div>
                    <Progress
                      value={getUserProgress(plan.maxUsers)}
                      className="h-2"
                    />
                  </div>

                  {/* Max Resources with Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">
                          {t("pricing.max-resources")}
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="cursor-help">
                              <Info className="w-3 h-3 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              {t("pricing.max-resources.tooltip")}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
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
                    <div className="space-y-2">
                      {Object.entries(plan.features).map(
                        ([feature, enabled]) => {
                          const FeatureIcon = getFeatureIcon(feature);
                          return (
                            <div
                              key={feature}
                              className="flex items-center gap-2"
                            >
                              <div className="flex items-center gap-2">
                                {enabled ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <X className="w-4 h-4 text-muted-foreground" />
                                )}
                                <FeatureIcon className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {t(`pricing.features.${feature}`)}
                                </span>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className="cursor-help ml-1"
                                    >
                                      <Info className="w-3 h-3 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {t(`pricing.features.${feature}.tooltip`)}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Support */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-muted-foreground">
                          {t("pricing.support")}
                        </span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="cursor-help">
                              <Info className="w-3 h-3 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {t(`pricing.support.${plan.support}.tooltip`)}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Badge
                        variant={getSupportBadgeVariant(plan.support)}
                        className={cn(
                          "text-xs",
                          getSupportBadgeStyle(plan.support)
                        )}
                        aria-label={`${t(`pricing.support.${plan.support}`)} support level`}
                      >
                        {t(`pricing.support.${plan.support}`)}
                      </Badge>
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
