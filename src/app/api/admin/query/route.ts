import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Free-form SQL against the live database.
 *
 * Read *and* write, deliberately: the point is to be able to correct or prune
 * data by hand without shelling into the container. That makes this the most
 * dangerous endpoint in the app by a wide margin — `/admin` and `/api/admin/*`
 * have no authentication of their own, so the reverse proxy in front of this
 * app is the only thing standing between this handler and the open internet.
 * If that proxy is ever misconfigured, this is a remote `DROP TABLE`. Never
 * expose the container directly. See docs/operations.md.
 *
 * Two things deliberately absent, both requested:
 *   - no row cap. A `SELECT * FROM events` returns every row.
 *   - no statement timeout. better-sqlite3 is synchronous, so a heavy query
 *     blocks every other request to the site until it finishes.
 *
 * The client asks for confirmation before sending anything that isn't a plain
 * read; that is a guard against slips, not against an attacker, since anyone
 * who can reach this route can post whatever they like straight to it.
 */

/** Statements that only ever read. Used to label the request, not to gate it. */
function isReadOnly(sql: string): boolean {
  return /^\s*(?:select|with|pragma|explain)\b/i.test(sql);
}

export async function GET() {
  // The table list for the picker, straight from SQLite's own catalogue so it
  // cannot drift from the real schema.
  const tables = db()
    .prepare(
      `SELECT name FROM sqlite_master
        WHERE type = 'table' AND name NOT LIKE 'sqlite_%'
        ORDER BY name`,
    )
    .all() as { name: string }[];

  const withColumns = tables.map((t) => ({
    name: t.name,
    columns: (
      db().prepare(`PRAGMA table_info(${JSON.stringify(t.name)})`).all() as {
        name: string;
        type: string;
      }[]
    ).map((c) => `${c.name} ${c.type || "?"}`.trim()),
    rows: Number(
      (db().prepare(`SELECT COUNT(*) AS n FROM ${JSON.stringify(t.name)}`).get() as { n: number })
        .n,
    ),
  }));

  return NextResponse.json({ tables: withColumns });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { sql?: unknown };
  const sql = typeof body.sql === "string" ? body.sql.trim() : "";
  if (!sql) return NextResponse.json({ error: "No query." }, { status: 400 });

  const started = Date.now();
  try {
    const stmt = db().prepare(sql);

    // `reader` is better-sqlite3's own answer to "does this statement return
    // rows", derived from SQLite's parse rather than from the text — which is
    // why it is used here instead of matching on the string. A statement that
    // returns rows must be run with .all(); one that doesn't must use .run(),
    // and calling the wrong one throws.
    if (stmt.reader) {
      const rows = stmt.all() as Record<string, unknown>[];
      // Columns come from the first row, so a query returning nothing still
      // needs a fallback — otherwise an empty result renders as a blank block
      // with no indication of what was asked for.
      const columns = rows.length ? Object.keys(rows[0]) : stmt.columns().map((c) => c.name);
      return NextResponse.json({
        kind: "rows",
        columns,
        rows,
        rowCount: rows.length,
        ms: Date.now() - started,
      });
    }

    const info = stmt.run();
    return NextResponse.json({
      kind: "write",
      changes: info.changes,
      lastInsertRowid: Number(info.lastInsertRowid),
      readOnly: isReadOnly(sql),
      ms: Date.now() - started,
    });
  } catch (err) {
    // SQLite's own message is far more useful here than anything we could
    // write — it names the column or the syntax position.
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Query failed." },
      { status: 400 },
    );
  }
}
