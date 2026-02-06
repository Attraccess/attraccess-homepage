import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { I18nProvider } from "@/contexts/i18n";
import { ThemeProvider } from "@/contexts/theme";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Home } from "@/pages/Home";
import { Features } from "@/pages/Features";
import { HowItWorksPage } from "@/pages/HowItWorksPage";
import { PricingPage } from "@/pages/PricingPage";
import { Contact } from "@/pages/Contact";
import { AGB } from "@/pages/AGB";
import { Blog } from "@/pages/Blog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <I18nProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/agb" element={<AGB />} />
                  <Route path="/blog" element={<Blog />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </I18nProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
