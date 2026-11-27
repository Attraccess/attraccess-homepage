import {
  SiAuthentik,
  SiDocker,
  SiEclipsemosquitto,
  SiEspressif,
  SiGrafana,
  SiHomeassistant,
  SiKeycloak,
  SiMqtt,
  SiNfc,
  SiNodered,
  SiOpenapiinitiative,
  SiOpenid,
  SiPrometheus,
  SiRabbitmq,
  SiShelly,
  SiWebauthn,
} from '@icons-pack/react-simple-icons';
import {
  Building2,
  Factory,
  FileSpreadsheet,
  IdCard,
  KeyRound,
  MonitorSmartphone,
  ShieldCheck,
  Webhook,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { Reveal, SectionHeading } from '../components/primitives';
import type { Copy } from '../i18n/en';
import { useSite } from '../lib/site';

type BrandIcon = ComponentType<{ size?: number; color?: string; 'aria-hidden'?: boolean }>;
type Label = keyof Copy['integrations']['labels'];
// Proper names stay as they are; `label` points at translated copy.
type Item = { name?: string; label?: Label; brand?: BrandIcon; icon?: LucideIcon; planned?: boolean };
type GroupKey = keyof Copy['integrations']['groups'];

// Industry standards first; consumer smart-home gear is still listed, just last.
const GROUPS: { key: GroupKey; icon: LucideIcon; items: Item[] }[] = [
  {
    key: 'machines',
    icon: Factory,
    items: [
      { name: 'WAGO PLC (CC100)', icon: Factory },
      { name: 'Modbus RTU', icon: Factory },
      { name: 'MQTT', brand: SiMqtt },
      { name: 'AMQP / RabbitMQ', brand: SiRabbitmq },
      { name: 'Node-RED', brand: SiNodered },
      { name: 'OPC UA', planned: true },
    ],
  },
  {
    key: 'identity',
    icon: KeyRound,
    items: [
      { name: 'Microsoft Entra ID', icon: Building2 },
      { name: 'SAML 2.0', icon: ShieldCheck },
      { name: 'OpenID Connect', brand: SiOpenid },
      { name: 'Keycloak', brand: SiKeycloak },
      { name: 'Authentik', brand: SiAuthentik },
      { name: 'Passkeys / FIDO2', brand: SiWebauthn },
    ],
  },
  {
    key: 'badges',
    icon: IdCard,
    items: [
      { label: 'existingBadges', icon: IdCard },
      { name: 'MIFARE DESFire EV2/EV3', brand: SiNfc },
      { name: 'NTAG 424 DNA', brand: SiNfc },
    ],
  },
  {
    key: 'workstations',
    icon: MonitorSmartphone,
    items: [
      { name: 'Windows', icon: MonitorSmartphone },
      { name: 'macOS', icon: MonitorSmartphone },
      { name: 'Linux', icon: MonitorSmartphone },
    ],
  },
  {
    key: 'it',
    icon: Webhook,
    items: [
      { name: 'REST API / OpenAPI', brand: SiOpenapiinitiative },
      { label: 'webhooks', icon: Webhook },
      { name: 'Prometheus', brand: SiPrometheus },
      { name: 'Grafana', brand: SiGrafana },
      { name: 'Docker', brand: SiDocker },
      { label: 'csv', icon: FileSpreadsheet },
      { label: 'erp', planned: true },
    ],
  },
  {
    key: 'smart',
    icon: Wifi,
    items: [
      { name: 'Shelly', brand: SiShelly },
      { name: 'Home Assistant', brand: SiHomeassistant },
      { name: 'Mosquitto', brand: SiEclipsemosquitto },
      { name: 'ESP32', brand: SiEspressif },
    ],
  },
];

function Pill({ item }: { item: Item }) {
  const { copy, theme } = useSite();
  const Brand = item.brand;
  const Icon = item.icon;
  return (
    <li
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${item.planned ? 'border-dashed border-border text-muted' : 'border-border bg-surface'}`}
    >
      {Brand && <Brand size={14} color={theme === 'dark' ? 'currentColor' : 'default'} aria-hidden />}
      {Icon && <Icon className="size-3.5" aria-hidden />}
      {item.label ? copy.integrations.labels[item.label] : item.name}
      {item.planned && <span className="rounded-full bg-default px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider">{copy.integrations.planned}</span>}
    </li>
  );
}

export function Integrations() {
  const { copy } = useSite();
  const t = copy.integrations;
  return (
    <section id="integrations" className="bg-surface-secondary/60 py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} lead={t.lead} align="left" />
        <Reveal delay={0.1} className="mt-12 divide-y divide-border rounded-3xl border border-border bg-surface">
          {GROUPS.map(({ key, icon: Icon, items }) => (
            <div key={key} className="grid gap-4 p-6 md:grid-cols-[16rem_1fr] md:p-8">
              <div>
                <div className="flex items-center gap-2">
                  <Icon className="size-5 text-accent" aria-hidden />
                  <h3 className="text-lg font-bold">{t.groups[key].title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted">{t.groups[key].body}</p>
              </div>
              <ul className="flex flex-wrap content-start gap-2">
                {items.map((item) => (
                  <Pill key={item.label ?? item.name} item={item} />
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
