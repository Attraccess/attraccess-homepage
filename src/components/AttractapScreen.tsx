import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, type ReactNode } from 'react';
import { CheckCircle2, ChevronLeft, DoorOpen, Pencil, X } from 'lucide-react';
import { MEMBERS, formatMoney, sessionMinutes, type ReaderAction, type ReaderState } from '../lib/reader';
import { fill, useSite } from '../lib/site';

// Everything inside is laid out on the reader's native 480 × 480 px canvas and scaled by the parent.
const SIGN_OUT_AFTER = 30;

function useNow(active: boolean, intervalMs = 250) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [active, intervalMs]);
  return now;
}

function clock(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
}

function Footer() {
  return (
    <div className="absolute inset-x-6 bottom-2 flex justify-between text-[10px] text-fw-muted">
      <span>Attractap</span>
      <span>Attractap Touch</span>
    </div>
  );
}

function TopBar({ name, onSignOut, signOutLabel, countdown }: { name: string; onSignOut: () => void; signOutLabel: string; countdown?: number }) {
  return (
    <div className="flex items-center gap-3 px-5 pt-5">
      <button type="button" onClick={onSignOut} className="rounded-md bg-fw-danger px-3.5 py-2.5 text-[15px] text-fw-bg active:brightness-90">
        {signOutLabel}
      </button>
      <div className="flex-1">
        <div className="flex items-baseline justify-between text-[17px]">
          <span>{name}</span>
          {countdown !== undefined && <span className="text-[14px] text-fw-muted">{countdown} s</span>}
        </div>
        {countdown !== undefined && (
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-fw-surface-2">
            <motion.div
              className="h-full rounded-full bg-fw-primary"
              initial={false}
              animate={{ width: `${(countdown / SIGN_OUT_AFTER) * 100}%` }}
              transition={{ duration: 0.25, ease: 'linear' }}
            />
          </div>
        )}
      </div>
      <span className="self-start rounded-md bg-fw-success px-1.5 py-0.5 text-[12px] font-semibold text-fw-bg">OK NET</span>
    </div>
  );
}

