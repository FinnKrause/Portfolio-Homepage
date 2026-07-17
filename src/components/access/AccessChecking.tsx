"use client";

/**
 * Content-free placeholder shown for the brief moment while we check whether
 * access is already granted, and while the site chunk loads afterwards.
 */
export function AccessChecking() {
  return (
    <div className="grid min-h-[100svh] place-items-center bg-paper" aria-hidden>
      <span className="relative flex h-3 w-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-600" />
      </span>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
