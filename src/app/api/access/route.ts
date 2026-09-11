import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import {
  ACCESS_URL_PARAM,
  VISITOR_COOKIE,
  formatAccessCode,
  isWellFormedCode,
} from "@/config/access";
import { isKnownSection } from "@/content/ui";
import { issueCookies } from "@/lib/cookies";
import {
  bindVisitorToToken,
  checkToken,
  noteFailedAttempt,
  readRequestFacts,
  recordEvent,
  tooManyAttempts,
} from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The one place a code is turned into access.
 *
 * On success it sets two cookies:
 *   fk-access   the gate flag — strictly necessary for the service requested
 *   fk-visitor  the analytics id — first written here, i.e. only once someone
 *               has entered a valid code and is actually being let in. Nobody
 *               who stops at the gate is given one. Refreshed on every later
 *               visit by /api/visit, which is what makes the year roll.
 */
function handle(req: NextRequest, rawCode: string, source: "gate" | "link") {
  const facts = readRequestFacts(req.headers);
  const visitor = req.cookies.get(VISITOR_COOKIE)?.value;
  const code = formatAccessCode(rawCode);

  if (tooManyAttempts(req.headers)) {
    return { status: "rate-limited" as const, facts, visitor, code };
  }

  if (!isWellFormedCode(code)) {
    noteFailedAttempt(req.headers);
    recordEvent({ kind: "rejected", facts, attemptedCode: rawCode.slice(0, 24), reason: "unknown" });
    return { status: "rejected" as const, facts, visitor, code };
  }

  const check = checkToken(code);
  if (!check.ok) {
    noteFailedAttempt(req.headers);
    recordEvent({
      kind: "rejected",
      facts,
      tokenId: check.token?.id ?? null,
      attemptedCode: code,
      reason: check.reason,
    });
    return { status: "rejected" as const, reason: check.reason, facts, visitor, code };
  }

  // The id has to be minted *before* logging, otherwise a first-time device
  // records a grant with no visitor attached and never counts as a visitor.
  const isNewVisitor = !visitor;
  const visitorId = visitor ?? randomUUID();

  // Bind first, so every later visit from this device can be attributed to
  // the code it came in with.
  bindVisitorToToken(visitorId, check.token.id);
  recordEvent({
    kind: "granted",
    facts,
    tokenId: check.token.id,
    visitorId,
    isNew: isNewVisitor,
    source,
  });
  return {
    status: "granted" as const,
    facts,
    visitor,
    code,
    visitorId,
    isNewVisitor,
    section: check.token.section,
  };
}

/**
 * Where a link arrival should land — read from the token, never from the URL.
 *
 * This is resolved at scan time, which is the point: editing "Lands on" in the
 * admin instantly retargets every link and every already-printed QR for that
 * code. A section carried in the URL would be frozen into the printed card.
 *
 * Only applies to link arrivals. Typing a code at the gate always lands on the
 * homepage — `GateClient` navigates to "/" itself — because someone who has
 * just typed a code is looking at the site, not following a pointer into it.
 *
 * A section that is no longer in SECTION_IDS is dropped rather than rejected:
 * a printed QR outlives the page, so a renamed section should land the visitor
 * on the homepage rather than break their link.
 *
 * Returned as a fragment. The browser never sends it back to us, which is
 * exactly right — the section someone was pointed at is not worth logging.
 */
function landingPath(tokenSection: string | null): string {
  return isKnownSection(tokenSection) && tokenSection !== "top"
    ? `/#${tokenSection}`
    : "/";
}

/**
 * A redirect with a **relative** Location header.
 *
 * Do not replace this with `NextResponse.redirect(new URL("/", req.url))`. That
 * builds an absolute URL out of `req.url`, which behind a reverse proxy is the
 * address the container is listening on — so a visitor who opened
 * `https://home.finnkrause.com/?code=1234-5` was answered with
 * `Location: http://localhost:3000/` and sent somewhere that does not exist
 * outside the host. Forwarding the real Host header does not help: the URL a
 * route handler sees is built from the listening address either way.
 *
 * A relative Location is resolved by the browser against the URL it actually
 * requested, so this is correct in dev, behind any proxy, on any domain, with
 * no configuration — every destination here is same-origin anyway.
 */
function redirectTo(path: string): NextResponse {
  return new NextResponse(null, { status: 307, headers: { Location: path } });
}

/** QR / shared-link path: validate, then land the visitor on the site. */
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get(ACCESS_URL_PARAM) ?? "";
  const result = handle(req, raw, "link");

  if (result.status === "granted") {
    return issueCookies(redirectTo(landingPath(result.section)), result.visitorId);
  }
  // Send them to the gate with the code stripped from the address bar.
  return redirectTo("/");
}

/** Form path: validate and answer with JSON so the screen can show the error. */
export async function POST(req: NextRequest) {
  let raw = "";
  try {
    const body = (await req.json()) as { code?: unknown };
    raw = typeof body.code === "string" ? body.code : "";
  } catch {
    raw = "";
  }

  const result = handle(req, raw, "gate");

  if (result.status === "granted") {
    return issueCookies(NextResponse.json({ ok: true }), result.visitorId);
  }
  if (result.status === "rate-limited") {
    return NextResponse.json({ ok: false, reason: "rate-limited" }, { status: 429 });
  }
  return NextResponse.json({ ok: false, reason: result.reason ?? "unknown" }, { status: 401 });
}
