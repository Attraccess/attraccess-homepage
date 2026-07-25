import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "@/App";
import { expectNoUntranslatedKeys } from "@/test/utils";

const ROUTES = [
  { path: "/", title: "Attraccess — Access & Lifecycle for Shared Resources" },
  { path: "/features", title: "Features — Attraccess" },
  { path: "/how-it-works", title: "How It Works — Attraccess" },
  { path: "/pricing", title: "Pricing — Attraccess" },
  { path: "/contact", title: "Contact — Attraccess" },
] as const;

function renderRoute(path: string, language: "en" | "de" = "en") {
  Object.defineProperty(window.navigator, "language", {
    value: language === "de" ? "de-DE" : "en-GB",
    configurable: true,
  });
  window.history.pushState({}, "", path);
  return render(<App />);
}

describe("App routing", () => {
  it.each(ROUTES)("renders $path with exactly one h1", ({ path }) => {
    renderRoute(path);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it.each(ROUTES)("sets the document title on $path", ({ path, title }) => {
    renderRoute(path);
    expect(document.title).toBe(title);
  });

  it.each(ROUTES)(
    "renders $path in English without untranslated keys",
    ({ path }) => {
      const { container } = renderRoute(path);
      expectNoUntranslatedKeys(container);
    }
  );

  it.each(ROUTES)(
    "renders $path in German without untranslated keys",
    ({ path }) => {
      const { container } = renderRoute(path, "de");
      expectNoUntranslatedKeys(container);
    }
  );

  it("still serves the 404 page for an unknown route", () => {
    renderRoute("/definitely-not-a-page");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("404");
  });

  it("no longer serves /blog", () => {
    renderRoute("/blog");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("404");
  });

  it("does not link to the blog from the navigation", () => {
    const { container } = renderRoute("/");
    expect(container.querySelector('a[href="/blog"]')).toBeNull();
    expect(
      screen.queryByRole("link", { name: /blog/i })
    ).not.toBeInTheDocument();
  });
});
