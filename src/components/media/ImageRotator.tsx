"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsDesktop } from "@/lib/useIsDesktop";
import { cn } from "@/lib/utils";

/**
 * Crossfades through a set of images. Auto-advances on desktop only; on mobile
 * or with reduced-motion it stays on the first image (static).
 */
export function ImageRotator({
  images,
  interval = 4200,
  className,
}: {
  images: { src: string; alt: string }[];
  interval?: number;
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();

  useEffect(() => {
    if (!desktop || reduce || images.length <= 1) return;
    const timer = window.setInterval(() => setIdx((i) => (i + 1) % images.length), interval);
    return () => window.clearInterval(timer);
  }, [desktop, reduce, images.length, interval]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 40rem"
          priority={i === 0}
          className={cn(
            "object-cover transition-opacity duration-1000 ease-out",
            i === idx ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/25 via-transparent to-transparent" />
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((img, i) => (
            <span
              key={img.src}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === idx ? "w-5 bg-white" : "w-1.5 bg-white/60",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
