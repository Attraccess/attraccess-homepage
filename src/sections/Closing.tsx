import {
  Accordion,
  AccordionBody,
  AccordionHeading,
  AccordionIndicator,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
  buttonVariants,
} from '@heroui/react';
import { AttraccessLogo } from '../components/AttraccessLogo';
import { motion } from 'motion/react';
import {
  Activity,
  ArrowRight,
  Check,
  FileClock,
  Fingerprint,
  KeyRound,
  Languages,
  Puzzle,
  Server,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { Reveal, SectionHeading } from '../components/primitives';
import { useSite } from '../lib/site';
import { pathFor } from '../lib/routes';

const TRUST_ICONS: Record<string, LucideIcon> = {
  sso: KeyRound,
  security: Fingerprint,
  roles: ShieldCheck,
  audit: FileClock,
  selfhosted: Server,
  monitoring: Activity,
  plugins: Puzzle,
  languages: Languages,
};

export function Trust() {
  const { copy } = useSite();
  return (
    <section className="bg-surface-secondary/60 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={copy.trust.eyebrow} title={copy.trust.title} />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.trust.items.map((item, index) => {
            const Icon = TRUST_ICONS[item.key];
            // Four wide tiles + four narrow ones fill a 4-column grid exactly; the outer two get the brand colour.
            const wide = [0, 3, 4, 7].includes(index);
            const branded = index === 0 || index === 7;
            return (
              <Reveal key={item.key} delay={(index % 4) * 0.06} className={wide ? 'lg:col-span-2' : ''}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className={`group relative h-full overflow-hidden rounded-2xl border border-border p-6 ${branded ? 'bg-accent text-accent-foreground' : 'bg-surface'}`}
                >
                  <Icon className={`size-6 ${branded ? '' : 'text-accent'}`} aria-hidden />
                  <h3 className="mt-6 text-xl font-bold">{item.title}</h3>
                  <p className={`mt-2 ${branded ? 'text-accent-foreground/80' : 'text-muted'}`}>{item.body}</p>
                  {wide && (
                    <Icon
                      className={`absolute -bottom-6 -right-6 size-36 transition-transform ${branded ? 'opacity-10' : 'text-accent opacity-[0.07]'} duration-700 group-hover:rotate-12 group-hover:scale-110`}
                      aria-hidden
                    />
                  )}
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function Pricing() {
  const { copy } = useSite();
  const p = copy.pricing;
  return (
    <section id="pricing" className="relative py-28">
      <div className="mx-auto max-w-5xl px-6">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {p.plans.map((plan, index) => {
            const featured = index === 0;
            return (
              <Reveal key={plan.key} delay={index * 0.1}>
                <div
                  className={`relative flex h-full flex-col rounded-3xl border p-8 ${
                    featured ? 'border-accent bg-surface shadow-float ring-1 ring-accent' : 'border-border bg-surface'
                  }`}
                >
                  {featured && (
                    <span className="absolute -top-3 left-8 rounded-full bg-rose px-3 py-1 text-xs font-semibold text-white">{p.badge}</span>
                  )}
                  <h3 className="font-mono text-sm uppercase tracking-[0.18em] text-muted">{plan.name}</h3>
                  <p className="mt-4 flex items-baseline gap-2">
                    <span className="font-display text-5xl font-extrabold tracking-tight">{plan.price}</span>
                    {plan.period && <span className="text-muted">{plan.period}</span>}
                  </p>
                  <p className="mt-3 text-muted">{plan.body}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <a href={plan.href} className={`${buttonVariants({ variant: featured ? 'primary' : 'secondary', size: 'lg', fullWidth: true })} mt-8`}>
                    {plan.cta}
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="mt-8 text-center text-sm text-muted">
          <a href="https://github.com/Attraccess/Attraccess/blob/main/LICENSE.md" className="underline decoration-border underline-offset-4 hover:decoration-current">
            {p.note}
          </a>
        </p>
      </div>
    </section>
  );
}

export function Faq() {
  const { copy } = useSite();
  return (
    <section id="faq" className="py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1fr_1.6fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading eyebrow={copy.faq.eyebrow} title={copy.faq.title} align="left" />
          <Reveal delay={0.1}>
            <img src="/brand/mascot.webp" alt="" aria-hidden className="mt-8 hidden w-28 -rotate-6 lg:block" />
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <Accordion className="w-full">
            {copy.faq.items.map((item) => (
              <AccordionItem key={item.q} id={item.q}>
                <AccordionHeading>
                  <AccordionTrigger className="py-5 text-left text-lg font-semibold">
                    {item.q}
                    <AccordionIndicator />
                  </AccordionTrigger>
                </AccordionHeading>
                <AccordionPanel>
                  <AccordionBody className="pb-5 text-base leading-relaxed text-muted">{item.a}</AccordionBody>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCta() {
  const { copy, locale } = useSite();
  return (
    <section className="px-4 pb-10">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-ink px-8 py-20 text-white sm:px-16">
        <img src="/brand/neon-wallpaper.webp" alt="" aria-hidden className="absolute inset-0 size-full object-cover object-[100%_75%] opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-transparent" aria-hidden />
        <div className="relative max-w-xl">
          <Reveal>
            <h2 className="text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">{copy.cta.title}</h2>
            <p className="mt-5 text-lg text-white/70">{copy.cta.lead}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href={`https://docs.attraccess.org/#/${locale}/getting-started/quick-start`} className={`${buttonVariants({ variant: 'primary', size: 'lg' })} group`}>
                {copy.cta.primary}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </a>
              <a
                href={pathFor('contact', locale)}
                className={`${buttonVariants({ variant: 'outline', size: 'lg' })} border-white/30 text-white hover:bg-white/10`}
              >
                {copy.cta.secondary}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const { copy, locale, page } = useSite();
  const f = copy.footer;
  const home = pathFor('home', locale);
  const anchor = (id: string) => (page === 'home' ? `#${id}` : `${home}#${id}`);
  const columns = [
    {
      title: f.product,
      links: [
        { label: copy.nav.features, href: anchor('features') },
        { label: copy.nav.reader, href: anchor('reader') },
        { label: copy.nav.automation, href: anchor('automation') },
        { label: copy.nav.pricing, href: anchor('pricing') },
        { label: copy.newsletter.eyebrow, href: anchor('newsletter') },
      ],
    },
    {
      title: f.resources,
      links: [
        { label: f.docs, href: `https://docs.attraccess.org/#/${locale}/home` },
        { label: f.github, href: 'https://github.com/Attraccess/Attraccess' },
        { label: f.license, href: 'https://github.com/Attraccess/Attraccess/blob/main/LICENSE.md' },
        { label: f.contact, href: pathFor('contact', locale) },
      ],
    },
    {
      title: f.legal,
      links: [
        { label: f.imprint, href: pathFor('imprint', locale) },
        { label: f.privacy, href: pathFor('privacy', locale) },
        { label: f.terms, href: pathFor('terms', locale) },
        { label: f.credits, href: pathFor('credits', locale) },
      ],
    },
  ];
  return (
    <footer className="px-6 pb-12 pt-16">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-3 md:grid-cols-[2fr_1fr_1fr_1fr]">
        <div className="sm:col-span-3 md:col-span-1">
          <AttraccessLogo className="h-10 w-auto text-foreground" />
          <p className="mt-4 max-w-sm text-muted">{f.tagline}</p>
          <p className="mt-6 max-w-md text-xs leading-relaxed text-muted">{f.disclaimer}</p>
        </div>
        {columns.map((column) => (
          <div key={column.title}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{column.title}</p>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-foreground/80 transition-colors hover:text-accent">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-border pt-6 text-sm text-muted">© {new Date().getFullYear()} Attraccess</div>
    </footer>
  );
}
