import { useEffect } from "react";

const SITE_NAME = "Attraccess";
const DEFAULT_DESCRIPTION =
  "Track, control and automate access to shared machines, tools and doors. Usage analytics, maintenance scheduling, RBAC and SSO — self-hosted, free for non-profits.";

interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  noindex?: boolean;
}

// ponytail: DOM-mutating SEO for a JS-rendering crawler (Google). Deep-link
// OG previews for non-JS scrapers (Slack/FB/LinkedIn) need build-time prerender.
export function useSEO({ title, description, canonicalPath, noindex }: SEOProps = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Access & Lifecycle Management for Shared Resources`;
    const desc = description ?? DEFAULT_DESCRIPTION;
    document.title = fullTitle;

    const setMeta = (selector: string, attr: string, value: string) =>
      document.querySelector(selector)?.setAttribute(attr, value);

    setMeta('meta[name="description"]', "content", desc);
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[property="og:description"]', "content", desc);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:description"]', "content", desc);

    if (canonicalPath) {
      const url = `https://attraccess.org${canonicalPath}`;
      setMeta('meta[property="og:url"]', "content", url);
      setMeta('link[rel="canonical"]', "href", url);
    }

    // Soft-404 / legal pages: keep them out of the index while mounted.
    let robots: HTMLMetaElement | null = null;
    if (noindex) {
      robots = document.createElement("meta");
      robots.name = "robots";
      robots.content = "noindex, nofollow";
      document.head.appendChild(robots);
    }
    return () => robots?.remove();
  }, [title, description, canonicalPath, noindex]);
}
