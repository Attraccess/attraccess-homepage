/**
 * Pricing helpers.
 *
 * Attraccess is billed annually, but the marketing pages lead with the
 * *monthly equivalent* because that is how buyers compare tools. The annual
 * total is always shown next to it so the monthly figure is never presented as
 * something you can actually pay month-to-month.
 *
 * Rounding is deliberately `ceil`: a rounded-down monthly figure would
 * understate what the customer pays, which is the one direction that is
 * actually misleading.
 */

export const MONTHS_PER_YEAR = 12;

export type PriceLocale = "en" | "de";

export interface AnnualPlan {
  /** i18n key fragment, e.g. `nonprofit` -> `home.pricing.nonprofit.name`. */
  key: string;
  /** Net price in EUR billed once per year. `0` means free. */
  annualEur: number;
  /** Render the headline as "from <price>" (entry price of a range). */
  from?: boolean;
}

/** The three tiers shown on the home page, cheapest first. */
export const HOME_PLANS: readonly AnnualPlan[] = [
  { key: "nonprofit", annualEur: 0 },
  { key: "community", annualEur: 900, from: true },
  { key: "standard", annualEur: 3500 },
] as const;

const LOCALE_TAG: Record<PriceLocale, string> = {
  en: "en-IE", // euro-prefixed, comma thousands: €3,500
  de: "de-DE", // euro-suffixed, dot thousands: 3.500 €
};

function assertUsableAmount(amount: number, label: string): void {
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    throw new RangeError(
      `${label} must be a finite number, received ${amount}`
    );
  }
  if (amount < 0) {
    throw new RangeError(`${label} must not be negative, received ${amount}`);
  }
}

/**
 * The monthly-equivalent price of an annually billed plan, rounded up to whole
 * euros.
 */
export function monthlyEquivalentEur(annualEur: number): number {
  assertUsableAmount(annualEur, "annualEur");
  return Math.ceil(annualEur / MONTHS_PER_YEAR);
}

/** Format a whole-euro amount for the given UI language. */
export function formatEur(amount: number, locale: PriceLocale): string {
  assertUsableAmount(amount, "amount");
  return (
    new Intl.NumberFormat(LOCALE_TAG[locale] ?? LOCALE_TAG.en, {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      // German formats as "3.500 €" with a space before the symbol. Different
      // ICU builds emit either a narrow no-break space (U+202F) or a regular
      // no-break space (U+00A0); normalise so rendering and tests are stable.
      .replace(/\u202F/g, "\u00A0")
  );
}

/** `true` when the plan costs nothing (non-profit tier). */
export function isFreePlan(plan: Pick<AnnualPlan, "annualEur">): boolean {
  return plan.annualEur === 0;
}

export interface PlanPriceDisplay {
  /** Headline figure, e.g. `€75` (or `€0` for the free tier). */
  price: string;
  /** Whether the headline should be prefixed with a "from" label. */
  from: boolean;
  /** `true` for free plans, where no annual note applies. */
  free: boolean;
  /** Annual total, e.g. `€900` — `null` for free plans. */
  annualTotal: string | null;
}

/**
 * Everything a pricing card needs to render a monthly-first price.
 * Returns strings only; the surrounding wording comes from i18n.
 */
export function planPriceDisplay(
  plan: AnnualPlan,
  locale: PriceLocale
): PlanPriceDisplay {
  const free = isFreePlan(plan);
  return {
    price: formatEur(free ? 0 : monthlyEquivalentEur(plan.annualEur), locale),
    from: Boolean(plan.from) && !free,
    free,
    annualTotal: free ? null : formatEur(plan.annualEur, locale),
  };
}
