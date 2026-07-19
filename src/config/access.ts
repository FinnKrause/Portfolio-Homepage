export const VERIFICATION_ENABLED = true;

/**
 * Cookie carrying the "verified" flag. The middleware reads it on the server,
 * so verified visitors receive the full site with the very first response —
 * no client-side check, no second JS roundtrip.
 */
export const ACCESS_COOKIE = "fk-access";

export const ACCESS_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // one year

export const ACCESS_URL_PARAM = "code";

const CODE_RE = /^(\d)(\d)(\d)(\d)-(\d)$/;

export function isValidAccessCode(raw: string): boolean {
  const match = CODE_RE.exec(raw.trim());
  if (!match) return false;
  const [, a, b, c, d, check] = match;
  const checksum = (Number(a) + Number(b) + Number(c) + Number(d)) % 10;
  return checksum === Number(check);
}

export function formatAccessCode(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 5);
  return digits.length > 4
    ? `${digits.slice(0, 4)}-${digits.slice(4)}`
    : digits;
}
