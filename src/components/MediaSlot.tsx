import React from "react";
import { Camera, ImageIcon, MonitorSmartphone } from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { cn } from "@/lib/utils";
import type { MediaAsset, MediaKind } from "@/lib/media";

const KIND_ICON: Record<
  MediaKind,
  React.ComponentType<{ className?: string }>
> = {
  photo: Camera,
  screenshot: MonitorSmartphone,
  illustration: ImageIcon,
};

export interface MediaSlotProps {
  asset: MediaAsset;
  /** Tailwind aspect utility, e.g. `aspect-video`. */
  className?: string;
  imgClassName?: string;
  /** Native lazy-loading; the first slot on a page should pass "eager". */
  loading?: "lazy" | "eager";
}

/**
 * Renders a media asset, or a labelled placeholder when the asset has not been
 * produced yet (`src: null`). The placeholder names what belongs in the slot so
 * an unfilled slot reads as an intentional to-do rather than a broken image.
 */
export function MediaSlot({
  asset,
  className,
  imgClassName,
  loading = "lazy",
}: MediaSlotProps) {
  const { t } = useI18n();
  const label = t(asset.altKey);

  if (asset.src) {
    return (
      <img
        src={asset.src}
        alt={label}
        loading={loading}
        decoding="async"
        className={cn(
          "h-full w-full",
          // Photos crop well; a cropped screenshot or diagram loses the very
          // detail it was included to show.
          asset.kind === "photo" ? "object-cover" : "object-contain",
          className,
          imgClassName
        )}
      />
    );
  }

  const Icon = KIND_ICON[asset.kind] ?? ImageIcon;

  return (
    <div
      role="img"
      aria-label={label}
      data-testid="media-placeholder"
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-3 border border-dashed border-border bg-muted/60 p-6 text-center",
        className
      )}
    >
      <Icon
        className="h-7 w-7 flex-none text-muted-foreground"
        aria-hidden="true"
      />
      <p className="max-w-[28ch] text-sm font-medium leading-snug text-muted-foreground">
        {label}
      </p>
      <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {t("media.placeholder.badge")}
      </span>
    </div>
  );
}
