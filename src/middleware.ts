import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, ACCESS_URL_PARAM, VERIFICATION_ENABLED } from "@/config/access";

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
    // Only the code travels. Where it lands is looked up from the token in
    // /api/access — see the note in config/access.ts. Any other query the
    // visitor arrived with is dropped here rather than forwarded.
    const target = new URL("/api/access", req.url);
    target.searchParams.set(ACCESS_URL_PARAM, code);

    // Absolute here is safe, and only here. Middleware builds `req.url` from
    // the Host header, so this URL is same-origin as the request and Next
    // emits it as a relative Location — verified against a public domain, a
    // bare host:port and no Host override at all.
    //
    // **Route handlers do not work this way.** There, `req.url` is built from
    // the address the container is listening on, so `new URL("/", req.url)`
    // behind a proxy yields `http://localhost:3000/` and redirects the visitor
    // somewhere that does not exist off-host. That was a real bug. If you add
    // a redirect to anything under /api, set a relative Location by hand — see
    // `redirectTo` in api/access/route.ts.
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
