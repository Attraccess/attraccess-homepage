import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { useIsMobile } from "@/hooks/use-mobile";

interface ImpressumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImpressumModal({ open, onOpenChange }: ImpressumModalProps) {
  const { t, language } = useI18n();
  const isMobile = useIsMobile();
  const [expandedDe, setExpandedDe] = React.useState(!isMobile);
  const [expandedEn, setExpandedEn] = React.useState(!isMobile);

  const ImpressumContent = ({ lang }: { lang: "de" | "en" }) => (
    <section className={`impressum-${lang} space-y-4`}>
      <div>
        <h3 className="font-semibold text-lg mb-2">
          {lang === "de" ? "Impressum" : "Imprint"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {lang === "de" 
            ? "Angaben gem. § 5 TMG / § 18 MStV:" 
            : "In compliance with German Telemedia Act § 5 TMG / Interstate Media Treaty § 18 MStV:"
          }
        </p>
      </div>
      <ul className="space-y-2 text-sm">
        <li>
          <strong>
            {lang === "de" ? "Name" : "Owner"}:
          </strong>{" "}
          {lang === "de" 
            ? "Jan Jaap (selbstständig, Einzelunternehmen \"Attraccess\")"
            : "Jan Jaap (sole proprietor operating as \"Attraccess\")"
          }
        </li>
        <li>
          <strong>
            {lang === "de" ? "Anschrift" : "Address"}:
          </strong>{" "}
          Platanenallee 2a, 22529 Hamburg, {lang === "de" ? "Deutschland" : "Germany"}
        </li>
        <li>
          <strong>
            {lang === "de" ? "E-Mail" : "Email"}:
          </strong>{" "}
          <a 
            href="mailto:contact@attraccess.org" 
            className="text-primary hover:underline"
          >
            contact@attraccess.org
          </a>
        </li>
        <li className="italic text-muted-foreground">
          {lang === "de" 
            ? "Kleinunternehmer gemäß § 19 UStG – keine Umsatzsteuer ausgewiesen."
            : "Small business operator according to § 19 UStG – no VAT charged."
          }
        </li>
      </ul>
    </section>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="impressum-modal max-w-4xl max-h-[80vh] overflow-y-auto"
        aria-describedby="impressum-description"
      >
        <DialogHeader>
          <DialogTitle>
            {t("footer.impressum")}
          </DialogTitle>
        </DialogHeader>
        
        <div id="impressum-description" className="sr-only">
          Legal information and contact details as required by German law
        </div>

        {isMobile ? (
          // Mobile: Accordion Layout
          <div className="space-y-4">
            <Collapsible 
              open={expandedDe} 
              onOpenChange={setExpandedDe}
              className="accordion-section"
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between p-4 h-auto font-semibold"
                  aria-expanded={expandedDe}
                >
                  Deutsch
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedDe ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <ImpressumContent lang="de" />
              </CollapsibleContent>
            </Collapsible>

            <Collapsible 
              open={expandedEn} 
              onOpenChange={setExpandedEn}
              className="accordion-section"
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between p-4 h-auto font-semibold"
                  aria-expanded={expandedEn}
                >
                  English
                  <ChevronDown className={`w-4 h-4 transition-transform ${expandedEn ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <ImpressumContent lang="en" />
              </CollapsibleContent>
            </Collapsible>
          </div>
        ) : (
          // Desktop: Two Column Layout
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ImpressumContent lang="de" />
            <ImpressumContent lang="en" />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}