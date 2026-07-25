import { describe, expect, it } from "vitest";
import {
  FREE_MONTHS_PER_YEAR,
  HOME_PLANS,
  MONTHS_BILLED_ANNUALLY,
  MONTHS_PER_YEAR,
  formatEur,
  isFreePlan,
  monthlyRateEur,
  planPriceDisplay,
  type AnnualPlan,
} from "@/lib/pricing";

const NBSP = " ";

describe("the annual billing model", () => {
  it("charges ten of twelve months, leaving two free", () => {
    expect(MONTHS_BILLED_ANNUALLY).toBe(10);
    expect(MONTHS_PER_YEAR).toBe(12);
    expect(FREE_MONTHS_PER_YEAR).toBe(2);
  });
});

describe("monthlyRateEur", () => {
  it("divides the annual price by the ten months it charges for", () => {
    expect(monthlyRateEur(900)).toBe(90);
    expect(monthlyRateEur(3500)).toBe(350);
    expect(monthlyRateEur(9500)).toBe(950);
    expect(monthlyRateEur(20000)).toBe(2000);
  });

  it("never advertises less than a tenth of the annual price", () => {
    for (let annual = 0; annual <= 5000; annual += 7) {
      expect(
        monthlyRateEur(annual) * MONTHS_BILLED_ANNUALLY
      ).toBeGreaterThanOrEqual(annual);
    }
  });

  it("returns 0 for a free plan", () => {
    expect(monthlyRateEur(0)).toBe(0);
  });

  it("rounds any fraction of a euro up to the next whole euro", () => {
    expect(monthlyRateEur(1)).toBe(1);
    expect(monthlyRateEur(11)).toBe(2);
    expect(monthlyRateEur(955)).toBe(96);
  });

  it("does not divide by twelve — that rate is not purchasable", () => {
    expect(monthlyRateEur(900)).not.toBe(75);
    expect(monthlyRateEur(3500)).not.toBe(292);
  });

  it.each([
    -1,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    "900" as unknown as number,
  ])("rejects unusable input %p", (value) => {
    expect(() => monthlyRateEur(value)).toThrow(RangeError);
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

  it("leads with the monthly rate and keeps the annual total", () => {
    expect(planPriceDisplay(community, "en")).toEqual({
      price: "€90",
      from: true,
      free: false,
      annualTotal: "€900",
    });
  });

  it("quotes the standard plan at a tenth of its annual price", () => {
    expect(planPriceDisplay(standard, "en")).toEqual({
      price: "€350",
      from: false,
      free: false,
      annualTotal: "€3,500",
    });
  });

  it("localises both figures", () => {
    expect(planPriceDisplay(standard, "de")).toEqual({
      price: `350${NBSP}€`,
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

  it("derives exactly the monthly rate the pricing page quotes", () => {
    // If these ever diverge, the two pages advertise different prices.
    expect(monthlyRateEur(HOME_PLANS[1].annualEur)).toBe(90);
    expect(monthlyRateEur(HOME_PLANS[2].annualEur)).toBe(350);
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
