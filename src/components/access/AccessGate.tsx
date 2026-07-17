"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  ACCESS_STORAGE_KEY,
  ACCESS_URL_PARAM,
  VERIFICATION_ENABLED,
  isValidAccessCode,
} from "@/config/access";
import { AccessChecking } from "./AccessChecking";

// The real site is code-split and only fetched once access is granted, so an
// unverified visitor never downloads the content (or the data behind it).
const SiteContent = dynamic(
  () => import("@/components/SiteContent").then((m) => m.SiteContent),
  { ssr: false, loading: () => <AccessChecking /> },
);

// The lock screen is split out too, so verified visitors hydrate a smaller
// bundle and reach the content sooner.
const AccessScreen = dynamic(
  () => import("./AccessScreen").then((m) => m.AccessScreen),
  { ssr: false, loading: () => <AccessChecking /> },
);

/**
 * Read-only version of the access decision (no storage writes, no URL
 * rewriting — those stay in the effect below). Used to warm caches early.
 */
function hasAccessSync(): boolean {
  if (!VERIFICATION_ENABLED) return true;
  try {
    if (localStorage.getItem(ACCESS_STORAGE_KEY) === "1") return true;
  } catch {
    /* ignore */
  }
  try {
    const code = new URL(window.location.href).searchParams.get(ACCESS_URL_PARAM);
    if (code && isValidAccessCode(code)) return true;
  } catch {
    /* ignore */
  }
  return false;
}

function preloadHeroPortrait() {
  if (document.querySelector('link[data-fk-hero-preload]')) return;
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = "/images/finn-portrait-transparent.png";
  link.setAttribute("data-fk-hero-preload", "");
  document.head.appendChild(link);
}

// Warm-up at module-evaluation time (i.e. while React is still hydrating):
// if this device is already verified, start downloading the SiteContent chunk
// and the hero portrait immediately instead of waiting for the post-hydration
// effect. Unverified visitors trigger neither request — the gate holds.
if (typeof window !== "undefined" && hasAccessSync()) {
  void import("@/components/SiteContent");
  preloadHeroPortrait();
}

type Status = "checking" | "locked" | "granted";

export function AccessGate() {
  const [status, setStatus] = useState<Status>(
    VERIFICATION_ENABLED ? "checking" : "granted",
  );

  const grant = () => {
    try {
      localStorage.setItem(ACCESS_STORAGE_KEY, "1");
    } catch {
      /* storage unavailable — still let them in for this session */
    }
    // Manual code entry path: start the portrait download alongside the chunk.
    preloadHeroPortrait();
    setStatus("granted");
  };

  useEffect(() => {
    if (!VERIFICATION_ENABLED) return;

    // 1. Already let in on this device?
    try {
      if (localStorage.getItem(ACCESS_STORAGE_KEY) === "1") {
        setStatus("granted");
        return;
      }
    } catch {
      /* ignore */
    }

    // 2. A valid code in the URL (shared link / QR code) → let them straight in
    //    and strip the code from the address bar.
    try {
      const url = new URL(window.location.href);
      const code = url.searchParams.get(ACCESS_URL_PARAM);
      if (code && isValidAccessCode(code)) {
        url.searchParams.delete(ACCESS_URL_PARAM);
        window.history.replaceState(
          {},
          "",
          url.pathname + url.search + url.hash,
        );
        grant();
        return;
      }
    } catch {
      /* ignore */
    }

    setStatus("locked");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "granted") return <SiteContent />;
  if (status === "locked") return <AccessScreen onGranted={grant} />;
  return <AccessChecking />;
}
