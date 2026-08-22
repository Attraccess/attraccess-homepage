import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  return (
    <div className="flex min-h-screen flex-col">
       <main className="flex-1">
         <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/contact" element={<Contact />} />
          <Route path="/agb" element={<AGB />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
       </main>
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
