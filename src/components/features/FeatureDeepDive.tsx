import React from "react";
import {
  BarChart3,
  CreditCard,
  GitBranch,
  Nfc,
  Server,
  UserCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/contexts/i18n";
import { MediaSlot } from "@/components/MediaSlot";
import {
  ILLUSTRATIONS,
  PHOTOS,
  SCREENSHOTS,
  type MediaAsset,
} from "@/lib/media";
import { cn } from "@/lib/utils";

export interface FeatureDetail {
  /** i18n prefix: `features.detail.<key>.*` */
  key: string;
  icon: LucideIcon;
  media: MediaAsset;
  /** Number of `bulletN` keys defined for this feature. */
  bullets: number;
  /** Whether the media sits left of the copy on large screens. */
  mediaFirst?: boolean;
}

export const FEATURE_DETAILS: readonly FeatureDetail[] = [
  { key: "access", icon: Nfc, media: PHOTOS.readerWithCredentials, bullets: 4 },
  {
    key: "permissions",
    icon: UserCheck,
    media: SCREENSHOTS.training,
    bullets: 4,
    mediaFirst: true,
  },
  { key: "flows", icon: GitBranch, media: SCREENSHOTS.flowEditor, bullets: 4 },
  {
    key: "analytics",
    icon: BarChart3,
    media: SCREENSHOTS.sessionLog,
    bullets: 4,
    mediaFirst: true,
  },
  {
    key: "maintenance",
    icon: Wrench,
    media: ILLUSTRATIONS.maintenance,
    bullets: 4,
  },
  {
    key: "billing",
    icon: CreditCard,
    media: SCREENSHOTS.billing,
    bullets: 4,
    mediaFirst: true,
  },
  {
    key: "selfhosted",
    icon: Server,
    media: ILLUSTRATIONS.architecture,
    bullets: 4,
  },
] as const;

function FeatureBlock({ detail }: { detail: FeatureDetail }) {
  const { t } = useI18n();
  const prefix = `features.detail.${detail.key}`;
  const Icon = detail.icon;

  return (
    <article
      className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16"
      aria-labelledby={`feature-${detail.key}`}
    >
      <div className={cn(detail.mediaFirst && "lg:order-2")}>
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
          <Icon className="h-4 w-4" aria-hidden="true" />
          {t(`${prefix}.label`)}
        </span>

        <h3
          id={`feature-${detail.key}`}
          className="mt-5 text-3xl font-bold tracking-tight text-foreground"
        >
          {t(`${prefix}.title`)}
        </h3>

        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          {t(`${prefix}.description`)}
        </p>

        <ul className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: detail.bullets }, (_, i) => (
            <li key={i} className="rounded-xl border border-border bg-card p-4">
              <div className="text-sm font-bold text-foreground">
                {t(`${prefix}.bullet${i + 1}.title`)}
              </div>
              <p className="mt-1 text-sm leading-snug text-muted-foreground">
                {t(`${prefix}.bullet${i + 1}.text`)}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-6 border-l-2 border-primary/40 pl-4 text-[15px] font-medium italic leading-relaxed text-foreground/70">
          {t(`${prefix}.usecase`)}
        </p>
      </div>

      <figure className={cn("m-0", detail.mediaFirst && "lg:order-1")}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted shadow-large">
          <MediaSlot asset={detail.media} className="absolute inset-0" />
        </div>
        <figcaption className="mt-3 text-center text-sm font-medium text-muted-foreground">
          {t(`${prefix}.caption`)}
        </figcaption>
      </figure>
    </article>
  );
}

/**
 * One full-width block per feature — headline, what it does, four concrete
 * capabilities and a real-world use case, next to a screenshot or photo.
 */
export function FeatureDeepDive() {
  return (
    <div className="space-y-24 lg:space-y-32">
      {FEATURE_DETAILS.map((detail) => (
        <FeatureBlock key={detail.key} detail={detail} />
      ))}
    </div>
  );
}
