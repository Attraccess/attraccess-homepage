import { Button } from '@heroui/react';
import { AnimatePresence, motion, useAnimationControls } from 'motion/react';
import { Fan, Nfc, RotateCcw, Volume2, VolumeX, Wifi } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { AttractapScreen } from '../components/AttractapScreen';
import { SectionHeading } from '../components/primitives';
import { formatMoney, initialReaderState, readerReducer, sessionMinutes, type CardKey, type LogTone } from '../lib/reader';
import { fill, useSite } from '../lib/site';
import { beep } from '../lib/sound';
import { PAD, SCREEN, rectStyle } from '../lib/device';

const CARD_KEYS: CardKey[] = ['alex', 'jamie', 'priya'];
const CARD_STYLE: Record<CardKey, string> = {
  alex: 'from-[#256d7b] to-[#163f48]',
  jamie: 'from-[#c57881] to-[#7b3f48]',
  priya: 'from-[#2f3e42] to-[#121b1d]',
};


const TONE_DOT: Record<LogTone, string> = {
  info: 'bg-fw-primary',
  success: 'bg-fw-success',
  warning: 'bg-fw-warning',
  danger: 'bg-fw-danger',
  flow: 'bg-neon',
};

function MemberCard({
  card,
  onPresent,
  padRef,
  onHover,
}: {
  card: CardKey;
  onPresent: (card: CardKey) => void;
  padRef: React.RefObject<HTMLDivElement | null>;
  onHover: (over: boolean) => void;
}) {
  const { copy } = useSite();
  const person = copy.demo.cards[card];
  const overPad = (x: number, y: number) => {
    const rect = padRef.current?.getBoundingClientRect();
    return !!rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };
  return (
    <motion.button
      type="button"
      drag
      dragSnapToOrigin
      dragElastic={0.6}
      whileHover={{ y: -6, rotate: -1.5 }}
      whileDrag={{ scale: 1.06, rotate: 4, zIndex: 40, cursor: 'grabbing' }}
      onDrag={(_, info) => onHover(overPad(info.point.x - window.scrollX, info.point.y - window.scrollY))}
      onDragEnd={(_, info) => {
        onHover(false);
        if (overPad(info.point.x - window.scrollX, info.point.y - window.scrollY)) onPresent(card);
      }}
      onTap={() => onPresent(card)}
      aria-label={`${person.name} – ${person.role}`}
      className={`relative aspect-[1.586] w-full max-w-[15rem] cursor-grab touch-none select-none overflow-hidden rounded-2xl bg-gradient-to-br p-4 text-left text-white shadow-[0_20px_40px_-16px_rgb(0_0_0/0.6)] ${CARD_STYLE[card]}`}
    >
      <span className="absolute -right-6 -top-6 size-28 rounded-full bg-white/10" aria-hidden />
      <span className="flex items-start justify-between">
        <img src="/logo.png" alt="" className="h-8 w-auto opacity-90" draggable={false} />
        <Wifi className="size-5 rotate-90 opacity-80" aria-hidden />
      </span>
      <span className="absolute inset-x-4 bottom-3.5">
        <span className="block font-display text-xl font-bold leading-none">{person.name}</span>
        <span className="mt-1 block text-xs text-white/75">{person.role}</span>
      </span>
    </motion.button>
  );
}

