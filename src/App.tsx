import Lenis from 'lenis';
import { useEffect } from 'react';
import { SiteProvider, type Locale } from './lib/site';
import type { PageId } from './lib/routes';
import { Nav } from './sections/Nav';
import { Hero } from './sections/Hero';
import { Audience } from './sections/Audience';
import { TapDemo } from './sections/TapDemo';
import { Tour } from './sections/Tour';
import { Automation } from './sections/Automation';
import { Hardware } from './sections/Hardware';
import { Themes } from './sections/Themes';
import { Newsletter } from './sections/Newsletter';
import { Faq, FinalCta, Footer, Pricing, Trust } from './sections/Closing';
import { ContactPage } from './pages/Contact';
import { CreditsPage } from './pages/Credits';
import { ImprintPage, PrivacyPage, TermsPage } from './pages/Legal';
import { NotFoundPage } from './pages/NotFound';

function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ autoRaf: true, anchors: { offset: -80 }, lerp: 0.12 });
    return () => lenis.destroy();
  }, []);
}

function HomePage() {
  return (
    <>
      <Hero />
      <Audience />
      <TapDemo />
      <Tour />
      <Automation />
      <Hardware />
      <Themes />
      <Trust />
      <Pricing />
      <Faq />
      <Newsletter />
      <FinalCta />
    </>
  );
}

const PAGES: Record<PageId, () => React.JSX.Element> = {
  home: HomePage,
  contact: ContactPage,
  credits: CreditsPage,
  privacy: PrivacyPage,
  terms: TermsPage,
  imprint: ImprintPage,
  notFound: NotFoundPage,
};

export function App({ page, locale }: { page: PageId; locale: Locale }) {
  useSmoothScroll();
  const Page = PAGES[page];
  return (
    <SiteProvider page={page} locale={locale}>
      <Nav />
      <main id="main">
        <Page />
      </main>
      <Footer />
    </SiteProvider>
  );
}
