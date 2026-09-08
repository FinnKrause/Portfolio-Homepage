"use client";

import { useEffect } from "react";

/**
 * Locks page scrolling while `active` is true.
 *
 * Counted rather than a plain flag, because two things can hold the lock at
 * once: opening a photo from the mobile nav sheet means both the nav and the
 * lightbox want scrolling frozen. Each previously wrote `document.body.style
 * .overflow` directly and reset it to `""` on close, so whichever closed first
 * released the other's lock and the page scrolled underneath the open dialog.
 *
 * Only the last holder to leave restores the original value.
 */
let holders = 0;
let previousOverflow = "";

export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;

    if (holders === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    holders += 1;

    return () => {
      holders -= 1;
      if (holders === 0) document.body.style.overflow = previousOverflow;
    };
  }, [active]);
}
