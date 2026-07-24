import React, { useState } from "react";
import { ArrowUpRight, Clock } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import {
  formatPostDate,
  primaryTopic,
  truncate,
  type BlogPost,
} from "@/lib/blog";
import { cn } from "@/lib/utils";

export interface PostCardProps {
  post: BlogPost;
  /** Featured cards use a side-by-side layout and a larger headline. */
  featured?: boolean;
  className?: string;
}

export function PostCard({ post, featured = false, className }: PostCardProps) {
  const { t, language } = useI18n();
  const topic = primaryTopic(post);
  const date = formatPostDate(post.publishedAt, language);
  // Cover images are hosted by the blog, not by us. If one disappears, fall
  // back to the gradient rather than showing a broken-image icon.
  const [imageBroken, setImageBroken] = useState(false);
  const showImage = Boolean(post.image) && !imageBroken;

  return (
    <article
      className={cn(
        "group relative flex overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-shadow duration-300 hover:shadow-large",
        featured ? "flex-col lg:flex-row" : "flex-col",
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          featured ? "aspect-[16/10] lg:aspect-auto lg:w-1/2" : "aspect-[16/9]"
        )}
      >
        {showImage ? (
          <img
            src={post.image}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setImageBroken(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-card" aria-hidden="true" />
        )}
        {featured && (
          <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-medium">
            {t("blog.featured.badge")}
          </span>
        )}
      </div>

      <div
        className={cn(
          "flex flex-1 flex-col p-6",
          featured && "lg:justify-center lg:p-10"
        )}
      >
        {topic && (
          <span className="mb-3 inline-block max-w-full truncate text-xs font-bold uppercase tracking-wider text-primary">
            {truncate(topic, 48)}
          </span>
        )}

        <h3
          className={cn(
            "font-bold leading-tight text-foreground",
            featured ? "text-2xl sm:text-3xl" : "text-lg"
          )}
        >
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="after:absolute after:inset-0 focus-visible:underline"
          >
            {post.title}
          </a>
        </h3>

        <p
          className={cn(
            "mt-3 leading-relaxed text-muted-foreground",
            featured ? "text-base" : "text-sm"
          )}
        >
          {truncate(post.excerpt, featured ? 240 : 140)}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted-foreground">
          {date && <span>{date}</span>}
          {date && <span aria-hidden="true">·</span>}
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {t("blog.reading-time", { minutes: post.readingMinutes })}
          </span>
        </div>

        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
          {t("blog.read-article")}
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </article>
  );
}
