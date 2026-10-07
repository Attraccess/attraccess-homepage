// State machine behind the interactive Attractap demo. It mirrors the real reader flow:
// sign in with a card → pick an action → (supervision) → session → end-of-session form → billing.

export type CardKey = 'alex' | 'jamie' | 'priya';
export type ReaderScreen = 'lock' | 'list' | 'running' | 'supervision' | 'form' | 'summary' | 'door';
export type LogKey =
  | 'signedIn'
  | 'started'
  | 'statusInUse'
  | 'fanOn'
  | 'denied'
  | 'supervisionAsk'
  | 'wrongSupervisor'
  | 'supervised'
  | 'counted'
  | 'form'
  | 'ended'
  | 'charged'
  | 'fanOff'
  | 'door'
  | 'signedOut';
export type LogTone = 'info' | 'success' | 'warning' | 'danger' | 'flow';

export interface LogEntry {
  id: number;
  key: LogKey;
  tone: LogTone;
  values: Record<string, string>;
  /** Wall-clock label (HH:MM) of the simulated workshop clock. */
  at: number;
}

export interface ReaderState {
  screen: ReaderScreen;
  /** Who is signed in at the reader right now. */
  user: CardKey | null;
  /** Who owns the running laser session, if any. */
  sessionUser: CardKey | null;
  supervisor: CardKey | null;
  startedAt: number | null;
  fanOn: boolean;
  material: number | null;
  lastCharge: { minutes: number; cents: number } | null;
  balances: Record<CardKey, number>;
  log: LogEntry[];
  seq: number;
  /** Bumped when the reader rejects something, so the UI can shake. */
  rejected: number;
  /** When the action list was last shown; it signs the member out after 30 s of inactivity. */
  listSince: number;
}

/** Introductions on the laser cutter. Priya is also an introducer, so she may supervise. */
export const MEMBERS: Record<CardKey, { introduced: boolean; introducer: boolean }> = {
  alex: { introduced: true, introducer: false },
  jamie: { introduced: false, introducer: false },
  priya: { introduced: true, introducer: true },
};

/** The demo clock runs 60× faster: one real second is one workshop minute. */
export const SPEEDUP = 60;
export const PRICE = { perUse: 50, perMinute: 10 };

export function initialReaderState(): ReaderState {
  return {
    screen: 'lock',
    user: null,
    sessionUser: null,
    supervisor: null,
    startedAt: null,
    fanOn: false,
    material: null,
    lastCharge: null,
    balances: { alex: 4200, jamie: 1500, priya: 6150 },
    log: [],
    seq: 0,
    rejected: 0,
    listSince: 0,
  };
}

export type ReaderAction =
  | { type: 'present'; card: CardKey; now: number }
  | { type: 'start'; now: number }
  | { type: 'requestSupervision'; now: number }
  | { type: 'cancel'; now: number }
  | { type: 'end' }
  | { type: 'chooseMaterial'; index: number }
  | { type: 'submit'; now: number; materialLabel: string }
  | { type: 'openDoor'; now: number }
  | { type: 'backToList'; now: number }
  | { type: 'signOut'; now: number }
  | { type: 'fanOff' }
  | { type: 'reset' };

export function sessionMinutes(startedAt: number, now: number): number {
  return Math.max(1, Math.round(((now - startedAt) / 1000 / 60) * SPEEDUP));
}

