"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * The "spine": two slim blue rails pinned to the left & right margins. Each has
 * a continuously travelling shimmer, a smooth scroll-progress fill, and a
 * glowing comet head that rides the leading edge. Desktop only; reduced-motion
 * collapses to a static fill.
 */
export function ScrollRails() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const headTop = useTransform(scaleY, [0, 1], ["0%", "100%"]);
  const headOpacity = useTransform(scaleY, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);

  const Rail = ({ side }: { side: "left" | "right" }) => (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 z-40 hidden lg:block"
      style={{ [side]: "clamp(1rem, 2.6vw, 2.75rem)" } as React.CSSProperties}
    >
      <div className="relative h-full w-[3px] overflow-hidden rounded-full bg-gradient-to-b from-brand-500/8 via-brand-500/16 to-brand-500/8">
        {/* continuously travelling shimmer */}
        {!reduce && (
          <div className="rail-shimmer" style={{ animationDelay: side === "right" ? "1.8s" : "0s" }} />
        )}

        {/* scroll-progress fill */}
        <motion.div
          className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-gradient-to-b from-brand-500 via-brand-400 to-sky-400 shadow-[0_0_14px_2px_rgba(61,97,245,0.45)]"
          style={{ scaleY: reduce ? 1 : scaleY }}
        />
      </div>

      {/* glowing comet head riding the leading edge */}
      {!reduce && (
        <motion.div
          style={{ top: headTop, opacity: headOpacity }}
          className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300 shadow-[0_0_16px_4px_rgba(56,189,248,0.9)]"
        />
      )}
    </div>
  );

  return (
    <>
      <Rail side="left" />
      <Rail side="right" />
    </>
  );
}
