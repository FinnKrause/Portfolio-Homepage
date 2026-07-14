"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Crossfade carousel.
 * - `fill`: every slide is absolutely positioned to fill the parent (the parent
 *   must define the height). Use for edge-to-edge media panels.
 * - default (no `fill`): the FIRST slide stays in flow and defines the height;
 *   the rest are overlaid. Good for slides of differing intrinsic heights.
 * - Auto-advances only while scrolled into view.
 * - Any manual interaction (arrow/dot) permanently stops auto-advance.
 */
export function Carousel({
  slides,
  autoMs = 4200,
  ariaLabel,
  fill = false,
  subtle = false,
  className,
}: {
  slides: ReactNode[];
  autoMs?: number;
  ariaLabel?: string;
  fill?: boolean;
  /** Quiet controls: small arrows that surface on hover/focus, not always-on. */
  subtle?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [inView, setInView] = useState(false);
  const [manual, setManual] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const count = slides.length;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.4,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (count <= 1 || manual || !inView || reduce) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % count), autoMs);
    return () => window.clearInterval(timer);
  }, [count, manual, inView, reduce, autoMs]);

  const go = (next: number) => {
    setManual(true);
    setIndex(((next % count) + count) % count);
  };

  if (count === 0) return null;

  return (
    <div
      ref={rootRef}
      className={cn("relative", fill && "h-full", subtle && "group", className)}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      {fill ? (
        // Fill mode: all slides absolute; parent provides the height.
        slides.map((node, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              index === i ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-hidden={index !== i}
          >
            {node}
          </div>
        ))
      ) : (
        <>
          {/* Sizer = first slide, always in flow */}
          <div
            className={cn("transition-opacity duration-500", index === 0 ? "opacity-100" : "opacity-0")}
            aria-hidden={index !== 0}
          >
            {slides[0]}
          </div>
          {slides.slice(1).map((node, i) => {
            const slideIndex = i + 1;
            const active = index === slideIndex;
            return (
              <div
                key={slideIndex}
                className={cn(
                  "absolute inset-0 transition-opacity duration-500",
                  active ? "opacity-100" : "pointer-events-none opacity-0",
                )}
                aria-hidden={!active}
              >
                {node}
              </div>
            );
          })}
        </>
      )}

      {count > 1 && (
        <>
          {/* Arrows */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 flex items-center justify-between px-2",
              subtle &&
                "px-3 opacity-0 transition-opacity duration-300 focus-within:opacity-100 group-hover:opacity-100",
            )}
          >
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous"
              className={cn(
                "pointer-events-auto grid place-items-center rounded-full transition",
                subtle
                  ? "h-8 w-8 bg-white/60 text-ink-600 shadow-sm ring-1 ring-black/5 backdrop-blur hover:bg-white/90 hover:text-ink-900"
                  : "h-9 w-9 bg-white/85 text-ink-700 shadow-md backdrop-blur hover:bg-white",
              )}
            >
              <ChevronLeft className={subtle ? "h-4 w-4" : "h-5 w-5"} />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next"
              className={cn(
                "pointer-events-auto grid place-items-center rounded-full transition",
                subtle
                  ? "h-8 w-8 bg-white/60 text-ink-600 shadow-sm ring-1 ring-black/5 backdrop-blur hover:bg-white/90 hover:text-ink-900"
                  : "h-9 w-9 bg-white/85 text-ink-700 shadow-md backdrop-blur hover:bg-white",
              )}
            >
              <ChevronRight className={subtle ? "h-4 w-4" : "h-5 w-5"} />
            </button>
          </div>

          {/* Dots */}
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={index === i}
                className={cn(
                  "rounded-full shadow-sm transition-all",
                  subtle
                    ? index === i
                      ? "h-1.5 w-4 bg-white"
                      : "h-1.5 w-1.5 bg-white/55 hover:bg-white/80"
                    : index === i
                      ? "h-1.5 w-5 bg-brand-600"
                      : "h-1.5 w-1.5 bg-white/90 ring-1 ring-black/5 hover:bg-white",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
