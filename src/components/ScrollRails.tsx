"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * The "spine": two thin blue rails pinned to the left & right margins. Each has
 * a scroll-progress fill plus a small "data pulse" that streams down the rail —
 * echoing the code-rain background. Desktop only; reduced-motion → static fill.
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
      style={{ [side]: "clamp(1rem, 2.6vw, 2.75rem)" } as React.CSSProperties}
    >
      <div className="relative h-full w-0.5 overflow-hidden rounded-full bg-brand-500/15">
        {/* scroll-progress fill */}
        <motion.div
          className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-gradient-to-b from-brand-500 via-brand-400 to-sky-400"
          style={{ scaleY: reduce ? 1 : scaleY }}
        />
        {/* traveling data pulse */}
        {!reduce && (
          <motion.div
            className="absolute inset-x-[-2px] h-24 rounded-full bg-gradient-to-b from-transparent via-sky-300 to-transparent blur-[1.5px]"
            initial={{ top: "-15%" }}
            animate={{ top: "115%" }}
            transition={{
              duration: 3.4,
              repeat: Infinity,
              ease: "linear",
              delay: side === "right" ? 1.7 : 0,
            }}
          />
        )}
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
