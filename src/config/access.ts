/**
 * Access gate — a light privacy check shown before the site content loads.
 *
 * The goal is NOT strong security. It is a small, deliberate speed-bump that
 * keeps naive AI crawlers / scrapers from silently harvesting personal data:
 * the real content is code-split and only loaded once access is granted, so an
 * unverified request never receives it in the first place.
 *
 * To make the whole site fully public, flip VERIFICATION_ENABLED to `false`.
 */
export const VERIFICATION_ENABLED = true;

/** localStorage flag — set once a visitor is let in, so they're never asked again. */
export const ACCESS_STORAGE_KEY = "fk-access-granted";

/**
 * URL query parameter that can carry a code, e.g. `?code=1234-0`.
 * Lets a shared link or QR code grant access without any typing.
 */
export const ACCESS_URL_PARAM = "code";

const CODE_RE = /^(\d)(\d)(\d)(\d)-(\d)$/;

/**
 * A code has the shape `XXXX-X`: four digits, then a check digit equal to the
 * sum of those four digits, modulo 10. (e.g. 1234-0, because 1+2+3+4 = 10 → 0.)
 */
export function isValidAccessCode(raw: string): boolean {
  const match = CODE_RE.exec(raw.trim());
  if (!match) return false;
  const [, a, b, c, d, check] = match;
  const checksum = (Number(a) + Number(b) + Number(c) + Number(d)) % 10;
  return checksum === Number(check);
}

/** Format up to five raw digits into the `XXXX-X` display shape. */
export function formatAccessCode(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 5);
  return digits.length > 4 ? `${digits.slice(0, 4)}-${digits.slice(4)}` : digits;
}
