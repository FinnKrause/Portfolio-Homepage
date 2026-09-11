import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Liveness probe for the container healthcheck.
 *
 * It touches the database on purpose: a Next server that is answering requests
 * but cannot open SQLite is not actually healthy, and that is the failure this
 * deployment is most likely to have — a missing or unwritable /app/data mount.
 *
 * It must never be one of the pages the gate logs. Pointing a healthcheck at
 * `/gate` would write a `gate_view` row every thirty seconds forever, which
 * would bury the real visitor numbers and permanently skew the bounce rate.
 * Nothing here records an event.
 */
export async function GET() {
  try {
    db().prepare("SELECT 1 AS ok").get();
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
