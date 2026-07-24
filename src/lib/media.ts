/**
 * Central registry for marketing imagery and the product demo video.
 *
 * Photo shoots lag behind page work, so every visual slot is declared here with
 * an explicit `src: null` when the asset does not exist yet. Components render
 * a labelled placeholder for those slots instead of a broken image, and filling
 * one in later is a one-line change in this file.
 */

export type MediaKind = "photo" | "screenshot" | "illustration";

export interface MediaAsset {
  /** Path under `public/`, or `null` while the asset is still outstanding. */
  src: string | null;
  /** i18n key for the alt text (also used as the placeholder caption). */
  altKey: string;
  /** Drives the placeholder icon and label. */
  kind: MediaKind;
}

/** Real product photography that already exists in the repo. */
export const PHOTOS = {
  /** Attractap Touch mounted next to a 3D printer. */
  readerOnMachine: {
    src: "/features/reader.webp",
    altKey: "media.reader-on-machine.alt",
    kind: "photo",
  },
  /** Attractap with an NFC card and key fob. */
  readerWithCredentials: {
    src: "/features/access.jpg",
    altKey: "media.reader-credentials.alt",
    kind: "photo",
  },
} as const satisfies Record<string, MediaAsset>;

/** Application screenshots. */
export const SCREENSHOTS = {
  training: {
    src: "/design/sc-einweisung.png",
    altKey: "media.training.alt",
    kind: "screenshot",
  },
  billing: {
    src: "/design/sc-abrechnung.png",
    altKey: "media.billing.alt",
    kind: "screenshot",
  },
  sessionLog: {
    src: "/design/sc-protokoll.png",
    altKey: "media.session-log.alt",
    kind: "screenshot",
  },
  flowEditor: {
    src: "/features/flows.png",
    altKey: "media.flow-editor.alt",
    kind: "screenshot",
  },
} as const satisfies Record<string, MediaAsset>;

/** Explanatory diagrams and illustrations. */
export const ILLUSTRATIONS = {
  architecture: {
    src: "/features/security.jpg",
    altKey: "media.architecture.alt",
    kind: "illustration",
  },
  maintenance: {
    src: "/how-it-works/maintain-scale.webp",
    altKey: "media.maintenance.alt",
    kind: "illustration",
  },
} as const satisfies Record<string, MediaAsset>;

/**
 * Photography that has been requested but not shot yet. Each entry renders as
 * a labelled placeholder until `src` is filled in.
 */
export const PENDING_PHOTOS = {
  peopleAtMachine: {
    src: null,
    altKey: "media.people-at-machine.alt",
    kind: "photo",
  },
  peopleTapping: {
    src: null,
    altKey: "media.people-tapping.alt",
    kind: "photo",
  },
  workshopFloor: {
    src: null,
    altKey: "media.workshop-floor.alt",
    kind: "photo",
  },
  team: {
    src: null,
    altKey: "media.team.alt",
    kind: "photo",
  },
} as const satisfies Record<string, MediaAsset>;

export type VideoProvider = "youtube" | "vimeo" | "file";

export interface DemoVideoConfig {
  /**
   * Full URL of the demo video. A YouTube/Vimeo watch or share link works —
   * `demoVideoEmbedUrl` converts it. `null` renders the "book a live demo"
   * fallback instead.
   */
  url: string | null;
  /** Poster frame shown behind the play button. */
  poster: string;
  /** Human-readable runtime, e.g. "3:24". Optional. */
  duration?: string;
}

/**
 * Drop the demo video URL in here once it exists — no other change needed.
 */
export const DEMO_VIDEO: DemoVideoConfig = {
  url: null,
  poster: PHOTOS.readerOnMachine.src,
};

const YOUTUBE_HOSTS = ["youtube.com", "www.youtube.com", "m.youtube.com"];
const YOUTUBE_ID = /^[\w-]{11}$/;

/** Detect which player a URL belongs to. Returns `null` if unrecognised. */
export function demoVideoProvider(url: string): VideoProvider | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;

  const host = parsed.hostname.toLowerCase();
  if (host === "youtu.be" || YOUTUBE_HOSTS.includes(host)) return "youtube";
  if (host === "vimeo.com" || host === "player.vimeo.com") return "vimeo";
  if (/\.(mp4|webm|ogg)$/i.test(parsed.pathname)) return "file";
  return null;
}

/**
 * Normalise a share/watch URL into something that can go straight into an
 * `<iframe src>`. Returns `null` for unsupported or malformed input so callers
 * can fall back rather than render a broken embed.
 */
export function demoVideoEmbedUrl(url: string | null): string | null {
  if (!url) return null;
  const provider = demoVideoProvider(url);
  if (!provider) return null;

  const parsed = new URL(url);

  if (provider === "youtube") {
    const id =
      parsed.hostname.toLowerCase() === "youtu.be"
        ? parsed.pathname.slice(1)
        : parsed.pathname.startsWith("/embed/")
          ? parsed.pathname.slice("/embed/".length)
          : (parsed.searchParams.get("v") ?? "");
    if (!YOUTUBE_ID.test(id)) return null;
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
  }

  if (provider === "vimeo") {
    const id = parsed.pathname.split("/").filter(Boolean).pop() ?? "";
    if (!/^\d+$/.test(id)) return null;
    return `https://player.vimeo.com/video/${id}`;
  }

  return parsed.toString();
}

/** `true` when a real, playable demo video is configured. */
export function hasDemoVideo(config: DemoVideoConfig = DEMO_VIDEO): boolean {
  return demoVideoEmbedUrl(config.url) !== null;
}
