"use client";

import { useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";

/**
 * Cinematic god-rays fanning out from a bright source above the fold. Pure CSS
 * (blurred gradient beams + a slow group sway), so it stays cheap. The beams
 * only render on md+ where there's room; a soft source glow always shows.
 * Reduced-motion → static fan.
 */
type Beam = {
  angle: number; // degrees from vertical
  w: number; // rem
  min: number; // resting opacity
  max: number; // peak opacity
  dur: number; // breathe duration (s)
  delay: number;
};

const BEAMS: Beam[] = [
  { angle: -42, w: 3.2, min: 0.24, max: 0.56, dur: 8.6, delay: 0.0 },
  { angle: -29, w: 4.6, min: 0.3, max: 0.7, dur: 7.1, delay: 0.9 },
  { angle: -17, w: 5.6, min: 0.36, max: 0.82, dur: 9.2, delay: 0.35 },
  { angle: -6, w: 6.6, min: 0.4, max: 0.9, dur: 7.9, delay: 1.5 },
  { angle: 6, w: 6.6, min: 0.4, max: 0.9, dur: 8.4, delay: 0.6 },
  { angle: 17, w: 5.6, min: 0.36, max: 0.82, dur: 7.3, delay: 1.15 },
  { angle: 29, w: 4.6, min: 0.3, max: 0.7, dur: 9.5, delay: 0.2 },
  { angle: 42, w: 3.2, min: 0.24, max: 0.56, dur: 8.0, delay: 1.75 },
];

export function LightRays() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="light-rays">
      <div className="ray-source" />
      <div className={reduce ? "ray-fan ray-fan--static" : "ray-fan"}>
        {BEAMS.map((b, i) => (
          <span
            key={i}
            className="ray"
            style={
              {
                width: `${b.w}rem`,
                transform: `translateX(-50%) rotate(${b.angle}deg)`,
                animationDelay: `${b.delay}s`,
                "--ray-min": b.min,
                "--ray-max": b.max,
                "--ray-dur": `${b.dur}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
