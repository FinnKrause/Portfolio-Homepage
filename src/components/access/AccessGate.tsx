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
import { AccessScreen } from "./AccessScreen";

// The real site is code-split and only fetched once access is granted, so an
// unverified visitor never downloads the content (or the data behind it).
const SiteContent = dynamic(
  () => import("@/components/SiteContent").then((m) => m.SiteContent),
  { ssr: false, loading: () => <AccessChecking /> },
);

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
