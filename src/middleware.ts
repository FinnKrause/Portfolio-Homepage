import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  ACCESS_COOKIE_MAX_AGE,
  ACCESS_URL_PARAM,
  VERIFICATION_ENABLED,
  isValidAccessCode,
} from "@/config/access";

/**
 * Server-side access gate.
 *
 * The check runs before the response is sent, so verified visitors receive the
 * fully rendered site with the first HTML response (fast), while unverified
 * visitors only ever receive the gate screen (the content HTML never leaves
 * the server — stronger than the old client-side gate, and it works without
 * JavaScript). The legal pages stay public, as they must be.
 */
export function middleware(req: NextRequest) {
  if (!VERIFICATION_ENABLED) return NextResponse.next();

  const url = req.nextUrl;

  // A valid code in the URL (shared link / QR code) → set the cookie and
  // redirect to the clean URL, exactly like the old client logic did.
  const code = url.searchParams.get(ACCESS_URL_PARAM);
  if (code && isValidAccessCode(code)) {
    const clean = url.clone();
    clean.searchParams.delete(ACCESS_URL_PARAM);
    const res = NextResponse.redirect(clean);
    res.cookies.set(ACCESS_COOKIE, "1", {
      maxAge: ACCESS_COOKIE_MAX_AGE,
      sameSite: "lax",
      path: "/",
    });
    return res;
  }

  // Already verified on this device?
  if (req.cookies.get(ACCESS_COOKIE)?.value === "1") return NextResponse.next();

  // Not verified → serve the gate under the same URL.
  return NextResponse.rewrite(new URL("/gate", req.url));
}

// Only the home page carries personal content; Impressum & Datenschutz must
// stay publicly reachable.
export const config = {
  matcher: ["/"],
};
