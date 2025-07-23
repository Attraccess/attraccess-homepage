import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/contexts/i18n";

interface ImpressumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImpressumModal({ open, onOpenChange }: ImpressumModalProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="impressum-modal max-w-2xl max-h-[80vh] overflow-y-auto"
        aria-describedby="impressum-description"
      >
        <DialogHeader>
          <DialogTitle>
            {t("impressum.title")}
          </DialogTitle>
        </DialogHeader>
        
        <div id="impressum-description" className="sr-only">
          Legal information and contact details as required by German law
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {t("impressum.subtitle")}
            </p>
          </div>
          
          <ul className="space-y-2 text-sm">
            <li>
              <strong>
                {t("impressum.owner")}:
              </strong>{" "}
              {t("impressum.owner.value")}
            </li>
            <li>
              <strong>
                {t("impressum.address")}:
              </strong>{" "}
              {t("impressum.address.value")}
            </li>
            <li>
              <strong>
                {t("impressum.email")}:
              </strong>{" "}
              <a 
                href="mailto:contact@attraccess.org" 
                className="text-primary hover:underline"
              >
                contact@attraccess.org
              </a>
            </li>
            <li className="italic text-muted-foreground">
              {t("impressum.vat.notice")}
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}