import "server-only";

import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { EVENT_RETENTION_DAYS } from "@/config/access";

/**
 * SQLite store for access tokens and their analytics.
 *
 * The file lives outside the build output so it survives redeploys — see the
 * `data` volume in docker-compose.yaml. Override with FK_DB_PATH if needed.
 */
const DB_PATH =
  process.env.FK_DB_PATH ?? path.join(process.cwd(), "data", "access.db");

let instance: Database.Database | null = null;

export function db(): Database.Database {
  if (instance) return instance;

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const conn = new Database(DB_PATH);
  conn.pragma("journal_mode = WAL");
  conn.pragma("foreign_keys = ON");

  conn.exec(`
    CREATE TABLE IF NOT EXISTS tokens (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      code        TEXT    NOT NULL UNIQUE,
      name        TEXT    NOT NULL,
      -- Where a link or QR built from this code should land. NULL = the top of
      -- the page. Only ever a value from SECTION_IDS; see content/ui.ts.
      section     TEXT,
      enabled     INTEGER NOT NULL DEFAULT 1,
      expires_at  TEXT,
      created_at  TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      ts             TEXT    NOT NULL,
      kind           TEXT    NOT NULL,      -- gate_view | granted | rejected | visit
      token_id       INTEGER REFERENCES tokens(id) ON DELETE SET NULL,
      attempted_code TEXT,                  -- only for rejected
      reason         TEXT,                  -- unknown | disabled | expired
      visitor_id     TEXT,                  -- analytics cookie, null before consent
      is_new         INTEGER,               -- 1 = first time on this device
      browser        TEXT,
      os             TEXT,
      device         TEXT,
      referrer       TEXT,
      source         TEXT                   -- granted only: gate | link
    );

    -- A device belongs to exactly one code: the one it entered with. Clearing
    -- cookies makes it a new device with a new row.
    --
    -- total_entries / total_visits are running counters, NOT derived from the
    -- events table. That is the whole point: events are deleted after six months,
    -- so anything counted from them silently shrinks over time and the all-time
    -- figures would drift downwards. These only ever go up.
    CREATE TABLE IF NOT EXISTS visitors (
      visitor_id    TEXT PRIMARY KEY,
      token_id      INTEGER REFERENCES tokens(id) ON DELETE SET NULL,
      first_seen    TEXT    NOT NULL,
      last_seen     TEXT    NOT NULL,
      total_entries INTEGER NOT NULL DEFAULT 0,
      total_visits  INTEGER NOT NULL DEFAULT 0
    );

    -- All-time counters for the two event kinds that have no device attached.
    -- A gate view or a rejected code happens before any cookie exists, so there
    -- is no visitors row to hang a counter on — and once those events age out,
    -- "how many people ever turned back at the door" would be unanswerable.
    -- Deliberately just a name and a number: nothing here identifies anyone.
    CREATE TABLE IF NOT EXISTS totals (
      key TEXT    PRIMARY KEY,   -- gate_views | rejected
      n   INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_events_ts       ON events(ts);
    CREATE INDEX IF NOT EXISTS idx_events_kind_ts  ON events(kind, ts);
    CREATE INDEX IF NOT EXISTS idx_events_token    ON events(token_id);
    CREATE INDEX IF NOT EXISTS idx_events_visitor  ON events(visitor_id);
  `);

  instance = conn;
  pruneOldEvents();
  return conn;
}

/**
 * Enforces the retention promised in the privacy policy. Cheap enough to run
 * opportunistically; it only touches rows that are already past the cut-off.
 *
 * Events only, and on the event's own timestamp — this does not roll forward
 * when a device returns. The running totals that survive it live on `visitors`
 * and in `totals`, which is what keeps the all-time figures honest after the
 * rows behind them are gone.
 */
export function pruneOldEvents(): number {
  const cutoff = new Date(
    Date.now() - EVENT_RETENTION_DAYS * 86_400_000,
  ).toISOString();
  return db().prepare(`DELETE FROM events WHERE ts < ?`).run(cutoff).changes;
}

export interface TokenRow {
  id: number;
  code: string;
  name: string;
  section: string | null;
  enabled: number;
  expires_at: string | null;
  created_at: string;
}

export interface EventRow {
  id: number;
  ts: string;
  kind: "gate_view" | "granted" | "rejected" | "visit";
  token_id: number | null;
  attempted_code: string | null;
  reason: string | null;
  visitor_id: string | null;
  is_new: number | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  referrer: string | null;
  source: "gate" | "link" | null;
}

export interface VisitorRow {
  visitor_id: string;
  token_id: number | null;
  first_seen: string;
  last_seen: string;
  total_entries: number;
  total_visits: number;
}
