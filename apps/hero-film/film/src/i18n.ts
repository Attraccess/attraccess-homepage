// On-screen copy per locale. Node titles use the app's exact UI strings
// (apps/frontend/src/app/resources/details/flows/node/{en,de}.json and status chips).
export type Locale = 'en' | 'de';

type NodeCopy = { title: string; meta?: string };
type Strings = {
  nodes: Record<'intro' | 'session' | 'flow' | 'shelly' | 'companion' | 'meter' | 'record' | 'maintenance' | 'available', NodeCopy>;
  captions: { word: string; sub: string }[];
  chips: Record<string, string>;
  card: { lab: string; member: string };
};

export const STRINGS: Record<Locale, Strings> = {
  en: {
    nodes: {
      intro: { title: 'Introduction', meta: 'Allowed' },
      session: { title: 'Usage started', meta: 'Trotec Speedy 400' },
      flow: { title: 'Flow · Trotec Speedy 400', meta: 'Usage started' },
      shelly: { title: 'Send HTTP request', meta: 'Shelly Pro 1PM' },
      companion: { title: 'Unlock PC', meta: 'Companion kiosk' },
      meter: { title: 'Report meter', meta: 'Electricity · kWh' },
      record: { title: 'Usage stopped', meta: 'Billing' },
      maintenance: { title: 'Maintenance', meta: 'Operating duration' },
      available: { title: 'Resources', meta: 'Available' },
    },
    captions: [
      { word: 'Tap', sub: 'A card at the Attractap reader' },
      { word: 'Check', sub: 'Current introduction for this machine' },
      { word: 'Start', sub: 'Required form, project, live session' },
      { word: 'Automate', sub: 'Your flow switches power, extraction and the PC' },
      { word: 'Bill', sub: 'Minutes, measured energy and consumables' },
      { word: 'Maintain', sub: 'Service scheduled from real operating hours' },
      { word: 'Ready', sub: 'Back in service for the next person' },
    ],
    chips: {
      sso: 'Entra ID · Keycloak · Authentik',
      wago: 'Digital I/O · Modbus RTU',
      rabbitmq: 'MQTT broker management',
      shelly: 'Discovery · configuration',
      companion: 'Windows · macOS · Linux',
      http: 'Requests from any flow',
      sumup: 'Credit top-ups',
      metrics: 'Metrics & monitoring',
      api: 'WebSocket live updates',
      attractap: 'NFC readers · OTA',
      plugins: 'Pages · nodes · APIs',
    },
    card: { lab: 'North Campus · Prototyping Lab', member: 'Member · NTAG 424 DNA' },
  },
  de: {
    nodes: {
      intro: { title: 'Einweisung', meta: 'Erlaubt' },
      session: { title: 'Nutzung gestartet', meta: 'Trotec Speedy 400' },
      flow: { title: 'Flow · Trotec Speedy 400', meta: 'Nutzung gestartet' },
      shelly: { title: 'HTTP-Anfrage senden', meta: 'Shelly Pro 1PM' },
      companion: { title: 'PC entsperren', meta: 'Companion-Kiosk' },
      meter: { title: 'Zähler melden', meta: 'Strom · kWh' },
      record: { title: 'Nutzung beendet', meta: 'Abrechnung' },
      maintenance: { title: 'Wartung', meta: 'Betriebsdauer' },
      available: { title: 'Ressourcen', meta: 'Verfügbar' },
    },
    captions: [
      { word: 'Tap', sub: 'Eine Karte am Attractap-Leser' },
      { word: 'Prüfung', sub: 'Gültige Einweisung für genau diese Maschine' },
      { word: 'Start', sub: 'Pflichtformular, Projekt, laufende Sitzung' },
      { word: 'Automatisierung', sub: 'Dein Flow schaltet Strom, Absaugung und den PC' },
      { word: 'Abrechnung', sub: 'Minuten, gemessene Energie und Verbrauchsmaterial' },
      { word: 'Wartung', sub: 'Geplant nach echten Betriebsstunden' },
      { word: 'Bereit', sub: 'Wieder frei für die nächste Person' },
    ],
    chips: {
      sso: 'Entra ID · Keycloak · Authentik',
      wago: 'Digitale E/A · Modbus RTU',
      rabbitmq: 'MQTT-Broker-Verwaltung',
      shelly: 'Erkennung · Konfiguration',
      companion: 'Windows · macOS · Linux',
      http: 'Anfragen aus jedem Flow',
      sumup: 'Guthaben aufladen',
      metrics: 'Metriken & Monitoring',
      api: 'WebSocket-Live-Updates',
      attractap: 'NFC-Leser · OTA-Updates',
      plugins: 'Seiten · Knoten · APIs',
    },
    card: { lab: 'Nordcampus · Prototyping-Labor', member: 'Mitglied · NTAG 424 DNA' },
  },
};
