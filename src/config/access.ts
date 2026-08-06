export const VERIFICATION_ENABLED = true;

/**
 * Cookie carrying the "verified" flag. The middleware reads it on the server,
 * so verified visitors receive the full site with the very first response —
 * no client-side check, no second JS roundtrip. Strictly necessary for the
 * service the visitor asked for (§ 25 Abs. 2 Nr. 2 TDDDG).
 */
export const ACCESS_COOKIE = "fk-access";

/**
 * Analytics cookie. Written ONLY once a visitor has entered a valid code and
 * is being let onto the site — never on the gate screen itself, so nobody who
 * turns back at the door is given one. Its lifetime matches the retention
 * period below so nothing outlives the data it belongs to.
 */
export const VISITOR_COOKIE = "fk-visitor";

export const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // one year
export const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 182; // ~6 months

/** Access events are deleted after this many days. Stated in the privacy policy. */
export const EVENT_RETENTION_DAYS = 182;

export const ACCESS_URL_PARAM = "code";

/** Codes are typed by hand and read off cards, so they stay short: XXXX-X. */
const CODE_RE = /^(\d{4})-(\d)$/;

/** Shape check only — whether a code actually opens the door is a DB question. */
export function isWellFormedCode(raw: string): boolean {
  return CODE_RE.test(raw.trim());
}

export function formatAccessCode(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 5);
  return digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits;
}

/** Generates a random well-formed code. Uniqueness is enforced by the DB. */
export function generateCode(): string {
  const n = Math.floor(Math.random() * 100_000)
    .toString()
    .padStart(5, "0");
  return `${n.slice(0, 4)}-${n.slice(4)}`;
}
