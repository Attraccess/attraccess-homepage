import React from "react";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DemoVideo } from "@/components/DemoVideo";
import { renderWithProviders, expectNoUntranslatedKeys } from "@/test/utils";
import { DEMO_VIDEO, type DemoVideoConfig } from "@/lib/media";

const WITH_VIDEO: DemoVideoConfig = {
  url: "https://youtu.be/dQw4w9WgXcQ",
  poster: "/features/reader.webp",
  duration: "3:24",
};

describe("DemoVideo without a configured video", () => {
  it("shows the pending state instead of a dead player", () => {
    renderWithProviders(
      <DemoVideo config={{ url: null, poster: "/x.webp" }} />
    );
    expect(screen.getByTestId("demo-video-pending")).toBeInTheDocument();
    expect(
      screen.getByText("The full demo video is in production")
    ).toBeInTheDocument();
    expect(document.querySelector("iframe")).toBeNull();
  });

  it("offers a live demo as the fallback call to action", () => {
    renderWithProviders(
      <DemoVideo config={{ url: null, poster: "/x.webp" }} />
    );
    const cta = screen.getByRole("link", { name: "Book a live demo" });
    expect(cta).toHaveAttribute("href", "/contact");
  });

  it("shows no play control when there is nothing to play", () => {
    renderWithProviders(
      <DemoVideo config={{ url: null, poster: "/x.webp" }} />
    );
    expect(
      screen.queryByRole("button", { name: /Play the demo/ })
    ).not.toBeInTheDocument();
  });

  it("still shows the poster image", () => {
    renderWithProviders(
      <DemoVideo config={{ url: null, poster: "/x.webp" }} />
    );
    expect(screen.getByRole("img")).toHaveAttribute("src", "/x.webp");
  });

  it("falls back for a configured-but-unplayable URL", () => {
    renderWithProviders(
      <DemoVideo
        config={{ url: "https://example.com/nope", poster: "/x.webp" }}
      />
    );
    expect(screen.getByTestId("demo-video-pending")).toBeInTheDocument();
  });

  it("uses the shipped configuration by default", () => {
    renderWithProviders(<DemoVideo />);
    expect(screen.getByRole("img")).toHaveAttribute("src", DEMO_VIDEO.poster);
  });

  it("translates the whole section", () => {
    const { container } = renderWithProviders(
      <DemoVideo config={{ url: null, poster: "/x.webp" }} />,
      { language: "de" }
    );
    expect(
      screen.getByText("Das vollständige Demo-Video entsteht gerade")
    ).toBeInTheDocument();
    expectNoUntranslatedKeys(container);
  });
});

describe("DemoVideo with a configured video", () => {
  it("shows a play button over the poster, not the iframe", () => {
    renderWithProviders(<DemoVideo config={WITH_VIDEO} />);
    expect(
      screen.getByRole("button", { name: /Play the demo/ })
    ).toBeInTheDocument();
    expect(document.querySelector("iframe")).toBeNull();
  });

  it("shows the runtime next to the play label when known", () => {
    renderWithProviders(<DemoVideo config={WITH_VIDEO} />);
    expect(screen.getByRole("button")).toHaveTextContent("3:24");
  });

  it("omits the runtime when it is not configured", () => {
    renderWithProviders(
      <DemoVideo config={{ ...WITH_VIDEO, duration: undefined }} />
    );
    expect(screen.getByRole("button")).toHaveTextContent("Play the demo");
    expect(screen.getByRole("button")).not.toHaveTextContent("·");
  });

  it("loads the player only after the user presses play", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DemoVideo config={WITH_VIDEO} />);

    await user.click(screen.getByRole("button", { name: /Play the demo/ }));

    const iframe = document.querySelector("iframe");
    expect(iframe).not.toBeNull();
    expect(iframe).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&autoplay=1"
    );
  });

  it("appends autoplay with a '?' when the embed URL has no query", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <DemoVideo
        config={{ url: "https://vimeo.com/123456789", poster: "/x.webp" }}
      />
    );
    await user.click(screen.getByRole("button"));
    expect(document.querySelector("iframe")).toHaveAttribute(
      "src",
      "https://player.vimeo.com/video/123456789?autoplay=1"
    );
  });

  it("gives the player an accessible title", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DemoVideo config={WITH_VIDEO} />);
    await user.click(screen.getByRole("button"));
    expect(document.querySelector("iframe")).toHaveAttribute(
      "title",
      "The whole thing, end to end"
    );
  });

  it("removes the poster once the player is showing", async () => {
    const user = userEvent.setup();
    renderWithProviders(<DemoVideo config={WITH_VIDEO} />);
    await user.click(screen.getByRole("button"));
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
