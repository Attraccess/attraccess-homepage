import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/contexts/i18n';
import { useTheme } from '@/contexts/theme';
import { Sun, Moon, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  const { t, language, setLanguage } = useI18n();
  const { actualTheme, setTheme } = useTheme();

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="py-12 text-center border-b border-border">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {t('footer.cta.title')}
          </h3>
          <Button variant="cta" size="lg">
            {t('footer.cta.button')}
          </Button>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold text-foreground">Attraccess</span>
              </Link>
              <p className="text-muted-foreground text-sm mb-4">
                {t('about.mission')}
              </p>
              <div className="flex space-x-3">
                <Button variant="ghost" size="icon">
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t('nav.features')}</Link></li>
                <li><Link to="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t('nav.how-it-works')}</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t('nav.pricing')}</Link></li>
                <li><Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t('nav.resources')}</Link></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t('nav.about')}</Link></li>
                <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">{t('nav.contact')}</Link></li>
                <li><Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Blog</Link></li>
                <li><Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Careers</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Newsletter</h4>
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <Input 
                  type="email" 
                  placeholder={t('footer.newsletter.placeholder')}
                  className="flex-1"
                />
                <Button size="sm">
                  {t('footer.newsletter.button')}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Get the latest updates and features.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {t('footer.copyright')}
            </p>
            
            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLanguage(language === 'en' ? 'de' : 'en')}
              >
                {language === 'en' ? 'EN' : 'DE'} | {language === 'en' ? 'DE' : 'EN'}
              </Button>
              
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setTheme(actualTheme === 'light' ? 'dark' : 'light')}
                className="gap-2"
              >
                {actualTheme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {t('footer.toggle.theme')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}