import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";

/**
 * Reports a Matomo page view on every client-side route change (including the
 * first render). Renders nothing.
 *
 * Mount it *after* <Routes> so its effect runs after the page's useSEO() has
 * updated document.title — otherwise Matomo records the previous page's title.
 */
export function AnalyticsTracker() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    trackPageView(`${window.location.origin}${pathname}${search}`, document.title);
  }, [pathname, search]);

  return null;
}
