import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Contact } from "@/pages/Contact";
import { renderWithProviders, expectNoUntranslatedKeys } from "@/test/utils";
import { PHOTOS } from "@/lib/media";

/** `window.location.href = …` is not implemented in jsdom; capture it instead. */
function captureNavigation() {
  const navigations: string[] = [];
  const original = window.location;
  Object.defineProperty(window, "location", {
    configurable: true,
    value: {
      ...original,
      set href(value: string) {
        navigations.push(value);
      },
      get href() {
        return navigations.at(-1) ?? original.href;
      },
    },
  });
  return {
    navigations,
    restore: () =>
      Object.defineProperty(window, "location", {
        configurable: true,
        value: original,
      }),
  };
}

describe("Contact page", () => {
  let capture: ReturnType<typeof captureNavigation>;

  beforeEach(() => {
    capture = captureNavigation();
  });

  afterEach(() => {
    capture.restore();
    vi.restoreAllMocks();
  });

  it("keeps a single page heading", () => {
    renderWithProviders(<Contact />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("keeps all five form fields with labels bound to inputs", () => {
    renderWithProviders(<Contact />);
    for (const label of [
      "Name",
      "Email",
      "Organization",
      "Role",
      "Use Case",
    ]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
  });

  it("sets expectations before the form is even filled in", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByText("A reply within one working day")).toBeInTheDocument();
    expect(screen.getByText("No sales pipeline, no cold calls")).toBeInTheDocument();
    expect(screen.getByText("Built and hosted in Germany")).toBeInTheDocument();
  });

  it("explains the three steps that follow, with timings", () => {
    renderWithProviders(<Contact />);
    const next = screen
      .getByRole("heading", { name: "What happens after you send it" })
      .closest("div") as HTMLElement;

    expect(within(next).getAllByRole("listitem")).toHaveLength(3);
    expect(within(next).getByText("A real reply")).toBeInTheDocument();
    expect(within(next).getByText("within 1 working day")).toBeInTheDocument();
    expect(within(next).getByText("A 30-minute call")).toBeInTheDocument();
    expect(within(next).getByText("A pilot on two machines")).toBeInTheDocument();
  });

  it("shows a real product photo with a caption", () => {
    renderWithProviders(<Contact />);
    const photo = screen.getByRole("img", {
      name: /Attractap Touch reader mounted next to a 3D printer/,
    });
    expect(photo).toHaveAttribute("src", PHOTOS.readerOnMachine.src);
    expect(
      screen.getByText(/entire hardware side of a typical setup/)
    ).toBeInTheDocument();
  });

  it("shows the customer logos as social proof", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByText("Already running Attraccess")).toBeInTheDocument();
    for (const name of ["Working Lab", "TUHH", "Attraktor e.V."]) {
      expect(screen.getByRole("img", { name })).toBeInTheDocument();
    }
  });

  it("introduces the team behind the replies", () => {
    renderWithProviders(<Contact />);
    expect(
      screen.getByRole("heading", {
        name: "A small team from Hamburg that runs makerspaces too",
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId("media-placeholder")).toHaveAttribute(
      "aria-label",
      "Photo needed: the Attraccess team"
    );
  });

  it("links the e-mail card to a mailto and leaves the address card inert", () => {
    renderWithProviders(<Contact />);
    expect(
      screen.getByRole("link", { name: /contact@attraccess.org/ })
    ).toHaveAttribute("href", "mailto:contact@attraccess.org");
    expect(screen.getByText("Hamburg, Germany").closest("a")).toBeNull();
  });

  it("says plainly that nothing is stored on the site", () => {
    renderWithProviders(<Contact />);
    expect(
      screen.getByText(/Nothing is stored on this website/)
    ).toBeInTheDocument();
  });

  it("builds a mailto from the filled-in form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Contact />);

    await user.type(screen.getByLabelText("Name"), "Rodrigo");
    await user.type(screen.getByLabelText("Email"), "rodrigo@example.com");
    await user.type(screen.getByLabelText("Organization"), "Werkstatt GmbH");
    await user.type(screen.getByLabelText("Role"), "Head of Ops");
    await user.type(screen.getByLabelText("Use Case"), "Two laser cutters");

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(capture.navigations).toHaveLength(1);
    const mailto = decodeURIComponent(capture.navigations[0]);
    expect(mailto.startsWith("mailto:contact@attraccess.org?")).toBe(true);
    expect(mailto).toContain("Rodrigo");
    expect(mailto).toContain("rodrigo@example.com");
    expect(mailto).toContain("Werkstatt GmbH");
    expect(mailto).toContain("Head of Ops");
    expect(mailto).toContain("Two laser cutters");
  });

  it("leaves no unsubstituted placeholders in the mail body", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Contact />);

    await user.type(screen.getByLabelText("Name"), "Rodrigo");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    const mailto = decodeURIComponent(capture.navigations[0]);
    expect(mailto).not.toMatch(/\{\w+\}/);
  });

  it("still submits when optional fields are blank", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Contact />);
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(capture.navigations).toHaveLength(1);
  });

  it("localises the mail subject and body", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Contact />, { language: "de" });

    await user.type(screen.getByLabelText("Name"), "Rodrigo");
    await user.click(screen.getByRole("button", { name: "Absenden" }));

    const mailto = decodeURIComponent(capture.navigations[0]);
    expect(mailto).toContain("Rodrigo");
    expect(mailto).not.toMatch(/\{\w+\}/);
  });

  it.each(["en", "de"] as const)("has no untranslated keys in %s", (language) => {
    const { container } = renderWithProviders(<Contact />, { language });
    expectNoUntranslatedKeys(container);
  });
});
