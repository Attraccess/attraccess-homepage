import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, Play } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DEMO_VIDEO,
  demoVideoEmbedUrl,
  type DemoVideoConfig,
} from "@/lib/media";

export interface DemoVideoProps {
  config?: DemoVideoConfig;
  className?: string;
}

/**
 * Demo video section for the "How it works" page.
 *
 * Uses a click-to-load facade: the player iframe is only mounted after the user
 * presses play, so the third-party embed never runs on first paint (and never
 * gets baked into the prerendered HTML).
 *
 * When no video URL is configured yet the same block renders a "book a live
 * demo" card instead, so the page never shows a dead player.
 */
export function DemoVideo({ config = DEMO_VIDEO, className }: DemoVideoProps) {
  const { t } = useI18n();
  const [playing, setPlaying] = useState(false);
  const embedUrl = demoVideoEmbedUrl(config.url);

  return (
    <section
      className={cn("bg-muted/40 py-20", className)}
      aria-labelledby="demo-video-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-[13px] font-bold uppercase tracking-[.14em] text-primary">
            {t("how-it-works.demo.label")}
          </div>
          <h2
            id="demo-video-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {t("how-it-works.demo.title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t("how-it-works.demo.subtitle")}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-large">
            <div
              className={cn(
                "relative aspect-video w-full bg-muted",
                // The fallback card carries a heading, a paragraph and a
                // button; on a narrow screen 16:9 is not tall enough for them,
                // so a min-height takes over until the aspect ratio is taller.
                !embedUrl && "min-h-[26rem] sm:min-h-[24rem]"
              )}
            >
              {embedUrl && playing ? (
                <iframe
                  src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
                  title={t("how-it-works.demo.title")}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    src={config.poster}
                    alt={t("how-it-works.demo.poster.alt")}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-t",
                      // The fallback puts a paragraph over the middle of the
                      // photo, which needs a heavier scrim than a play button.
                      embedUrl
                        ? "from-black/70 via-black/25 to-transparent"
                        : "from-black/80 via-black/60 to-black/45"
                    )}
                    aria-hidden="true"
                  />
                  {embedUrl ? (
                    <button
                      type="button"
                      onClick={() => setPlaying(true)}
                      className="group absolute inset-0 flex flex-col items-center justify-center gap-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60"
                    >
                      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-large transition-transform duration-200 group-hover:scale-110">
                        <Play
                          className="ml-1 h-8 w-8 fill-current"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="text-base font-semibold text-white drop-shadow">
                        {t("how-it-works.demo.play")}
                        {config.duration ? ` · ${config.duration}` : ""}
                      </span>
                    </button>
                  ) : (
                    <div
                      data-testid="demo-video-pending"
                      className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
                    >
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                        <CalendarClock
                          className="h-7 w-7 text-white"
                          aria-hidden="true"
                        />
                      </span>
                      <p className="max-w-md text-lg font-semibold text-white drop-shadow">
                        {t("how-it-works.demo.pending.title")}
                      </p>
                      <p className="max-w-md text-sm font-medium text-white/85 drop-shadow">
                        {t("how-it-works.demo.pending.text")}
                      </p>
                      <Button variant="cta" size="lg" className="mt-1" asChild>
                        <Link to="/contact">
                          {t("how-it-works.demo.pending.cta")}
                        </Link>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <p className="mt-4 text-center text-sm font-medium text-muted-foreground">
            {t("how-it-works.demo.caption")}
          </p>
        </div>
      </div>
    </section>
  );
}
