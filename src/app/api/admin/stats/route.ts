import { NextResponse, type NextRequest } from "next/server";
import { db, pruneOldEvents, type EventRow } from "@/lib/db";
import { EVENT_RETENTION_DAYS } from "@/config/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

function since(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

/** Fills gaps so charts show empty days rather than skipping them. */
function byDaySeries(
  rows: { day: string; [k: string]: unknown }[],
  days: number,
  keys: string[],
) {
  const map = new Map(rows.map((r) => [r.day, r]));
  const out: Record<string, string | number>[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const day = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10);
    const found = map.get(day);
    const entry: Record<string, string | number> = { day };
    keys.forEach((k) => (entry[k] = Number(found?.[k] ?? 0)));
    out.push(entry);
  }
  return out;
}

export async function GET(req: NextRequest) {
  const days = Math.min(Math.max(Number(req.nextUrl.searchParams.get("days")) || 30, 1), 365);
  const from = since(days);
  const d = db();
  pruneOldEvents();

  /* ---------------- headline numbers ---------------- */
  const totals = d
    .prepare(
      `SELECT
         SUM(kind = 'granted')                                  AS grants,
         SUM(kind = 'visit')                                    AS visits,
         SUM(kind = 'rejected')                                 AS rejected,
         SUM(kind = 'gate_view')                                AS gate_views,
         COUNT(DISTINCT CASE WHEN visitor_id IS NOT NULL THEN visitor_id END) AS unique_visitors
       FROM events WHERE ts >= ?`,
    )
    .get(from) as Row;

  /* ---------------- visitors per day ---------------- */
  const perDay = d
    .prepare(
      `SELECT substr(ts,1,10) AS day,
              COUNT(DISTINCT visitor_id)                     AS visitors,
              SUM(kind = 'granted')                          AS entries,
              SUM(kind = 'granted' AND source = 'gate')       AS entries_typed,
              SUM(kind = 'visit')                            AS visits,
              SUM(kind = 'gate_view')                        AS gate_views,
              SUM(kind = 'rejected')                         AS rejected
         FROM events WHERE ts >= ? GROUP BY day ORDER BY day`,
    )
    .all(from) as { day: string }[];

  /* --------- people who stopped at the door ---------
     Gate views that did not turn into an entry that day. */
  const bounced = (perDay as Row[]).map((r) => ({
    day: r.day as string,
    bounced: Math.max(0, Number(r.gate_views ?? 0) - Number(r.entries_typed ?? 0)),
    gate_views: Number(r.gate_views ?? 0),
  }));

  /* ---------------- per token ----------------
     Entries alone only say a code was opened once. What tells you whether a
     code actually landed is how much the people it let in came back for. */
  const perToken = d
    .prepare(
      `SELECT t.id, t.code, t.name, t.enabled,
              COALESCE(SUM(e.kind = 'granted'), 0) AS entries,
              COALESCE(SUM(e.kind = 'visit'), 0)   AS views,
              COUNT(DISTINCT e.visitor_id)         AS devices,
              MAX(CASE WHEN e.kind IN ('granted','visit') THEN e.ts END) AS last_active
         FROM tokens t
         LEFT JOIN events e ON e.token_id = t.id AND e.ts >= ?
        GROUP BY t.id ORDER BY devices DESC, entries DESC`,
    )
    .all(from) as Row[];

  const tokenEngagement = perToken.map((r) => {
    const entries = Number(r.entries ?? 0);
    const views = Number(r.views ?? 0);
    const devices = Number(r.devices ?? 0);
    return {
      name: String(r.name),
      code: String(r.code),
      entries,
      views,
      devices,
      accesses: entries + views,
      perDevice: devices ? Math.round(((entries + views) / devices) * 10) / 10 : null,
      lastActive: (r.last_active as string) ?? null,
    };
  });

  /* --------- how entries arrived ---------
     A QR/link arrival never renders the gate, so it can never be part of a
     gate bounce rate. Keeping the two apart is what makes both numbers mean
     something — and it answers which distribution channel actually works. */
  const arrival = d
    .prepare(
      `SELECT COALESCE(source, 'unknown') AS label, COUNT(*) AS n
         FROM events WHERE kind = 'granted' AND ts >= ?
        GROUP BY label`,
    )
    .all(from) as Row[];
  const typedEntries = Number(
    (arrival.find((r) => r.label === "gate")?.n as number) ?? 0,
  );
  const linkEntries = Number(
    (arrival.find((r) => r.label === "link")?.n as number) ?? 0,
  );
  // Entries recorded before `source` existed. Surfaced rather than dropped, so
  // the split always reconciles with the Entries headline. Ages out with
  // retention.
  const unknownEntries = Number(
    (arrival.find((r) => r.label === "unknown")?.n as number) ?? 0,
  );

  /* ---------------- failed attempts ---------------- */
  const failedCodes = d
    .prepare(
      `SELECT attempted_code AS code, reason, COUNT(*) AS tries, MAX(ts) AS last_try
         FROM events
        WHERE kind = 'rejected' AND ts >= ? AND attempted_code IS NOT NULL
        GROUP BY attempted_code, reason ORDER BY tries DESC LIMIT 40`,
    )
    .all(from) as Row[];

  /* ---------------- breakdowns ---------------- */
  const breakdown = (col: string) =>
    d
      .prepare(
        `SELECT COALESCE(${col}, 'Unknown') AS label, COUNT(*) AS n
           FROM events WHERE ts >= ? AND kind IN ('granted','visit')
          GROUP BY label ORDER BY n DESC LIMIT 12`,
      )
      .all(from) as Row[];

  /* --------- devices that returned on a later day --------- */
  const returning = d
    .prepare(
      `SELECT COUNT(*) AS n FROM (
         SELECT visitor_id FROM events
          WHERE ts >= ? AND visitor_id IS NOT NULL
          GROUP BY visitor_id
         HAVING COUNT(DISTINCT substr(ts,1,10)) > 1
       )`,
    )
    .get(from) as Row;

  /* ---------------- busiest devices ---------------- */
  const topVisitors = d
    .prepare(
      `SELECT e.visitor_id,
              COUNT(*)                                   AS requests,
              MIN(e.ts)                                  AS first_seen,
              MAX(e.ts)                                  AS last_seen,
              t.code                                     AS token_code,
              t.name                                     AS token_name
         FROM events e
         LEFT JOIN visitors v ON v.visitor_id = e.visitor_id
         LEFT JOIN tokens   t ON t.id = v.token_id
        WHERE e.ts >= ? AND e.visitor_id IS NOT NULL
        GROUP BY e.visitor_id
        ORDER BY requests DESC
        LIMIT 25`,
    )
    .all(from) as Row[];

  /* ---------------- event log ---------------- */
  const events = d
    .prepare(
      `SELECT e.*, t.name AS token_name, t.code AS token_code
         FROM events e LEFT JOIN tokens t ON t.id = e.token_id
        WHERE e.ts >= ? ORDER BY e.ts DESC LIMIT 400`,
    )
    .all(from) as (EventRow & { token_name: string | null; token_code: string | null })[];

  return NextResponse.json({
    days,
    retentionDays: EVENT_RETENTION_DAYS,
    totals: {
      grants: Number(totals.grants ?? 0),
      visits: Number(totals.visits ?? 0),
      rejected: Number(totals.rejected ?? 0),
      gateViews: Number(totals.gate_views ?? 0),
      uniqueVisitors: Number(totals.unique_visitors ?? 0),
      returningDevices: Number(returning.n ?? 0),
      typedEntries,
      linkEntries,
    },
    perDay: byDaySeries(perDay as never, days, [
      "visitors",
      "entries",
      "entries_typed",
      "visits",
      "gate_views",
      "rejected",
    ]),
    bounced: byDaySeries(bounced as never, days, ["bounced", "gate_views"]),
    arrival: { typed: typedEntries, link: linkEntries, unknown: unknownEntries },
    tokenEngagement,
    failedCodes,
    byDevice: breakdown("device"),
    byBrowser: breakdown("browser"),
    byReferrer: breakdown("referrer"),
    topVisitors,
    events,
  });
}
