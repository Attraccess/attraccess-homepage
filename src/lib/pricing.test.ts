import { describe, expect, it } from "vitest";
import {
  HOME_PLANS,
  MONTHS_PER_YEAR,
  formatEur,
  isFreePlan,
  monthlyEquivalentEur,
  planPriceDisplay,
  type AnnualPlan,
} from "@/lib/pricing";

const NBSP = " ";

describe("monthlyEquivalentEur", () => {
  it("divides an evenly divisible annual price", () => {
    expect(monthlyEquivalentEur(900)).toBe(75);
    expect(monthlyEquivalentEur(1200)).toBe(100);
  });

  it("rounds up so the monthly figure never understates the price", () => {
    // 3500 / 12 = 291.66… — rounding down would advertise less than is charged.
    expect(monthlyEquivalentEur(3500)).toBe(292);
    expect(monthlyEquivalentEur(9500)).toBe(792);
    expect(monthlyEquivalentEur(20000)).toBe(1667);
  });

  it("never advertises less than one twelfth of the annual price", () => {
    for (let annual = 0; annual <= 5000; annual += 7) {
      expect(
        monthlyEquivalentEur(annual) * MONTHS_PER_YEAR
      ).toBeGreaterThanOrEqual(annual);
    }
  });

  it("returns 0 for a free plan", () => {
    expect(monthlyEquivalentEur(0)).toBe(0);
  });

  it("rounds any fraction of a euro up to the next whole euro", () => {
    expect(monthlyEquivalentEur(1)).toBe(1);
    expect(monthlyEquivalentEur(13)).toBe(2);
  });

  it.each([
    -1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    "900" as unknown as number,
  ])("rejects unusable input %p", (value) => {
    expect(() => monthlyEquivalentEur(value)).toThrow(RangeError);
  });
});

describe("formatEur", () => {
  it("prefixes the symbol in English with comma thousands separators", () => {
    expect(formatEur(75, "en")).toBe("€75");
    expect(formatEur(3500, "en")).toBe("€3,500");
  });

  it("suffixes the symbol in German with dot thousands separators", () => {
    expect(formatEur(75, "de")).toBe(`75${NBSP}€`);
    expect(formatEur(3500, "de")).toBe(`3.500${NBSP}€`);
  });

  it("shows no decimal places", () => {
    expect(formatEur(292, "en")).toBe("€292");
    expect(formatEur(0, "de")).toBe(`0${NBSP}€`);
  });

  it("falls back to the English format for an unknown locale", () => {
    expect(formatEur(900, "fr" as "en")).toBe("€900");
  });

  it("uses a non-breaking space in German so the price never wraps", () => {
    expect(formatEur(1200, "de")).not.toContain(" ");
    expect(formatEur(1200, "de")).toContain(NBSP);
  });

  it.each([-5, Number.NaN])("rejects unusable amount %p", (value) => {
    expect(() => formatEur(value, "en")).toThrow(RangeError);
  });
});

describe("isFreePlan", () => {
  it("is true only at zero", () => {
    expect(isFreePlan({ annualEur: 0 })).toBe(true);
    expect(isFreePlan({ annualEur: 1 })).toBe(false);
    expect(isFreePlan({ annualEur: 900 })).toBe(false);
  });
});

describe("planPriceDisplay", () => {
  const community: AnnualPlan = {
    key: "community",
    annualEur: 900,
    from: true,
  };
  const standard: AnnualPlan = { key: "standard", annualEur: 3500 };
  const free: AnnualPlan = { key: "nonprofit", annualEur: 0 };

  it("leads with the monthly figure and keeps the annual total", () => {
    expect(planPriceDisplay(community, "en")).toEqual({
      price: "€75",
      from: true,
      free: false,
      annualTotal: "€900",
    });
  });

  it("rounds the monthly figure up for the standard plan", () => {
    expect(planPriceDisplay(standard, "en")).toEqual({
      price: "€292",
      from: false,
      free: false,
      annualTotal: "€3,500",
    });
  });

  it("localises both figures", () => {
    expect(planPriceDisplay(standard, "de")).toEqual({
      price: `292${NBSP}€`,
      from: false,
      free: false,
      annualTotal: `3.500${NBSP}€`,
    });
  });

  it("marks the free plan as free and omits the annual total", () => {
    expect(planPriceDisplay(free, "en")).toEqual({
      price: "€0",
      from: false,
      free: true,
      annualTotal: null,
    });
  });

  it("never shows 'from' on a free plan", () => {
    expect(planPriceDisplay({ ...free, from: true }, "en").from).toBe(false);
  });
});

describe("HOME_PLANS", () => {
  it("lists the three home-page tiers cheapest first", () => {
    expect(HOME_PLANS.map((plan) => plan.key)).toEqual([
      "nonprofit",
      "community",
      "standard",
    ]);
    const prices = HOME_PLANS.map((plan) => plan.annualEur);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("keeps prices consistent with the pricing page (annual = 10 monthly)", () => {
    // The pricing page quotes €90/month for Community and €350 for Standard,
    // with annual billing advertised as "2 months free".
    expect(HOME_PLANS[1].annualEur).toBe(90 * 10);
    expect(HOME_PLANS[2].annualEur).toBe(350 * 10);
  });

  it("renders every tier without throwing, in both languages", () => {
    for (const language of ["en", "de"] as const) {
      for (const plan of HOME_PLANS) {
        const display = planPriceDisplay(plan, language);
        expect(display.price).toMatch(/\d/);
      }
    }
  });
});
