"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import type { MediaSlide } from "@/content/types";
import { useLang } from "@/lib/i18n";
import { MediaView } from "./MediaView";
import { Lightbox, type LightboxImage } from "./Lightbox";
import { RevealGroup, RevealItem } from "../motion/Reveal";
import { cn } from "@/lib/utils";

/**
 * Responsive image gallery with hover-zoom and a click-to-open lightbox.
 * Auto-adapts its column count to the number of slides, so adding more
 * images later "just works". Non-image slides (video/placeholder) render
 * as-is and are not lightbox-openable.
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

  // Collect image slides for the lightbox; remember each slide's image index.
  const images: LightboxImage[] = [];
  const imageIndexOfSlide = slides.map((s) => {
    if (s.kind === "image") {
      images.push({ src: s.src, alt: s.alt ? t(s.alt) : "" });
      return images.length - 1;
    }
    return null;
  });

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
      <RevealGroup className={cn("grid gap-3 sm:gap-4", gridCols, className)} stagger={0.06}>
        {slides.map((slide, i) => {
          const imgIdx = imageIndexOfSlide[i];
          if (slide.kind === "image" && imgIdx !== null) {
            return (
              <RevealItem key={i}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(imgIdx)}
                  aria-label={t({ de: "Bild vergrößern", en: "Enlarge image" })}
                  className="group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-xl ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-lift"
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt ? t(slide.alt) : ""}
                    fill
                    sizes="(max-width: 768px) 50vw, 24rem"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="pointer-events-none absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/85 text-ink-700 opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:opacity-100">
                    <Expand className="h-4 w-4" />
                  </span>
                </button>
              </RevealItem>
            );
          }
          return (
            <RevealItem key={i}>
              <MediaView slide={slide} />
            </RevealItem>
          );
        })}
      </RevealGroup>

      <Lightbox images={images} index={openIndex} onClose={() => setOpenIndex(null)} onNav={nav} />
    </>
  );
}
