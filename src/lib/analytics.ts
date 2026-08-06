/**
 * Matomo analytics for a self-hosted instance.
 *
 * The tracker script/endpoint names are configurable because self-hosted
 * instances usually rename matomo.js/matomo.php to survive adblock filter
 * lists. Cookies are disabled, so no consent banner is required.
 *
 * Everything is a no-op unless VITE_MATOMO_HOST is set at build time, and in
 * dev builds and prerender snapshots (scripts/prerender.mjs) — so local work
 * and the build-time crawl never show up as traffic.
 */

declare global {
  interface Window {
    _paq?: unknown[][];
    /** set by scripts/prerender.mjs while snapshotting the built SPA */
    __PRERENDER__?: boolean;
  }
}

const HOST = import.meta.env.VITE_MATOMO_HOST;
const SITE_ID = import.meta.env.VITE_MATOMO_SITE_ID ?? "1";
const SCRIPT = import.meta.env.VITE_MATOMO_SCRIPT ?? "not_matomo.js";
const TRACKER = import.meta.env.VITE_MATOMO_TRACKER ?? "matomo.php";

// accepts "analytics.example.org", "https://analytics.example.org" or a
// sub-path like "example.org/analytics"
const BASE = `https://${(HOST ?? "").replace(/^https?:\/\//, "").replace(/\/+$/, "")}/`;

function enabled(): boolean {
  return Boolean(HOST) && import.meta.env.PROD && typeof window !== "undefined" && !window.__PRERENDER__;
}

/** The queue swallows calls made before the tracker script has loaded. */
function queue(): unknown[][] {
  return (window._paq = window._paq ?? []);
}

export function initAnalytics(): void {
  if (!enabled() || window._paq) return;

  const _paq = queue();
  _paq.push(["setTrackerUrl", `${BASE}${TRACKER}`]);
  _paq.push(["setSiteId", SITE_ID]);
  _paq.push(["disableCookies"]);
  // No trackPageView here — <AnalyticsTracker /> reports the first view once
  // the route's useSEO() has set document.title.

  const script = document.createElement("script");
  script.async = true;
  script.src = `${BASE}${SCRIPT}`;
  document.head.appendChild(script);
}

export function trackPageView(url: string, title?: string): void {
  if (!enabled()) return;

  const _paq = queue();
  _paq.push(["setCustomUrl", url]);
  if (title) _paq.push(["setDocumentTitle", title]);
  _paq.push(["trackPageView"]);
  // re-arm outbound/download link tracking for the newly rendered page
  _paq.push(["enableLinkTracking"]);
}

export function trackEvent(category: string, action: string, name?: string, value?: number): void {
  if (!enabled()) return;

  queue().push(["trackEvent", category, action, name ?? `${category}:${action}`, value ?? 1]);
}
