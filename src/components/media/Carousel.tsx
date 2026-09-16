"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Crossfade carousel. Every slide is absolutely positioned to fill the parent,
 * so the parent must define the height.
 *
 * Auto-advances only while scrolled into view; any manual interaction (arrow or
 * dot) stops auto-advance permanently.
 *
 * There used to be a second, in-flow layout mode behind a `fill` prop, where
 * the first slide sized the container. Both call sites passed `fill`, so that
 * branch never ran — and because it rendered every slide unconditionally it
 * also quietly contradicted the mounting rule below.
 */
export function Carousel({
  slides,
  autoMs = 4200,
  ariaLabel,
  subtle = false,
  className,
}: {
  slides: ReactNode[];
  autoMs?: number;
  ariaLabel?: string;
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

  /**
   * Only the current slide and its immediate neighbours are mounted. Rendering
   * every slide meant a carousel of 11 photos fired 11 image requests at once
   * and starved whatever else the page still needed. Neighbours stay mounted so
   * they are already decoded before the crossfade reaches them.
   */
  const near = (i: number) => {
    const d = Math.abs(i - index);
    return Math.min(d, count - d) <= 1;
  };

  return (
    <div
      ref={rootRef}
      className={cn("relative h-full", subtle && "group", className)}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      {slides.map((node, i) => (
        <div
          key={i}
          className={cn(
            "absolute inset-0 transition-opacity duration-500",
            index === i ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-hidden={index !== i}
        >
          {near(i) ? node : null}
        </div>
      ))}

      {count > 1 && (
        <>
          {/* Arrows */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 flex items-center justify-between px-2",
              // Hide-until-hover only on devices that can hover; on touch the
              // arrows stay visible so the carousel is clickable on mobile.
              subtle &&
                "px-3 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:focus-within:opacity-100 [@media(hover:hover)]:group-hover:opacity-100",
            )}
          >
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous"
              className="pointer-events-auto grid h-11 w-11 place-items-center rounded-md bg-canvas/85 text-ink shadow-lift backdrop-blur transition-colors hover:bg-canvas"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next"
              className="pointer-events-auto grid h-11 w-11 place-items-center rounded-md bg-canvas/85 text-ink shadow-lift backdrop-blur transition-colors hover:bg-canvas"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dots. The button is a full 44px-tall hit box around a 6px mark —
              the visible dot stays small without the tap target shrinking. */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={index === i}
                className="group/dot grid h-11 w-5 place-items-center"
              >
                <span
                  aria-hidden
                  className={cn(
                    "h-1.5 rounded-sm transition-all",
                    index === i
                      ? "w-6 bg-canvas"
                      : "w-1.5 bg-canvas/55 group-hover/dot:bg-canvas/85",
                  )}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
