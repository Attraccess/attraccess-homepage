import { describe, expect, it } from "vitest";
import { interpolate } from "@/lib/interpolate";

describe("interpolate", () => {
  it("substitutes named placeholders", () => {
    expect(
      interpolate("Billed annually · {total} / year", { total: "€900" })
    ).toBe("Billed annually · €900 / year");
  });

  it("substitutes numbers", () => {
    expect(interpolate("{minutes} min read", { minutes: 6 })).toBe(
      "6 min read"
    );
  });

  it("substitutes every occurrence of the same placeholder", () => {
    expect(interpolate("{a} and {a}", { a: "x" })).toBe("x and x");
  });

  it("leaves the token in place when no value is supplied", () => {
    expect(interpolate("Hello {name}", {})).toBe("Hello {name}");
    expect(interpolate("Hello {name}", { other: "x" })).toBe("Hello {name}");
  });

  it("returns the template untouched when no params are given", () => {
    expect(interpolate("Hello {name}")).toBe("Hello {name}");
  });

  it("ignores double braces used by the product's own templating", () => {
    expect(interpolate("{{input.resource.id}}", { input: "x" })).toBe(
      "{{input.resource.id}}"
    );
  });

  it("substitutes an explicitly empty value", () => {
    expect(interpolate("[{name}]", { name: "" })).toBe("[]");
  });

  it("is not confused by inherited object properties", () => {
    expect(interpolate("{toString}", {} as Record<string, string>)).toBe(
      "{toString}"
    );
  });
});
