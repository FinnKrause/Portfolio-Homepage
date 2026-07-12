"use client";

import Image from "next/image";
import type { MediaSlide } from "@/content/types";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Placeholder } from "./Placeholder";
import { YouTubeEmbed } from "./YouTubeEmbed";

/** Renders any MediaSlide. `fill` makes it fill its parent (used in carousels). */
export function MediaView({
  slide,
  fill = false,
  className,
}: {
  slide: MediaSlide;
  fill?: boolean;
  className?: string;
}) {
  const { t } = useLang();

  if (slide.kind === "image") {
    if (fill) {
      return (
        <div className={cn("relative h-full w-full overflow-hidden rounded-xl", className)}>
          <Image src={slide.src} alt={slide.alt ? t(slide.alt) : ""} fill sizes="(max-width: 768px) 100vw, 40rem" className="object-cover" />
        </div>
      );
    }
    return (
      <div className={cn("relative overflow-hidden rounded-xl", className)} style={{ aspectRatio: "4 / 3" }}>
        <Image src={slide.src} alt={slide.alt ? t(slide.alt) : ""} fill sizes="(max-width: 768px) 100vw, 40rem" className="object-cover" />
      </div>
    );
  }

  if (slide.kind === "video") {
    return <YouTubeEmbed youtube={slide.youtube} title={slide.title ? t(slide.title) : undefined} fill={fill} className={className} />;
  }

  return <Placeholder label={slide.label ? t(slide.label) : undefined} aspect={slide.aspect} fill={fill} className={className} />;
}
