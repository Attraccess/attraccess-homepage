import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/contexts/i18n";
import { useTheme } from "@/contexts/theme";
import { Logo } from "@/components/Logo";
import { Sun, Moon, Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const { t, language, setLanguage } = useI18n();
  const { actualTheme, setTheme } = useTheme();

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <Link to="/" className="flex items-center mb-4">
                <Logo className="h-8 w-auto" />
              </Link>
              <p className="text-muted-foreground text-sm mb-4">
                {t("about.mission")}
              </p>
              <div className="flex space-x-3">
                <a
                  href="https://github.com/attraccess/attraccess"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon">
                    <Github className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                {t("footer.product")}
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/features"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {t("nav.features")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/how-it-works"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {t("nav.how-it-works")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {t("nav.pricing")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">
                {t("footer.company")}
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/contact"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                  >
                    {t("nav.contact")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {t("footer.copyright")}
            </p>

            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "de" : "en")}
              >
                {language === "en" ? "EN" : "DE"} |{" "}
                {language === "en" ? "DE" : "EN"}
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setTheme(actualTheme === "light" ? "dark" : "light")
                }
                className="gap-2"
              >
                {actualTheme === "light" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
                {t("footer.toggle.theme")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
