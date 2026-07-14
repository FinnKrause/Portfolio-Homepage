"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsDesktop } from "@/lib/useIsDesktop";
import { cn } from "@/lib/utils";

/**
 * Full-bleed "data field": slowly drifting blue motes joined by faint plexus
 * lines — a calm, technical atmosphere behind the hero. Canvas-based and
 * transform-free (only compositor-friendly work), desktop-only, and fully
 * static under reduced-motion / on mobile.
 */
export function HeroBackdrop({
  className,
  active = true,
}: {
  className?: string;
  active?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const reduce = useReducedMotion();
  const desktop = useIsDesktop();

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (!desktop || reduce) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let pts: P[] = [];

    // Pre-render a soft glowing dot once (cheap to blit each frame).
    const sprite = document.createElement("canvas");
    const S = 34;
    sprite.width = sprite.height = S;
    const sctx = sprite.getContext("2d");
    if (sctx) {
      const g = sctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      g.addColorStop(0, "rgba(97,136,252,0.9)");
      g.addColorStop(0.4, "rgba(61,97,245,0.35)");
      g.addColorStop(1, "rgba(61,97,245,0)");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, S, S);
    }

    const build = () => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Density scales with area, but stays modest for a calm, cheap field.
      const count = Math.min(96, Math.round((w * h) / 22000));
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: 1.1 + Math.random() * 1.7,
      }));
    };
    build();

    const ro = new ResizeObserver(build);
    ro.observe(parent);

    const MAX = 132; // link distance
    const MAX2 = MAX * MAX;

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      // Idle (hero off-screen): keep the loop alive but skip all the drawing.
      if (!activeRef.current) {
        last = t;
        return;
      }
      if (t - last < 1000 / 40) return; // cap ~40fps: smooth enough, easy on the CPU
      last = t;

      ctx.clearRect(0, 0, w, h);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        else if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        else if (p.y > h + 20) p.y = -20;
      }

      // Plexus links.
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > MAX2) continue;
          const alpha = (1 - d2 / MAX2) * 0.16;
          ctx.strokeStyle = `rgba(56,101,232,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Glowing motes.
      for (const p of pts) {
        const s = p.r * 7;
        ctx.drawImage(sprite, p.x - s / 2, p.y - s / 2, s, s);
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [desktop, reduce]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
