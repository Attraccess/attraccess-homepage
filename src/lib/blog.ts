import snapshot from "@/lib/blog-posts.json";
import type { Language } from "@/contexts/i18n";

export interface BlogPost {
  slug: string | null;
  title: string;
  link: string;
  excerpt: string;
  categories: string[];
  author: string | null;
  /** ISO 8601, or `null` when the feed had no usable date. */
  publishedAt: string | null;
  image: string | null;
  readingMinutes: number;
}

export interface BlogSnapshot {
  source: string;
  fetchedAt: string | null;
  posts: BlogPost[];
}

/** Public URL of the Ghost blog. */
export const BLOG_URL = "https://ghost.attraccess.apps.janjaap.de";

/**
 * Slugs to surface first regardless of publish date — use this to lead with the
 * articles that convert. Unknown slugs are ignored, so it is safe to leave
 * entries in place after a post is removed.
 */
export const PINNED_SLUGS: readonly string[] = [
  "was-ist-zugriffsmanagement-effizient",
];

export const BLOG_SNAPSHOT = snapshot as BlogSnapshot;

/** Pinned posts first (in pin order), then the rest newest-first. */
export function orderPosts(
  posts: readonly BlogPost[],
  pinned: readonly string[] = PINNED_SLUGS
): BlogPost[] {
  const pinnedPosts = pinned
    .map((slug) => posts.find((post) => post.slug === slug))
    .filter((post): post is BlogPost => Boolean(post));

  const rest = posts
    .filter((post) => !pinnedPosts.includes(post))
    .slice()
    .sort((a, b) => {
      const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return bTime - aTime;
    });

  return [...pinnedPosts, ...rest];
}

/** The lead article plus everything below it. */
export function splitFeatured(posts: readonly BlogPost[]): {
  featured: BlogPost | null;
  rest: BlogPost[];
} {
  const ordered = orderPosts(posts);
  return {
    featured: ordered[0] ?? null,
    rest: ordered.slice(1),
  };
}

const DATE_LOCALE: Record<Language, string> = {
  en: "en-GB",
  de: "de-DE",
};

/** Long-form publish date, or `null` when the post has no usable date. */
export function formatPostDate(
  iso: string | null,
  language: Language
): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.valueOf())) return null;
  return new Intl.DateTimeFormat(DATE_LOCALE[language] ?? DATE_LOCALE.en, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Feed categories are lower-cased; show them sentence-cased. */
export function formatTopic(category: string | undefined): string | null {
  if (!category) return null;
  const trimmed = category.trim().replace(/\s+/g, " ");
  if (!trimmed) return null;
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/** First category of a post, sentence-cased. */
export function primaryTopic(post: BlogPost): string | null {
  return formatTopic(post.categories?.[0]);
}

/** Shorten to `max` characters on a word boundary, adding an ellipsis. */
export function truncate(text: string, max: number): string {
  if (typeof text !== "string") return "";
  const clean = text.trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  // Fall back to a hard cut when the last space is so early that trimming to it
  // would throw away most of the excerpt.
  return `${(lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
