"use client";

import { AccessScreen } from "@/components/access/AccessScreen";

/**
 * The code is checked on the server: only codes that exist in the database
 * open the door, so validation cannot happen in the browser any more.
 */
export function GateClient() {
  const submit = async (code: string): Promise<"ok" | "invalid" | "rate-limited"> => {
    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        window.location.replace("/");
        return "ok";
      }
      return res.status === 429 ? "rate-limited" : "invalid";
    } catch {
      return "invalid";
    }
  };

  return <AccessScreen onSubmit={submit} />;
}
