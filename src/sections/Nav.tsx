import { Button, buttonVariants } from '@heroui/react';
import { AttraccessLogo } from '../components/AttraccessLogo';
import { Languages, Menu, Moon, Sun, X } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useState } from 'react';
import { rememberLanguage, useSite } from '../lib/site';
import { languageSwitchHref, pathFor } from '../lib/routes';

export function Nav() {
  const { copy, theme, toggleTheme, page, locale } = useSite();
  const otherLocale = locale === 'en' ? 'de' : 'en';
  // Section anchors only exist on the home page; elsewhere they lead back to it.
  const home = pathFor('home', locale);
  const anchor = (id: string) => (page === 'home' ? `#${id}` : `${home}#${id}`);
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));
  // The home page opens on a dark hero; until the bar gets its own background it follows that.
  const overDarkHero = page === 'home' && !scrolled;

  const links = [
    { href: anchor('features'), label: copy.nav.features },
    { href: anchor('reader'), label: copy.nav.reader },
    { href: anchor('integrations'), label: copy.nav.integrations },
    { href: anchor('pricing'), label: copy.nav.pricing },
    { href: pathFor('contact', locale), label: copy.nav.contact },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded focus:bg-surface focus:px-3 focus:py-2">
        {copy.nav.skip}
      </a>
      <motion.nav
        animate={{
          maxWidth: scrolled ? 1100 : 1280,
          paddingTop: scrolled ? 8 : 14,
          paddingBottom: scrolled ? 8 : 14,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 30 }}
        className={`mx-auto flex items-center gap-4 rounded-2xl px-4 text-foreground transition-colors duration-300 ${overDarkHero ? 'dark' : ''} ${
          scrolled ? 'border border-border bg-background/75 shadow-float backdrop-blur-xl' : 'border border-transparent'
        }`}
      >
        <a href={page === 'home' ? '#top' : home} className="flex shrink-0 items-center text-foreground" aria-label="Attraccess">
          <AttraccessLogo className="h-8 w-auto" />
        </a>
        <div className="mx-auto hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-default hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://docs.attraccess.org"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-default hover:text-foreground"
          >
            {copy.nav.docs}
          </a>
        </div>
        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <a
            href={languageSwitchHref(page, otherLocale)}
            onClick={() => rememberLanguage(otherLocale)}
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            hrefLang={otherLocale}
            lang={otherLocale}
          >
            <Languages className="size-4" aria-hidden />
            <span className="hidden sm:inline">{copy.nav.language}</span>
          </a>
          <Button
            variant="ghost"
            size="sm"
            isIconOnly
            aria-label={theme === 'dark' ? copy.nav.themeLight : copy.nav.themeDark}
            onPress={toggleTheme}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </motion.span>
            </AnimatePresence>
          </Button>
          <a href={pathFor('contact', locale)} className={`${buttonVariants({ variant: 'primary', size: 'sm' })} hidden sm:inline-flex`}>
            {copy.nav.cta}
          </a>
          <Button variant="ghost" size="sm" isIconOnly className="lg:hidden" aria-label={copy.nav.menu} aria-expanded={open} onPress={() => setOpen((v) => !v)}>
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </motion.nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto mt-2 grid max-w-[1100px] gap-1 rounded-2xl border border-border bg-background/95 p-3 shadow-float backdrop-blur-xl lg:hidden"
          >
            {[...links, { href: 'https://docs.attraccess.org', label: copy.nav.docs }].map((link) => (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-medium hover:bg-default">
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
