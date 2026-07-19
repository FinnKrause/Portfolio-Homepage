"use client";

import { useEffect } from "react";
import {
  ACCESS_COOKIE,
  ACCESS_COOKIE_MAX_AGE,
  ACCESS_STORAGE_KEY,
} from "@/config/access";
import { AccessScreen } from "@/components/access/AccessScreen";

function setAccessCookie() {
  document.cookie = `${ACCESS_COOKIE}=1; path=/; max-age=${ACCESS_COOKIE_MAX_AGE}; samesite=lax`;
}

export function GateClient() {
  // Silent migration: devices verified under the old localStorage-based gate
  // get the cookie set and pass straight through without re-entering a code.
  useEffect(() => {
    try {
      if (localStorage.getItem(ACCESS_STORAGE_KEY) === "1") {
        setAccessCookie();
        window.location.replace("/");
      }
    } catch {
      /* ignore */
    }
  }, []);

  const grant = () => {
    try {
      localStorage.setItem(ACCESS_STORAGE_KEY, "1");
    } catch {
      /* storage unavailable — the cookie alone still lets them in */
    }
    setAccessCookie();
    window.location.replace("/");
  };

  return <AccessScreen onGranted={grant} />;
}
