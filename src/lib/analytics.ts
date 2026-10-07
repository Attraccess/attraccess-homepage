/**
 * Umami analytics on our self-hosted instance (no cookies, no stored IPs – see the privacy policy,
 * section 4). Everything is a no-op unless VITE_UMAMI_HOST and VITE_UMAMI_WEBSITE_ID are set at build
 * time, and in dev builds. Prerendering happens in Node, so the crawl never counts as a visit.
 *
 * Only the events listed in the privacy policy may be tracked: `contact-submit` and
 * `newsletter-subscribe`. Update the policy before adding more.
 */
type UmamiProps = Record<string, unknown>;
type TrackedEvent = 'contact-submit' | 'newsletter-subscribe';

declare global {
  interface Window {
    umami?: {
      track: (name: string | ((props: UmamiProps) => UmamiProps), data?: UmamiProps) => void;
    };
  }
}

const HOST = import.meta.env.VITE_UMAMI_HOST;
const WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID;
const SCRIPT = import.meta.env.VITE_UMAMI_SCRIPT ?? 'script.js';
// Accepts "umami.example.org", "https://umami.example.org" or a sub-path like "example.org/umami".
const BASE = `https://${(HOST ?? '').replace(/^https?:\/\//, '').replace(/\/+$/, '')}/`;

function enabled(): boolean {
  return Boolean(HOST && WEBSITE_ID) && import.meta.env.PROD && typeof window !== 'undefined';
}

/** Loads the tracker; it records the current page view itself once loaded. */
export function initAnalytics(): void {
  if (!enabled() || window.umami) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = `${BASE}${SCRIPT}`;
  script.dataset.websiteId = WEBSITE_ID;
  // Umami ignores Do Not Track unless asked to – the privacy policy promises we honour it.
  script.dataset.doNotTrack = 'true';
  document.head.appendChild(script);
}

export function trackEvent(name: TrackedEvent): void {
  if (!enabled()) return;
  window.umami?.track(name);
}
