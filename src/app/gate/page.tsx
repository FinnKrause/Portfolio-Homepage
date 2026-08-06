import type { Metadata } from "next";
import { headers } from "next/headers";
import { GateClient } from "./GateClient";
import { readRequestFacts, recordEvent } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The gate carries no personal content and should never be indexed.
export const metadata: Metadata = {
  title: "Finn K",
  description: "Content only available with valid access token",
  robots: { index: false, follow: false },
};

export default async function GatePage() {
  // Counts everyone who reached the door — the denominator for "how many
  // never got past it". No cookie is involved at this stage.
  recordEvent({ kind: "gate_view", facts: readRequestFacts(await headers()) });

  return <GateClient />;
}
