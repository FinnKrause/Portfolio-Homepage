export const VERIFICATION_ENABLED = true;

/**
 * Cookie carrying the "verified" flag. The middleware reads it on the server,
 * so verified visitors receive the full site with the very first response —
 * no client-side check, no second JS roundtrip. Strictly necessary for the
 * service the visitor asked for (§ 25 Abs. 2 Nr. 2 TDDDG).
 *
 * HttpOnly: the middleware reads it off the *request*, which HttpOnly does not
 * affect, and nothing in the browser needs it. It was previously readable by
 * page scripts for no reason anyone could name.
 */
export const ACCESS_COOKIE = "fk-access";

/**
 * Analytics cookie. Written ONLY once a visitor has entered a valid code and
 * is being let onto the site — never on the gate screen itself, so nobody who
 * turns back at the door is given one.
 */
export const VISITOR_COOKIE = "fk-visitor";

/**
 * Both cookies live a year, and both are re-issued on **every** visit — see
 * /api/visit. The window therefore rolls: someone who comes back every nine
 * months never sees the gate a second time and stays attributable to the code
 * they arrived with, while a device that goes quiet for a full year is
 * forgotten by the browser and returns as a new device.
 *
 * They are equal on purpose. If the visitor cookie expired first, a returning
 * device would still be let in but would be counted as a brand new one, which
 * silently inflates reach; if the access cookie expired first, someone would be
 * asked for a code the site could already attribute. Keep them in step.
 */
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // one year, from the last visit

/**
 * Individual access events are deleted after this many days, counted from the
 * event's own timestamp — this does not roll with the cookies. Stated in the
 * privacy policy.
 *
 * Running totals survive the prune: per-device counters on `visitors`, and the
 * identifier-free `totals` table for the two event kinds that have no device
 * attached. So the all-time numbers stay correct even though the rows behind
 * them are long gone.
 */
export const EVENT_RETENTION_DAYS = 182;

export const ACCESS_URL_PARAM = "code";

/**
 * Optional section to land on, carried in the same URL as the code:
 * `/?code=1234-5&to=championship`.
 *
 * It travels in the query rather than as a `#hash` because the middleware has
 * to hand it to /api/access on the server, and fragments are never sent to a
 * server. The route turns it back into a hash on the final redirect, which is
 * what actually makes the browser scroll.
 */
export const SECTION_URL_PARAM = "to";

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

/**
 * Whether a token's `expires_at` has passed. Shared by the server (which
 * decides whether the door opens) and the admin table (which prints the
 * badge), so the two can never disagree about what "expired" means.
 *
 * The admin form is an `<input type="date">`, so the value arrives as a bare
 * `YYYY-MM-DD`, which `new Date()` reads as midnight UTC. Taken literally that
 * killed the code for the whole of the day it was meant to expire *on* — hand
 * someone a card marked "valid to the 7th" and it was already dead all of the
 * 7th. A bare date therefore means the end of that day; full timestamps are
 * used as given.
 */
export function isExpired(expiresAt: string | null | undefined): boolean {
  if (!expiresAt) return false;
  const bareDate = /^\d{4}-\d{2}-\d{2}$/.test(expiresAt);
  return new Date(bareDate ? `${expiresAt}T23:59:59.999Z` : expiresAt).getTime() < Date.now();
}

/** Generates a random well-formed code. Uniqueness is enforced by the DB. */
export function generateCode(): string {
  const n = Math.floor(Math.random() * 100_000)
    .toString()
    .padStart(5, "0");
  return `${n.slice(0, 4)}-${n.slice(4)}`;
}
