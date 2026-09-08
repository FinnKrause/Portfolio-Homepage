"use client";

import { useEffect } from "react";

/**
 * Scrolls to the element named by the URL fragment after the page has settled.
 *
 * The browser already does this natively, but it does it once, at parse time —
 * before the photography below the fold has loaded and taken up its real
 * height. On this page that lands you hundreds of pixels short of the section
 * you asked for. A QR code that promises to drop someone into the F1 chapter
 * has to actually do it, so the scroll is repeated as the layout stabilises.
 *
 * Deliberately cheap: a handful of timers and a `load` listener, all cleaned
 * up, and it does nothing at all when there is no fragment — which is every
 * visit that didn't arrive through a sectioned link.
 */
export function useHashScroll(): void {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    let cancelled = false;
    const go = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      // `scroll-margin-top` in globals.css keeps the fixed nav off the heading.
      el?.scrollIntoView({ behavior: "auto", block: "start" });
    };

    // Once immediately, then again as images resolve and the page grows.
    const frame = requestAnimationFrame(go);
    const timers = [120, 400, 900].map((ms) => window.setTimeout(go, ms));
    window.addEventListener("load", go);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      timers.forEach(window.clearTimeout);
      window.removeEventListener("load", go);
    };
  }, []);
}
