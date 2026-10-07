import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { Fan, Hourglass, Play, Power, Square, TimerOff, type LucideIcon } from 'lucide-react';
import {
  SiAuthentik,
  SiDocker,
  SiEclipsemosquitto,
  SiEspressif,
  SiGrafana,
  SiHomeassistant,
  SiKeycloak,
  SiMqtt,
  SiNodered,
  SiOpenid,
  SiPrometheus,
  SiRabbitmq,
  SiShelly,
  SiSqlite,
  SiWebauthn,
} from '@icons-pack/react-simple-icons';
import { useEffect, useRef, useState } from 'react';
import { BrowserFrame, Reveal, SectionHeading, Shot } from '../components/primitives';
import { useSite } from '../lib/site';

type NodeKind = 'input' | 'output' | 'processing';

// Phases of the looping animation: which node glows and which connector carries a pulse.
const PHASES = 7;

function FlowNode({ icon: Icon, label, kind, active, spinning }: { icon: LucideIcon; label: string; kind: NodeKind; active: boolean; spinning?: boolean }) {
  const kinds: Record<NodeKind, string> = {
    input: 'text-success',
    output: 'text-accent',
    processing: 'text-warning',
  };
  return (
    <motion.div
      animate={{
        scale: active ? 1.04 : 1,
        boxShadow: active ? '0 0 0 2px var(--accent), 0 12px 30px -10px color-mix(in oklab, var(--accent) 60%, transparent)' : '0 0 0 1px var(--border)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="flex min-w-0 items-center gap-2.5 rounded-xl bg-surface px-3.5 py-3"
    >
      <motion.span
        animate={spinning ? { rotate: 360 } : { rotate: 0 }}
        transition={spinning ? { repeat: Infinity, duration: 0.9, ease: 'linear' } : { duration: 0.3 }}
        className={`shrink-0 ${kinds[kind]}`}
      >
        <Icon className="size-4.5" aria-hidden />
      </motion.span>
      <span className="text-sm font-medium leading-tight">{label}</span>
    </motion.div>
  );
}

function Connector({ active }: { active: boolean }) {
  return (
    <div className="relative mx-1 h-6 w-px shrink-0 bg-border sm:h-px sm:w-10" aria-hidden>
      <AnimatePresence>
        {active && (
          <motion.span
            className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)] sm:left-0 sm:top-1/2"
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], ...(typeof window !== 'undefined' && window.innerWidth >= 640 ? { x: [0, 40] } : { y: [0, 24] }) }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Chain({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col items-start sm:flex-row sm:items-center">{children}</div>;
}

const INTEGRATIONS = [
  { name: 'Shelly', icon: SiShelly },
  { name: 'MQTT', icon: SiMqtt },
  { name: 'Mosquitto', icon: SiEclipsemosquitto },
  { name: 'Home Assistant', icon: SiHomeassistant },
  { name: 'Node-RED', icon: SiNodered },
  { name: 'RabbitMQ', icon: SiRabbitmq },
  { name: 'Keycloak', icon: SiKeycloak },
  { name: 'Authentik', icon: SiAuthentik },
  { name: 'OpenID Connect', icon: SiOpenid },
  { name: 'Passkeys', icon: SiWebauthn },
  { name: 'Prometheus', icon: SiPrometheus },
  { name: 'Grafana', icon: SiGrafana },
  { name: 'Docker', icon: SiDocker },
  { name: 'SQLite', icon: SiSqlite },
  { name: 'ESP32', icon: SiEspressif },
];

export function Automation() {
  const { copy, theme } = useSite();
  const n = copy.automation.nodes;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: '-20% 0px' });
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const id = window.setInterval(() => setPhase((p) => (p + 1) % PHASES), 1100);
    return () => window.clearInterval(id);
  }, [inView, reduceMotion]);

  const fanOn = phase >= 1 && phase <= 4;

  return (
    <section id="automation" className="relative overflow-hidden bg-surface-secondary/60 py-28">
      <div className="mat-grid pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.25fr]">
          <div>
            <SectionHeading eyebrow={copy.automation.eyebrow} title={copy.automation.title} lead={copy.automation.lead} align="left" />
            <Reveal delay={0.1} className="mt-10">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">{copy.automation.integrations}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {INTEGRATIONS.map(({ name, icon: Icon }) => (
                  <li key={name} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm">
                    <Icon size={14} color={theme === 'dark' ? 'currentColor' : 'default'} aria-hidden />
                    {name}
                  </li>
                ))}
                <li className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm">
                  <span className="font-black tracking-tighter text-[#6ec800]" aria-hidden>
                    W
                  </span>
                  WAGO CC100
                </li>
              </ul>
            </Reveal>
          </div>

          <Reveal ref={ref} delay={0.15}>
            <div className="rounded-3xl border border-border bg-background/80 p-6 shadow-float backdrop-blur sm:p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted">laser-cutter.flow</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${fanOn ? 'bg-accent/15 text-accent' : 'bg-default text-muted'}`}>
                  <Fan className="size-3.5" aria-hidden />
                  {fanOn ? copy.demo.panel.on : copy.demo.panel.off}
                </span>
              </div>
              <div className="mt-6 space-y-5">
                <Chain>
                  <FlowNode icon={Play} label={n.started} kind="input" active={phase === 0} />
                  <Connector active={phase === 0} />
                  <FlowNode icon={Power} label={n.fanOn} kind="output" active={phase === 1} spinning={fanOn} />
                </Chain>
                <Chain>
                  <FlowNode icon={Square} label={n.stopped} kind="input" active={phase === 3} />
                  <Connector active={phase === 3} />
                  <FlowNode icon={Hourglass} label={n.wait} kind="processing" active={phase === 4} />
                  <Connector active={phase === 4} />
                  <FlowNode icon={Power} label={n.fanOff} kind="output" active={phase === 5} />
                </Chain>
                <Chain>
                  <FlowNode icon={TimerOff} label={n.idle} kind="input" active={phase === 6} />
                  <Connector active={phase === 6} />
                  <FlowNode icon={Square} label={n.end} kind="output" active={false} />
                </Chain>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal className="mt-20">
          <BrowserFrame url="makerspace.example/resources/1/flows">
            <Shot name="resource-flows" alt={copy.automation.caption} />
          </BrowserFrame>
          <p className="mt-4 text-center text-sm text-muted">{copy.automation.caption}</p>
        </Reveal>
      </div>
    </section>
  );
}
