export const VERIFICATION_ENABLED = true;

export const ACCESS_STORAGE_KEY = "fk-access-granted";

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
