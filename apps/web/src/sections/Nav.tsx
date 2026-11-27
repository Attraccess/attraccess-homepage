import { Button, buttonVariants } from '@heroui/react';
import { AttraccessLogo } from '../components/AttraccessLogo';
import { ChevronDown, Languages, Menu, Moon, Sun, X } from 'lucide-react';
import { USE_CASE_ICONS } from '../components/useCaseIcons';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { rememberLanguage, useSite } from '../lib/site';
import { USE_CASE_IDS, languageSwitchHref, pathFor, type UseCaseId } from '../lib/routes';

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
  // The home and use-case pages open on a dark hero; until the bar gets its own background it follows that.
  const overDarkHero = (page === 'home' || USE_CASE_IDS.includes(page as UseCaseId)) && !scrolled;

  const links = [
    { href: anchor('features'), label: copy.nav.features },
    { href: anchor('reader'), label: copy.nav.reader },
    { href: anchor('integrations'), label: copy.nav.integrations },
    { href: anchor('pricing'), label: copy.nav.pricing },
  ];
  // The desktop bar leaves contact to the call-to-action button; the menu lists it.
  const menuLinks = [...links, { href: pathFor('contact', locale), label: copy.nav.contact }, { href: 'https://docs.attraccess.org', label: copy.nav.docs }];

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
        {/* The full link row needs about 1100 px in German; below that the menu takes over. */}
        <div className="mx-auto hidden items-center gap-0.5 xl:flex">
          <UseCaseMenu />
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-default hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://docs.attraccess.org"
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-default hover:text-foreground"
          >
            {copy.nav.docs}
          </a>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1 xl:ml-0">
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
          <a href={pathFor('contact', locale)} className={`${buttonVariants({ variant: 'primary', size: 'sm' })} hidden whitespace-nowrap sm:inline-flex`}>
            {copy.nav.cta}
          </a>
          <Button variant="ghost" size="sm" isIconOnly className="xl:hidden" aria-label={copy.nav.menu} aria-expanded={open} onPress={() => setOpen((v) => !v)}>
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
            className="mx-auto mt-2 grid max-h-[calc(100dvh-6rem)] max-w-[1100px] gap-1 overflow-y-auto overscroll-contain rounded-2xl border border-border bg-background/95 p-3 shadow-float backdrop-blur-xl xl:hidden"
          >
            <p className="px-3 pb-1 pt-2 font-mono text-xs uppercase tracking-[0.2em] text-muted">{copy.useCases.nav}</p>
            {USE_CASE_IDS.map((id) => (
              <a
                key={id}
                href={pathFor(id, locale)}
                aria-current={page === id ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className="rounded-lg py-2.5 pl-6 pr-3 font-medium hover:bg-default aria-[current=page]:text-accent"
              >
                {copy.useCases.pages[id].card.title}
              </a>
            ))}
            <span className="my-1 h-px bg-border" aria-hidden />
            {menuLinks.map((link) => (
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

/** Desktop disclosure listing the use-case pages; the mobile menu lists them inline. */
function UseCaseMenu() {
  const { copy, page, locale } = useSite();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = USE_CASE_IDS.includes(page as UseCaseId);

  useEffect(() => {
    if (!open) return;
    const close = (event: Event) => {
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative" onBlur={(event) => !ref.current?.contains(event.relatedTarget as Node) && setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="use-case-menu"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:bg-default hover:text-foreground ${active ? 'text-foreground' : 'text-muted'}`}
      >
        {copy.useCases.nav}
        <ChevronDown className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id="use-case-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-3 w-[22rem] rounded-2xl border border-border bg-background p-2 text-foreground shadow-float"
          >
            {USE_CASE_IDS.map((id) => {
              const Icon = USE_CASE_ICONS[id];
              const card = copy.useCases.pages[id].card;
              return (
                <a
                  key={id}
                  href={pathFor(id, locale)}
                  aria-current={page === id ? 'page' : undefined}
                  className="flex gap-3 rounded-xl p-3 transition-colors hover:bg-default aria-[current=page]:bg-default"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-soft-foreground">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{card.title}</span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted">{card.tags.join(' · ')}</span>
                  </span>
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
