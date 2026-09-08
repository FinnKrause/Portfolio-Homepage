import { NextResponse, type NextRequest } from "next/server";
import QRCode from "qrcode";
import { ACCESS_URL_PARAM, SECTION_URL_PARAM, isWellFormedCode } from "@/config/access";
import { isKnownSection } from "@/content/ui";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Renders the direct-access link for a code as a downloadable PNG.
 * The origin is taken from the request, so the QR always points at whatever
 * host the panel is being used on.
 */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const code = params.get("code");
  if (!code) return NextResponse.json({ error: "Missing code." }, { status: 400 });
  // The code is interpolated into the Content-Disposition filename below, so it
  // has to be checked, not just trusted for being on an admin route: anything
  // carrying a quote or a newline would let the caller write their own headers.
  // Shape-checking here also means a typo yields a 400 rather than a QR that
  // silently points at a code that cannot exist.
  if (!isWellFormedCode(code)) {
    return NextResponse.json({ error: "Codes look like 1234-5." }, { status: 400 });
  }

  const size = Math.min(Math.max(Number(params.get("size")) || 1024, 256), 2048);
  const origin = process.env.FK_PUBLIC_ORIGIN ?? req.nextUrl.origin;

  // The section is encoded into the printed code itself, so a card can send
  // someone straight to a specific part of the page. Validated for the same
  // reason the code is: this string ends up inside a QR that will outlive the
  // page, and an unknown id should degrade to the homepage rather than persist
  // as junk in a printed artefact.
  const target = new URL("/", origin);
  target.searchParams.set(ACCESS_URL_PARAM, code);
  const section = params.get(SECTION_URL_PARAM);
  if (isKnownSection(section) && section !== "top") {
    target.searchParams.set(SECTION_URL_PARAM, section);
  }

  const png = await QRCode.toBuffer(target.toString(), {
    type: "png",
    width: size,
    margin: 2,
    errorCorrectionLevel: "M",
    color: { dark: "#0b1220ff", light: "#ffffffff" },
  });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="zugang-${code}.png"`,
      "Cache-Control": "no-store",
    },
  });
}
