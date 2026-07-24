/**
 * Minimal RSS 2.0 reader for the Ghost blog feed.
 *
 * The feed sends no CORS headers, so it cannot be fetched from the browser.
 * `fetch-blog-posts.mjs` runs this at build time and writes the result to
 * `src/lib/blog-posts.json`, which the Blog page imports.
 *
 * Deliberately dependency-free and tolerant: a malformed item is skipped rather
 * than failing the whole build.
 */

const NAMED_ENTITIES = {
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

/** Decode the XML entities Ghost emits (named, decimal and hex numeric). */
export function decodeXmlEntities(input) {
  if (typeof input !== "string") return "";
  return (
    input
      .replace(/&(lt|gt|quot|apos|nbsp);/g, (_, name) => NAMED_ENTITIES[name])
      .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
        String.fromCodePoint(Number.parseInt(hex, 16))
      )
      .replace(/&#(\d+);/g, (_, dec) =>
        String.fromCodePoint(Number.parseInt(dec, 10))
      )
      // `&amp;` must come last so "&amp;lt;" decodes to "&lt;", not "<".
      .replace(/&amp;/g, "&")
  );
}

/**
 * Turn an HTML source string into plain text: drop the markup, decode the
 * entities it contained, and tidy the whitespace the removed tags left behind.
 */
export function stripHtml(html) {
  if (typeof html !== "string") return "";
  return (
    decodeXmlEntities(
      html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
    )
      .replace(/\s+/g, " ")
      // An inline tag before punctuation ("<b>Text</b>.") would otherwise leave
      // a stray space in front of it.
      .replace(/\s+([.,;:!?…)\]])/g, "$1")
      .trim()
  );
}

function unwrapCdata(value) {
  const cdata = value.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/);
  return cdata ? cdata[1] : decodeXmlEntities(value);
}

/** First value of `<tag>` inside `xml`, CDATA-unwrapped. `null` if absent. */
export function extractTag(xml, tag) {
  if (typeof xml !== "string") return null;
  const match = xml.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "i")
  );
  return match ? unwrapCdata(match[1]) : null;
}

/** Every value of `<tag>` inside `xml`, CDATA-unwrapped. */
export function extractAllTags(xml, tag) {
  if (typeof xml !== "string") return [];
  const matches = xml.matchAll(
    new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, "gi")
  );
  return [...matches].map((match) => unwrapCdata(match[1]));
}

/** Value of an attribute on the first matching self-closing/open tag. */
export function extractAttribute(xml, tag, attribute) {
  if (typeof xml !== "string") return null;
  const openTag = xml.match(new RegExp(`<${tag}\\s[^>]*>`, "i"));
  if (!openTag) return null;
  const value = openTag[0].match(
    new RegExp(`\\b${attribute}\\s*=\\s*"([^"]*)"`, "i")
  );
  return value ? decodeXmlEntities(value[1]) : null;
}

/** Slug of a Ghost post URL, used as a stable identifier. */
export function slugFromLink(link) {
  if (typeof link !== "string") return null;
  try {
    const segments = new URL(link).pathname.split("/").filter(Boolean);
    return segments.length ? segments[segments.length - 1] : null;
  } catch {
    return null;
  }
}

const WORDS_PER_MINUTE = 200;

/** Reading time in whole minutes, minimum 1. */
export function readingMinutes(wordCount) {
  const words = Number(wordCount);
  if (!Number.isFinite(words) || words <= 0) return 1;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/**
 * Parse `<item>` elements into the shape the Blog page consumes.
 * Items without a title or link are dropped.
 */
export function parseRssItems(xml) {
  if (typeof xml !== "string") return [];
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(
    (m) => m[1]
  );

  return items
    .map((item) => {
      const title = extractTag(item, "title");
      const link = extractTag(item, "link");
      if (!title || !link) return null;

      const content = extractTag(item, "content:encoded") ?? "";
      const description = extractTag(item, "description") ?? "";
      const pubDate = extractTag(item, "pubDate");
      const parsedDate = pubDate ? new Date(pubDate) : null;

      return {
        slug: slugFromLink(link),
        // Ghost puts numeric entities inside CDATA, so titles need the same
        // HTML-to-text treatment as the body.
        title: stripHtml(title),
        link: link.trim(),
        excerpt: stripHtml(description),
        categories: extractAllTags(item, "category").map((c) => c.trim()),
        author: extractTag(item, "dc:creator")?.trim() ?? null,
        publishedAt:
          parsedDate && !Number.isNaN(parsedDate.valueOf())
            ? parsedDate.toISOString()
            : null,
        image:
          extractAttribute(item, "media:content", "url") ??
          extractAttribute(content, "img", "src"),
        readingMinutes: readingMinutes(
          stripHtml(content).split(/\s+/).filter(Boolean).length
        ),
      };
    })
    .filter(Boolean);
}

/** Parse a whole feed document. */
export function parseFeed(xml) {
  return {
    title: extractTag(xml, "title")?.trim() ?? null,
    posts: parseRssItems(xml),
  };
}
