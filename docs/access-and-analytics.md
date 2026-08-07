# Access codes & analytics

The gate, the token store, and every number the dashboard shows — where each
comes from and what it actually means.

- [The code format](#the-code-format)
- [Cookies](#cookies)
- [Database schema](#database-schema)
- [The event lifecycle](#the-event-lifecycle)
- [Why `source` exists](#why-source-exists)
- [Metric definitions](#metric-definitions)
- [Rate limiting](#rate-limiting)
- [Retention](#retention)

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

| Cookie | Lifetime | HttpOnly | Value | Purpose |
|---|---|---|---|---|
| `fk-access` | 12 months | no | `"1"` | "this browser may see the site". Read by edge middleware, which is why it's a flat constant. |
| `fk-visitor` | 6 months | **yes** | random UUID | ties later page views back to the code the device entered with. |

`fk-visitor` is HttpOnly because nothing in the browser needs to read it; only
the server ever does.

### Legal basis

Entering a valid code *is* the consent action. The privacy policy states this
as the legal basis (§ 25 (1) TDDDG, Art. 6 (1) (a) GDPR) without arguing for
it. Logging of *rejected* entries runs on legitimate interest instead
(Art. 6 (1) (f)) — those happen before any cookie exists, so consent could not
possibly cover them.

Withdrawal is "delete this site's cookies", which is accurate: clearing them
makes the device a brand-new device with a brand-new UUID.

---

## Database schema

SQLite via `better-sqlite3`, in WAL mode. One file, three tables.

```sql
tokens
  id           INTEGER PK AUTOINCREMENT
  code         TEXT UNIQUE      -- "1234-5"
  name         TEXT             -- "CV", "Business card"
  description  TEXT
  note         TEXT
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
  visitor_id   TEXT PK
  token_id     INTEGER NULL     -- the code this device came in with
  first_seen   TEXT
  last_seen    TEXT
```

**`visitors` holds one row per device, not per person.** A device belongs to
exactly one code — the one it entered with. Clearing cookies produces a new
UUID and therefore a new device, by design: there is deliberately no way to
recognise a returning person across a cookie clear.

`token_id` uses `ON DELETE SET NULL`, so deleting a code keeps its history as
anonymous events rather than destroying the record.

### Migrations

There is no migration framework. `db()` runs `CREATE TABLE IF NOT EXISTS` on
every open, and additive changes are guarded:

```ts
const hasSource = (conn.prepare(`PRAGMA table_info(events)`).all() as {name:string}[])
  .some((c) => c.name === "source");
if (!hasSource) conn.exec(`ALTER TABLE events ADD COLUMN source TEXT`);
```

Follow that pattern for any new column. Rows written before the column existed
keep `NULL`, which every consumer must tolerate.

---

## The event lifecycle

Four kinds, written from three places.

```
  ┌─ gate_view ── /gate renders ───────────── no cookie, no visitor_id
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

The IP is hashed into a bucket key and used for nothing else. **It is never
written to the database.** (Your *web server* logs IPs like any web server —
that is disclosed separately in the privacy policy under legitimate interest.)

Because the bucket is in-process memory, it resets on restart and is per-instance.
Fine for one container; if this is ever scaled horizontally, the limiter needs
shared state.

---

## Retention

`EVENT_RETENTION_DAYS = 182` (~6 months), matching the privacy policy.

`pruneOldEvents()` deletes `events` older than the cutoff. It runs on every
`db()` open and again inside the stats route, so it is enforced continuously
rather than on a schedule. It touches only already-expired rows.

`tokens` and `visitors` are **not** pruned — a token is a thing you created, and
a visitor row is the binding that keeps later visits attributable.
