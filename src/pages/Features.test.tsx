import React from "react";
import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Features } from "@/pages/Features";
import { FEATURE_DETAILS } from "@/components/features/FeatureDeepDive";
import { renderWithProviders, expectNoUntranslatedKeys } from "@/test/utils";
import { translations } from "@/contexts/i18n";

describe("Features page", () => {
  it("keeps a single page heading", () => {
    renderWithProviders(<Features />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("gives every feature its own section", () => {
    const { container } = renderWithProviders(<Features />);
    expect(container.querySelectorAll("article[aria-labelledby]")).toHaveLength(
      FEATURE_DETAILS.length
    );
  });

  it("anchors each section so the jump links resolve", () => {
    const { container } = renderWithProviders(<Features />);
    for (const detail of FEATURE_DETAILS) {
      const anchor = container.querySelector(`#feature-${detail.key}`);
      expect(anchor, detail.key).not.toBeNull();

      const link = container.querySelector(`a[href="#feature-${detail.key}"]`);
      expect(link, detail.key).not.toBeNull();
    }
  });

  it("renders one jump link per feature", () => {
    renderWithProviders(<Features />);
    const nav = screen.getByRole("navigation", { name: "Jump to a feature" });
    expect(within(nav).getAllByRole("link")).toHaveLength(
      FEATURE_DETAILS.length
    );
  });

  it("gives every feature a description, four capabilities and a use case", () => {
    renderWithProviders(<Features />);

    for (const detail of FEATURE_DETAILS) {
      const prefix = `features.detail.${detail.key}`;
      const section = screen
        .getByRole("heading", {
          name: translations.en[`${prefix}.title` as keyof typeof translations.en],
        })
        .closest("article") as HTMLElement;

      expect(
        within(section).getByText(
          translations.en[
            `${prefix}.description` as keyof typeof translations.en
          ]
        )
      ).toBeInTheDocument();

      expect(within(section).getAllByRole("listitem")).toHaveLength(
        detail.bullets
      );

      expect(
        within(section).getByText(
          translations.en[`${prefix}.usecase` as keyof typeof translations.en]
        )
      ).toBeInTheDocument();
    }
  });

  it("shows a captioned image for every feature", () => {
    const { container } = renderWithProviders(<Features />);
    const figures = container.querySelectorAll("figure");
    expect(figures).toHaveLength(FEATURE_DETAILS.length);

    figures.forEach((figure) => {
      expect(figure.querySelector("figcaption")?.textContent?.trim()).toBeTruthy();
      const image = figure.querySelector("img");
      expect(image?.getAttribute("alt")).toBeTruthy();
    });
  });

  it("uses only real assets — no placeholders on this page", () => {
    renderWithProviders(<Features />);
    expect(screen.queryAllByTestId("media-placeholder")).toHaveLength(0);
  });

  it("lists the smaller capabilities", () => {
    renderWithProviders(<Features />);
    const extras = screen
      .getByRole("heading", {
        name: "And the things you only notice when they are missing",
      })
      .closest("section") as HTMLElement;

    for (const title of [
      "Single sign-on",
      "Works on any phone",
      "QR code access",
      "MQTT & webhooks",
      "Notifications",
      "CSV export",
      "Groups & areas",
      "German & English",
      "Audit trail",
    ]) {
      expect(within(extras).getByText(title), title).toBeInTheDocument();
    }
  });

  it("answers the pre-demo questions in an accordion", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Features />);

    const question = screen.getByRole("button", {
      name: "Do I have to buy your hardware?",
    });
    expect(question).toHaveAttribute("aria-expanded", "false");

    await user.click(question);
    expect(question).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText(/Attraccess drives standard Shelly relays/)
    ).toBeVisible();
  });

  it("has five FAQ entries", () => {
    renderWithProviders(<Features />);
    const faq = screen
      .getByRole("heading", { name: "Questions people ask before they book a demo" })
      .closest("div") as HTMLElement;
    expect(within(faq).getAllByRole("button")).toHaveLength(5);
  });

  it("closes with a demo call to action", () => {
    renderWithProviders(<Features />);
    expect(
      screen.getAllByRole("link", { name: /Request a Demo/ }).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: "See how it works" })
    ).toHaveAttribute("href", "/how-it-works");
  });

  it.each(["en", "de"] as const)("has no untranslated keys in %s", (language) => {
    const { container } = renderWithProviders(<Features />, { language });
    expectNoUntranslatedKeys(container);
  });
});
