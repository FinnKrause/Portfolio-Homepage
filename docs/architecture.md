# Architecture

How the application is put together and what happens to a request from the
moment it arrives.

- [The shape of the thing](#the-shape-of-the-thing)
- [Request lifecycle](#request-lifecycle)
- [Runtime split: edge vs node](#runtime-split-edge-vs-node)
- [Rendering model](#rendering-model)
- [Module map](#module-map)

---

## The shape of the thing

A single-page personal portfolio behind an access gate, plus a private admin
dashboard for the access codes.

```
                    ┌────────────────────────────────────┐
   visitor ────────▶│  middleware.ts        (edge)       │
                    │  "is there an access cookie?"      │
                    └───────┬────────────────────┬───────┘
                            │ no                 │ yes
                            ▼                    ▼
                    ┌───────────────┐    ┌──────────────┐
                    │  /gate        │    │  /  (site)   │
                    │  AccessScreen │    │  SiteContent │
                    └───────┬───────┘    └──────┬───────┘
                            │ POST code         │ POST beacon
                            ▼                   ▼
                    ┌────────────────────────────────────┐
                    │  /api/access        /api/visit     │  (node)
                    └────────────────┬───────────────────┘
                                     ▼
                            ┌────────────────┐
                            │  SQLite        │
                            │  data/access.db│
                            └───────┬────────┘
                                    ▲
                    ┌───────────────┴────────────────────┐
   operator ───────▶│  /admin  +  /api/admin/*           │  (node)
   (via proxy auth) │  tokens · stats · qr               │
                    └────────────────────────────────────┘
```

Three surfaces, three audiences:

| Surface | Who reaches it | Protected by |
|---|---|---|
| `/gate` | anyone | nothing — it *is* the door |
| `/` | anyone holding a valid code | `fk-access` cookie, enforced in middleware |
| `/admin`, `/api/admin/*` | the operator | **a reverse proxy in front of the app** |

`/impressum` and `/datenschutz` are deliberately public — they must be
reachable without passing the gate to satisfy German disclosure law.

> **The admin surface has no application-level auth.** That is intentional and
> documented in `src/app/admin/page.tsx`, but it means the app must never be
> exposed to the internet without the proxy in front of it. See
> [operations.md](./operations.md#the-admin-surface-has-no-lock-of-its-own).

---

## Request lifecycle

### A visitor with no cookie

1. `GET /` hits `src/middleware.ts` on the **edge** runtime.
2. No `fk-access` cookie → `NextResponse.rewrite("/gate")`. The URL in the
   address bar stays `/`; only the rendered page changes.
3. `src/app/gate/page.tsx` (node, `force-dynamic`) records a `gate_view` event
   and renders `GateClient` → `AccessScreen`.
4. The visitor types a code. `GateClient` does `POST /api/access`.
5. On success the route sets both cookies and answers `{ok:true}`; the client
   calls `window.location.replace("/")`.
6. `GET /` again — this time the cookie is there, so middleware passes it
   through and `SiteContent` renders.

### A visitor arriving from a QR code or shared link

1. `GET /?code=8811-8` hits middleware, which sees the `code` search param.
2. It redirects to `/api/access?code=8811-8` — deliberately *not* a rewrite, so
   the code disappears from the address bar and won't be copy-pasted onward.
3. The route validates, sets cookies, and redirects to `/`.

The gate is never rendered on this path. That distinction is recorded on the
event as `source = 'link'` vs `'gate'`, and it matters for the statistics — see
[access-and-analytics.md](./access-and-analytics.md#why-source-exists).

### A visitor already inside

`VisitBeacon` fires one `POST /api/visit` about 1.2 s after mount. The delay is
deliberate: it is never urgent, and it means a visitor who bounces instantly
isn't counted as having looked at anything.

---

## Runtime split: edge vs node

This split is the single most important structural constraint in the codebase.

**`middleware.ts` runs on the edge runtime.** It cannot use `node:fs`, native
modules, or `better-sqlite3`. So it does exactly one thing: read a cookie and
compare it to `"1"`. It never asks whether the code behind that cookie is still
valid.

**Everything that touches the database declares `export const runtime = "nodejs"`.**
That is every file under `src/app/api/`, plus `src/app/gate/page.tsx` and
`src/app/admin/page.tsx`.

The practical consequence: **revoking a code does not evict visitors who already
entered with it.** Their `fk-access` cookie is a flat `"1"` and the edge has no
way to look anything up. Disabling a token stops *new* entries only. This is a
conscious trade — checking the database on every page view would put SQLite in
the path of every request — but it is worth knowing before you rely on
"disable" as a security control.

`src/lib/db.ts` opens with `import "server-only"`, so importing it from a client
component fails at build time rather than leaking at runtime.

---

## Rendering model

`SiteContent` is a client component (`"use client"`) and so is nearly every
section under it. This is not the same as client-side rendering: Next still
server-renders the whole tree, so the HTML arrives complete on the first
response and the text is painted before any JavaScript executes. The `"use
client"` boundary exists because the sections need `useLang()`, scroll
progress, and `framer-motion`.

Static vs dynamic, from the build output:

| Route | Mode | Why |
|---|---|---|
| `/` | static | no per-request data; the gate is upstream in middleware |
| `/impressum`, `/datenschutz` | static | pure content |
| `/gate` | dynamic | writes a `gate_view` event on every render |
| `/admin` | dynamic | reads live database state |
| `/api/*` | dynamic | request handlers |

First Load JS, as of the last build:

```
/          186 kB     framer-motion + the full section tree
/gate      105 kB     essentially the shared baseline
/admin     223 kB     recharts
shared     102 kB
```

The gate matters most — it is the only page an unverified visitor loads, and
first impressions run on it. It was 143 kB until `LanguageToggle` was rewritten
without `framer-motion`; the library was being pulled in for one sliding pill.
**Keep `framer-motion` out of anything the gate imports.**

---

## Module map

```
src/
├── middleware.ts            edge gate — cookie check only
│
├── app/
│   ├── layout.tsx           <html>, Inter, LanguageProvider, metadata
│   ├── page.tsx             → SiteContent
│   ├── globals.css          Tailwind v4 @theme tokens + hand-written classes
│   ├── gate/                the door: page.tsx (logs) → GateClient → AccessScreen
│   ├── admin/               dashboard (page.tsx is a shell; AdminDashboard is the UI)
│   ├── datenschutz/         ─┐ both render <LegalDoc> from src/content/legal.ts
│   ├── impressum/           ─┘
│   └── api/
│       ├── access/          GET = link arrival, POST = gate form
│       ├── visit/           POST beacon, one per page load
│       └── admin/
│           ├── tokens/      GET POST PATCH DELETE
│           ├── stats/       GET — every number the dashboard shows
│           └── qr/          GET — PNG for a code
│
├── components/
│   ├── SiteContent.tsx      composes the whole page in order
│   ├── Nav · Hero · About · Projects · Championship · Engagement
│   │   Experience · Awards · Skills · Contact · Footer
│   ├── access/              AccessScreen (the form) · VisitBeacon
│   ├── f1/                  JourneyTimeline · RaceFilm · ReactionTest
│   ├── media/               Carousel · Gallery · Lightbox · MediaView
│   ├── motion/Reveal.tsx    the standard scroll-in wrapper
│   ├── visuals/             decorative per-project graphics
│   └── legal/LegalDoc.tsx   renders a legal document from content
│
├── content/                 ALL copy lives here — see frontend.md
├── config/access.ts         cookie names, lifetimes, code format
└── lib/
    ├── db.ts                SQLite connection, schema, migrations, retention
    ├── analytics.ts         request facts, rate limiting, event recording
    ├── i18n.tsx             LanguageProvider / useLang
    ├── useIsDesktop.ts      matchMedia hook, SSR-safe
    └── utils.ts             cn()
```

### Dependency direction

```
app/ ──▶ components/ ──▶ content/
  │           │
  │           └────────▶ lib/i18n, lib/utils
  │
  └──▶ lib/db, lib/analytics ──▶ config/access
```

`content/` imports nothing but `content/types`. `lib/db` and `lib/analytics` are
server-only and must never appear in a client component's import graph.
