import React from "react";
import { useI18n } from "@/contexts/i18n";
import { MediaSlot } from "@/components/MediaSlot";
import { PENDING_PHOTOS, PHOTOS, type MediaAsset } from "@/lib/media";
import { cn } from "@/lib/utils";

interface GalleryItem {
  asset: MediaAsset;
  captionKey: string;
  /** Featured tiles take two columns from the `lg` breakpoint up. */
  featured?: boolean;
}

const ITEMS: readonly GalleryItem[] = [
  {
    asset: PHOTOS.readerOnMachine,
    captionKey: "how-it-works.gallery.reader.caption",
    featured: true,
  },
  {
    asset: PENDING_PHOTOS.peopleTapping,
    captionKey: "how-it-works.gallery.tap.caption",
  },
  {
    asset: PHOTOS.readerWithCredentials,
    captionKey: "how-it-works.gallery.credentials.caption",
  },
  {
    asset: PENDING_PHOTOS.workshopFloor,
    captionKey: "how-it-works.gallery.floor.caption",
  },
  {
    asset: PENDING_PHOTOS.peopleAtMachine,
    captionKey: "how-it-works.gallery.people.caption",
  },
];

/**
 * "In the workshop" gallery: the reader next to a real machine, the credentials
 * people carry, and the space it runs in. Slots without a photo yet render as
 * labelled placeholders rather than being hidden, so the layout is final.
 */
export function WorkshopGallery() {
  const { t } = useI18n();

  return (
    <section className="py-20" aria-labelledby="workshop-gallery-heading">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="text-[13px] font-bold uppercase tracking-[.14em] text-primary">
            {t("how-it-works.gallery.label")}
          </div>
          <h2
            id="workshop-gallery-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {t("how-it-works.gallery.title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            {t("how-it-works.gallery.subtitle")}
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => (
            <li
              key={item.captionKey}
              className={cn(
                "flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft",
                // The hero tile covers two columns *and* two rows, so the tiles
                // beside it keep their normal height instead of stretching to
                // match it and leaving a gap under their caption.
                item.featured && "lg:col-span-2 lg:row-span-2"
              )}
            >
              <div
                className={cn(
                  "relative w-full overflow-hidden bg-muted",
                  item.featured
                    ? "aspect-[4/3] lg:aspect-auto lg:flex-1"
                    : "aspect-[4/3]"
                )}
              >
                <MediaSlot asset={item.asset} className="absolute inset-0" />
              </div>
              <p className="px-5 py-4 text-sm font-medium leading-snug text-muted-foreground">
                {t(item.captionKey)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
