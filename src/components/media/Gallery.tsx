"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import type { MediaSlide } from "@/content/types";
import { useLang } from "@/lib/i18n";
import { Lightbox, type LightboxImage } from "./Lightbox";
import { cn } from "@/lib/utils";

/**
 * Responsive image gallery with hover-zoom and a click-to-open lightbox.
 * Auto-adapts its column count to the number of slides, so adding more
 * images later "just works".
 */
export function Gallery({
  slides,
  columns,
  className,
}: {
  slides: MediaSlide[];
  /** Force a fixed max column count (keeps lone images from going full-width). */
  columns?: 2 | 3;
  className?: string;
}) {
  const { t } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const images: LightboxImage[] = slides.map((s) => ({
    src: s.src,
    alt: s.alt ? t(s.alt) : "",
  }));

  const nav = (dir: number) =>
    setOpenIndex((cur) => (cur === null ? cur : (cur + dir + images.length) % images.length));

  const n = slides.length;
  const gridCols =
    columns === 3
      ? "grid-cols-2 sm:grid-cols-3"
      : columns === 2
        ? "grid-cols-2"
        : n <= 1
          ? "grid-cols-1"
          : n === 2
            ? "grid-cols-2"
            : "grid-cols-2 md:grid-cols-3";


  return (
    <>
      <ul className={cn("grid gap-4", gridCols, className)}>
        {slides.map((slide, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={t({ de: "Bild vergrößern", en: "Enlarge image" })}
              className="frame group relative block aspect-[4/3] w-full cursor-pointer"
            >
              <Image
                src={slide.src}
                alt={slide.alt ? t(slide.alt) : ""}
                fill
                quality={90}
                sizes="(max-width: 768px) 50vw, 28rem"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
              />
              {/* The control only appears on intent — hover or keyboard focus. */}
              <span className="pointer-events-none absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-md bg-canvas/90 text-ink opacity-0 shadow-lift backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                <Expand className="h-4 w-4" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox images={images} index={openIndex} onClose={() => setOpenIndex(null)} onNav={nav} />
    </>
  );
}
