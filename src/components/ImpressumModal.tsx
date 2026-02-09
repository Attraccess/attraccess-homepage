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

        <div className="w-full h-[60vh]">
          <iframe
            src="https://mein.online-impressum.de/jappyjan/"
            className="w-full h-full border-0 rounded"
            title="Impressum"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}