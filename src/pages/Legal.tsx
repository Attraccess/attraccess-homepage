import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { pathFor } from '../lib/routes';
import { useSite } from '../lib/site';
import { PrivacyContent } from './Privacy';
import { TermsContent } from './Terms';

/** German-only legal pages share this frame; English visitors get a short note on top. */
function LegalFrame({ children }: { children: ReactNode }) {
  const { copy, locale } = useSite();
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-36">
      {locale === 'en' && (
        <p lang="en" className="mb-8 rounded-xl border border-border bg-surface-secondary px-4 py-3 text-sm text-muted">
          {copy.legal.germanOnly}
        </p>
      )}
      <article lang="de" className="legal">
        {children}
      </article>
      <a href={pathFor('home', locale)} className="mt-12 inline-flex items-center gap-2 text-sm text-accent hover:underline">
        <ArrowLeft className="size-4" aria-hidden />
        {copy.legal.back}
      </a>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <LegalFrame>
      <PrivacyContent />
    </LegalFrame>
  );
}

export function TermsPage() {
  return (
    <LegalFrame>
      <TermsContent />
    </LegalFrame>
  );
}

// The imprint is maintained at online-impressum.de and embedded, as described in the privacy policy
// (section 7): the frame only loads when someone opens this page.
export function ImprintPage() {
  const { copy } = useSite();
  return (
    <LegalFrame>
      <h1>Impressum</h1>
      <iframe
        src="https://mein.online-impressum.de/jappyjan/"
        title={copy.legal.imprintFrame}
        loading="lazy"
        className="mt-6 h-[70vh] w-full rounded-xl border border-border bg-white"
      />
    </LegalFrame>
  );
}
