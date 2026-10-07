import { describe, expect, it } from 'vitest';
import { initialReaderState, readerReducer, type ReaderAction, type ReaderState } from './reader';

const T0 = 1_000_000;
const run = (actions: ReaderAction[], state: ReaderState = initialReaderState()) => actions.reduce(readerReducer, state);

describe('readerReducer', () => {
  it('lets an introduced member start a session, which switches the exhaust on', () => {
    const state = run([
      { type: 'present', card: 'alex', now: T0 },
      { type: 'start', now: T0 + 1000 },
    ]);
    expect(state).toMatchObject({ screen: 'running', sessionUser: 'alex', supervisor: null, fanOn: true });
    expect(state.log.map((entry) => entry.key)).toContain('fanOn');
  });

  it('refuses a member without an introduction', () => {
    const state = run([
      { type: 'present', card: 'jamie', now: T0 },
      { type: 'start', now: T0 },
    ]);
    expect(state.screen).toBe('list');
    expect(state.sessionUser).toBeNull();
    expect(state.rejected).toBe(1);
    expect(state.log[0].key).toBe('denied');
  });

  it('only accepts an introducer as supervisor', () => {
    const waiting = run([
      { type: 'present', card: 'jamie', now: T0 },
      { type: 'requestSupervision', now: T0 },
      { type: 'present', card: 'alex', now: T0 },
    ]);
    expect(waiting.screen).toBe('supervision');
    expect(waiting.log[0].key).toBe('wrongSupervisor');

    const supervised = readerReducer(waiting, { type: 'present', card: 'priya', now: T0 });
    expect(supervised).toMatchObject({ screen: 'running', sessionUser: 'jamie', supervisor: 'priya' });
  });

  it('bills the session owner per use plus per (60× accelerated) minute after the end form', () => {
    const before = initialReaderState().balances.jamie;
    const state = run([
      { type: 'present', card: 'jamie', now: T0 },
      { type: 'requestSupervision', now: T0 },
      { type: 'present', card: 'priya', now: T0 },
      { type: 'end' },
      { type: 'chooseMaterial', index: 1 },
      { type: 'submit', now: T0 + 7000, materialLabel: 'Acrylic' },
    ]);
    // 7 s at 60× is 7 minutes: 50 per use + 7 × 10 per minute.
    expect(state.lastCharge).toEqual({ minutes: 7, cents: 120 });
    expect(state.balances.jamie).toBe(before - 120);
    expect(state.sessionUser).toBeNull();
  });

  it('refuses to submit the end form without a material', () => {
    const state = run([
      { type: 'present', card: 'alex', now: T0 },
      { type: 'start', now: T0 },
      { type: 'end' },
      { type: 'submit', now: T0 + 5000, materialLabel: 'Plywood' },
    ]);
    expect(state.screen).toBe('form');
  });

  it('restarts the auto sign-out timer whenever the action list is shown again', () => {
    const signedIn = run([{ type: 'present', card: 'alex', now: T0 }]);
    expect(signedIn.listSince).toBe(T0);
    const back = run(
      [
        { type: 'openDoor', now: T0 + 5000 },
        { type: 'backToList', now: T0 + 7000 },
      ],
      signedIn,
    );
    expect(back.listSince).toBe(T0 + 7000);
  });
});