function Row({
  title,
  status,
  statusTone,
  action,
  actionTone,
  onAction,
  disabled,
}: {
  title: string;
  status: string;
  statusTone: 'muted' | 'success' | 'warning';
  action: string;
  actionTone: 'success' | 'warning' | 'primary' | 'disabled';
  onAction: () => void;
  disabled?: boolean;
}) {
  const tones = {
    success: 'bg-fw-success text-fw-bg',
    warning: 'bg-fw-warning text-fw-bg',
    primary: 'bg-fw-primary text-fw-on-primary',
    disabled: 'bg-fw-surface-2 text-fw-muted',
  };
  const statusTones = { muted: 'text-fw-muted', success: 'text-fw-success', warning: 'text-fw-warning' };
  return (
    <div className="flex h-[74px] overflow-hidden rounded-md">
      <div className="flex w-1/2 flex-col justify-center bg-fw-surface/95 px-4">
        <span className="text-[19px] leading-tight">{title}</span>
        <span className={`mt-1 text-[13px] ${statusTones[statusTone]}`}>{status}</span>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onAction}
        className={`w-1/2 text-[19px] transition active:brightness-90 ${tones[actionTone]}`}
      >
        {action}
      </button>
    </div>
  );
}

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`absolute inset-0 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function AttractapScreen({ state, dispatch }: { state: ReaderState; dispatch: (action: ReaderAction) => void }) {
  const { copy, locale } = useSite();
  const t = copy.demo.device;
  const names = copy.demo.cards;
  const now = useNow(true);
  const countdown = Math.max(0, SIGN_OUT_AFTER - Math.floor((now - state.listSince) / 1000));
  useEffect(() => {
    if (state.screen === 'list' && countdown === 0) dispatch({ type: 'signOut', now: Date.now() });
  }, [countdown, state.screen, dispatch]);

  useEffect(() => {
    if (state.screen === 'door') {
      const id = window.setTimeout(() => dispatch({ type: 'backToList', now: Date.now() }), 1800);
      return () => window.clearTimeout(id);
    }
    if (state.screen === 'summary') {
      const id = window.setTimeout(() => dispatch({ type: 'signOut', now: Date.now() }), 3600);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [state.screen, dispatch]);

  const user = state.user;
  const userName = user ? names[user].name : '';
  const laserBusy = state.sessionUser !== null && state.sessionUser !== user;
  const minutes = state.startedAt ? sessionMinutes(state.startedAt, now) : 0;
  const statusLabel = state.sessionUser ? t.inUse : t.available;

  return (
    <div className="relative size-[480px] overflow-clip bg-fw-bg font-device text-fw-text select-none">
      <AnimatePresence mode="popLayout" initial={false}>
        {state.screen === 'lock' && (
          <Panel key="lock">
            <img src="/brand/neon-wallpaper.webp" alt="" className="absolute inset-0 size-full object-cover object-[0%_70%]" />
            <div className="relative flex items-center gap-3 px-5 pt-4">
              <span className="flex size-10 items-center justify-center rounded-md border border-fw-surface-2 bg-fw-bg/60">
                <ChevronLeft className="size-6" />
              </span>
              <img src="/logo.png" alt="" className="h-9 w-auto" />
              <span className="text-[17px] font-medium">Attraccess</span>
              <span className="ml-4 leading-tight">
                <span className="block text-[17px]">{t.resources.laser}</span>
                <span className={`block text-[15px] ${state.sessionUser ? 'text-fw-warning' : 'text-fw-success'}`}>{statusLabel}</span>
              </span>
              <span className="ml-auto self-start rounded-md bg-fw-success px-1.5 py-0.5 text-[12px] font-semibold text-fw-bg">OK NET</span>
            </div>
            <div className="relative mt-16 px-12 text-[31px] leading-[1.25]">
              <div>{t.lock[0]}</div>
              <div className="pl-20">{t.lock[1]}</div>
            </div>
            <Footer />
          </Panel>
        )}

        {state.screen === 'list' && user && (
          <Panel key="list">
            <img src="/brand/neon-wallpaper.webp" alt="" className="absolute inset-0 size-full object-cover object-[0%_70%] opacity-60" />
            <div className="relative">
              <TopBar name={userName} signOutLabel={t.signOut} onSignOut={() => dispatch({ type: 'signOut', now: Date.now() })} countdown={countdown} />
              <div className="mt-5 space-y-2.5 px-5">
                {laserBusy ? (
                  <Row title={t.resources.laser} status={t.inUse} statusTone="warning" action={t.inUse} actionTone="disabled" onAction={() => undefined} disabled />
                ) : MEMBERS[user].introduced ? (
                  <Row title={t.resources.laser} status={t.available} statusTone="muted" action={t.start} actionTone="success" onAction={() => dispatch({ type: 'start', now: Date.now() })} />
                ) : (
                  <Row
                    title={t.resources.laser}
                    status={t.missingIntro}
                    statusTone="warning"
                    action={t.introduction}
                    actionTone="warning"
                    onAction={() => dispatch({ type: 'requestSupervision', now: Date.now() })}
                  />
                )}
                <Row title={t.resources.cnc} status={t.maintenance} statusTone="warning" action={t.maintenance} actionTone="disabled" onAction={() => undefined} disabled />
                <Row title={t.resources.door} status={t.available} statusTone="muted" action={t.open} actionTone="primary" onAction={() => dispatch({ type: 'openDoor', now: Date.now() })} />
              </div>
            </div>
            <Footer />
          </Panel>
        )}

        {state.screen === 'running' && user && (
          <Panel key="running">
            <TopBar name={userName} signOutLabel={t.signOut} onSignOut={() => dispatch({ type: 'signOut', now: Date.now() })} />
            <div className="px-6 pt-6">
              <h3 className="font-device text-[34px] font-normal">{t.resources.laser}</h3>
              <div className="mt-5 grid grid-cols-3 text-[17px] leading-snug">
                <div>
                  <div className="text-fw-muted">{t.started}</div>
                  <div>{new Date(state.startedAt ?? now).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                <div className="text-center">
                  <div className="text-fw-muted">{t.user}</div>
                  <div>{state.sessionUser ? names[state.sessionUser].name : ''}</div>
                </div>
                <div className="text-right">
                  <div className="text-fw-muted">{t.duration}</div>
                  <div className="tabular-nums">{clock(minutes)}</div>
                </div>
              </div>
              {state.supervisor && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-fw-primary/15 px-3 py-1.5 text-[14px] text-fw-primary">
                  <CheckCircle2 className="size-4" />
                  {t.supervisedBy}: {names[state.supervisor].name}
                </div>
              )}
              <button
                type="button"
                onClick={() => dispatch({ type: 'end' })}
                className="mt-6 w-full rounded-md bg-fw-danger py-3.5 text-[19px] text-fw-bg active:brightness-90"
              >
                {t.end}
              </button>
            </div>
            <Footer />
          </Panel>
        )}

        {state.screen === 'supervision' && user && (
          <Panel key="supervision" className="flex flex-col items-center px-8 pt-14 text-center">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-fw-surface-2">
              <motion.div className="h-full bg-fw-primary" initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 30, ease: 'linear' }} />
            </div>
            <div className="mt-6 text-[28px] text-fw-muted">{t.supervisionTitle}</div>
            <div className="mt-3 text-[40px]">{userName}</div>
            <div className="mt-4 text-[26px]">{t.supervisionBody}</div>
            <div className="mt-2 text-[17px] text-fw-muted">{t.supervisionSub}</div>
            <button
              type="button"
              onClick={() => dispatch({ type: 'cancel', now: Date.now() })}
              className="mt-7 w-72 rounded-md border border-fw-surface-2 bg-fw-surface py-3 text-[22px] active:brightness-90"
            >
              {t.cancel}
            </button>
            <Footer />
          </Panel>
        )}

        {state.screen === 'form' && (
          <Panel key="form" className="px-5 pt-5">
            <div className="flex items-center justify-between text-[14px] text-fw-muted">
              <span>1 / 1</span>
              <button type="button" onClick={() => dispatch({ type: 'cancel', now: Date.now() })} className="flex size-9 items-center justify-center rounded-md bg-fw-text text-fw-bg">
                <X className="size-5" />
              </button>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-fw-primary" />
            <div className="mt-3 text-[15px] text-fw-muted">{t.formHint}</div>
            <div className="mt-6 text-[24px]">{t.formQuestion} *</div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {t.materials.map((material, index) => (
                <button
                  key={material}
                  type="button"
                  onClick={() => dispatch({ type: 'chooseMaterial', index })}
                  className={`flex items-center justify-between rounded-md border px-3 py-3 text-[17px] transition ${
                    state.material === index ? 'border-fw-primary bg-fw-primary/15 text-fw-primary' : 'border-fw-surface-2 bg-fw-surface'
                  }`}
                >
                  {material}
                  {state.material === index && <Pencil className="size-4" />}
                </button>
              ))}
            </div>
            <div className="absolute inset-x-5 bottom-8 flex gap-2">
              <button type="button" onClick={() => dispatch({ type: 'cancel', now: Date.now() })} className="w-1/3 rounded-md border border-fw-surface-2 bg-fw-surface py-3 text-[19px]">
                ←
              </button>
              <button
                type="button"
                disabled={state.material === null}
                onClick={() => dispatch({ type: 'submit', now: Date.now(), materialLabel: t.materials[state.material ?? 0] })}
                className="flex-1 rounded-md bg-fw-primary py-3 text-[19px] text-fw-on-primary transition disabled:opacity-40"
              >
                {t.submit}
              </button>
            </div>
            <Footer />
          </Panel>
        )}

        {state.screen === 'summary' && state.lastCharge && (
          <Panel key="summary" className="flex flex-col items-center justify-center text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14 }}>
              <CheckCircle2 className="size-24 text-fw-success" strokeWidth={1.5} />
            </motion.div>
            <div className="mt-4 text-[32px]">{fill(t.thanks, { name: userName })}</div>
            <div className="mt-5 flex gap-10 text-[17px]">
              <div>
                <div className="text-fw-muted">{t.duration}</div>
                <div>{clock(state.lastCharge.minutes)}</div>
              </div>
              <div>
                <div className="text-fw-muted">{t.charged}</div>
                <div>{formatMoney(state.lastCharge.cents, locale)}</div>
              </div>
            </div>
            <div className="mt-6 text-[17px] text-fw-muted">{t.bye}</div>
            <Footer />
          </Panel>
        )}

        {state.screen === 'door' && (
          <Panel key="door" className="flex flex-col items-center justify-center text-center">
            <motion.div initial={{ rotate: -20, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 12 }}>
              <DoorOpen className="size-28 text-fw-primary" strokeWidth={1.3} />
            </motion.div>
            <div className="mt-5 text-[32px]">{t.doorOpen}</div>
            <div className="mt-1 text-[18px] text-fw-muted">{t.resources.door}</div>
            <Footer />
          </Panel>
        )}
      </AnimatePresence>
    </div>
  );
}
