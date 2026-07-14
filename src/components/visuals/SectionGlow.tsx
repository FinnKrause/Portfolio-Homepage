"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * An edge light that grows inward from the page rails into a section's
 * background as the section scrolls into view — tying the animated spine to
 * the content. Desktop only (hidden < lg); reduced-motion → gentle static tint.
 */
export function SectionGlow({
  side = "both",
  color,
  className,
}: {
  side?: "left" | "right" | "both";
  /** CSS color for the bloom (defaults to brand blue). */
  color?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scaleX = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  const style = reduce ? { opacity: 0.85 } : { opacity, scaleX };

  const varStyle = color ? ({ ["--bloom" as string]: color } as React.CSSProperties) : undefined;

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-hidden", className)}
    >
      {(side === "left" || side === "both") && (
        <motion.div style={{ ...style, ...varStyle }} className="section-bloom section-bloom--left" />
      )}
      {(side === "right" || side === "both") && (
        <motion.div style={{ ...style, ...varStyle }} className="section-bloom section-bloom--right" />
      )}
    </div>
  );
}
