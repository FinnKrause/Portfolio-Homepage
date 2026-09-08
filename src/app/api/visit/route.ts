import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, VISITOR_COOKIE } from "@/config/access";
import { issueCookies } from "@/lib/cookies";
import { readRequestFacts, recordEvent, tokenForVisitor } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Records a visit by someone who already had access. Called once per page load
 * from the browser, which keeps the site itself statically served and means
 * crawlers that don't run JavaScript never land in the visit numbers.
 *
 * Does nothing without the analytics cookie — that cookie only exists for
 * people who entered a code, so there is never a visit recorded for anyone who
 * hasn't been through the gate.
 *
 * This is also where the retention window rolls. Both cookies are re-issued
 * here for another year, so a device that keeps coming back keeps being
 * recognised and never has to enter its code again; one that goes quiet for a
 * full year is forgotten by the browser and returns as a new device. That is
 * why the response carries Set-Cookie headers on an ordinary page view — the
 * beacon is not only reporting, it is renewing.
 */
export async function POST(req: NextRequest) {
  const visitor = req.cookies.get(VISITOR_COOKIE)?.value;
  const hasAccess = req.cookies.get(ACCESS_COOKIE)?.value === "1";

  if (!visitor || !hasAccess) return new NextResponse(null, { status: 204 });

  // tokenForVisitor also moves last_seen and ticks the visit counter, so the
  // stored record and the cookie expiry advance together.
  recordEvent({
    kind: "visit",
    facts: readRequestFacts(req.headers),
    tokenId: tokenForVisitor(visitor),
    visitorId: visitor,
    isNew: false,
  });

  return issueCookies(new NextResponse(null, { status: 204 }), visitor);
}
