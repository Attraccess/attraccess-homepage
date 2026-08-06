/**
 * Umami analytics for a self-hosted instance.
 *
 * The tracker script name is configurable because self-hosted instances usually
 * rename script.js to survive adblock filter lists. Umami stores no cookies, so
 * no consent banner is required.
 *
 * Everything is a no-op unless VITE_UMAMI_HOST and VITE_UMAMI_WEBSITE_ID are set
 * at build time, and in dev builds and prerender snapshots
 * (scripts/prerender.mjs) — so local work and the build-time crawl never show up
 * as traffic.
 */

type UmamiProps = Record<string, unknown>;

declare global {
  interface Window {
    umami?: {
      track: (
        name: string | ((props: UmamiProps) => UmamiProps),
        data?: UmamiProps,
      ) => void;
    };
    /** set by scripts/prerender.mjs while snapshotting the built SPA */
    __PRERENDER__?: boolean;
  }
}

const HOST = import.meta.env.VITE_UMAMI_HOST;
const WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID;
const SCRIPT = import.meta.env.VITE_UMAMI_SCRIPT ?? "script.js";

// accepts "umami.example.org", "https://umami.example.org" or a sub-path like
// "example.org/umami"
const BASE = `https://${(HOST ?? "").replace(/^https?:\/\//, "").replace(/\/+$/, "")}/`;

function enabled(): boolean {
  return (
    Boolean(HOST && WEBSITE_ID) &&
    import.meta.env.PROD &&
    typeof window !== "undefined" &&
    !window.__PRERENDER__
  );
}

/** The first page view fires before the async script has loaded — hold it here. */
let pending: Parameters<typeof trackPageView> | null = null;

export function initAnalytics(): void {
  if (!enabled() || window.umami) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `${BASE}${SCRIPT}`;
  script.dataset.websiteId = WEBSITE_ID!;
  // We report page views ourselves in <AnalyticsTracker />, once the route's
  // useSEO() has set document.title.
  script.dataset.autoTrack = "false";
  // Umami ignores Do Not Track unless asked to honour it — the Datenschutz page
  // promises we do.
  script.dataset.doNotTrack = "true";
  script.onload = () => {
    if (!pending) return;
    const [url, title] = pending;
    pending = null;
    trackPageView(url, title);
  };
  document.head.appendChild(script);
}

export function trackPageView(url: string, title?: string): void {
  if (!enabled()) return;

  if (!window.umami) {
    pending = [url, title];
    return;
  }
  window.umami.track((props) => ({ ...props, url, title: title ?? props.title }));
}

// ponytail: events fired before the tracker script loads are dropped. They all
// sit behind a form submit, so the script has long since arrived.
export function trackEvent(name: string, data?: UmamiProps): void {
  if (!enabled()) return;

  window.umami?.track(name, data);
}
