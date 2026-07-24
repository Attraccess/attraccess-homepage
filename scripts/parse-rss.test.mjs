import { describe, expect, it } from "vitest";
import {
  decodeXmlEntities,
  extractAllTags,
  extractAttribute,
  extractTag,
  parseFeed,
  parseRssItems,
  readingMinutes,
  slugFromLink,
  stripHtml,
} from "./parse-rss.mjs";

const FEED = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title><![CDATA[Attraccess]]></title>
    <link>https://blog.example.com/</link>
    <item>
      <title><![CDATA[Wartungsworkflow &#x2013; Anleitung]]></title>
      <link>https://blog.example.com/wartungsworkflow-anleitung/</link>
      <description><![CDATA[Wie Sie Wartung automatisieren.]]></description>
      <category><![CDATA[wartung]]></category>
      <category><![CDATA[automatisierung]]></category>
      <dc:creator><![CDATA[Jan Jaap]]></dc:creator>
      <pubDate>Mon, 09 Feb 2026 05:57:04 GMT</pubDate>
      <media:content url="https://cdn.example.com/cover.png" medium="image"/>
      <content:encoded><![CDATA[<p>${"wort ".repeat(400)}</p>]]></content:encoded>
    </item>
    <item>
      <title>Ohne CDATA &amp; mit Entities</title>
      <link>https://blog.example.com/zweiter-artikel/</link>
      <description>Kurzer &lt;b&gt;Text&lt;/b&gt;.</description>
      <pubDate>Tue, 10 Feb 2026 06:00:00 GMT</pubDate>
      <content:encoded><![CDATA[<img src="https://cdn.example.com/inline.png"><p>Nur ein paar Worte.</p>]]></content:encoded>
    </item>
  </channel>
</rss>`;

describe("decodeXmlEntities", () => {
  it("decodes the named entities Ghost emits", () => {
    expect(decodeXmlEntities("a &lt;b&gt; &quot;c&quot; &apos;d&apos;")).toBe(
      `a <b> "c" 'd'`
    );
  });

  it("decodes hexadecimal and decimal numeric entities", () => {
    expect(decodeXmlEntities("Wartung &#x2013; Anleitung")).toBe(
      "Wartung – Anleitung"
    );
    expect(decodeXmlEntities("&#8211;")).toBe("–");
  });

  it("decodes &amp; last so double-encoded input survives", () => {
    expect(decodeXmlEntities("&amp;lt;")).toBe("&lt;");
    expect(decodeXmlEntities("Zugang &amp; Wartung")).toBe("Zugang & Wartung");
  });

  it("returns an empty string for non-string input", () => {
    expect(decodeXmlEntities(null)).toBe("");
    expect(decodeXmlEntities(undefined)).toBe("");
    expect(decodeXmlEntities(42)).toBe("");
  });

  it("leaves text without entities untouched", () => {
    expect(decodeXmlEntities("plain text")).toBe("plain text");
  });
});

describe("stripHtml", () => {
  it("removes tags and collapses whitespace", () => {
    expect(stripHtml("<p>Hallo   <b>Welt</b></p>\n<p>Zwei</p>")).toBe(
      "Hallo Welt Zwei"
    );
  });

  it("drops script and style contents entirely", () => {
    expect(
      stripHtml("<p>A</p><script>alert(1)</script><style>p{}</style>")
    ).toBe("A");
  });

  it("decodes entities inside the text", () => {
    expect(stripHtml("<p>Zugang &amp; Wartung</p>")).toBe("Zugang & Wartung");
  });

  it("returns an empty string for non-string input", () => {
    expect(stripHtml(null)).toBe("");
  });
});

describe("extractTag", () => {
  it("unwraps CDATA", () => {
    expect(extractTag("<title><![CDATA[Hallo]]></title>", "title")).toBe(
      "Hallo"
    );
  });

  it("decodes entities when there is no CDATA", () => {
    expect(extractTag("<title>A &amp; B</title>", "title")).toBe("A & B");
  });

  it("matches namespaced tags", () => {
    expect(extractTag("<dc:creator>Jan</dc:creator>", "dc:creator")).toBe(
      "Jan"
    );
  });

  it("ignores attributes on the opening tag", () => {
    expect(extractTag(`<title type="text">Hi</title>`, "title")).toBe("Hi");
  });

  it("returns the first occurrence only", () => {
    expect(extractTag("<a>one</a><a>two</a>", "a")).toBe("one");
  });

  it("returns null when the tag is absent or the input is not a string", () => {
    expect(extractTag("<a>one</a>", "b")).toBeNull();
    expect(extractTag(null, "a")).toBeNull();
  });
});

describe("extractAllTags", () => {
  it("returns every occurrence", () => {
    expect(extractAllTags("<c><![CDATA[a]]></c><c>b</c>", "c")).toEqual([
      "a",
      "b",
    ]);
  });

  it("returns an empty array when there are none", () => {
    expect(extractAllTags("<a>x</a>", "c")).toEqual([]);
    expect(extractAllTags(null, "c")).toEqual([]);
  });
});

describe("extractAttribute", () => {
  it("reads an attribute from a self-closing tag", () => {
    expect(
      extractAttribute(
        '<media:content url="https://x/y.png" medium="image"/>',
        "media:content",
        "url"
      )
    ).toBe("https://x/y.png");
  });

  it("reads an attribute from an opening tag", () => {
    expect(extractAttribute('<img src="https://x/y.png">', "img", "src")).toBe(
      "https://x/y.png"
    );
  });

  it("decodes entities in the value", () => {
    expect(
      extractAttribute('<img src="https://x/y?a=1&amp;b=2">', "img", "src")
    ).toBe("https://x/y?a=1&b=2");
  });

  it("returns null when the tag or attribute is missing", () => {
    expect(extractAttribute("<img>", "img", "src")).toBeNull();
    expect(extractAttribute("<p>x</p>", "img", "src")).toBeNull();
    expect(extractAttribute(null, "img", "src")).toBeNull();
  });
});

describe("slugFromLink", () => {
  it("takes the last path segment", () => {
    expect(slugFromLink("https://blog.example.com/my-post/")).toBe("my-post");
    expect(slugFromLink("https://blog.example.com/a/b/c")).toBe("c");
  });

  it("returns null for a root URL or malformed input", () => {
    expect(slugFromLink("https://blog.example.com/")).toBeNull();
    expect(slugFromLink("not a url")).toBeNull();
    expect(slugFromLink(null)).toBeNull();
  });
});

describe("readingMinutes", () => {
  it("rounds to the nearest minute at 200 words per minute", () => {
    expect(readingMinutes(200)).toBe(1);
    expect(readingMinutes(500)).toBe(3);
    expect(readingMinutes(1200)).toBe(6);
  });

  it("never returns less than one minute", () => {
    expect(readingMinutes(0)).toBe(1);
    expect(readingMinutes(5)).toBe(1);
    expect(readingMinutes(-100)).toBe(1);
    expect(readingMinutes("nonsense")).toBe(1);
  });
});

describe("parseRssItems", () => {
  const posts = parseRssItems(FEED);

  it("returns one entry per item", () => {
    expect(posts).toHaveLength(2);
  });

  it("decodes the title and derives a slug", () => {
    expect(posts[0].title).toBe("Wartungsworkflow – Anleitung");
    expect(posts[0].slug).toBe("wartungsworkflow-anleitung");
  });

  it("keeps the description as a plain-text excerpt", () => {
    expect(posts[0].excerpt).toBe("Wie Sie Wartung automatisieren.");
    expect(posts[1].excerpt).toBe("Kurzer Text.");
  });

  it("collects every category", () => {
    expect(posts[0].categories).toEqual(["wartung", "automatisierung"]);
    expect(posts[1].categories).toEqual([]);
  });

  it("normalises the publish date to ISO 8601", () => {
    expect(posts[0].publishedAt).toBe("2026-02-09T05:57:04.000Z");
  });

  it("prefers the media:content image and falls back to the first inline image", () => {
    expect(posts[0].image).toBe("https://cdn.example.com/cover.png");
    expect(posts[1].image).toBe("https://cdn.example.com/inline.png");
  });

  it("reads the author when the feed provides one", () => {
    expect(posts[0].author).toBe("Jan Jaap");
    expect(posts[1].author).toBeNull();
  });

  it("estimates reading time from the article body", () => {
    expect(posts[0].readingMinutes).toBe(2); // 400 words
    expect(posts[1].readingMinutes).toBe(1);
  });

  it("skips items without a title or link", () => {
    const broken = `<item><description>no title</description></item>
      <item><title>No link</title></item>
      <item><title>Fine</title><link>https://x.test/ok/</link></item>`;
    expect(parseRssItems(broken).map((p) => p.title)).toEqual(["Fine"]);
  });

  it("tolerates a missing date", () => {
    const item = `<item><title>T</title><link>https://x.test/t/</link><pubDate>not a date</pubDate></item>`;
    expect(parseRssItems(item)[0].publishedAt).toBeNull();
  });

  it("returns an empty array for empty or non-string input", () => {
    expect(parseRssItems("")).toEqual([]);
    expect(parseRssItems("<rss></rss>")).toEqual([]);
    expect(parseRssItems(null)).toEqual([]);
  });
});

describe("parseFeed", () => {
  it("returns the channel title and the posts", () => {
    const feed = parseFeed(FEED);
    expect(feed.title).toBe("Attraccess");
    expect(feed.posts).toHaveLength(2);
  });

  it("handles an empty document without throwing", () => {
    expect(parseFeed("")).toEqual({ title: null, posts: [] });
  });
});
