import React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/contexts/i18n";

export function AGB() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Allgemeine Geschäftsbedingungen (AGB)
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Stand: 16. September 2025
            </p>
            
            {/* Provider Information */}
            <div className="bg-muted/50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-3">Anbieter</h2>
              <div className="text-foreground space-y-1">
                <p>Jan Jaap</p>
                <p>Platanenallee 2a</p>
                <p>22529 Hamburg</p>
                <p>Deutschland</p>
                <p className="text-sm text-muted-foreground mt-2">
                  (Einzelunternehmer, Kleinunternehmer gemäß § 19 UStG – keine Umsatzsteuer ausweisbar)
                </p>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Geltungsbereich</h2>
              <p className="text-foreground leading-relaxed">
                Diese AGB gelten für alle Verträge zwischen Jan Jaap („Anbieter") und seinen Kunden über die zeitlich befristete Überlassung von Software sowie die Vermietung von Hardware, sofern nicht schriftlich etwas anderes vereinbart wurde.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Vertragsgegenstand</h2>
              <ol className="text-foreground leading-relaxed space-y-2">
                <li>1. Der Anbieter gewährt dem Kunden ein einfaches, nicht übertragbares und nicht unterlizenzierbares Recht, die im Angebot bezeichnete Software während der vereinbarten Laufzeit zu nutzen.</li>
                <li>2. Soweit vereinbart, vermietet der Anbieter dem Kunden zusätzlich die im Angebot bezeichnete Hardware.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Vertragsabschluss</h2>
              <p className="text-foreground leading-relaxed">
                Der Vertrag kommt durch schriftliche oder elektronische Annahme eines vom Anbieter erstellten Angebots zustande. Maßgeblich sind die im Angebot genannten Laufzeiten, Preise und Stückzahlen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Nutzungsrechte an der Software</h2>
              <ol className="text-foreground leading-relaxed space-y-2">
                <li>1. Der Kunde darf die Software ausschließlich für eigene geschäftliche Zwecke verwenden.</li>
                <li>2. Änderungen, Dekompilierung, Weitergabe oder Vervielfältigung über den vertraglich vorgesehenen Umfang hinaus sind unzulässig, soweit nicht gesetzlich zwingend erlaubt.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Mietbedingungen für Hardware</h2>
              <ol className="text-foreground leading-relaxed space-y-2">
                <li>1. Der Kunde behandelt die gemietete Hardware sorgfältig und schützt sie vor Verlust, Diebstahl und Beschädigung.</li>
                <li>2. Bei Verlust oder Beschädigung haftet der Kunde für den Wiederbeschaffungs- bzw. Reparaturwert.</li>
                <li>3. Die Rückgabe hat zum vereinbarten Termin in funktionsfähigem und gereinigtem Zustand zu erfolgen.</li>
                <li>4. Versandkosten für Rücksendung trägt der Kunde, sofern nichts anderes vereinbart ist.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Vergütung und Zahlung</h2>
              <ol className="text-foreground leading-relaxed space-y-2">
                <li>1. Die im Angebot genannten Preise verstehen sich ohne Ausweis von Umsatzsteuer gemäß § 19 UStG.</li>
                <li>2. Rechnungen sind innerhalb von 14 Tagen ab Rechnungsdatum ohne Abzug fällig, sofern nichts anderes vereinbart ist.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Laufzeit und Kündigung</h2>
              <ol className="text-foreground leading-relaxed space-y-2">
                <li>1. Die Laufzeit ergibt sich aus dem Angebot.</li>
                <li>2. Soweit nicht anders vereinbart, endet das Nutzungsrecht an der Software automatisch mit Ablauf der Laufzeit, ohne dass es einer Kündigung bedarf.</li>
                <li>3. Eine ordentliche Kündigung während der vereinbarten Laufzeit ist ausgeschlossen.</li>
                <li>4. Das Recht zur außerordentlichen Kündigung aus wichtigem Grund bleibt unberührt.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Gewährleistung und Haftung</h2>
              <ol className="text-foreground leading-relaxed space-y-2">
                <li>1. Für Sach- und Rechtsmängel der Software gelten die gesetzlichen Vorschriften, soweit nachfolgend nichts anderes geregelt ist.</li>
                <li>2. Der Anbieter haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit.</li>
                <li>3. Bei leichter Fahrlässigkeit haftet der Anbieter nur für Schäden aus der Verletzung wesentlicher Vertragspflichten (Kardinalpflichten) und nur in Höhe des vorhersehbaren, typischen Schadens.</li>
                <li>4. Die Haftung für Datenverlust wird auf den typischen Wiederherstellungsaufwand beschränkt.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Datenschutz</h2>
              <p className="text-foreground leading-relaxed">
                Der Anbieter verarbeitet personenbezogene Daten ausschließlich im Rahmen der geltenden Datenschutzgesetze. Näheres regelt die Datenschutzerklärung auf der Website des Anbieters.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Schlussbestimmungen</h2>
              <ol className="text-foreground leading-relaxed space-y-2">
                <li>1. Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts.</li>
                <li>2. Gerichtsstand für Kaufleute ist – soweit gesetzlich zulässig – der Sitz des Anbieters.</li>
                <li>3. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Regelungen unberührt.</li>
              </ol>
            </section>
          </div>

          {/* Back to Home Link */}
          <div className="text-center pt-8 border-t border-border">
            <Link 
              to="/" 
              className="text-primary hover:text-primary/80 transition-colors duration-200 text-sm"
            >
              ← Zurück zur Startseite
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}