import React from "react";
import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModernPricingSection } from "@/components/ModernPricingSection";
import { renderWithProviders } from "@/test/utils";

const NBSP = " ";

/**
 * The plan name also appears as a support-level badge ("Standard"), so match on
 * the card title element rather than on text anywhere in the document.
 */
function planCard(name: string): HTMLElement {
  const card = [...document.querySelectorAll<HTMLElement>(".pricing-card")].find(
    (element) =>
      element.querySelector(".text-lg.font-bold")?.textContent?.trim() === name
  );
  if (!card) throw new Error(`No pricing card titled "${name}"`);
  return card;
}

describe("ModernPricingSection", () => {
  it("starts on the monthly cycle and quotes the monthly price", () => {
    renderWithProviders(<ModernPricingSection />);
    const community = planCard("Community");
    expect(within(community).getByText("€90")).toBeInTheDocument();
    expect(within(community).getByText("/month")).toBeInTheDocument();
    expect(within(community).queryByText(/billed annually/)).not.toBeInTheDocument();
  });

  it("quotes annual plans as a monthly equivalent with the annual total", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ModernPricingSection />);

    await user.click(screen.getByRole("button", { name: /Yearly/ }));

    const community = planCard("Community");
    expect(within(community).getByText("€75")).toBeInTheDocument();
    expect(within(community).getByText("/month")).toBeInTheDocument();
    expect(
      within(community).getByText("billed annually · €900 / year")
    ).toBeInTheDocument();
  });

  it("never shows a bare annual figure as the headline price", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ModernPricingSection />);
    await user.click(screen.getByRole("button", { name: /Yearly/ }));

    const standard = planCard("Standard");
    expect(within(standard).getByText("€292")).toBeInTheDocument();
    expect(
      within(standard).getByText("billed annually · €3,500 / year")
    ).toBeInTheDocument();
  });

  it("switches back to monthly", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ModernPricingSection />);
    await user.click(screen.getByRole("button", { name: /Yearly/ }));
    await user.click(screen.getByRole("button", { name: "Monthly" }));

    expect(within(planCard("Community")).getByText("€90")).toBeInTheDocument();
    expect(screen.queryByText(/billed annually/)).not.toBeInTheDocument();
  });

  it("shows 'Contact Sales' with no period or note for Enterprise", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ModernPricingSection />);
    const enterprise = planCard("Enterprise");
    expect(within(enterprise).getByText("Contact Sales")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Yearly/ }));
    expect(within(planCard("Enterprise")).getByText("Contact Sales")).toBeInTheDocument();
    expect(
      within(planCard("Enterprise")).queryByText(/billed annually/)
    ).not.toBeInTheDocument();
  });

  it("localises the annual note", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ModernPricingSection />, { language: "de" });
    await user.click(screen.getByRole("button", { name: /Jährlich/ }));

    expect(
      screen.getByText(`jährliche Abrechnung · 900${NBSP}€ / Jahr`)
    ).toBeInTheDocument();
  });

  it("keeps the two-months-free promise consistent with the numbers", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ModernPricingSection />);
    expect(screen.getByText("2 months free")).toBeInTheDocument();

    // €90/month monthly vs €75/month billed annually is exactly 10/12.
    await user.click(screen.getByRole("button", { name: /Yearly/ }));
    expect(within(planCard("Community")).getByText("€75")).toBeInTheDocument();
  });
});
