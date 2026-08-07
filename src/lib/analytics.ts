import "server-only";

import { db, type TokenRow } from "./db";

/* ------------------------------------------------------------ request info */

export interface RequestFacts {
  browser: string;
  os: string;
  device: string;
  referrer: string | null;
}

/**
 * Everything we keep about a request. The IP is read for rate limiting only
 * and is deliberately never returned or stored.
 */
export function readRequestFacts(headers: Headers): RequestFacts {
  const ua = headers.get("user-agent") ?? "";

  const browser =
    /Edg\//.test(ua) ? "Edge"
    : /OPR\//.test(ua) ? "Opera"
    : /Firefox\//.test(ua) ? "Firefox"
    : /Chrome\//.test(ua) ? "Chrome"
    : /Safari\//.test(ua) ? "Safari"
    : ua ? "Other"
    : "Unknown";

  const os =
    /Windows NT/.test(ua) ? "Windows"
    : /iPhone|iPad|iPod/.test(ua) ? "iOS"
    : /Mac OS X/.test(ua) ? "macOS"
    : /Android/.test(ua) ? "Android"
    : /Linux/.test(ua) ? "Linux"
    : "Unknown";

  const device =
    /iPad|Tablet/.test(ua) ? "Tablet"
    : /Mobi|iPhone|Android/.test(ua) ? "Phone"
    : ua ? "Desktop"
    : "Unknown";

  // Only a hostname is kept, never the full referring URL.
  let referrer: string | null = null;
  const raw = headers.get("referer");
  if (raw) {
    try {
      const host = new URL(raw).hostname;
      referrer = host && !host.endsWith("finnkrause.com") ? host : null;
    } catch {
      referrer = null;
    }
  }

  return { browser, os, device, referrer };
}

function clientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

/* ------------------------------------------------------------ rate limiting */

const attempts = new Map<string, number[]>();
const WINDOW_MS = 10 * 60_000;
const MAX_ATTEMPTS = 12;

/**
 * Only stored codes open the door, and the code space is small enough to walk
 * through, so failed attempts are capped per IP. Successful entries are not
 * counted against the limit.
 */
export function tooManyAttempts(headers: Headers): boolean {
  const ip = clientIp(headers);
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  attempts.set(ip, recent);
  if (attempts.size > 5_000) attempts.clear(); // crude guard against growth
  return recent.length >= MAX_ATTEMPTS;
}

export function noteFailedAttempt(headers: Headers): void {
  const ip = clientIp(headers);
  const now = Date.now();
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
}

/* ----------------------------------------------------------------- tokens */

export type TokenCheck =
  | { ok: true; token: TokenRow }
  | { ok: false; reason: "unknown" | "disabled" | "expired"; token?: TokenRow };

export function checkToken(code: string): TokenCheck {
  const token = db()
    .prepare(`SELECT * FROM tokens WHERE code = ?`)
    .get(code.trim()) as TokenRow | undefined;

  if (!token) return { ok: false, reason: "unknown" };
  if (!token.enabled) return { ok: false, reason: "disabled", token };
  if (token.expires_at && new Date(token.expires_at).getTime() < Date.now()) {
    return { ok: false, reason: "expired", token };
  }
  return { ok: true, token };
}

/* ----------------------------------------------------------------- events */

export interface RecordArgs {
  kind: "gate_view" | "granted" | "rejected" | "visit";
  facts: RequestFacts;
  tokenId?: number | null;
  attemptedCode?: string | null;
  reason?: string | null;
  visitorId?: string | null;
  isNew?: boolean | null;
  /** How a granted entry arrived: the gate form, or a QR / shared link. */
  source?: "gate" | "link" | null;
}

/** A device is bound to the code it entered with. */
export function bindVisitorToToken(visitorId: string, tokenId: number): void {
  const now = new Date().toISOString();
  db()
    .prepare(
      `INSERT INTO visitors (visitor_id, token_id, first_seen, last_seen)
       VALUES (?,?,?,?)
       ON CONFLICT(visitor_id) DO UPDATE SET token_id = excluded.token_id, last_seen = excluded.last_seen`,
    )
    .run(visitorId, tokenId, now, now);
}

/** The one code this device came in with — so return visits are attributable. */
export function tokenForVisitor(visitorId: string): number | null {
  const row = db()
    .prepare(`SELECT token_id FROM visitors WHERE visitor_id = ?`)
    .get(visitorId) as { token_id: number | null } | undefined;
  if (row) {
    db().prepare(`UPDATE visitors SET last_seen = ? WHERE visitor_id = ?`)
      .run(new Date().toISOString(), visitorId);
  }
  return row?.token_id ?? null;
}

export function recordEvent(a: RecordArgs): void {
  try {
    db()
      .prepare(
        `INSERT INTO events
           (ts, kind, token_id, attempted_code, reason, visitor_id, is_new,
            browser, os, device, referrer, source)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      )
      .run(
        new Date().toISOString(),
        a.kind,
        a.tokenId ?? null,
        a.attemptedCode ?? null,
        a.reason ?? null,
        a.visitorId ?? null,
        a.isNew === null || a.isNew === undefined ? null : a.isNew ? 1 : 0,
        a.facts.browser,
        a.facts.os,
        a.facts.device,
        a.facts.referrer,
        a.source ?? null,
      );
  } catch {
    // Analytics must never take the site down.
  }
}
