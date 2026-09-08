import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  ACCESS_URL_PARAM,
  SECTION_URL_PARAM,
  VERIFICATION_ENABLED,
} from "@/config/access";

/**
 * Server-side access gate.
 *
 * Runs on the edge, so it does no database work: it only checks whether the
 * access cookie is present. Anything that needs to look a code up in SQLite is
 * handed to /api/access, which runs on Node.
 */
export function middleware(req: NextRequest) {
  if (!VERIFICATION_ENABLED) return NextResponse.next();

  const url = req.nextUrl;

  // A code in the URL (shared link / QR) → let the Node route validate, record
  // the attempt and set the cookies.
  const code = url.searchParams.get(ACCESS_URL_PARAM);
  if (code) {
    const target = new URL("/api/access", req.url);
    target.searchParams.set(ACCESS_URL_PARAM, code);
    // Carry the requested section through. It is validated in the route, not
    // here — the edge runtime should stay free of anything but the cookie check.
    const section = url.searchParams.get(SECTION_URL_PARAM);
    if (section) target.searchParams.set(SECTION_URL_PARAM, section);
    return NextResponse.redirect(target);
  }

  if (req.cookies.get(ACCESS_COOKIE)?.value === "1") return NextResponse.next();

  return NextResponse.rewrite(new URL("/gate", req.url));
}

// Only the home page carries personal content. Impressum & Datenschutz stay
// public; /admin sits behind the reverse proxy; /api handles its own rules.
export const config = {
  matcher: ["/"],
};
