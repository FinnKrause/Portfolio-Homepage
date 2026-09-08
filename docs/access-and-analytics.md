# Access codes & analytics

The gate, the token store, and every number the dashboard shows — where each
comes from and what it actually means.

- [The code format](#the-code-format)
- [Cookies](#cookies)
- [Database schema](#database-schema)
- [The event lifecycle](#the-event-lifecycle)
- [Why `source` exists](#why-source-exists)
- [Landing sections](#landing-sections)
- [Metric definitions](#metric-definitions)
- [Rate limiting](#rate-limiting)
- [Retention](#retention)
- [The SQL console](#the-sql-console)

---

## The code format

Five digits, printed as `1234-5`. Defined in `src/config/access.ts`:

```ts
const CODE_RE = /^(\d{4})-(\d)$/;
```

`isWellFormedCode()` checks **shape only**. There is no checksum and no client
side validation of whether a code is real — a code is valid if and only if a
row exists in the `tokens` table with `enabled = 1` and an unexpired
`expires_at`. Authority lives in the database, nowhere else.

`formatAccessCode()` inserts the hyphen as the visitor types.

---

## Cookies

Both are first-party. Neither is set until a valid code has been accepted.

| Cookie | Lifetime | HttpOnly | Secure | Value | Purpose |
|---|---|---|---|---|---|
| `fk-access` | 12 months, rolling | yes | in production | `"1"` | "this browser may see the site". Read by edge middleware, which is why it's a flat constant. |
| `fk-visitor` | 12 months, rolling | yes | in production | random UUID | ties later page views back to the code the device entered with. |

Both are HttpOnly because nothing in the browser reads either one; only the
server does. `fk-access` used to be readable by page scripts on the theory that
the middleware needed it — it does not: the middleware reads cookies off the
incoming *request*, which HttpOnly does not affect.

`Secure` is conditional on `NODE_ENV === "production"` purely so `npm run dev`
over plain http still works.

### The window rolls

Both cookies are re-issued **on every visit**, by `/api/visit` — not only when a
code is accepted. `lib/cookies.ts` holds the one function that writes them, and
it always writes both.

That is the whole feature: the twelve months run from your *last* visit, not
your first. Someone who comes back every nine months never sees the gate a
second time and stays attributable to the code they arrived with. A device that
stays away for a full year has both cookies expire in the browser, and returns
as a genuinely new device with a fresh UUID.

Two failure modes this design is guarding against, both silent:

- **visitor cookie expires first** → the device is still let straight in, but is
  counted as brand new. Reach inflates and returning devices vanish.
- **access cookie expires first** → the visitor is asked for a code the site
  could already have attributed to them.

So the two lifetimes are one constant, `COOKIE_MAX_AGE`, and both cookies are
always written together. Never write one without the other.

The visible consequence is that ordinary page views carry `Set-Cookie` response
headers. That is expected — the beacon is renewing, not just reporting.

### Legal basis

Entering a valid code *is* the consent action. The privacy policy states this
as the legal basis (§ 25 (1) TDDDG, Art. 6 (1) (a) GDPR) without arguing for
it. Logging of *rejected* entries runs on legitimate interest instead
(Art. 6 (1) (f)) — those happen before any cookie exists, so consent could not
possibly cover them.

Withdrawal is "delete this site's cookies", which is accurate: clearing them
makes the device a brand-new device with a brand-new UUID. Staying away for a
year has the same effect, without any action.

---

## Database schema

SQLite via `better-sqlite3`, in WAL mode. One file, three tables.

```sql
tokens
  id           INTEGER PK AUTOINCREMENT
  code         TEXT UNIQUE      -- "1234-5"
  name         TEXT             -- "CV", "Business card" — the only label
  section      TEXT NULL        -- landing section; NULL = top of the page
  enabled      INTEGER          -- 0 disables new entries
  expires_at   TEXT NULL        -- NULL = never
  created_at   TEXT

events
  id             INTEGER PK AUTOINCREMENT
  ts             TEXT             -- ISO 8601
  kind           TEXT             -- gate_view | granted | rejected | visit
  token_id       INTEGER NULL     -- FK tokens(id) ON DELETE SET NULL
  attempted_code TEXT NULL        -- rejected only
  reason         TEXT NULL        -- unknown | disabled | expired
  visitor_id     TEXT NULL        -- NULL before consent exists
  is_new         INTEGER NULL     -- 1 = device's first ever entry
  browser, os, device, referrer   TEXT NULL
  source         TEXT NULL        -- granted only: gate | link

visitors
  visitor_id    TEXT PK
  token_id      INTEGER NULL    -- the code this device came in with
  first_seen    TEXT
  last_seen     TEXT
  total_entries INTEGER         -- running counter, never derived from events
  total_visits  INTEGER         -- running counter, never derived from events

totals
  key TEXT PK                   -- gate_views | rejected
  n   INTEGER
```

### Why there are counters at all

`events` is deleted after six months. Anything counted *from* it therefore
describes the retention window, not the lifetime — and an "all time" figure
computed that way silently shrinks as history ages out, which is worse than not
having one.

So the all-time numbers are running counters that only ever go up:

- **`visitors.total_entries` / `total_visits`** — per device, incremented in the
  same statements that already touch that row (`bindVisitorToToken` on entry,
  `tokenForVisitor` on every visit).

  `total_entries` is **not shown** on the dashboard. A device is granted once
  and then only visits, so its all-time entry count is within a rounding error
  of "Devices ever" — the two tiles showed the same number. It still differs
  when someone re-opens a `?code=` link on a device that already has cookies, so
  the column is kept for the SQL console; it just does not earn a tile.
- **`totals`** — for `gate_view` and `rejected`, which have *no device attached*:
  nobody has consented at the point either is recorded, so there is no
  `visitors` row to hang a counter on. Without this table, "how many people ever
  turned back at the door" becomes unanswerable once those events age out, and
  bounce rate loses its history. The table is a name and a number; nothing in it
  identifies anyone.

The dashboard's **All time** card reads only these. Every other number on that
page is windowed and comes from `events`.

**`visitors` holds one row per device, not per person.** A device belongs to
exactly one code — the one it entered with. Clearing cookies produces a new
UUID and therefore a new device, by design: there is deliberately no way to
recognise a returning person across a cookie clear.

`token_id` uses `ON DELETE SET NULL`, so deleting a code keeps its history as
anonymous events rather than destroying the record.

### Migrations

There is no migration framework, and currently no migration *code*: `db()` runs
`CREATE TABLE IF NOT EXISTS` on every open and that is all.

This file previously carried a guarded `ALTER TABLE` for the `source` column,
added after a deploy to protect existing rows. That guard has been removed along
with the data it protected — the schema is defined once, in its final shape.

**This only works while nothing is in production.** The moment real codes are in
circulation — printed on a card, embedded in a QR, sitting in someone's inbox —
a breaking schema change destroys the `tokens` rows behind them and those codes
stop working permanently. At that point, go back to the additive pattern:

```ts
const hasCol = (conn.prepare(`PRAGMA table_info(events)`).all() as {name:string}[])
  .some((c) => c.name === "new_column");
if (!hasCol) conn.exec(`ALTER TABLE events ADD COLUMN new_column TEXT`);
```

Rows written before the column existed keep `NULL`, which every consumer must
tolerate.

---

## The event lifecycle

Four kinds, written from three places.

```
  ┌─ gate_view ── /gate renders ───────────── no cookie, no visitor_id
  │              (logged for everyone who reaches the door, before consent
  │               exists — disclosed in the privacy policy under Art. 6 (1) (f))
  │
  ├─ rejected ─── bad code at /api/access ─── no visitor_id, keeps attempted_code
  │
  ├─ granted ──── valid code at /api/access ─ mints visitor_id, sets both cookies
  │                                           records source = gate | link
  │
  └─ visit ────── /api/visit beacon ───────── requires fk-visitor; ignored without it
```

### The ordering rule in `/api/access`

```ts
const isNewVisitor = !visitor;
const visitorId = visitor ?? randomUUID();   // BEFORE logging
bindVisitorToToken(visitorId, check.token.id);
recordEvent({ kind: "granted", ..., visitorId, isNew: isNewVisitor, source });
```

The UUID must be minted **before** the event is written. Minting it afterwards
records a `granted` row with `visitor_id = NULL`, and since unique-visitor
counts use `COUNT(DISTINCT visitor_id)` — which ignores NULL — every first-time
device would be invisible in the numbers. This was a real bug; keep the order.

### Failure isolation

`recordEvent()` wraps its insert in a bare `try/catch`. Analytics must never be
able to take the site down.

---

## Why `source` exists

A QR or shared-link arrival is redirected straight through `/api/access` and
**never renders the gate**. A typed arrival always renders it first.

Mixing the two corrupts any funnel built on gate views:

```
bounce = (gate_views − entries) / gate_views
```

With link arrivals folded into `entries`, the numerator shrinks for entries that
never produced a gate view in the first place — the rate is understated and can
floor at zero while people really are bouncing.

So `granted` events carry `source`, and the bounce rate uses only
`source = 'gate'`:

```sql
SUM(kind = 'granted' AND source = 'gate') AS entries_typed
```

The same column powers **How entries arrive**, which answers a question worth
asking: are the QR links doing the work, or are people typing codes off print?

---

## Landing sections

A code can point at a section of the page, so a QR on a business card can drop
someone straight into the F1 chapter instead of the top.

```
/?code=1234-5&to=championship
        │            └── section, optional
        └── the code
```

The chain, and why it has this shape:

1. **Middleware** sees `code` and redirects to `/api/access`, forwarding `to`
   untouched. It does not validate — the edge runtime stays free of everything
   but the cookie check.
2. **`/api/access` GET** validates the code, then resolves the landing section:
   the `to` parameter if there is one, otherwise the token's stored `section`.
   An explicit `to` therefore lets one code be aimed somewhere else ad hoc
   without editing the token.
3. It redirects to `/#championship`. **The section becomes a fragment**, which
   the browser never sends back to a server — so the section someone was
   pointed at is not logged, which is right: it is navigation, not analytics.
4. **`useHashScroll`** in `SiteContent` scrolls to it once on mount and again as
   images resolve. The browser's own hash handling fires before the photography
   below the fold has taken up its real height, which lands you hundreds of
   pixels short.

**Why a query parameter and not just a `#hash` in the QR.** Fragments are never
transmitted to the server, and this URL has to survive two server-side redirects
before the browser is allowed to keep anything. Browsers *do* usually carry a
fragment across a redirect whose target has none, but "usually" is not a
property you want printed onto a card.

### Validation

`to` is checked against `SECTION_IDS` in `content/ui.ts` — derived from `nav`,
plus `top`. Anything else is **dropped, not rejected**: a QR code is a printed
artefact that outlives the page it points at, so a section that has since been
renamed lands the visitor on the homepage rather than breaking their link.

`top` is stored as `NULL`, since it means the same thing as no section and one
representation keeps the link builder to a single branch.

The same allowlist guards the QR route, so an invalid section can never be baked
into a printed code.

---

## Metric definitions

Every number on `/admin`, and the question it answers. Anything that could not
answer a question was removed.

### Headline

| Stat | Definition | Reading it |
|---|---|---|
| Entries | `count(kind='granted')` | doors opened. Capped at one per device per cookie lifetime. |
| Returning devices | devices with events on **>1 distinct day** | the honest engagement signal — someone came back later. |
| Unique devices | `count(distinct visitor_id)` | reach. NULLs (pre-consent) excluded. |
| Gate views | `count(kind='gate_view')` | how many times the door was rendered. |
| Rejected codes | `count(kind='rejected')` | wrong codes typed. |

### Charts and tables

| Card | Shows | Why it earns its space |
|---|---|---|
| **Devices per day** | distinct devices per day | the trend line. Reach over time. |
| **Stopped at the gate** | `gate_views − typed entries`, floored at 0 | people who saw the door and didn't come in. A spike means a code is circulating wrong or being mistyped. |
| **Devices reached per code** | devices per token | which code is actually in circulation. |
| **Engagement per code** | devices · accesses · **accesses/device** · last active | the one that matters. Entries alone say a code was opened; per-device says whether those people *read* anything. A code at 3.5 landed; a code at 1.0 got a glance. |
| **How entries arrive** | QR/link vs typed | which distribution channel works. |
| **Rejected entries** | attempted code, reason, count | typos vs probing. |
| **Devices by accesses** | ranked device list | who is reading the most. |
| **Device / Browser / Referrer** | breakdowns over `granted`+`visit` | context. |
| **Event log** | last 400 events, searchable | the ground truth behind every number above. |
| **All time** | devices, page views, views/device, gate views, rejections, and devices + page views per code | the only figures on the page that do not move when events age out. Read from the counters, never from `events`. A code whose batch went out eight months ago shows nothing in any window and its real total here. |

### Deliberately absent

| Removed | Why |
|---|---|
| Success rate per code | structurally ~100%. A code either exists or it doesn't; the rate carried no information. |
| Entries vs. page views (chart) | compared incomparable quantities — entries are capped at one per device forever, page views are unbounded. Any shape was an artefact. "Accesses per device" expresses the real content as one number. |
| Hour of day / Weekday | noise at this traffic volume. |
| Country | not derivable without a geo-IP service, which would mean shipping IPs to a third party. |

---

## Rate limiting

`src/lib/analytics.ts`: **12 failed attempts per IP per 10 minutes**, held in
memory.

The raw IP is the in-memory bucket key and is used for nothing else. **It is
never written to the database** and is never joined to an event row — the
limiter's `Map` is the only place it exists, and it dies with the process. (Your *web server* logs IPs like any web server —
that is disclosed separately in the privacy policy under legitimate interest.)

Because the bucket is in-process memory, it resets on restart and is per-instance.
Fine for one container; if this is ever scaled horizontally, the limiter needs
shared state.

---

## Retention

`EVENT_RETENTION_DAYS = 182` (~6 months), matching the privacy policy.

`pruneOldEvents()` deletes rows from `events` older than the cutoff, counted from
each event's own timestamp. It runs on every `db()` open and again inside the
stats route, so it is enforced continuously rather than on a schedule, and it
touches only already-expired rows.

**This does not roll.** The rolling year applies to the *cookies*, not to the
event log. An active device keeps its identity for as long as it keeps visiting;
its individual events still age out at six months regardless. What survives the
prune are the running counters, which is what keeps the all-time figures honest
after the rows behind them are gone.

`tokens`, `visitors` and `totals` are not pruned:

- `tokens` are things you created, not observations about a visitor.
- `visitors` carries the counters, and losing a row would make the all-time
  numbers fall.
- `totals` contains no identifiers at all.

The privacy policy states the six-month period for the individual entries and
notes that aggregate figures are retained. It does not describe the `visitors`
table's lifetime — a deliberate choice, on the reasoning that once both cookies
have expired the device can never be matched again and a code cannot be pinned
to one identifiable person. If that reasoning ever stops holding — a code issued
to exactly one named individual, say — revisit both the table and the policy
together.

---

## The SQL console

`/api/admin/query` runs free-form SQL against the live database, surfaced as the
**SQL** card at the bottom of `/admin`.

`GET` returns the table list, read from `sqlite_master` so it cannot drift from
the real schema. `POST` takes `{ sql }` and runs it.

Read *and* write, deliberately — the point is to correct or prune data by hand
without shelling into the container. Statement type is decided by
better-sqlite3's `stmt.reader`, which comes from SQLite's own parse rather than
from matching the query text, so it can't be fooled by a leading comment.

**There is no row cap and no statement timeout.** better-sqlite3 is synchronous:
a heavy query blocks every other request to the site until it finishes. That is
an accepted trade for a single-user dashboard on a low-traffic site.

The client `confirm()`s before sending anything that isn't a plain read. That is
a guard against slips, not against an attacker — anyone who can reach the page
can POST to the endpoint directly.

**This is the most dangerous endpoint in the app.** `/admin` and `/api/admin/*`
have no authentication of their own; the reverse proxy is the only lock. If it
is ever misconfigured, this route is a remote `DROP TABLE`. Never expose the
container directly.
