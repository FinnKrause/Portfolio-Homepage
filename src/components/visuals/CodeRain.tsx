"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsDesktop } from "@/lib/useIsDesktop";
import { cn } from "@/lib/utils";

const CHARS = "0123456789ABCDEF+/=abcdefx01".split("");

/**
 * Subtle, professional "code rain" — faint blue hex/base64 glyphs streaming
 * down a transparent canvas (so whatever is behind it still shows). Desktop
 * only; disabled for reduced-motion. Meant to sit behind hero-like content.
 */
export function CodeRain({
  className,
  headColor = "56, 189, 248", // sky-400
  trailColor = "38, 69, 230", // brand-600
  intensity = 0.55,
}: {
  className?: string;
  headColor?: string;
  trailColor?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Mobile / reduced-motion: keep it fully static (blank canvas).
    if (!desktop || reduce) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const fontSize = 15;
    const trail = 10;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let cols = 0;
    let drops: number[] = [];
    let raf = 0;
    let last = 0;

    const resize = () => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${fontSize}px "JetBrains Mono", ui-monospace, monospace`;
      ctx.textBaseline = "top";
      cols = Math.ceil(w / fontSize);
      drops = Array.from({ length: cols }, () => Math.floor(Math.random() * (h / fontSize)));
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 95) return; // ~10–11 fps: calm, low cost
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < cols; i++) {
        const x = i * fontSize;
        const headRow = drops[i];
        for (let k = 0; k < trail; k++) {
          const row = headRow - k;
          if (row < 0) continue;
          const y = row * fontSize;
          if (y > h) continue;
          const ch = CHARS[(Math.random() * CHARS.length) | 0];
          if (k === 0) {
            ctx.fillStyle = `rgba(${headColor}, ${0.9 * intensity})`;
          } else {
            const a = (1 - k / trail) * 0.5 * intensity;
            ctx.fillStyle = `rgba(${trailColor}, ${a})`;
          }
          ctx.fillText(ch, x, y);
        }
        drops[i] = headRow * fontSize > h && Math.random() > 0.975 ? 0 : headRow + 1;
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [desktop, reduce, headColor, trailColor, intensity]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
