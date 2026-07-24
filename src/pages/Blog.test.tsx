import React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, screen, within } from "@testing-library/react";
import { Blog } from "@/pages/Blog";
import { PostCard } from "@/components/blog/PostCard";
import { renderWithProviders, expectNoUntranslatedKeys } from "@/test/utils";
import {
  BLOG_SNAPSHOT,
  BLOG_URL,
  PINNED_SLUGS,
  splitFeatured,
  type BlogPost,
} from "@/lib/blog";

const { featured, rest } = splitFeatured(BLOG_SNAPSHOT.posts);

function samplePost(overrides: Partial<BlogPost> = {}): BlogPost {
  return {
    slug: "a-post",
    title: "A post about access control",
    link: "https://blog.test/a-post/",
    excerpt: "A short excerpt.",
    categories: ["zugriffsmanagement"],
    author: "Jan Jaap",
    publishedAt: "2026-02-09T05:57:04.000Z",
    image: "https://cdn.test/cover.png",
    readingMinutes: 6,
    ...overrides,
  };
}

describe("Blog page", () => {
  it("replaces the bare iframe with real content", () => {
    const { container } = renderWithProviders(<Blog />);
    expect(container.querySelector("iframe")).toBeNull();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });

  it("leads with the pinned article, badged", () => {
    renderWithProviders(<Blog />);
    expect(featured?.slug).toBe(PINNED_SLUGS[0]);
    expect(screen.getByText("Start here")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: featured!.title })).toHaveAttribute(
      "href",
      featured!.link
    );
  });

  it("lists every remaining article", () => {
    renderWithProviders(<Blog />);
    const more = screen
      .getByRole("heading", { name: "More from the blog" })
      .closest("section") as HTMLElement;
    expect(within(more).getAllByRole("listitem")).toHaveLength(rest.length);
  });

  it("opens articles in a new tab without leaking the referrer window", () => {
    renderWithProviders(<Blog />);
    for (const post of BLOG_SNAPSHOT.posts) {
      const link = screen.getByRole("link", { name: post.title });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("puts a conversion call to action between the lead and the archive", () => {
    renderWithProviders(<Blog />);
    expect(
      screen.getByRole("heading", {
        name: "Reading about it is one thing. Seeing it run is another.",
      })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Book a demo/ })).toHaveAttribute(
      "href",
      "/contact"
    );
    expect(
      screen.getByRole("link", { name: "See how it works" })
    ).toHaveAttribute("href", "/how-it-works");
  });

  it("links out to the full Ghost archive", () => {
    renderWithProviders(<Blog />);
    expect(screen.getByRole("link", { name: /Open the blog/ })).toHaveAttribute(
      "href",
      BLOG_URL
    );
  });

  it.each(["en", "de"] as const)(
    "has no untranslated keys in %s",
    (language) => {
      const { container } = renderWithProviders(<Blog />, { language });
      expectNoUntranslatedKeys(container);
    }
  );
});

describe("PostCard", () => {
  it("shows the topic, date and reading time", () => {
    renderWithProviders(<PostCard post={samplePost()} />);
    expect(screen.getByText("Zugriffsmanagement")).toBeInTheDocument();
    expect(screen.getByText("9 February 2026")).toBeInTheDocument();
    expect(screen.getByText("6 min read")).toBeInTheDocument();
  });

  it("localises the date and reading time", () => {
    renderWithProviders(<PostCard post={samplePost()} />, { language: "de" });
    expect(screen.getByText("9. Februar 2026")).toBeInTheDocument();
    expect(screen.getByText("6 Min. Lesezeit")).toBeInTheDocument();
  });

  it("omits the date when the feed had none", () => {
    renderWithProviders(<PostCard post={samplePost({ publishedAt: null })} />);
    expect(screen.queryByText(/2026/)).not.toBeInTheDocument();
    expect(screen.getByText("6 min read")).toBeInTheDocument();
  });

  it("omits the topic when the post has no category", () => {
    renderWithProviders(<PostCard post={samplePost({ categories: [] })} />);
    expect(screen.queryByText("Zugriffsmanagement")).not.toBeInTheDocument();
  });

  it("renders a decorative cover image that screen readers skip", () => {
    const { container } = renderWithProviders(<PostCard post={samplePost()} />);
    const image = container.querySelector("img");
    expect(image).toHaveAttribute("src", "https://cdn.test/cover.png");
    expect(image).toHaveAttribute("alt", "");
  });

  it("falls back to a gradient when the post has no image", () => {
    const { container } = renderWithProviders(
      <PostCard post={samplePost({ image: null })} />
    );
    expect(container.querySelector("img")).toBeNull();
  });

  it("drops a cover image that fails to load instead of showing it broken", () => {
    const { container } = renderWithProviders(<PostCard post={samplePost()} />);
    const image = container.querySelector("img") as HTMLImageElement;
    fireEvent.error(image);
    expect(container.querySelector("img")).toBeNull();
  });

  it("shows the featured badge only on featured cards", () => {
    const { unmount } = renderWithProviders(<PostCard post={samplePost()} />);
    expect(screen.queryByText("Start here")).not.toBeInTheDocument();
    unmount();

    renderWithProviders(<PostCard post={samplePost()} featured />);
    expect(screen.getByText("Start here")).toBeInTheDocument();
  });

  it("truncates a long excerpt", () => {
    const long = "wort ".repeat(200).trim();
    renderWithProviders(<PostCard post={samplePost({ excerpt: long })} />);
    const rendered = screen.getByText(/^wort/).textContent ?? "";
    expect(rendered.length).toBeLessThanOrEqual(141);
    expect(rendered.endsWith("…")).toBe(true);
  });

  it("gives a featured card more room for its excerpt", () => {
    const long = "wort ".repeat(200).trim();
    renderWithProviders(
      <PostCard post={samplePost({ excerpt: long })} featured />
    );
    const rendered = screen.getByText(/^wort/).textContent ?? "";
    expect(rendered.length).toBeGreaterThan(141);
    expect(rendered.length).toBeLessThanOrEqual(241);
  });
});
