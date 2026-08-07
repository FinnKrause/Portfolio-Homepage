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
  Plus,
  QrCode,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import type { TokenWithStats } from "@/app/api/admin/tokens/route";
import { cn } from "@/lib/utils";

const BRAND = "#2645e6";
const GREEN = "#12a150";
const RED = "#e10600";
const GREY = "#94a3b8";

const RANGES = [7, 30, 90, 182] as const;

interface Stats {
  days: number;
  retentionDays: number;
  totals: {
    grants: number;
    visits: number;
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
    <section className={cn("border border-line bg-white p-5", className)}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-ink-900">{title}</h2>
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
    <div className="border border-line bg-white p-4">
      <div className="text-2xl font-semibold tabular-nums" style={{ color: tone ?? "#0b1220" }}>
        {value.toLocaleString("en-GB")}
      </div>
      <div className="mt-1 text-xs text-ink-500">{label}</div>
    </div>
  );
}

const axis = { stroke: "#94a3b8", fontSize: 11 };
const tooltipStyle = {
  contentStyle: { fontSize: 12, border: "1px solid #e6eaf2", borderRadius: 0 },
};

/* ------------------------------------------------------------- dashboard */

export function AdminDashboard() {
  const [tokens, setTokens] = useState<TokenWithStats[] | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [days, setDays] = useState<number>(30);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [openEvent, setOpenEvent] = useState<EventItem | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [query, setQuery] = useState("");

  const origin = typeof window === "undefined" ? "" : window.location.origin;

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

  const linkFor = (code: string) => `${origin}/?code=${encodeURIComponent(code)}`;

  const copy = async (code: string) => {
    await navigator.clipboard.writeText(linkFor(code));
    setCopied(code);
    window.setTimeout(() => setCopied((c) => (c === code ? null : c)), 1600);
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
    <div className="min-h-screen bg-paper-soft">
      <div className="mx-auto max-w-[86rem] px-5 py-10 md:px-8">
        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-brand-700">
              Administration
            </p>
            <h1 className="headline mt-2 text-3xl font-medium text-ink-900">
              Access codes &amp; statistics
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-line bg-white">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setDays(r)}
                  className={cn(
                    "px-3 py-2 text-xs font-medium transition-colors",
                    days === r ? "bg-brand-600 text-white" : "text-ink-500 hover:text-ink-900",
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
              className="inline-flex items-center gap-2 border border-line bg-white px-3 py-2 text-xs font-medium text-ink-700 hover:border-brand-300"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </button>
            <button
              onClick={() => setShowNew((v) => !v)}
              className="inline-flex items-center gap-2 bg-brand-600 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-700"
            >
              <Plus className="h-3.5 w-3.5" />
              New code
            </button>
          </div>
        </header>

        {error && (
          <p className="mt-4 border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {showNew && <NewToken onCreate={mutate} busy={busy} onDone={() => setShowNew(false)} />}

        {/* Headline numbers */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Stat label="Entries" value={totals?.grants ?? 0} tone={BRAND} />
          <Stat label="Returning devices" value={totals?.returningDevices ?? 0} tone={GREEN} />
          <Stat label="Unique devices" value={totals?.uniqueVisitors ?? 0} />
          <Stat label="Gate views" value={totals?.gateViews ?? 0} tone={GREY} />
          <Stat label="Rejected codes" value={totals?.rejected ?? 0} tone={RED} />
        </div>

        {/* Tokens */}
        <Card
          className="mt-4"
          title="Codes"
        >
          {!tokens ? (
            <p className="flex items-center gap-2 text-sm text-ink-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </p>
          ) : tokens.length === 0 ? (
            <p className="text-sm text-ink-500">No codes.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[64rem] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-500">
                    <th className="py-2 pr-3 font-medium">Code</th>
                    <th className="py-2 pr-3 font-medium">Name</th>
                    <th className="py-2 pr-3 font-medium">Description</th>
                    <th className="py-2 pr-3 font-medium">Note</th>
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
                    const expired =
                      tk.expires_at && new Date(tk.expires_at).getTime() < Date.now();
                    return (
                      <tr key={tk.id} className="border-b border-line/70 align-top">
                        <td className="py-3 pr-3 font-mono font-semibold text-ink-900">
                          {tk.code}
                        </td>
                        <td className="py-3 pr-3 text-ink-900">{tk.name}</td>
                        <td className="max-w-[16rem] py-3 pr-3 text-ink-500">{tk.description}</td>
                        <td className="max-w-[12rem] py-3 pr-3 text-ink-500">{tk.note}</td>
                        <td className="py-3 pr-3 text-right tabular-nums">{tk.uses}</td>
                        <td className="py-3 pr-3 text-right tabular-nums">{tk.unique_visitors}</td>
                        <td className="py-3 pr-3 text-xs text-ink-500">
                          {tk.last_used ? fmt(tk.last_used) : "—"}
                        </td>
                        <td className="py-3 pr-3 text-xs text-ink-500">
                          {tk.expires_at ? tk.expires_at.slice(0, 10) : "—"}
                        </td>
                        <td className="py-3 pr-3">
                          <span
                            className={cn(
                              "inline-block px-2 py-0.5 text-[0.65rem] font-semibold uppercase",
                              !tk.enabled
                                ? "bg-ink-300/40 text-ink-700"
                                : expired
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-emerald-50 text-emerald-700",
                            )}
                          >
                            {!tk.enabled ? "Off" : expired ? "Expired" : "Active"}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button
                              onClick={() => void copy(tk.code)}
                              title="Copy access link"
                              className="inline-flex items-center gap-1 border border-line px-2 py-1 text-xs hover:border-brand-300"
                            >
                              {copied === tk.code ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                              Link
                            </button>
                            <a
                              href={`/api/admin/qr?code=${encodeURIComponent(tk.code)}`}
                              title="QR code as PNG"
                              className="inline-flex items-center gap-1 border border-line px-2 py-1 text-xs hover:border-brand-300"
                            >
                              <Download className="h-3 w-3" />
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
                              className="border border-line px-2 py-1 text-xs hover:border-brand-300"
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
                              className="border border-line px-2 py-1 text-xs text-red-600 hover:border-red-300"
                            >
                              <Trash2 className="h-3 w-3" />
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
                <CartesianGrid stroke="#eef1f6" vertical={false} />
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
                <CartesianGrid stroke="#eef1f6" vertical={false} />
                <XAxis dataKey="day" tick={axis} tickFormatter={(v) => String(v).slice(5)} />
                <YAxis tick={axis} allowDecimals={false} width={30} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="bounced" name="No entry" fill={GREY} />
              </BarChart>
            </ResponsiveContainer>
            {bounceRate !== null && (
              <p className="mt-2 text-xs tabular-nums text-ink-500">
                {bounceRate}% of gate views ended without a code being entered
              </p>
            )}
          </Card>

          <Card title="Devices reached per code">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats?.tokenEngagement ?? []} layout="vertical">
                <CartesianGrid stroke="#eef1f6" horizontal={false} />
                <XAxis type="number" tick={axis} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={axis} width={110} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="devices" name="Devices" fill={BRAND} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

        </div>

        {/* How people arrive: scanning a code vs typing one. Tells you
            whether the QR links are doing the work or the printed codes are. */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card title="How entries arrive">
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-semibold tabular-nums" style={{ color: BRAND }}>
                  {stats?.arrival.link ?? 0}
                </p>
                <p className="mt-1 text-sm text-ink-500">QR or shared link</p>
              </div>
              <div>
                <p className="text-2xl font-semibold tabular-nums">{stats?.arrival.typed ?? 0}</p>
                <p className="mt-1 text-sm text-ink-500">Code typed at the gate</p>
              </div>
              {!!stats?.arrival.unknown && (
                <div>
                  <p className="text-2xl font-semibold tabular-nums text-ink-500">
                    {stats.arrival.unknown}
                  </p>
                  <p className="mt-1 text-sm text-ink-500">Before this was tracked</p>
                </div>
              )}
            </div>
          </Card>
        </div>

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
                    <li key={r.label} className="flex justify-between text-sm">
                      <span className="truncate text-ink-700">{r.label}</span>
                      <span className="tabular-nums text-ink-500">{r.n}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink-500">No data yet.</p>
              )}
            </Card>
          ))}
        </div>

        {/* Conversion + failed attempts */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card title="Engagement per code">
            {stats?.tokenEngagement.length ? (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-500">
                    <th className="py-2 pr-3 font-medium">Code</th>
                    <th className="py-2 pr-3 text-right font-medium">Devices</th>
                    <th className="py-2 pr-3 text-right font-medium">Accesses</th>
                    <th className="py-2 pr-3 text-right font-medium">Per device</th>
                    <th className="py-2 font-medium">Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.tokenEngagement.map((r) => (
                    <tr key={r.code} className="border-b border-line/60">
                      <td className="py-2 pr-3">
                        <span className="font-mono text-xs">{r.code}</span>
                        <span className="ml-2 text-ink-500">{r.name}</span>
                      </td>
                      <td className="py-2 pr-3 text-right tabular-nums">{r.devices}</td>
                      <td className="py-2 pr-3 text-right tabular-nums">{r.accesses}</td>
                      <td
                        className="py-2 pr-3 text-right font-medium tabular-nums"
                        style={{ color: (r.perDevice ?? 0) >= 2 ? GREEN : undefined }}
                      >
                        {r.perDevice ?? "—"}
                      </td>
                      <td className="py-2 text-xs text-ink-500">
                        {r.lastActive ? fmt(r.lastActive) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-ink-500">No codes yet.</p>
            )}
          </Card>

          <Card
            title="Rejected entries"
          >
            {stats?.failedCodes.length ? (
              <ul className="max-h-60 space-y-1 overflow-y-auto text-sm">
                {stats.failedCodes.map((f, i) => (
                  <li key={i} className="flex items-center justify-between gap-3">
                    <span className="font-mono text-ink-900">{f.code}</span>
                    <span className="text-xs text-ink-500">
                      {f.reason === "disabled"
                        ? "disabled"
                        : f.reason === "expired"
                          ? "abgelaufen"
                          : "unknown"}{" "}
                      · {f.tries}× · {fmt(f.last_try)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-500">No rejected entries.</p>
            )}
          </Card>
        </div>

        {/* Busiest devices — a plain ranking; every device is granted exactly
            once, so there is nothing to chart beyond the access count. */}
        <Card className="mt-4" title="Devices by accesses">
          {stats?.topVisitors.length ? (
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-500">
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
                  <tr key={v.visitor_id} className="border-b border-line/60">
                    <td className="py-2 pr-3 tabular-nums text-ink-500">{i + 1}</td>
                    <td className="py-2 pr-3 font-mono text-xs">{shortId(v.visitor_id)}</td>
                    <td className="py-2 pr-3 font-mono text-xs">
                      {v.token_code ?? "—"}
                      {v.token_name && (
                        <span className="ml-2 font-sans text-ink-500">{v.token_name}</span>
                      )}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums font-medium">{v.requests}</td>
                    <td className="py-2 pr-3 text-xs text-ink-500">{fmt(v.first_seen)}</td>
                    <td className="py-2 text-xs text-ink-500">{fmt(v.last_seen)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-ink-500">No devices.</p>
          )}
        </Card>

        {/* Event log */}
        <Card
          className="mt-4"
          title="Event log"
          right={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-300" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search code, device ID, browser…"
                  className="w-64 border border-line bg-white py-1.5 pl-7 pr-2 text-xs"
                />
              </div>
              <span className="tabular-nums text-xs text-ink-500">
                {shownEvents.length}/{stats?.events.length ?? 0}
              </span>
            </div>
          }
        >
          <div className="max-h-[30rem] overflow-y-auto">
            <table className="w-full min-w-[52rem] border-collapse text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-500">
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
                  <tr key={e.id} className="border-b border-line/60">
                    <td className="whitespace-nowrap py-2 pr-3 text-xs tabular-nums text-ink-500">
                      {fmt(e.ts)}
                    </td>
                    <td className="py-2 pr-3">
                      <EventBadge e={e} />
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs">
                      {e.token_code ?? e.attempted_code ?? "—"}
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs text-ink-700">
                      {shortId(e.visitor_id)}
                    </td>
                    <td className="py-2 pr-3 text-xs text-ink-500">
                      {[e.device, e.os, e.browser].filter(Boolean).join(" · ") || "—"}
                    </td>
                    <td className="py-2">
                      <button
                        onClick={() => setOpenEvent(e)}
                        className="text-xs font-medium text-brand-700 hover:underline"
                      >
                        view
                      </button>
                    </td>
                  </tr>
                ))}
                {!shownEvents.length && (
                  <tr>
                    <td colSpan={6} className="py-4 text-sm text-ink-500">
                      {query ? "No matches." : "No events yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

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
      cls: e.is_new ? "bg-emerald-50 text-emerald-700" : "bg-brand-50 text-brand-700",
    },
    visit: { label: "visit", cls: "bg-ink-300/30 text-ink-700" },
    rejected: { label: "rejected", cls: "bg-red-50 text-red-700" },
    gate_view: { label: "gate_view", cls: "bg-paper-soft text-ink-500" },
  } as const;
  const v = map[e.kind];
  return (
    <span className={cn("inline-block px-2 py-0.5 text-[0.65rem] font-semibold", v.cls)}>
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
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md border border-line bg-white p-6"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-semibold text-ink-900">Event #{e.id}</h3>
          <button onClick={onClose} aria-label="Close" className="text-ink-500">
            <X className="h-4 w-4" />
          </button>
        </div>
        <dl className="mt-4 space-y-2 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-line/60 pb-1.5">
              <dt className="text-ink-500">{k}</dt>
              <dd className="text-right text-ink-900">{v}</dd>
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
    description: "",
    note: "",
    code: "",
    expires_at: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
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
      className="mt-4 border border-brand-200 bg-brand-50/40 p-5"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs font-medium text-ink-700">
          Name *
          <input
            required
            value={form.name}
            onChange={set("name")}
            placeholder="e.g. CV application"
            className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs font-medium text-ink-700">
          Description
          <input
            value={form.description}
            onChange={set("description")}
            placeholder="What is this code for?"
            className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs font-medium text-ink-700">
          Note (private)
          <input
            value={form.note}
            onChange={set("note")}
            className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs font-medium text-ink-700">
          Code (blank = random)
          <input
            value={form.code}
            onChange={set("code")}
            placeholder="1234-5"
            className="mt-1 w-full border border-line bg-white px-3 py-2 font-mono text-sm"
          />
        </label>
        <label className="text-xs font-medium text-ink-700">
          Expires on (optional)
          <input
            type="date"
            value={form.expires_at}
            onChange={set("expires_at")}
            className="mt-1 w-full border border-line bg-white px-3 py-2 text-sm"
          />
        </label>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4" />}
          Create
        </button>
        <button
          type="button"
          onClick={onDone}
          className="px-3 py-2 text-sm text-ink-500 hover:text-ink-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
