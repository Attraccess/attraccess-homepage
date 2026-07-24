import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useSEO } from "@/hooks/use-seo";
import seoMeta from "@/lib/seo-meta.json";
import { useI18n } from "@/contexts/i18n";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/blog/PostCard";
import { BLOG_SNAPSHOT, BLOG_URL, splitFeatured } from "@/lib/blog";

export function Blog() {
  useSEO(seoMeta["/blog"]);
  const { t } = useI18n();
  const { featured, rest } = splitFeatured(BLOG_SNAPSHOT.posts);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <div className="text-[13px] font-bold uppercase tracking-[.14em] text-white/70">
            {t("blog.label")}
          </div>
          <h1 className="mb-6 mt-3 text-4xl font-bold text-white sm:text-5xl">
            {t("blog.title")}
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-white/90">
            {t("blog.subtitle")}
          </p>
        </div>
      </section>

      {featured ? (
        <>
          {/* Lead article */}
          <section className="py-16" aria-labelledby="blog-featured-heading">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 id="blog-featured-heading" className="sr-only">
                {t("blog.featured.heading")}
              </h2>
              <PostCard post={featured} featured />
            </div>
          </section>

          {/* Conversion band between the lead and the archive */}
          <section className="bg-muted/40 py-14">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center gap-6 rounded-2xl border border-border bg-card px-8 py-10 text-center shadow-medium sm:px-12 lg:flex-row lg:text-left">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground">
                    {t("blog.cta.title")}
                  </h2>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    {t("blog.cta.text")}
                  </p>
                </div>
                <div className="flex flex-none flex-col gap-3 sm:flex-row">
                  <Button variant="hero" size="lg" className="gap-2" asChild>
                    <Link to="/contact">
                      {t("blog.cta.primary")}
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/how-it-works">{t("blog.cta.secondary")}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Remaining articles */}
          {rest.length > 0 && (
            <section className="py-16" aria-labelledby="blog-more-heading">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                  id="blog-more-heading"
                  className="text-2xl font-bold text-foreground sm:text-3xl"
                >
                  {t("blog.more.heading")}
                </h2>
                <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <li key={post.link} className="flex">
                      <PostCard post={post} className="w-full" />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </>
      ) : (
        /* Feed unavailable at build time — never show an empty page */
        <section className="py-20">
          <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
            <p className="mx-auto max-w-xl text-lg text-muted-foreground">
              {t("blog.empty.text")}
            </p>
          </div>
        </section>
      )}

      {/* Full archive */}
      <section className="border-t border-border py-16">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground">
            {t("blog.archive.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
            {t("blog.archive.text")}
          </p>
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-base font-bold text-primary hover:underline"
          >
            {t("blog.archive.cta")}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
}
