import type { Copy } from '../i18n/en';

export type ReferenceKey = keyof Copy['references'];
export const REFERENCE_KEYS: ReferenceKey[] = ['tuhh', 'atic'];

// Typeset wordmarks until we have the customers' own logo files.
export function ReferenceLogo({ reference, className = '' }: { reference: ReferenceKey; className?: string }) {
  if (reference === 'tuhh')
    return (
      <span className={`inline-flex items-center gap-2.5 ${className}`}>
        <span className="font-display text-[1.6em] font-black leading-none tracking-tight">TUHH</span>
        <span className="border-l border-current/30 pl-2.5 text-[0.62em] font-medium uppercase leading-tight tracking-wide opacity-70">
          Technische
          <br />
          Universität Hamburg
        </span>
      </span>
    );
  return (
    <span className={`inline-flex items-baseline gap-1 ${className}`}>
      <span className="text-[1.5em] font-light lowercase leading-none tracking-[0.18em]">atic</span>
      <span className="text-[0.75em] font-semibold uppercase tracking-[0.3em] opacity-70">interior</span>
    </span>
  );
}
