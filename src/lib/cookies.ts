import "server-only";

import type { NextResponse } from "next/server";
import { ACCESS_COOKIE, COOKIE_MAX_AGE, VISITOR_COOKIE } from "@/config/access";

/**
 * Both cookies are read only on the server — the middleware reads `fk-access`
 * off the incoming request, which HttpOnly does not affect. Nothing in the
 * browser touches either one, so neither is exposed to page scripts.
 * Secure is conditional purely so `npm run dev` over plain http still works.
 */
const COOKIE_BASE = {
  sameSite: "lax",
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
} as const;

/**
 * Issues (or re-issues) both access cookies for another full year.
 *
 * Both are always written, including for a device that already has them: the
 * window rolls from the last visit, so every contact has to push the expiry
 * out. This is called from two places — /api/access when a code is accepted,
 * and /api/visit on every subsequent page view — and it is the second one that
 * makes the year actually roll.
 *
 * Writing only one of the two lets them drift apart, and the failure is silent
 * in both directions: a returning device whose visitor cookie expired first is
 * counted as brand new while still being let straight in, and one whose access
 * cookie expired first is asked for a code the site could already attribute.
 * Keep them written together.
 *
 * Lives here rather than in a route module because Next validates the exports
 * of `route.ts` files and rejects anything that isn't a handler or a config.
 */
export function issueCookies(res: NextResponse, visitorId: string): NextResponse {
  res.cookies.set(ACCESS_COOKIE, "1", { ...COOKIE_BASE, maxAge: COOKIE_MAX_AGE });
  res.cookies.set(VISITOR_COOKIE, visitorId, { ...COOKIE_BASE, maxAge: COOKIE_MAX_AGE });
  return res;
}
