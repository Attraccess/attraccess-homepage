import React from "react";
import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import { PricingTiers } from "@/components/home/PricingTiers";
import { renderWithProviders, expectNoUntranslatedKeys } from "@/test/utils";

const NBSP = " ";

function card(name: string): HTMLElement {
  return screen.getByText(name).closest("div.relative") as HTMLElement;
}

describe("PricingTiers", () => {
  it("leads with the monthly price, not the annual one", () => {
    renderWithProviders(<PricingTiers />);

    const community = card("Community");
    expect(within(community).getByText("€90")).toBeInTheDocument();
    expect(within(community).getByText("/ month")).toBeInTheDocument();
    expect(within(community).queryByText("€900")).not.toBeInTheDocument();
  });

  it("spells out the annual commitment under every paid price", () => {
    renderWithProviders(<PricingTiers />);

    expect(
      screen.getByText("Billed annually · €900 / year — 2 months free")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Billed annually · €3,500 / year — 2 months free")
    ).toBeInTheDocument();
  });

  it("quotes the standard tier at a tenth of its annual price", () => {
    renderWithProviders(<PricingTiers />);
    expect(within(card("Standard")).getByText("€350")).toBeInTheDocument();
  });

  it("never quotes an annual-divided-by-twelve rate nobody can buy", () => {
    renderWithProviders(<PricingTiers />);
    expect(screen.queryByText("€75")).not.toBeInTheDocument();
    expect(screen.queryByText("€292")).not.toBeInTheDocument();
  });

  it("keeps 'from' on the entry-level tier only", () => {
    renderWithProviders(<PricingTiers />);
    expect(within(card("Community")).getByText("from")).toBeInTheDocument();
    expect(
      within(card("Standard")).queryByText("from")
    ).not.toBeInTheDocument();
  });

  it("shows the non-profit tier as free forever, with no annual note", () => {
    renderWithProviders(<PricingTiers />);
    const nonprofit = card("Non-Profit");
    expect(within(nonprofit).getByText("€0")).toBeInTheDocument();
    expect(within(nonprofit).getByText("forever")).toBeInTheDocument();
    expect(
      within(nonprofit).queryByText(/Billed annually/)
    ).not.toBeInTheDocument();
    expect(
      within(nonprofit).getByText("No credit card. No time limit.")
    ).toBeInTheDocument();
  });

  it("renders all three tiers with four bullets each", () => {
    renderWithProviders(<PricingTiers />);
    for (const name of ["Non-Profit", "Community", "Standard"]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("points every tier at the contact page", () => {
    renderWithProviders(<PricingTiers />);
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAttribute("href", "/contact");
    }
  });

  it("localises prices and the annual note into German", () => {
    renderWithProviders(<PricingTiers />, { language: "de" });
    expect(screen.getByText(`90${NBSP}€`)).toBeInTheDocument();
    expect(screen.getAllByText("/ Monat")).toHaveLength(2);
    expect(
      screen.getByText(
        `Jährliche Abrechnung · 3.500${NBSP}€ / Jahr — 2 Monate gratis`
      )
    ).toBeInTheDocument();
  });

  it("says in the section subtitle that the monthly rate is billed annually", () => {
    renderWithProviders(<PricingTiers />);
    expect(
      screen.getByText(/12 months for the price of 10/)
    ).toBeInTheDocument();
  });

  it.each(["en", "de"] as const)(
    "has no untranslated keys in %s",
    (language) => {
      const { container } = renderWithProviders(<PricingTiers />, { language });
      expectNoUntranslatedKeys(container);
    }
  );
});
