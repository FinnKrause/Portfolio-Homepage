import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, VISITOR_COOKIE } from "@/config/access";
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
 */
export async function POST(req: NextRequest) {
  const visitor = req.cookies.get(VISITOR_COOKIE)?.value;
  const hasAccess = req.cookies.get(ACCESS_COOKIE)?.value === "1";

  if (visitor && hasAccess) {
    recordEvent({
      kind: "visit",
      facts: readRequestFacts(req.headers),
      tokenId: tokenForVisitor(visitor),
      visitorId: visitor,
      isNew: false,
    });
  }

  return new NextResponse(null, { status: 204 });
}
