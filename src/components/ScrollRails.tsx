"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * The "spine": two thin blue rails pinned to the left & right margins. Each has
 * a scroll-progress fill topped by a glowing head, plus a "data pulse" that
 * streams down the rail — echoing the hero's code-rain. Desktop only;
 * reduced-motion → static fill.
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

  const Rail = ({ side }: { side: "left" | "right" }) => (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-y-0 z-40 hidden lg:block"
      style={{ [side]: "clamp(1rem, 2.6vw, 2.75rem)" } as React.CSSProperties}
    >
      <div className="relative h-full w-0.5 overflow-hidden rounded-full bg-brand-500/15">
        {/* scroll-progress fill */}
        <motion.div
          className="absolute inset-x-0 top-0 h-full origin-top rounded-full bg-gradient-to-b from-brand-500 via-brand-400 to-sky-400 shadow-[0_0_10px_1px_rgba(61,97,245,0.45)]"
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

      {/* glowing head that rides the leading edge of the progress fill */}
      {!reduce && (
        <motion.div
          style={{ top: headTop }}
          className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300 shadow-[0_0_10px_2px_rgba(56,189,248,0.8)]"
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
