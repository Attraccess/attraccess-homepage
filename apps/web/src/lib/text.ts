/** Keeps a spaced dash on the line of the word before it, so no line starts with “– ”. */
export function keepDash(text: string): string {
  return text.replace(/ ([–—]) /g, ' $1 ');
}

/** Applies `keepDash` to every string of a copy dictionary, so no render site can forget it. */
export function keepDashes<T>(value: T): T {
  if (typeof value === 'string') return keepDash(value) as T;
  if (Array.isArray(value)) return value.map(keepDashes) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, keepDashes(entry)])) as T;
  }
  return value;
}
