import { describe, expect, it } from "vitest";
import {
  DEMO_VIDEO,
  ILLUSTRATIONS,
  PENDING_PHOTOS,
  PHOTOS,
  SCREENSHOTS,
  demoVideoEmbedUrl,
  demoVideoProvider,
  hasDemoVideo,
  type MediaAsset,
} from "@/lib/media";
import { translations } from "@/contexts/i18n";

describe("demoVideoProvider", () => {
  it.each([
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "youtube"],
    ["https://youtube.com/watch?v=dQw4w9WgXcQ", "youtube"],
    ["https://m.youtube.com/watch?v=dQw4w9WgXcQ", "youtube"],
    ["https://youtu.be/dQw4w9WgXcQ", "youtube"],
    ["https://vimeo.com/123456789", "vimeo"],
    ["https://player.vimeo.com/video/123456789", "vimeo"],
    ["https://cdn.attraccess.org/demo.mp4", "file"],
    ["https://cdn.attraccess.org/demo.webm", "file"],
  ])("recognises %s as %s", (url, expected) => {
    expect(demoVideoProvider(url)).toBe(expected);
  });

  it.each([
    "not a url",
    "",
    "ftp://example.com/demo.mp4",
    "javascript:alert(1)",
    "https://example.com/page.html",
  ])("returns null for unsupported input %p", (url) => {
    expect(demoVideoProvider(url)).toBeNull();
  });

  it("is case-insensitive about the host", () => {
    expect(
      demoVideoProvider("https://WWW.YouTube.com/watch?v=dQw4w9WgXcQ")
    ).toBe("youtube");
  });
});

describe("demoVideoEmbedUrl", () => {
  it("converts a YouTube watch URL to a cookie-less embed", () => {
    expect(
      demoVideoEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0");
  });

  it("converts a youtu.be share link", () => {
    expect(demoVideoEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0"
    );
  });

  it("accepts a URL that is already an embed", () => {
    expect(demoVideoEmbedUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0"
    );
  });

  it("converts a Vimeo link to the player URL", () => {
    expect(demoVideoEmbedUrl("https://vimeo.com/123456789")).toBe(
      "https://player.vimeo.com/video/123456789"
    );
  });

  it("passes a direct video file through unchanged", () => {
    expect(demoVideoEmbedUrl("https://cdn.attraccess.org/demo.mp4")).toBe(
      "https://cdn.attraccess.org/demo.mp4"
    );
  });

  it("returns null when no video is configured", () => {
    expect(demoVideoEmbedUrl(null)).toBeNull();
  });

  it.each([
    "https://www.youtube.com/watch?v=tooshort",
    "https://www.youtube.com/watch",
    "https://youtu.be/",
    "https://vimeo.com/not-a-number",
    "https://vimeo.com/",
  ])("returns null rather than a broken embed for %p", (url) => {
    expect(demoVideoEmbedUrl(url)).toBeNull();
  });

  it("never emits a non-http(s) embed URL", () => {
    expect(demoVideoEmbedUrl("javascript:alert(1)")).toBeNull();
    expect(demoVideoEmbedUrl("data:text/html,<script>")).toBeNull();
  });
});

describe("hasDemoVideo", () => {
  it("is false while the demo video is still unshot", () => {
    expect(hasDemoVideo({ url: null, poster: "/x.png" })).toBe(false);
    expect(hasDemoVideo(DEMO_VIDEO)).toBe(false);
  });

  it("is true once a playable URL is configured", () => {
    expect(
      hasDemoVideo({
        url: "https://youtu.be/dQw4w9WgXcQ",
        poster: "/x.png",
      })
    ).toBe(true);
  });

  it("is false for a configured but unusable URL", () => {
    expect(
      hasDemoVideo({ url: "https://example.com/x", poster: "/x.png" })
    ).toBe(false);
  });
});

describe("the media registry", () => {
  const registries: Record<string, Record<string, MediaAsset>> = {
    PHOTOS,
    SCREENSHOTS,
    ILLUSTRATIONS,
    PENDING_PHOTOS,
  };

  const allAssets = Object.entries(registries).flatMap(([name, registry]) =>
    Object.entries(registry).map(
      ([key, asset]) => [`${name}.${key}`, asset] as const
    )
  );

  it.each(allAssets)(
    "%s has an alt key translated in both languages",
    (_name, asset) => {
      expect(translations.en).toHaveProperty(asset.altKey);
      expect(translations.de).toHaveProperty(asset.altKey);
    }
  );

  it.each(allAssets)("%s declares a known media kind", (_name, asset) => {
    expect(["photo", "screenshot", "illustration"]).toContain(asset.kind);
  });

  it("points real assets at absolute public paths", () => {
    for (const [name, asset] of allAssets) {
      if (asset.src !== null) {
        expect(asset.src, name).toMatch(
          /^\/[\w./-]+\.(png|jpg|jpeg|webp|svg)$/
        );
      }
    }
  });

  it("keeps pending photos explicitly empty so they render as placeholders", () => {
    for (const asset of Object.values(PENDING_PHOTOS)) {
      expect(asset.src).toBeNull();
    }
  });

  it("uses a real image as the demo video poster", () => {
    expect(DEMO_VIDEO.poster).toBe(PHOTOS.readerOnMachine.src);
  });

  it("gives every asset a distinct alt key", () => {
    const altKeys = allAssets.map(([, asset]) => asset.altKey);
    expect(new Set(altKeys).size).toBe(altKeys.length);
  });
});
