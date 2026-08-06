import { NextResponse, type NextRequest } from "next/server";
import QRCode from "qrcode";
import { ACCESS_URL_PARAM } from "@/config/access";

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

  const size = Math.min(Math.max(Number(params.get("size")) || 1024, 256), 2048);
  const origin = process.env.FK_PUBLIC_ORIGIN ?? req.nextUrl.origin;
  const target = `${origin}/?${ACCESS_URL_PARAM}=${encodeURIComponent(code)}`;

  const png = await QRCode.toBuffer(target, {
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
