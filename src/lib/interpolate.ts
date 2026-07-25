/** Values substituted into `{placeholder}` tokens inside a translation. */
export type TranslationParams = Record<string, string | number>;

/**
 * Replace `{name}` tokens in a translation with the given values.
 *
 * Tokens with no matching parameter are left untouched so a missing value is
 * visible during review instead of silently rendering an empty gap. Double
 * braces are ignored — `{{input.resource.id}}` is Attraccess' own flow
 * templating and must survive verbatim in marketing copy.
 */
export function interpolate(
  template: string,
  params?: TranslationParams
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (token, name: string) =>
    Object.prototype.hasOwnProperty.call(params, name)
      ? String(params[name])
      : token
  );
}
