import React from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { MediaSlot } from "@/components/MediaSlot";
import { renderWithProviders } from "@/test/utils";
import type { MediaAsset } from "@/lib/media";

const REAL: MediaAsset = {
  src: "/features/reader.webp",
  altKey: "media.reader-on-machine.alt",
  kind: "photo",
};

const PENDING: MediaAsset = {
  src: null,
  altKey: "media.people-tapping.alt",
  kind: "photo",
};

describe("MediaSlot with an available asset", () => {
  it("renders an image with the translated alt text", () => {
    renderWithProviders(<MediaSlot asset={REAL} />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "/features/reader.webp");
    expect(image).toHaveAccessibleName(
      "An Attractap Touch reader mounted next to a 3D printer, showing a resource list"
    );
  });

  it("translates the alt text into German", () => {
    renderWithProviders(<MediaSlot asset={REAL} />, { language: "de" });
    expect(screen.getByRole("img")).toHaveAccessibleName(
      "Ein Attractap Touch neben einem 3D-Drucker, auf dem Display eine Ressourcenliste"
    );
  });

  it("lazy-loads by default and can be made eager", () => {
    const { unmount } = renderWithProviders(<MediaSlot asset={REAL} />);
    expect(screen.getByRole("img")).toHaveAttribute("loading", "lazy");
    unmount();

    renderWithProviders(<MediaSlot asset={REAL} loading="eager" />);
    expect(screen.getByRole("img")).toHaveAttribute("loading", "eager");
  });

  it("does not render a placeholder", () => {
    renderWithProviders(<MediaSlot asset={REAL} />);
    expect(screen.queryByTestId("media-placeholder")).not.toBeInTheDocument();
  });

  it("merges custom classes onto the image", () => {
    renderWithProviders(<MediaSlot asset={REAL} imgClassName="rounded-xl" />);
    expect(screen.getByRole("img").className).toContain("rounded-xl");
  });

  it("crops photos but never crops screenshots or diagrams", () => {
    const { unmount } = renderWithProviders(<MediaSlot asset={REAL} />);
    expect(screen.getByRole("img").className).toContain("object-cover");
    unmount();

    for (const kind of ["screenshot", "illustration"] as const) {
      const view = renderWithProviders(<MediaSlot asset={{ ...REAL, kind }} />);
      expect(screen.getByRole("img").className, kind).toContain(
        "object-contain"
      );
      view.unmount();
    }
  });
});

describe("MediaSlot with a pending asset", () => {
  it("renders a labelled placeholder instead of a broken image", () => {
    renderWithProviders(<MediaSlot asset={PENDING} />);
    expect(screen.queryByRole("img", { name: /^$/ })).not.toBeInTheDocument();
    const placeholder = screen.getByTestId("media-placeholder");
    expect(placeholder).toBeInTheDocument();
    expect(placeholder).toHaveAttribute("role", "img");
  });

  it("names what belongs in the slot", () => {
    renderWithProviders(<MediaSlot asset={PENDING} />);
    expect(screen.getByRole("img")).toHaveAccessibleName(
      "Photo needed: someone tapping their card on an Attractap before starting work"
    );
    expect(screen.getByText("Photo coming soon")).toBeInTheDocument();
  });

  it("localises the placeholder", () => {
    renderWithProviders(<MediaSlot asset={PENDING} />, { language: "de" });
    expect(screen.getByText("Foto folgt")).toBeInTheDocument();
  });

  it.each(["photo", "screenshot", "illustration"] as const)(
    "renders a placeholder for kind %s",
    (kind) => {
      renderWithProviders(<MediaSlot asset={{ ...PENDING, kind }} />);
      expect(screen.getByTestId("media-placeholder")).toBeInTheDocument();
    }
  );

  it("falls back to a generic icon for an unknown kind", () => {
    renderWithProviders(
      <MediaSlot
        asset={{ ...PENDING, kind: "hologram" as MediaAsset["kind"] }}
      />
    );
    expect(screen.getByTestId("media-placeholder")).toBeInTheDocument();
  });
});
