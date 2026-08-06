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
      description TEXT    NOT NULL DEFAULT '',
      note        TEXT    NOT NULL DEFAULT '',
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
      referrer       TEXT
    );

    -- A device belongs to exactly one code: the one it entered with. Clearing
    -- cookies makes it a new device with a new row.
    CREATE TABLE IF NOT EXISTS visitors (
      visitor_id TEXT PRIMARY KEY,
      token_id   INTEGER REFERENCES tokens(id) ON DELETE SET NULL,
      first_seen TEXT NOT NULL,
      last_seen  TEXT NOT NULL
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
 */
export function pruneOldEvents(): number {
  const cutoff = new Date(
    Date.now() - EVENT_RETENTION_DAYS * 86_400_000,
  ).toISOString();
  const info = instance!.prepare(`DELETE FROM events WHERE ts < ?`).run(cutoff);
  return info.changes;
}

export interface TokenRow {
  id: number;
  code: string;
  name: string;
  description: string;
  note: string;
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
}

export interface VisitorRow {
  visitor_id: string;
  token_id: number | null;
  first_seen: string;
  last_seen: string;
}
