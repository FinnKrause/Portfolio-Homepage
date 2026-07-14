"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * The "spine": two elegant, thin blue rails pinned to the left & right page
 * margins that fill as you scroll — a quiet frame that ties the whole journey
 * together. Desktop only (content-first on mobile). Reduced-motion → static.
 */
export function ScrollRails() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const Rail = ({ side }: { side: "left" | "right" }) => (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 z-40 hidden lg:block"
      style={{ [side]: "clamp(1.25rem, 3vw, 3rem)" } as React.CSSProperties}
    >
      {/* faint full-height track */}
      <div className="relative h-full w-px bg-gradient-to-b from-transparent via-brand-500/12 to-transparent">
        {/* scroll-progress fill */}
        <motion.div
          className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-gradient-to-b from-brand-500 via-brand-400 to-sky-400"
          style={{ scaleY: reduce ? 1 : scaleY }}
        />
      </div>
    </div>
  );

  return (
    <>
      <Rail side="left" />
      <Rail side="right" />
    </>
  );
}
