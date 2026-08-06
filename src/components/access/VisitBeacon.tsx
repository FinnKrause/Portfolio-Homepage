"use client";

import { useEffect } from "react";

/**
 * Reports one visit per page load. Runs in the browser so the site itself
 * stays statically served and so crawlers that don't execute JavaScript never
 * appear in the visit numbers.
 *
 * The server ignores the call unless the analytics cookie is present, and that
 * cookie only exists for people who entered a code — so this cannot record
 * anyone who hasn't been through the gate.
 */
export function VisitBeacon() {
  useEffect(() => {
    const id = window.setTimeout(() => {
      void fetch("/api/visit", { method: "POST", keepalive: true }).catch(() => {});
    }, 1200); // let the page settle first; this is never urgent
    return () => window.clearTimeout(id);
  }, []);

  return null;
}
