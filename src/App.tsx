import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import { I18nProvider } from "@/contexts/i18n-provider";
import { ThemeProvider } from "@/contexts/theme-provider";
import { AnalyticsTracker } from "@/components/Analytics";
import { Home } from "@/pages/Home";
import { Contact } from "@/pages/Contact";
import { AGB } from "@/pages/AGB";
import { Datenschutz } from "@/pages/Datenschutz";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function SiteFrame() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    // Leave initial loads and browser Back/Forward scroll restoration to the browser.
    if (navigationType === "POP") return;

    let target: HTMLElement | null = null;
    if (location.hash) {
      let id = location.hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Use the literal ID for malformed escapes. */ }
      target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({ behavior: "instant", block: "start" });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      target = document.querySelector<HTMLElement>("main h1") ?? document.querySelector<HTMLElement>("main");
    }

    if (!target) return;
    const addedTabIndex = !target.hasAttribute("tabindex");
    if (addedTabIndex) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    const cleanup = () => {
      if (addedTabIndex) target.removeAttribute("tabindex");
    };
    target.addEventListener("blur", cleanup, { once: true });
    return () => {
      target.removeEventListener("blur", cleanup);
      cleanup();
    };
  }, [location, navigationType]);

  return (
    <div className="flex min-h-screen flex-col">
       <div className="flex-1">
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/contact" element={<Contact />} />
          <Route path="/agb" element={<AGB />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
       </div>
       <AnalyticsTracker />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <I18nProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter><SiteFrame /></BrowserRouter>
        </I18nProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
