import React from "react";
import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import { HowItWorksPage } from "@/pages/HowItWorksPage";
import { STEPS } from "@/components/how-it-works/StepList";
import { renderWithProviders, expectNoUntranslatedKeys } from "@/test/utils";
import { PENDING_PHOTOS, PHOTOS } from "@/lib/media";

describe("HowItWorksPage", () => {
  it("keeps a single page heading", () => {
    renderWithProviders(<HowItWorksPage />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("puts the demo video section above the steps", () => {
    const { container } = renderWithProviders(<HowItWorksPage />);
    const headings = [...container.querySelectorAll("h2")].map((h) =>
      h.textContent?.trim()
    );
    expect(headings).toContain("The whole thing, end to end");
    expect(headings.indexOf("The whole thing, end to end")).toBeLessThan(
      headings.indexOf("From an empty dashboard to a workshop under control")
    );
  });

  it("falls back to a live-demo card while the video is unshot", () => {
    renderWithProviders(<HowItWorksPage />);
    expect(screen.getByTestId("demo-video-pending")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Book a live demo" })
    ).toHaveAttribute("href", "/contact");
  });

  it("shows the real product photo of the reader on a machine", () => {
    renderWithProviders(<HowItWorksPage />);
    const photos = screen.getAllByRole("img", {
      name: /Attractap Touch reader mounted next to a 3D printer/,
    });
    expect(photos.length).toBeGreaterThan(0);
    expect(photos[0]).toHaveAttribute("src", PHOTOS.readerOnMachine.src);
  });

  it("renders labelled placeholders for the photos still to be shot", () => {
    renderWithProviders(<HowItWorksPage />);
    const placeholders = screen.getAllByTestId("media-placeholder");
    expect(placeholders).toHaveLength(3);
    for (const placeholder of placeholders) {
      expect(placeholder.getAttribute("aria-label")).toMatch(/^Photo needed:/);
    }
  });

  it("names each pending slot by what belongs in it, not by its key", () => {
    renderWithProviders(<HowItWorksPage />);
    const labels = screen
      .getAllByTestId("media-placeholder")
      .map((element) => element.getAttribute("aria-label"));

    expect(labels).toContain(
      "Photo needed: someone tapping their card on an Attractap before starting work"
    );
    for (const key of Object.values(PENDING_PHOTOS).map((p) => p.altKey)) {
      expect(labels).not.toContain(key);
    }
  });

  it("describes the companion gadget with its specs", () => {
    renderWithProviders(<HowItWorksPage />);
    expect(
      screen.getByRole("heading", {
        name: "Attractap: the box that sits next to the machine",
      })
    ).toBeInTheDocument();
    for (const spec of ["NFC & QR", "Wi-Fi", "Relay control", "Updates over the air"]) {
      expect(screen.getByText(spec)).toBeInTheDocument();
    }
  });

  it("renders all five steps with their bullets", () => {
    const { container } = renderWithProviders(<HowItWorksPage />);
    const steps = container.querySelectorAll("ol > li");
    expect(steps).toHaveLength(STEPS.length);

    steps.forEach((step, index) => {
      expect(within(step as HTMLElement).getAllByRole("listitem")).toHaveLength(
        STEPS[index].bullets
      );
    });
  });

  it("numbers the steps and labels them", () => {
    renderWithProviders(<HowItWorksPage />);
    for (const step of STEPS) {
      expect(screen.getByText(`Step ${step.id}`)).toBeInTheDocument();
    }
  });

  it("gives every step image an alt text matching its title", () => {
    const { container } = renderWithProviders(<HowItWorksPage />);
    for (const step of STEPS) {
      const image = container.querySelector<HTMLImageElement>(
        `img[src="${step.image}"]`
      );
      expect(image, step.key).not.toBeNull();
      expect(image?.alt.length).toBeGreaterThan(0);
    }
  });

  it("closes with both calls to action", () => {
    renderWithProviders(<HowItWorksPage />);
    expect(screen.getByRole("link", { name: /Book a demo/ })).toHaveAttribute(
      "href",
      "/contact"
    );
    expect(
      screen.getByRole("link", { name: "Browse the features" })
    ).toHaveAttribute("href", "/features");
  });

  it("lazy-loads every image below the fold", () => {
    const { container } = renderWithProviders(<HowItWorksPage />);
    for (const image of container.querySelectorAll("img")) {
      expect(image).toHaveAttribute("loading", "lazy");
    }
  });

  it.each(["en", "de"] as const)("has no untranslated keys in %s", (language) => {
    const { container } = renderWithProviders(<HowItWorksPage />, { language });
    expectNoUntranslatedKeys(container);
  });
});
