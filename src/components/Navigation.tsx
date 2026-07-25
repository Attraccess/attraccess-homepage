import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/contexts/i18n";
import { Logo } from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useI18n();
  const location = useLocation();

  const navItems = [
    { key: "home", href: "/" },
    { key: "features", href: "/features" },
    { key: "how-it-works", href: "/how-it-works" },
    { key: "pricing", href: "/pricing" },
    { key: "contact", href: "/contact" },
  ];

  const externalNavItems: { key: string; href: string }[] = [];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className={`text-sm font-semibold transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-foreground/70"
                }`}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            {externalNavItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold transition-colors hover:text-primary text-foreground/70"
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Globe className="w-4 h-4" />
                  {language === "en" ? "EN" : "DE"}
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("en")}>
                  English (EN)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("de")}>
                  Deutsch (DE)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* CTA Button */}
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_4px_14px_rgba(5,132,247,.35)] transition-all hover:-translate-y-px hover:shadow-[0_7px_20px_rgba(5,132,247,.45)]"
            >
              {t("nav.cta")}
              <ArrowRight className="h-[17px] w-[17px]" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className={`block px-3 py-2 text-base font-medium transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            {externalNavItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 text-base font-medium transition-colors hover:text-primary text-muted-foreground"
                onClick={() => setIsOpen(false)}
              >
                {t(`nav.${item.key}`)}
              </a>
            ))}
            <div className="flex items-center justify-between px-3 py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Globe className="w-4 h-4" />
                    {language === "en" ? "EN" : "DE"}
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => setLanguage("en")}>
                    English (EN)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("de")}>
                    Deutsch (DE)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 rounded-[10px] bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-[0_4px_14px_rgba(5,132,247,.35)]"
              >
                {t("nav.cta")}
                <ArrowRight className="h-[17px] w-[17px]" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
