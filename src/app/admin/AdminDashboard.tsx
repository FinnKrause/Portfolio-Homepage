"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Check,
  Search,
  Copy,
  Download,
  Loader2,
  Play,
  Plus,
  QrCode,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import type { TokenWithStats } from "@/app/api/admin/tokens/route";
import { isExpired, ACCESS_URL_PARAM } from "@/config/access";
import { sectionOptions } from "@/content/ui";
import { cn } from "@/lib/utils";

/* Chart colours, straight off the design tokens. The system allows the primary
   family, one warm bloom accent and the storm neutral — nothing else, which is
   why "good" here is the storm teal rather than a green from outside it. */
const BRAND = "#024ad8"; /* --color-primary */
const GOOD = "#356373"; /* --color-storm-deep */
const BAD = "#b3262b"; /* --color-bloom-deep */
const MUTED = "#636363"; /* --color-graphite */

const RANGES = [7, 30, 90, 182] as const;

interface Stats {
  totals: {
    grants: number;
    rejected: number;
    gateViews: number;
    uniqueVisitors: number;
    returningDevices: number;
    typedEntries: number;
    linkEntries: number;
  };
  perDay: Record<string, number | string>[];
  bounced: Record<string, number | string>[];
  arrival: { typed: number; link: number; unknown: number };
  tokenEngagement: {
    name: string;
    code: string;
    entries: number;
    views: number;
    devices: number;
    accesses: number;
    perDevice: number | null;
    lastActive: string | null;
  }[];
  allTime: {
    devices: number;
    visits: number;
    perDevice: number | null;
    gateViews: number;
    rejected: number;
    since: string | null;
    perToken: {
      code: string;
      name: string;
      devices: number;
      visits: number;
      lastActive: string | null;
    }[];
  };
  failedCodes: { code: string; reason: string; tries: number; last_try: string }[];
  byDevice: { label: string; n: number }[];
  byBrowser: { label: string; n: number }[];
  byReferrer: { label: string; n: number }[];
  topVisitors: {
    visitor_id: string;
    requests: number;
    first_seen: string;
    last_seen: string;
    token_code: string | null;
    token_name: string | null;
  }[];
  events: EventItem[];
}

