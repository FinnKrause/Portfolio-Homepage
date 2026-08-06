import { NextResponse, type NextRequest } from "next/server";
import { db, type TokenRow } from "@/lib/db";
import { generateCode, isWellFormedCode } from "@/config/access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Token management. Access control for /admin and /api/admin is handled by the
 * reverse proxy in front of this app — nothing here authenticates.
 */

export interface TokenWithStats extends TokenRow {
  uses: number;
  attempts: number;
  unique_visitors: number;
  last_used: string | null;
  first_used: string | null;
}

function listTokens(): TokenWithStats[] {
  return db()
    .prepare(
      `SELECT t.*,
              COALESCE(g.uses, 0)     AS uses,
              COALESCE(a.attempts, 0) AS attempts,
              COALESCE(g.visitors, 0) AS unique_visitors,
              g.last_used,
              g.first_used
         FROM tokens t
         LEFT JOIN (
           SELECT token_id,
                  COUNT(*)                      AS uses,
                  COUNT(DISTINCT visitor_id)    AS visitors,
                  MAX(ts)                       AS last_used,
                  MIN(ts)                       AS first_used
             FROM events WHERE kind = 'granted' GROUP BY token_id
         ) g ON g.token_id = t.id
         LEFT JOIN (
           SELECT token_id, COUNT(*) AS attempts
             FROM events WHERE token_id IS NOT NULL AND kind IN ('granted','rejected')
            GROUP BY token_id
         ) a ON a.token_id = t.id
        ORDER BY t.created_at DESC`,
    )
    .all() as TokenWithStats[];
}

export async function GET() {
  return NextResponse.json({ tokens: listTokens() });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const name = String(body.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "A name is required." }, { status: 400 });

  const description = String(body.description ?? "").trim();
  const note = String(body.note ?? "").trim();
  const expires_at = body.expires_at ? String(body.expires_at) : null;

  // Use the code we were given, or find a free one.
  let code = String(body.code ?? "").trim();
  if (code) {
    if (!isWellFormedCode(code)) {
      return NextResponse.json({ error: "Codes look like 1234-5." }, { status: 400 });
    }
  } else {
    const taken = new Set(
      (db().prepare(`SELECT code FROM tokens`).all() as { code: string }[]).map((r) => r.code),
    );
    let candidate = generateCode();
    for (let i = 0; taken.has(candidate) && i < 500; i += 1) candidate = generateCode();
    if (taken.has(candidate)) {
      return NextResponse.json({ error: "No free codes left." }, { status: 409 });
    }
    code = candidate;
  }

  try {
    db()
      .prepare(
        `INSERT INTO tokens (code, name, description, note, enabled, expires_at, created_at)
         VALUES (?,?,?,?,1,?,?)`,
      )
      .run(code, name, description, note, expires_at, new Date().toISOString());
  } catch {
    return NextResponse.json({ error: "That code already exists." }, { status: 409 });
  }

  return NextResponse.json({ tokens: listTokens() }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const id = Number(body.id);
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  const sets: string[] = [];
  const values: unknown[] = [];
  for (const field of ["name", "description", "note"] as const) {
    if (typeof body[field] === "string") {
      sets.push(`${field} = ?`);
      values.push(String(body[field]).trim());
    }
  }
  if (typeof body.enabled === "boolean") {
    sets.push("enabled = ?");
    values.push(body.enabled ? 1 : 0);
  }
  if ("expires_at" in body) {
    sets.push("expires_at = ?");
    values.push(body.expires_at ? String(body.expires_at) : null);
  }
  if (!sets.length) return NextResponse.json({ error: "Nothing to update." }, { status: 400 });

  values.push(id);
  db().prepare(`UPDATE tokens SET ${sets.join(", ")} WHERE id = ?`).run(...values);
  return NextResponse.json({ tokens: listTokens() });
}

export async function DELETE(req: NextRequest) {
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  // Events survive with token_id set to NULL, so history is not rewritten.
  db().prepare(`DELETE FROM tokens WHERE id = ?`).run(id);
  return NextResponse.json({ tokens: listTokens() });
}
