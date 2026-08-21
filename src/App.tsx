import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { I18nProvider } from "@/contexts/i18n-provider";
import { ThemeProvider } from "@/contexts/theme-provider";
import { Navigation } from "@/components/Navigation";
import { MakerFairePopup } from "@/components/MakerFairePopup";
import { Footer } from "@/components/Footer";
import { AnalyticsTracker } from "@/components/Analytics";
import { Home } from "@/pages/Home";
import { Features } from "@/pages/Features";
import { HowItWorksPage } from "@/pages/HowItWorksPage";
import { PricingPage } from "@/pages/PricingPage";
import { Contact } from "@/pages/Contact";
import { AGB } from "@/pages/AGB";
import { Datenschutz } from "@/pages/Datenschutz";
import { Blog } from "@/pages/Blog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function SiteFrame() {
  const location = useLocation();
  const isHomepagePrototype = location.pathname === "/";

  return (
    <div className="flex min-h-screen flex-col">
      {!isHomepagePrototype && <MakerFairePopup />}
      {!isHomepagePrototype && <Navigation />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/agb" element={<AGB />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <AnalyticsTracker />
      {!isHomepagePrototype && <Footer />}
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