export function formatMoney(cents: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h} h ${m} min` : `${m} min`;
}

function log(state: ReaderState, now: number, entries: [LogKey, LogTone, Record<string, string>?][]): ReaderState {
  let seq = state.seq;
  const added = entries.map(([key, tone, values]) => ({ id: ++seq, key, tone, values: values ?? {}, at: now }));
  return { ...state, seq, log: [...added.reverse(), ...state.log].slice(0, 30) };
}

function startSession(state: ReaderState, now: number, supervisor: CardKey | null): ReaderState {
  const user = state.user as CardKey;
  const next: ReaderState = { ...state, screen: 'running', sessionUser: user, supervisor, startedAt: now, fanOn: true };
  return log(next, now, [
    supervisor ? ['supervised', 'success', { supervisor: cap(supervisor) }] : ['started', 'success'],
    ['statusInUse', 'info'],
    ['fanOn', 'flow'],
    ...(supervisor ? ([['counted', 'info']] as [LogKey, LogTone][]) : []),
  ]);
}

const cap = (card: CardKey) => card.charAt(0).toUpperCase() + card.slice(1);

export function readerReducer(state: ReaderState, action: ReaderAction): ReaderState {
  const next = reduce(state, action);
  // Every arrival on the action list restarts the 30 s auto sign-out.
  if (next.screen === 'list' && state.screen !== 'list' && 'now' in action) return { ...next, listSince: action.now };
  return next;
}

function reduce(state: ReaderState, action: ReaderAction): ReaderState {
  switch (action.type) {
    case 'present': {
      const { card, now } = action;
      if (state.screen === 'lock') {
        const signedIn = log({ ...state, user: card }, now, [['signedIn', 'info', { name: cap(card) }]]);
        return { ...signedIn, screen: state.sessionUser === card ? 'running' : 'list' };
      }
      if (state.screen === 'supervision') {
        if (card === state.user) return state;
        if (!MEMBERS[card].introducer) {
          return { ...log(state, now, [['wrongSupervisor', 'danger', { name: cap(card) }]]), rejected: state.rejected + 1 };
        }
        return startSession(state, now, card);
      }
      return { ...state, rejected: state.rejected + 1 };
    }
    case 'start':
      if (state.screen !== 'list' || !state.user || state.sessionUser) return state;
      if (!MEMBERS[state.user].introduced) {
        return { ...log(state, action.now, [['denied', 'danger', { name: cap(state.user) }]]), rejected: state.rejected + 1 };
      }
      return startSession(state, action.now, null);
    case 'requestSupervision':
      if (state.screen !== 'list' || !state.user || state.sessionUser) return state;
      return { ...log(state, action.now, [['supervisionAsk', 'warning']]), screen: 'supervision' };
    case 'cancel':
      return { ...state, screen: state.screen === 'form' ? 'running' : 'list' };
    case 'end':
      return state.screen === 'running' ? { ...state, screen: 'form', material: null } : state;
    case 'chooseMaterial':
      return { ...state, material: action.index };
    case 'submit': {
      if (state.screen !== 'form' || state.material === null || !state.sessionUser || state.startedAt === null) return state;
      const minutes = sessionMinutes(state.startedAt, action.now);
      const cents = PRICE.perUse + PRICE.perMinute * minutes;
      const payer = state.sessionUser;
      const next: ReaderState = {
        ...state,
        screen: 'summary',
        sessionUser: null,
        supervisor: null,
        startedAt: null,
        lastCharge: { minutes, cents },
        balances: { ...state.balances, [payer]: state.balances[payer] - cents },
      };
      return log(next, action.now, [
        ['form', 'info', { material: action.materialLabel }],
        ['ended', 'success', { duration: formatDuration(minutes) }],
        ['charged', 'info', { amount: String(cents), name: cap(payer) }],
        ['fanOff', 'flow'],
      ]);
    }
    case 'openDoor':
      if (!state.user) return state;
      return { ...log(state, action.now, [['door', 'success', { name: cap(state.user) }]]), screen: 'door' };
    case 'backToList':
      return { ...state, screen: 'list' };
    case 'signOut':
      if (!state.user) return state;
      return { ...log(state, action.now, [['signedOut', 'info', { name: cap(state.user) }]]), screen: 'lock', user: null };
    case 'fanOff':
      return state.sessionUser ? state : { ...state, fanOn: false };
    case 'reset':
      return initialReaderState();
  }
}
