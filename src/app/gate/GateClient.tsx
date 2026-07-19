"use client";

import { ACCESS_COOKIE, ACCESS_COOKIE_MAX_AGE } from "@/config/access";
import { AccessScreen } from "@/components/access/AccessScreen";

export function GateClient() {
  const grant = () => {
    document.cookie = `${ACCESS_COOKIE}=1; path=/; max-age=${ACCESS_COOKIE_MAX_AGE}; samesite=lax`;
    window.location.replace("/");
  };

  return <AccessScreen onGranted={grant} />;
}
