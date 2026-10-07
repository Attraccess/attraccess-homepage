import { Button, Checkbox, Input, Label, TextField } from '@heroui/react';
import { ArrowRight, Mail } from 'lucide-react';
import { Reveal } from '../components/primitives';
import { trackEvent } from '../lib/analytics';
import { pathFor } from '../lib/routes';
import { useSite } from '../lib/site';

// Posts straight to our self-hosted Listmonk (double opt-in). The form fields are described in the
// privacy policy, section 6: email, optional name, the language list and an invisible spam-protection field.
const LISTMONK_URL = 'https://listmonk.attraccess.org/subscription/form';

export function Newsletter() {
  const { copy, locale } = useSite();
  const n = copy.newsletter;
  return (
    <section id="newsletter" className="px-4 py-24">
      <Reveal className="mx-auto grid max-w-5xl gap-10 rounded-[2rem] border border-border bg-surface p-8 shadow-float sm:p-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
            <Mail className="size-6" aria-hidden />
          </span>
          <p className="mt-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">{n.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{n.title}</h2>
          <p className="mt-4 text-muted">{n.lead}</p>
        </div>
        <form method="post" action={LISTMONK_URL} onSubmit={() => trackEvent('newsletter-subscribe')} className="flex flex-col gap-4">
          {/* Listmonk's honeypot: humans never see or fill it. */}
          <input type="hidden" name="nonce" />
          <input type="hidden" name="l" value={n.list} />
          <TextField name="email" type="email" isRequired autoComplete="email">
            <Label>{n.email}</Label>
            <Input />
          </TextField>
          <TextField name="name" autoComplete="name">
            <Label>{n.name}</Label>
            <Input />
          </TextField>
          <Checkbox isRequired className="items-start">
            <Checkbox.Content className="items-start text-sm text-muted">
              <Checkbox.Control className="mt-0.5">
                <Checkbox.Indicator />
              </Checkbox.Control>
              <span>
                {n.consent}{' '}
                <a href={pathFor('privacy', locale)} className="text-accent underline underline-offset-2">
                  {n.privacy}
                </a>
                .
              </span>
            </Checkbox.Content>
          </Checkbox>
          <Button type="submit" variant="primary" size="lg" className="mt-2 self-start">
            {n.submit}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
          <p className="text-xs text-muted">{n.note}</p>
        </form>
      </Reveal>
    </section>
  );
}
