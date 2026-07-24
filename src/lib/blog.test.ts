import { describe, expect, it } from "vitest";
import {
  BLOG_SNAPSHOT,
  BLOG_URL,
  PINNED_SLUGS,
  formatPostDate,
  formatTopic,
  orderPosts,
  primaryTopic,
  splitFeatured,
  truncate,
  type BlogPost,
} from "@/lib/blog";

function post(overrides: Partial<BlogPost> = {}): BlogPost {
  return {
    slug: "a-post",
    title: "A post",
    link: "https://blog.test/a-post/",
    excerpt: "An excerpt.",
    categories: [],
    author: "Jan Jaap",
    publishedAt: "2026-02-09T05:57:04.000Z",
    image: null,
    readingMinutes: 4,
    ...overrides,
  };
}

describe("orderPosts", () => {
  const older = post({
    slug: "older",
    publishedAt: "2026-01-01T00:00:00.000Z",
  });
  const newer = post({
    slug: "newer",
    publishedAt: "2026-03-01T00:00:00.000Z",
  });
  const newest = post({
    slug: "newest",
    publishedAt: "2026-04-01T00:00:00.000Z",
  });

  it("sorts newest first when nothing is pinned", () => {
    expect(orderPosts([older, newest, newer], []).map((p) => p.slug)).toEqual([
      "newest",
      "newer",
      "older",
    ]);
  });

  it("puts pinned posts first, in pin order", () => {
    expect(
      orderPosts([older, newest, newer], ["older", "newer"]).map((p) => p.slug)
    ).toEqual(["older", "newer", "newest"]);
  });

  it("ignores pinned slugs that are not in the feed", () => {
    expect(
      orderPosts([older, newer], ["deleted-post", "older"]).map((p) => p.slug)
    ).toEqual(["older", "newer"]);
  });

  it("never drops or duplicates a post", () => {
    const input = [older, newest, newer];
    const ordered = orderPosts(input, ["newer"]);
    expect(ordered).toHaveLength(input.length);
    expect(new Set(ordered.map((p) => p.slug)).size).toBe(input.length);
  });

  it("does not mutate the input array", () => {
    const input = [older, newest, newer];
    const snapshot = [...input];
    orderPosts(input, ["newer"]);
    expect(input).toEqual(snapshot);
  });

  it("sorts posts without a date last", () => {
    const undated = post({ slug: "undated", publishedAt: null });
    expect(orderPosts([undated, older], []).map((p) => p.slug)).toEqual([
      "older",
      "undated",
    ]);
  });

  it("returns an empty array for an empty feed", () => {
    expect(orderPosts([], PINNED_SLUGS)).toEqual([]);
  });
});

describe("splitFeatured", () => {
  it("leads with the pinned post and returns the rest below it", () => {
    const posts = BLOG_SNAPSHOT.posts;
    const { featured, rest } = splitFeatured(posts);
    expect(featured?.slug).toBe(PINNED_SLUGS[0]);
    expect(rest).toHaveLength(posts.length - 1);
    expect(rest.map((p) => p.slug)).not.toContain(featured?.slug);
  });

  it("returns null and an empty list when there are no posts", () => {
    expect(splitFeatured([])).toEqual({ featured: null, rest: [] });
  });

  it("returns no rest when there is a single post", () => {
    const only = post();
    expect(splitFeatured([only])).toEqual({ featured: only, rest: [] });
  });
});

describe("formatPostDate", () => {
  it("formats long-form dates per language", () => {
    expect(formatPostDate("2026-02-09T05:57:04.000Z", "en")).toBe(
      "9 February 2026"
    );
    expect(formatPostDate("2026-02-09T05:57:04.000Z", "de")).toBe(
      "9. Februar 2026"
    );
  });

  it("returns null for a missing or unparseable date", () => {
    expect(formatPostDate(null, "en")).toBeNull();
    expect(formatPostDate("not a date", "en")).toBeNull();
    expect(formatPostDate("", "de")).toBeNull();
  });

  it("falls back to the English format for an unknown language", () => {
    expect(formatPostDate("2026-02-09T05:57:04.000Z", "fr" as "en")).toBe(
      "9 February 2026"
    );
  });
});

describe("formatTopic", () => {
  it("sentence-cases a lower-case feed category", () => {
    expect(formatTopic("rolle von automatisierung")).toBe(
      "Rolle von automatisierung"
    );
  });

  it("collapses stray whitespace", () => {
    expect(formatTopic("  wartung   und   pflege ")).toBe("Wartung und pflege");
  });

  it("returns null for missing or blank input", () => {
    expect(formatTopic(undefined)).toBeNull();
    expect(formatTopic("")).toBeNull();
    expect(formatTopic("   ")).toBeNull();
  });

  it("leaves an already-capitalised topic alone", () => {
    expect(formatTopic("Zugriffsmanagement")).toBe("Zugriffsmanagement");
  });
});

describe("primaryTopic", () => {
  it("uses the first category", () => {
    expect(primaryTopic(post({ categories: ["wartung", "zugang"] }))).toBe(
      "Wartung"
    );
  });

  it("returns null when the post has no categories", () => {
    expect(primaryTopic(post({ categories: [] }))).toBeNull();
    expect(
      primaryTopic(post({ categories: undefined as unknown as string[] }))
    ).toBeNull();
  });
});

describe("truncate", () => {
  it("leaves short text alone", () => {
    expect(truncate("Short text", 40)).toBe("Short text");
  });

  it("cuts on a word boundary and adds an ellipsis", () => {
    expect(truncate("one two three four five", 12)).toBe("one two…");
  });

  it("cuts mid-word when the last space is too early to be useful", () => {
    expect(truncate("a verylongsinglewordhere", 10)).toBe("a verylong…");
  });

  it("trims surrounding whitespace", () => {
    expect(truncate("   padded   ", 40)).toBe("padded");
  });

  it("returns an empty string for non-string input", () => {
    expect(truncate(null as unknown as string, 10)).toBe("");
  });

  it("never returns more than max + 1 characters", () => {
    const long = "lorem ipsum dolor sit amet consectetur adipiscing elit";
    for (const max of [5, 10, 20, 40]) {
      expect(truncate(long, max).length).toBeLessThanOrEqual(max + 1);
    }
  });
});

describe("the committed blog snapshot", () => {
  it("contains posts", () => {
    expect(BLOG_SNAPSHOT.posts.length).toBeGreaterThan(0);
  });

  it("points at the Ghost blog", () => {
    expect(BLOG_SNAPSHOT.source).toContain(new URL(BLOG_URL).hostname);
  });

  it("gives every post the fields the cards render", () => {
    for (const p of BLOG_SNAPSHOT.posts) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.link).toMatch(/^https:\/\//);
      expect(p.readingMinutes).toBeGreaterThanOrEqual(1);
      expect(p.excerpt.length).toBeGreaterThan(0);
    }
  });

  it("has no leftover HTML or XML entities in the rendered text", () => {
    for (const p of BLOG_SNAPSHOT.posts) {
      expect(p.title).not.toMatch(/&[#\w]+;|<[a-z]/i);
      expect(p.excerpt).not.toMatch(/&[#\w]+;|<[a-z]/i);
    }
  });

  it("has a unique link per post", () => {
    const links = BLOG_SNAPSHOT.posts.map((p) => p.link);
    expect(new Set(links).size).toBe(links.length);
  });

  it("pins a slug that actually exists in the snapshot", () => {
    for (const slug of PINNED_SLUGS) {
      expect(BLOG_SNAPSHOT.posts.map((p) => p.slug)).toContain(slug);
    }
  });
});