export function TapDemo() {
  const { copy, locale } = useSite();
  const [state, dispatch] = useReducer(readerReducer, undefined, initialReaderState);
  const [hoveringPad, setHoveringPad] = useState(false);
  const [sound, setSound] = useState(true);
  const [ripple, setRipple] = useState(0);
  const padRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  const shake = useAnimationControls();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, []);

  // Keep the 480 px firmware canvas mapped onto the render's screen as the device resizes.
  useLayoutEffect(() => {
    const element = deviceRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setScale((entry.contentRect.width * SCREEN.width) / 480));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // The flow waits three (demo) minutes before switching the exhaust off – three real seconds.
  useEffect(() => {
    if (!state.fanOn || state.sessionUser) return;
    const id = window.setTimeout(() => dispatch({ type: 'fanOff' }), 3000);
    return () => window.clearTimeout(id);
  }, [state.fanOn, state.sessionUser]);

  const lastRejected = useRef(state.rejected);
  useEffect(() => {
    if (state.rejected === lastRejected.current) return;
    lastRejected.current = state.rejected;
    if (sound) beep('error');
    void shake.start({ x: [0, -10, 10, -6, 6, 0], transition: { duration: 0.4 } });
  }, [state.rejected, sound, shake]);

  const present = useCallback(
    (card: CardKey) => {
      setRipple((r) => r + 1);
      if (sound) beep('read');
      dispatch({ type: 'present', card, now: Date.now() });
    },
    [sound],
  );

  const t = copy.demo;
  const logText = (key: keyof typeof t.log, values: Record<string, string>) => {
    const rendered = key === 'charged' ? { ...values, amount: formatMoney(Number(values.amount), locale) } : values;
    return fill(t.log[key], rendered);
  };
  const inUse = state.sessionUser !== null;
  const balanceUser = state.user ?? state.sessionUser;

  return (
    <section id="reader" className="relative overflow-hidden bg-ink py-28 text-white">
      <img src="/brand/neon-wallpaper.webp" alt="" aria-hidden className="pointer-events-none absolute inset-0 size-full object-cover opacity-25 mix-blend-screen" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-ink)_80%)]" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} lead={t.lead} tone="night" />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,380px)_1fr]">
          {/* Member cards */}
          <div className="order-2 flex flex-col items-center gap-5 lg:order-1 lg:items-end">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">{t.dragHint} →</p>
            <div className="grid w-full max-w-[15rem] gap-4 sm:max-w-none sm:grid-cols-3 lg:max-w-[15rem] lg:grid-cols-1">
              {CARD_KEYS.map((card) => (
                <MemberCard key={card} card={card} onPresent={present} padRef={padRef} onHover={setHoveringPad} />
              ))}
            </div>
            <p className="max-w-[15rem] text-center text-sm text-white/60 lg:text-right">{t.hint}</p>
          </div>

          {/* The reader */}
          <motion.div animate={shake} className="order-1 mx-auto w-full max-w-[380px] lg:order-2">
            <div ref={deviceRef} className="relative drop-shadow-[0_40px_60px_rgb(0_0_0/0.6)]">
              <img src="/hardware/attractap.webp" alt="Attractap Touch" className="block w-full select-none" draggable={false} />
              <div
                className="absolute overflow-clip rounded-[2.5%]"
                style={rectStyle(SCREEN)}
              >
                <div style={{ transform: `scale(${scale})`, transformOrigin: '0 0' }}>
                  <AttractapScreen state={state} dispatch={dispatch} />
                </div>
              </div>
              <div
                ref={padRef}
                className="pointer-events-none absolute rounded-[12%]"
                style={rectStyle(PAD)}
              >
                <motion.div
                  className="absolute inset-0 rounded-[12%] border-2 border-neon"
                  animate={{ opacity: hoveringPad ? 1 : 0, boxShadow: hoveringPad ? '0 0 40px 6px rgb(94 230 242 / 0.6)' : '0 0 0 0 rgb(94 230 242 / 0)' }}
                />
                <AnimatePresence>
                  {ripple > 0 && (
                    <motion.span
                      key={ripple}
                      className="absolute inset-0 rounded-full border-2 border-neon"
                      initial={{ scale: 0.4, opacity: 0.9 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Backstage */}
          <div className="order-3 w-full max-w-md justify-self-center lg:justify-self-start">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-neon">{t.panel.status}</p>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    isIconOnly
                    className="text-white/70"
                    aria-label={sound ? t.panel.soundOn : t.panel.soundOff}
                    onPress={() => setSound((s) => !s)}
                  >
                    {sound ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                  </Button>
                  <Button size="sm" variant="ghost" isIconOnly className="text-white/70" aria-label={t.reset} onPress={() => dispatch({ type: 'reset' })}>
                    <RotateCcw className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/[0.05] p-3">
                <img src="/demo/laser-cutter.webp" alt="" className="size-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold">{t.device.resources.laser}</div>
                  <div className="font-mono text-xs tabular-nums text-white/60">
                    {inUse && state.startedAt ? `${copy.demo.cards[state.sessionUser as CardKey].name} · ${sessionMinutes(state.startedAt, now)} min` : '—'}
                  </div>
                </div>
                <motion.span
                  layout
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${inUse ? 'bg-fw-warning/20 text-fw-warning' : 'bg-fw-success/20 text-fw-success'}`}
                >
                  {inUse ? t.device.inUse : t.device.available}
                </motion.span>
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.05] p-3">
                  <motion.span
                    animate={state.fanOn ? { rotate: 360 } : { rotate: 0 }}
                    transition={state.fanOn ? { repeat: Infinity, ease: 'linear', duration: 0.8 } : { duration: 0.6 }}
                    className={state.fanOn ? 'text-neon' : 'text-white/40'}
                  >
                    <Fan className="size-6" aria-hidden />
                  </motion.span>
                  <div className="text-xs leading-tight">
                    <div className="text-white/60">{t.panel.fan}</div>
                    <div className={`font-semibold ${state.fanOn ? 'text-neon' : ''}`}>{state.fanOn ? t.panel.on : t.panel.off}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.05] p-3">
                  <Nfc className="size-6 text-white/40" aria-hidden />
                  <div className="text-xs leading-tight">
                    <div className="text-white/60">
                      {t.panel.balance}
                      {balanceUser ? ` · ${copy.demo.cards[balanceUser].name}` : ''}
                    </div>
                    <div className="font-semibold tabular-nums">{balanceUser ? formatMoney(state.balances[balanceUser], locale) : '—'}</div>
                  </div>
                </div>
              </div>

              <p className="mt-5 font-mono text-xs uppercase tracking-[0.2em] text-white/50">{t.log.title}</p>
              <ol className="mt-3 h-64 space-y-2 overflow-hidden" aria-live="polite">
                {state.log.length === 0 && <li className="text-sm text-white/40">{t.log.empty}</li>}
                <AnimatePresence initial={false}>
                  {state.log.slice(0, 8).map((entry) => (
                    <motion.li
                      key={entry.id}
                      layout
                      initial={{ opacity: 0, x: 20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-2.5 text-sm"
                    >
                      <span className={`mt-1.5 size-2 shrink-0 rounded-full ${TONE_DOT[entry.tone]}`} aria-hidden />
                      <span className={entry.tone === 'flow' ? 'text-neon' : 'text-white/85'}>{logText(entry.key, entry.values)}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ol>
              <p className="mt-3 text-xs text-white/40">{t.panel.speed}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
