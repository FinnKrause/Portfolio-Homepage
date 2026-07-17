"use client";

/**
 * Content-free placeholder shown for the brief moment while we check whether
 * access is already granted, and while the site chunk loads afterwards.
 * Styled as the hero's cover backdrop so the hand-off feels like one screen
 * fading in rather than a loader being replaced.
 */
export function AccessChecking() {
  return (
    <div className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-night" aria-hidden>
      <div className="cover-wash" />
      <div className="cover-grid" />
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-500" />
      </span>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
