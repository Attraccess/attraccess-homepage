// Tiny WebAudio beeps in the spirit of the reader's buzzer. Created lazily on the first user gesture.
let context: AudioContext | null = null;

function tone(ctx: AudioContext, frequency: number, start: number, duration: number) {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = 'square';
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.05, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function beep(kind: 'read' | 'error') {
  try {
    context ??= new AudioContext();
    const start = context.currentTime;
    if (kind === 'read') {
      tone(context, 2400, start, 0.09);
    } else {
      tone(context, 440, start, 0.12);
      tone(context, 330, start + 0.16, 0.18);
    }
  } catch {
    // Audio is a nicety; browsers without WebAudio just stay quiet.
  }
}