interface EventItem {
  id: number;
  ts: string;
  kind: "gate_view" | "granted" | "rejected" | "visit";
  token_name: string | null;
  token_code: string | null;
  attempted_code: string | null;
  reason: string | null;
  is_new: number | null;
  browser: string | null;
  os: string | null;
  device: string | null;
  referrer: string | null;
  visitor_id: string | null;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

/* ------------------------------------------------------------------ shell */

function Card({
  title,
  right,
  children,
  className,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("card-hairline p-5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 className="display-xs">{title}</h2>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Short, stable handle for a device id. */
const shortId = (id: string | null | undefined) => (id ? id.slice(0, 8) : "—");

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="card-hairline p-4">
      <div className="display-sm tabular-nums" style={{ color: tone ?? "#1a1a1a" }}>
        {value.toLocaleString("en-GB")}
      </div>
      <div className="mt-1 text-fine text-graphite">{label}</div>
    </div>
  );
}

const axis = { stroke: "#636363", fontSize: 12 };
const tooltipStyle = {
  contentStyle: {
    fontSize: 12,
    border: "1px solid #e8e8e8",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(26, 26, 26, 0.08)",
  },
};
/** The hairline grid inside every chart. */
const GRID = "#e8e8e8";

/* ------------------------------------------------------------- dashboard */

export function AdminDashboard({ publicOrigin }: { publicOrigin: string }) {
  const [tokens, setTokens] = useState<TokenWithStats[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [days, setDays] = useState<number>(30);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [openEvent, setOpenEvent] = useState<EventItem | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [query, setQuery] = useState("");


  const loadTokens = useCallback(async () => {
    const res = await fetch("/api/admin/tokens");
    const json = await res.json();
    setTokens(json.tokens ?? []);
  }, []);

  const loadStats = useCallback(async (d: number) => {
    const res = await fetch(`/api/admin/stats?days=${d}`);
    setStats(await res.json());
  }, []);

  useEffect(() => {
    void loadTokens();
  }, [loadTokens]);
  useEffect(() => {
    void loadStats(days);
  }, [days, loadStats]);

  const mutate = async (init: RequestInit & { url?: string }) => {
    setBusy(true);
    setError(null);
    const res = await fetch(init.url ?? "/api/admin/tokens", init);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) setError(json.error ?? "Something went wrong.");
    else setTokens(json.tokens ?? []);
    setBusy(false);
    void loadStats(days);
    return res.ok;
  };

  /**
   * The shareable link. Just the code — where it lands is looked up from the
   * token when the link is opened, so changing "Lands on" retargets every link
   * and printed QR already in circulation. See config/access.ts.
   *
   * Prefers FK_PUBLIC_ORIGIN — the same value the QR route uses — so a copied
   * link and the QR for one code always point at the same place. Without it,
   * opening /admin on localhost produced localhost links while the QR still
   * encoded the public domain.
   *
   * Falls back to the origin being browsed, which is what you want in local
   * development where the variable is unset.
   */
  const linkFor = (tk: { code: string }) => {
    const u = new URL("/", publicOrigin || window.location.origin);
    u.searchParams.set(ACCESS_URL_PARAM, tk.code);
    return u.toString();
  };

  const qrHref = (tk: { code: string }) =>
    `/api/admin/qr?${ACCESS_URL_PARAM}=${encodeURIComponent(tk.code)}`;

  const copy = async (tk: { code: string }) => {
    await navigator.clipboard.writeText(linkFor(tk));
    setCopied(tk.code);
    window.setTimeout(() => setCopied((c) => (c === tk.code ? null : c)), 1600);
  };

  const shownEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stats?.events ?? [];
    return (stats?.events ?? []).filter((e) =>
      [
        e.kind,
        e.token_code,
        e.token_name,
        e.attempted_code,
        e.reason,
        e.browser,
        e.os,
        e.device,
        e.referrer,
        e.visitor_id,
        fmt(e.ts),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [stats, query]);

  const totals = stats?.totals;
  const bounceRate = useMemo(() => {
    if (!totals || !totals.gateViews) return null;
    // Only a typed entry can resolve a gate view; QR/link arrivals never
    // render the gate, so counting them here would deflate the rate.
    const got = totals.typedEntries;
    return Math.max(0, Math.round(((totals.gateViews - got) / totals.gateViews) * 100));
  }, [totals]);

  return (
    <div className="min-h-screen bg-cloud">
      <div className="mx-auto max-w-[86rem] px-5 py-10 md:px-8">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="display-lg">Access codes &amp; statistics</h1>

          <div className="flex flex-wrap items-center gap-2">
            {/* Range picker: one segmented control, 44px tall like every other
                interactive element in the system. */}
            <div className="flex overflow-hidden rounded-md border border-hairline bg-canvas">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setDays(r)}
                  aria-pressed={days === r}
                  className={cn(
                    "h-11 px-4 text-caption font-medium transition-colors",
                    days === r ? "bg-ink text-on-ink" : "text-charcoal hover:text-ink",
                  )}
                >
                  {r}d
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                void loadTokens();
                void loadStats(days);
              }}
              className="btn btn-outline-ink"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button onClick={() => setShowNew((v) => !v)} className="btn btn-primary">
              <Plus className="h-4 w-4" />
              New code
            </button>
          </div>
        </header>

        {error && (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-bloom-deep/30 bg-rose px-4 py-3 text-caption text-bloom-wine"
          >
            {error}
          </p>
        )}

        {showNew && <NewToken onCreate={mutate} busy={busy} onDone={() => setShowNew(false)} />}

        {/* Headline numbers */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Stat label="Entries" value={totals?.grants ?? 0} tone={BRAND} />
          <Stat label="Returning devices" value={totals?.returningDevices ?? 0} tone={GOOD} />
          <Stat label="Unique devices" value={totals?.uniqueVisitors ?? 0} />
          <Stat label="Gate views" value={totals?.gateViews ?? 0} tone={MUTED} />
          <Stat label="Rejected codes" value={totals?.rejected ?? 0} tone={BAD} />
        </div>

        {/* Tokens */}
        <Card
          className="mt-4"
          title="Codes"
        >
          {!tokens ? (
            <p className="flex items-center gap-2 text-caption text-graphite">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </p>
          ) : tokens.length === 0 ? (
            <p className="text-caption text-graphite">No codes.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[60rem] border-collapse text-caption">
                <thead>
                  <tr className="border-b border-steel text-left text-fine font-semibold text-graphite">
                    <th className="py-2 pr-3 font-medium">Code</th>
                    <th className="py-2 pr-3 font-medium">Name</th>
                    <th className="py-2 pr-3 font-medium">Lands on</th>
                    <th className="py-2 pr-3 text-right font-medium">Uses</th>
                    <th className="py-2 pr-3 text-right font-medium">Devices</th>
                    <th className="py-2 pr-3 font-medium">Last seen</th>
                    <th className="py-2 pr-3 font-medium">Expires</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                    <th className="py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map((tk) => {
                    const expired = isExpired(tk.expires_at);
                    return (
                      <tr key={tk.id} className="border-b border-hairline align-top">
                        <td className="py-3 pr-3 font-mono font-semibold text-ink">
                          {tk.code}
                        </td>
                        <td className="py-3 pr-3 text-ink">{tk.name}</td>
                        <td className="py-3 pr-3">
                          <select
                            value={tk.section ?? "top"}
                            onChange={(e) =>
                              void mutate({
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ id: tk.id, section: e.target.value }),
                              })
                            }
                            className="h-9 rounded-md border border-steel bg-canvas px-2 text-fine text-charcoal"
                          >
                            {sectionOptions.map((o) => (
                              <option key={o.id} value={o.id}>
                                {o.label.en}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 pr-3 text-right tabular-nums">{tk.uses}</td>
                        <td className="py-3 pr-3 text-right tabular-nums">{tk.unique_visitors}</td>
                        <td className="py-3 pr-3 text-fine text-graphite">
                          {tk.last_used ? fmt(tk.last_used) : "—"}
                        </td>
                        <td className="py-3 pr-3 text-fine text-graphite">
                          {tk.expires_at ? tk.expires_at.slice(0, 10) : "—"}
                        </td>
                        <td className="py-3 pr-3">
                          <span
                            className={cn(
                              "inline-block rounded-sm px-2 py-0.5 text-fine font-semibold",
                              !tk.enabled
                                ? "bg-fog text-charcoal"
                                : expired
                                  ? "bg-rose text-bloom-wine"
                                  : "bg-primary-soft text-primary-deep",
                            )}
                          >
                            {!tk.enabled ? "Off" : expired ? "Expired" : "Active"}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              onClick={() => void copy(tk)}
                              title="Copy access link"
                              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline px-2.5 text-fine transition-colors hover:border-ink"
                            >
                              {copied === tk.code ? (
                                <Check className="h-3.5 w-3.5 text-primary" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                              Link
                            </button>
                            <a
                              href={qrHref(tk)}
                              title="QR code as PNG"
                              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline px-2.5 text-fine transition-colors hover:border-ink"
                            >
                              <Download className="h-3.5 w-3.5" />
                              QR
                            </a>
                            <button
                              onClick={() =>
                                void mutate({
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ id: tk.id, enabled: !tk.enabled }),
                                })
                              }
                              className="h-9 rounded-md border border-hairline px-2.5 text-fine transition-colors hover:border-ink"
                            >
                              {tk.enabled ? "Disable" : "Enable"}
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete code ${tk.code}?`))
                                  void mutate({
                                    method: "DELETE",
                                    url: `/api/admin/tokens?id=${tk.id}`,
                                  });
                              }}
                              title="Delete"
                              className="grid h-9 w-9 place-items-center rounded-md border border-hairline text-bloom-deep transition-colors hover:border-bloom-deep"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Charts */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card
            title="Devices per day"
          >
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats?.perDay ?? []}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="day" tick={axis} tickFormatter={(v) => String(v).slice(5)} />
                <YAxis tick={axis} allowDecimals={false} width={30} />
                <Tooltip {...tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  name="Devices"
                  stroke={BRAND}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card
            title="Stopped at the gate"
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats?.bounced ?? []}>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="day" tick={axis} tickFormatter={(v) => String(v).slice(5)} />
                <YAxis tick={axis} allowDecimals={false} width={30} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="bounced" name="No entry" fill={MUTED} />
              </BarChart>
            </ResponsiveContainer>
            {bounceRate !== null && (
              <p className="mt-2 text-fine tabular-nums text-graphite">
                {bounceRate}% of gate views ended without a code being entered
              </p>
            )}
          </Card>

        </div>

        {/* Second row, paired so neither card sits next to dead space: the
            per-code bar chart is tall, "how entries arrive" is three numbers,
            so the short one gets the narrower half. */}
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2" title="Devices reached per code">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats?.tokenEngagement ?? []} layout="vertical">
                <CartesianGrid stroke={GRID} horizontal={false} />
                <XAxis type="number" tick={axis} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={axis} width={110} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="devices" name="Devices" fill={BRAND} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Scanning a code vs typing one — whether the QR links are doing the
              work or the printed codes are. */}
          <Card title="How entries arrive">
            <div className="grid gap-4">
              <div>
                <p className="display-sm tabular-nums" style={{ color: BRAND }}>
                  {stats?.arrival.link ?? 0}
                </p>
                <p className="mt-1 text-caption text-graphite">QR or shared link</p>
              </div>
              <div>
                <p className="display-sm tabular-nums">{stats?.arrival.typed ?? 0}</p>
                <p className="mt-1 text-caption text-graphite">Code typed at the gate</p>
              </div>
              {!!stats?.arrival.unknown && (
                <div>
                  <p className="display-sm tabular-nums text-graphite">{stats.arrival.unknown}</p>
                  <p className="mt-1 text-caption text-graphite">Before this was tracked</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* All time — read from the running counters, not from events.
            Events are deleted after six months, so every other number on this
            page describes the selected window only. These do not move when
            history ages out, which makes them the only figures here that can
            answer "did this code ever land". */}
        <Card
          className="mt-4"
          title="All time"
          right={
            <span className="text-fine text-graphite">
              {stats?.allTime.since ? `since ${fmt(stats.allTime.since)}` : "no devices yet"}
            </span>
          }
        >
          {/* No "Entries" tile: a device is granted once and then just visits,
              so all-time entries only differs from "Devices ever" when someone
              re-opens a ?code= link on a device that already has cookies. Two
              tiles showing the same number teach you nothing. The underlying
              counter is still there for the SQL console. */}
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <Stat label="Devices ever" value={stats?.allTime.devices ?? 0} tone={BRAND} />
            <Stat label="Page views" value={stats?.allTime.visits ?? 0} />
            <div className="card-hairline p-4">
              <div className="display-sm tabular-nums" style={{ color: GOOD }}>
                {stats?.allTime.perDevice ?? "—"}
              </div>
              <div className="mt-1 text-fine text-graphite">Views per device</div>
            </div>
            <Stat label="Gate views" value={stats?.allTime.gateViews ?? 0} tone={MUTED} />
            <Stat label="Rejected" value={stats?.allTime.rejected ?? 0} tone={BAD} />
          </div>

          {stats?.allTime.perToken.length ? (
            <table className="mt-5 w-full border-collapse text-caption">
              <thead>
                <tr className="border-b border-steel text-left text-fine font-semibold text-graphite">
                  <th className="py-2 pr-3 font-medium">Code</th>
                  <th className="py-2 pr-3 text-right font-medium">Devices</th>
                  <th className="py-2 pr-3 text-right font-medium">Page views</th>
                  <th className="py-2 font-medium">Last active</th>
                </tr>
              </thead>
              <tbody>
                {stats.allTime.perToken.map((r) => (
                  <tr key={r.code} className="border-b border-hairline">
                    <td className="py-2 pr-3">
                      <span className="font-mono text-fine">{r.code}</span>
                      <span className="ml-2 text-graphite">{r.name}</span>
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums">{r.devices}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{r.visits}</td>
                    <td className="py-2 text-fine text-graphite">
                      {r.lastActive ? fmt(r.lastActive) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </Card>

        {/* Breakdowns */}
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {(
            [
              ["Device", stats?.byDevice],
              ["Browser", stats?.byBrowser],
              ["Referrer", stats?.byReferrer],
            ] as const
          ).map(([title, rows]) => (
            <Card key={title} title={title}>
              {rows?.length ? (
                <ul className="space-y-1.5">
                  {rows.map((r: { label: string; n: number }) => (
                    <li key={r.label} className="flex justify-between text-caption">
                      <span className="truncate text-charcoal">{r.label}</span>
                      <span className="tabular-nums text-graphite">{r.n}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-caption text-graphite">No data yet.</p>
              )}
            </Card>
          ))}
        </div>

        {/* Conversion + failed attempts */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card title="Engagement per code">
            {stats?.tokenEngagement.length ? (
              <table className="w-full border-collapse text-caption">
                <thead>
                  <tr className="border-b border-steel text-left text-fine font-semibold text-graphite">
                    <th className="py-2 pr-3 font-medium">Code</th>
                    <th className="py-2 pr-3 text-right font-medium">Devices</th>
                    <th className="py-2 pr-3 text-right font-medium">Accesses</th>
                    <th className="py-2 pr-3 text-right font-medium">Per device</th>
                    <th className="py-2 font-medium">Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.tokenEngagement.map((r) => (
                    <tr key={r.code} className="border-b border-hairline">
                      <td className="py-2 pr-3">
                        <span className="font-mono text-fine">{r.code}</span>
                        <span className="ml-2 text-graphite">{r.name}</span>
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums">{r.devices}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{r.accesses}</td>
                      <td
                        className="py-2 pr-3 text-right font-medium tabular-nums"
                        style={{ color: (r.perDevice ?? 0) >= 2 ? GOOD : undefined }}
                      >
                        {r.perDevice ?? "—"}
                      </td>
                      <td className="py-2 text-fine text-graphite">
                        {r.lastActive ? fmt(r.lastActive) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-caption text-graphite">No codes yet.</p>
            )}
          </Card>

          <Card
            title="Rejected entries"
          >
            {stats?.failedCodes.length ? (
              <ul className="max-h-60 space-y-1 overflow-y-auto text-caption">
                {stats.failedCodes.map((f, i) => (
                  <li key={i} className="flex items-center justify-between gap-3">
                    <span className="font-mono text-ink">{f.code}</span>
                    <span className="text-fine text-graphite">
                      {f.reason === "disabled"
                        ? "disabled"
                        : f.reason === "expired"
                          ? "expired"
                          : "unknown"}{" "}
                      · {f.tries}× · {fmt(f.last_try)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-caption text-graphite">No rejected entries.</p>
            )}
          </Card>
        </div>

        {/* Busiest devices — a plain ranking; every device is granted exactly
            once, so there is nothing to chart beyond the access count. */}
        <Card className="mt-4" title="Devices by accesses">
          {stats?.topVisitors.length ? (
            <table className="w-full border-collapse text-caption">
              <thead>
                <tr className="border-b border-steel text-left text-fine font-semibold text-graphite">
                  <th className="w-8 py-2 pr-3 font-medium">#</th>
                  <th className="py-2 pr-3 font-medium">Device ID</th>
                  <th className="py-2 pr-3 font-medium">Code</th>
                  <th className="py-2 pr-3 text-right font-medium">Accesses</th>
                  <th className="py-2 pr-3 font-medium">First seen</th>
                  <th className="py-2 font-medium">Last seen</th>
                </tr>
              </thead>
              <tbody>
                {stats.topVisitors.map((v, i) => (
                  <tr key={v.visitor_id} className="border-b border-hairline">
                    <td className="py-2 pr-3 tabular-nums text-graphite">{i + 1}</td>
                    <td className="py-2 pr-3 font-mono text-fine">{shortId(v.visitor_id)}</td>
                    <td className="py-2 pr-3 font-mono text-fine">
                      {v.token_code ?? "—"}
                      {v.token_name && (
                        <span className="ml-2 font-sans text-graphite">{v.token_name}</span>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums font-medium">{v.requests}</td>
                    <td className="py-2 pr-3 text-fine text-graphite">{fmt(v.first_seen)}</td>
                    <td className="py-2 text-fine text-graphite">{fmt(v.last_seen)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-caption text-graphite">No devices.</p>
          )}
        </Card>

        {/* Event log */}
        <Card
          className="mt-4"
          title="Event log"
          right={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search code, device ID, browser…"
                  aria-label="Search the event log"
                  className="input w-64 pl-9 text-caption"
                />
              </div>
              <span className="tabular-nums text-fine text-graphite">
                {shownEvents.length}/{stats?.events.length ?? 0}
              </span>
            </div>
          }
        >
          <div className="max-h-[30rem] overflow-y-auto">
            <table className="w-full min-w-[60rem] border-collapse text-caption">
              <thead className="sticky top-0 bg-canvas">
                <tr className="border-b border-steel text-left text-fine font-semibold text-graphite">
                  <th className="py-2 pr-3 font-medium">Time</th>
                  <th className="py-2 pr-3 font-medium">Event</th>
                  <th className="py-2 pr-3 font-medium">Code</th>
                  <th className="py-2 pr-3 font-medium">Device ID</th>
                  <th className="py-2 pr-3 font-medium">Device</th>
                  <th className="py-2 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {shownEvents.map((e) => (
                  <tr key={e.id} className="border-b border-hairline">
                    <td className="whitespace-nowrap py-2 pr-3 text-fine tabular-nums text-graphite">
                      {fmt(e.ts)}
                    </td>
                    <td className="py-2 pr-3">
                      <EventBadge e={e} />
                    </td>
                    <td className="py-2 pr-3 font-mono text-fine">
                      {e.token_code ?? e.attempted_code ?? "—"}
                    </td>
                    <td className="py-2 pr-3 font-mono text-fine text-charcoal">
                      {shortId(e.visitor_id)}
                    </td>
                    <td className="py-2 pr-3 text-fine text-graphite">
                      {[e.device, e.os, e.browser].filter(Boolean).join(" · ") || "—"}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => setOpenEvent(e)}
                        className="link text-fine"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {!shownEvents.length && (
                  <tr>
                    <td colSpan={6} className="py-4 text-caption text-graphite">
                      {query ? "No matches." : "No events yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <SqlConsole />
      </div>

      {openEvent && <EventDetail e={openEvent} onClose={() => setOpenEvent(null)} />}
    </div>
  );
}

/* ------------------------------------------------------------ event bits */

function EventBadge({ e }: { e: EventItem }) {
  const map = {
    granted: {
      label: e.is_new ? "granted · new" : "granted · known",
      cls: e.is_new ? "bg-primary text-on-ink" : "bg-primary-soft text-primary-deep",
    },
    visit: { label: "visit", cls: "bg-fog text-charcoal" },
    rejected: { label: "rejected", cls: "bg-rose text-bloom-wine" },
    gate_view: { label: "gate view", cls: "bg-cloud text-graphite" },
  } as const;
  const v = map[e.kind];
  return (
    <span className={cn("inline-block rounded-sm px-2 py-0.5 text-fine font-semibold", v.cls)}>
      {v.label}
    </span>
  );
}

function EventDetail({ e, onClose }: { e: EventItem; onClose: () => void }) {
  const rows: [string, string][] = [
    ["Time", fmt(e.ts)],
    ["kind", e.kind + (e.kind === "granted" ? (e.is_new ? " · new device" : " · known device") : "")],
    ["Device ID", e.visitor_id ?? "—"],
    ["Code", e.token_code ?? e.attempted_code ?? "—"],
    ["Code name", e.token_name ?? "—"],
    ["Reason", e.reason ?? "—"],
    ["Device", e.device ?? "—"],
    ["OS", e.os ?? "—"],
    ["Browser", e.browser ?? "—"],
    ["Referrer", e.referrer ?? "direct"],
  ];

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md rounded-xl bg-canvas p-6 shadow-float"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="display-xs">Event #{e.id}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-2 grid h-11 w-11 place-items-center rounded-md text-graphite transition-colors hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <dl className="mt-5 space-y-2 text-caption">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-hairline pb-2">
              <dt className="text-graphite">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- new token */

function NewToken({
  onCreate,
  busy,
  onDone,
}: {
  onCreate: (init: RequestInit) => Promise<boolean>;
  busy: boolean;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    code: "",
    section: "top",
    expires_at: "",
  });

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const ok = await onCreate({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            expires_at: form.expires_at || null,
            code: form.code || undefined,
          }),
        });
        if (ok) onDone();
      }}
      className="mt-4 rounded-xl bg-canvas p-5 shadow-lift"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block text-caption font-medium">
          Name *
          <input
            required
            value={form.name}
            onChange={set("name")}
            placeholder="e.g. CV application"
            className="input mt-2"
          />
        </label>
        <label className="block text-caption font-medium">
          Code (blank = random)
          <input
            value={form.code}
            onChange={set("code")}
            placeholder="1234-5"
            className="input mt-2 font-mono"
          />
        </label>
        <label className="block text-caption font-medium">
          Lands on
          <select value={form.section} onChange={set("section")} className="input mt-2">
            {sectionOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label.en}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-caption font-medium">
          Expires on (optional)
          <input
            type="date"
            value={form.expires_at}
            onChange={set("expires_at")}
            className="input mt-2"
          />
        </label>
      </div>
      <div className="mt-5 flex items-center gap-2">
        <button type="submit" disabled={busy} className="btn btn-primary">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4" />}
          Create
        </button>
        <button type="button" onClick={onDone} className="btn btn-outline-ink">
          Cancel
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------ SQL console */

interface TableInfo {
  name: string;
  columns: string[];
  rows: number;
}

type QueryResult =
  | { kind: "rows"; columns: string[]; rows: Record<string, unknown>[]; rowCount: number; ms: number }
  | { kind: "write"; changes: number; lastInsertRowid: number; readOnly: boolean; ms: number };

/** Anything that isn't a plain read gets a confirm() first. */
const READ_ONLY = /^\s*(?:select|with|pragma|explain)\b/i;

const cell = (v: unknown) => {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
};

/**
 * Free-form SQL against the live database — read *and* write.
 *
 * There is no row limit and no statement timeout, by choice: this is a
 * single-user dashboard on a low-traffic site, and being able to prune or
 * correct data by hand without shelling into the container is the point.
 * The confirm() below is a guard against slips, not against an attacker —
 * anyone who can reach this component can post to the endpoint directly.
 */
function SqlConsole() {
  const [tables, setTables] = useState<TableInfo[] | null>(null);
  const [sql, setSql] = useState("SELECT * FROM visitors ORDER BY last_seen DESC;");
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void fetch("/api/admin/query")
      .then((r) => r.json())
      .then((j) => setTables(j.tables ?? []))
      .catch(() => setTables([]));
  }, []);

  const run = async () => {
    const trimmed = sql.trim();
    if (!trimmed) return;
    if (!READ_ONLY.test(trimmed)) {
      const ok = confirm(
        `This is not a read-only query. It will modify the live database and cannot be undone.\n\n${trimmed}\n\nRun it?`,
      );
      if (!ok) return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: trimmed }),
      });
      const json = await res.json();
      if (!res.ok) setError(json.error ?? "Query failed.");
      else setResult(json);
    } catch {
      setError("Could not reach the server.");
    }
    setBusy(false);
  };

  return (
    <Card
      className="mt-4"
      title="SQL"
      right={
        <span className="text-fine text-graphite">
          read &amp; write · no row limit · not undoable
        </span>
      }
    >
      {/* Table picker — straight from sqlite_master, so it can't drift from
          the real schema. Clicking one writes a starter query. */}
      <div className="flex flex-wrap gap-1.5">
        {tables === null ? (
          <span className="text-fine text-graphite">Loading tables…</span>
        ) : (
          tables.map((t) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setSql(`SELECT * FROM ${t.name} LIMIT 100;`)}
              title={t.columns.join("\n")}
              className="h-9 rounded-md border border-hairline px-2.5 font-mono text-fine text-charcoal transition-colors hover:border-primary hover:text-primary"
            >
              {t.name}
              <span className="ml-2 tabular-nums text-steel">{t.rows}</span>
            </button>
          ))
        )}
      </div>

      <textarea
        value={sql}
        onChange={(e) => setSql(e.target.value)}
        onKeyDown={(e) => {
          // Cmd/Ctrl+Enter runs; plain Enter stays a newline so multi-line
          // queries are actually writable.
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            e.preventDefault();
            void run();
          }
        }}
        spellCheck={false}
        rows={4}
        className="input mt-3 h-auto resize-y bg-cloud p-3 font-mono text-fine"
      />

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => void run()}
          disabled={busy}
          className="btn btn-primary"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
          Run
        </button>
        <span className="text-fine text-graphite">⌘/Ctrl + Enter</span>
        {result && (
          <span className="ml-auto text-fine tabular-nums text-graphite">
            {result.kind === "rows"
              ? `${result.rowCount} row${result.rowCount === 1 ? "" : "s"} · ${result.ms} ms`
              : `${result.changes} row${result.changes === 1 ? "" : "s"} changed · ${result.ms} ms`}
          </span>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-bloom-deep/30 bg-rose px-3 py-2 font-mono text-fine text-bloom-wine">
          {error}
        </p>
      )}

      {result?.kind === "rows" && (
        <div className="mt-3 max-h-[28rem] overflow-auto rounded-lg border border-hairline">
          <table className="w-full border-collapse text-fine">
            <thead className="sticky top-0 bg-canvas">
              <tr className="border-b border-steel text-left text-fine font-semibold text-graphite">
                {result.columns.map((c) => (
                  <th key={c} className="whitespace-nowrap px-2 py-1.5 font-medium">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i} className="border-b border-hairline">
                  {result.columns.map((c) => (
                    <td key={c} className="whitespace-nowrap px-2 py-1.5 font-mono text-charcoal">
                      {cell(row[c])}
                    </td>
                  ))}
                </tr>
              ))}
              {!result.rows.length && (
                <tr>
                  <td colSpan={Math.max(1, result.columns.length)} className="px-2 py-3 text-graphite">
                    No rows.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {result?.kind === "write" && (
        <p className="mt-3 rounded-lg border border-storm-mist bg-storm-mist/20 px-3 py-2 text-fine text-storm-deep">
          {result.changes} row{result.changes === 1 ? "" : "s"} changed.
          {result.lastInsertRowid > 0 && ` Last insert rowid: ${result.lastInsertRowid}.`}
        </p>
      )}
    </Card>
  );
}
