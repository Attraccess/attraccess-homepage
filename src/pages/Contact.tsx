import { Button, Input, Label, TextArea, TextField } from '@heroui/react';
import { ArrowRight, Check, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Reveal } from '../components/primitives';
import { trackEvent } from '../lib/analytics';
import { pathFor } from '../lib/routes';
import { useSite } from '../lib/site';

const CONTACT_EMAIL = 'contact@attraccess.org';

export function ContactPage() {
  const { copy, locale } = useSite();
  const c = copy.contact;
  const [sent, setSent] = useState(false);

  // Nothing is sent to this website: the form only prepares an email (privacy policy, section 5).
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      `${c.name}: ${data.get('name')}`,
      `${c.organization}: ${data.get('organization')}`,
      `${c.email}: ${data.get('email')}`,
      '',
      String(data.get('message') ?? ''),
    ].join('\n');
    trackEvent('contact-submit');
    setSent(true);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="relative overflow-hidden px-6 pb-24 pt-36">
      <div className="mat-grid pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">{c.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl">{c.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">{c.lead}</p>
        </Reveal>
        <div className="mt-14 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Reveal delay={0.1}>
            <form onSubmit={submit} className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6 shadow-float sm:p-8" aria-describedby="contact-privacy">
              <h2 className="text-2xl font-bold">{c.formTitle}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="name" isRequired autoComplete="name">
                  <Label>{c.name}</Label>
                  <Input />
                </TextField>
                <TextField name="organization" isRequired autoComplete="organization">
                  <Label>{c.organization}</Label>
                  <Input />
                </TextField>
              </div>
              <TextField name="email" type="email" isRequired autoComplete="email">
                <Label>{c.email}</Label>
                <Input />
              </TextField>
              <TextField name="message" isRequired>
                <Label>{c.message}</Label>
                <TextArea rows={5} placeholder={c.messagePlaceholder} />
              </TextField>
              <Button type="submit" variant="primary" size="lg" className="mt-2 self-start">
                {c.submit}
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              <p id="contact-privacy" className="text-sm text-muted">
                {c.privacy}{' '}
                <a href={pathFor('privacy', locale)} className="text-accent underline underline-offset-2">
                  {c.privacyLink}
                </a>
                .
              </p>
              {sent && (
                <p role="status" className="flex items-start gap-2 rounded-xl bg-success/10 p-3 text-sm text-success">
                  <Check className="mt-0.5 size-4 shrink-0" aria-hidden />
                  {c.sent}
                </p>
              )}
            </form>
          </Reveal>
          <Reveal delay={0.2}>
            <aside className="h-full rounded-3xl bg-ink p-8 text-white">
              <img src="/brand/mascot.webp" alt="" aria-hidden className="w-16" />
              <h2 className="mt-6 text-2xl font-bold">{c.nextTitle}</h2>
              <ol className="mt-5 space-y-4">
                {c.next.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neon/15 font-mono text-sm text-neon">{index + 1}</span>
                    <span className="text-white/80">{step}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-8 text-sm text-white/60">{c.direct}</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-1 inline-flex items-center gap-2 font-semibold text-neon hover:underline">
                <Mail className="size-4" aria-hidden />
                {CONTACT_EMAIL}
              </a>
            </aside>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
