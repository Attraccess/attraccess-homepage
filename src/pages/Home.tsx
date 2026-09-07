import { MarketingFooter, MarketingHeader, marketingCopy } from "@/components/MarketingLayout";
import { WorkshopTour } from "@/components/workshop/WorkshopTour";
import { useI18n } from "@/contexts/i18n";
import { useSEO } from "@/hooks/use-seo";

export function Home() {
  const { language } = useI18n();
  useSEO({
    title: language === "de" ? "Maschinenfreigabe für gemeinsame Werkstätten" : "Machine authorization for shared workshops",
    description: language === "de" ? "Attraccess verbindet Identität, Einweisung und Maschinenfreigabe in einem nachvollziehbaren Ablauf für gemeinsam genutzte Werkstätten." : "Attraccess connects identity, training and machine authorization in a traceable workflow for shared workshops.",
    canonicalPath: "/",
  });
  const c = marketingCopy[language === "de" ? "de" : "en"];
  return <div className="prototype-homepage workshop-page"><MarketingHeader c={c} /><WorkshopTour marketing={c} /><MarketingFooter c={c} /></div>;
}
