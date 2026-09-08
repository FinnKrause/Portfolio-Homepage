"use client";

import Image from "next/image";
import type { MediaSlide } from "@/content/types";
import { useLang } from "@/lib/i18n";

/**
 * One media slide inside a project carousel.
 *
 * `object-contain`, not `cover`: these are screenshots, and cropping the edges
 * off a user interface loses the part that makes it legible.
 *
 * There was a second, in-flow variant behind a `fill` prop that boxed the image
 * into a 4/3 frame with `object-cover`. Nothing ever rendered it — the only
 * call site has always passed `fill` — so the component is now just the one
 * thing it actually does.
 */
export function MediaView({ slide }: { slide: MediaSlide }) {
  const { t } = useLang();

  return (
    <div className="relative h-full w-full">
      <Image
        src={slide.src}
        alt={slide.alt ? t(slide.alt) : ""}
        fill
        quality={90}
        sizes="(max-width: 768px) 100vw, 40rem"
        className="object-contain"
      />
    </div>
  );
}
