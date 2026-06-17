import { useEffect } from "react";

const SITE_NAME = "Attraccess";
const DEFAULT_DESCRIPTION =
  "Track, control and automate access to shared machines, tools and doors. Usage analytics, maintenance scheduling, RBAC and SSO — self-hosted, free for non-profits.";

interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
}

export function useSEO({ title, description, canonicalPath }: SEOProps = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — Access & Lifecycle Management for Shared Resources`;
    document.title = fullTitle;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description ?? DEFAULT_DESCRIPTION);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description ?? DEFAULT_DESCRIPTION);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl && canonicalPath) {
      ogUrl.setAttribute("content", `https://attraccess.org${canonicalPath}`);
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && canonicalPath) {
      canonical.setAttribute("href", `https://attraccess.org${canonicalPath}`);
    }
  }, [title, description, canonicalPath]);
}
