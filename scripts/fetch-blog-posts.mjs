#!/usr/bin/env node
/**
 * Snapshot the Ghost RSS feed into `src/lib/blog-posts.json` so the Blog page
 * can render real article cards. The feed sends no CORS headers, so this has to
 * happen at build time rather than in the browser.
 *
 * Network failures are non-fatal: the committed snapshot stays in place and the
 * build continues. Run `pnpm blog:fetch` to refresh it.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseFeed } from "./parse-rss.mjs";

const FEED_URL =
  process.env.BLOG_FEED_URL ?? "https://ghost.attraccess.apps.janjaap.de/rss/";
const TIMEOUT_MS = 20_000;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = join(root, "src/lib/blog-posts.json");

function existingSnapshot() {
  try {
    return JSON.parse(readFileSync(outFile, "utf8"));
  } catch {
    return null;
  }
}

async function main() {
  let xml;
  try {
    const response = await fetch(FEED_URL, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { accept: "application/rss+xml, application/xml" },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }
    xml = await response.text();
  } catch (error) {
    const snapshot = existingSnapshot();
    console.warn(
      `blog:fetch — could not reach ${FEED_URL} (${error.message}).` +
        (snapshot
          ? ` Keeping the committed snapshot (${snapshot.posts.length} posts).`
          : " No snapshot on disk; the blog page will render its empty state.")
    );
    if (!snapshot) {
      writeFileSync(
        outFile,
        JSON.stringify(
          { source: FEED_URL, fetchedAt: null, posts: [] },
          null,
          2
        ) + "\n"
      );
    }
    return;
  }

  const { posts } = parseFeed(xml);
  if (!posts.length) {
    console.warn("blog:fetch — feed contained no usable items; snapshot kept.");
    return;
  }

  writeFileSync(
    outFile,
    JSON.stringify(
      {
        source: FEED_URL,
        fetchedAt: new Date().toISOString(),
        posts,
      },
      null,
      2
    ) + "\n"
  );
  console.log(
    `blog:fetch — wrote ${posts.length} posts to src/lib/blog-posts.json`
  );
}

await main();
