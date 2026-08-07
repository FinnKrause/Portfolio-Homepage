# Operations

Running, deploying and looking after this thing.

- [Local development](#local-development)
- [Environment variables](#environment-variables)
- [Deployment](#deployment)
- [The admin surface has no lock of its own](#the-admin-surface-has-no-lock-of-its-own)
- [The database](#the-database)
- [Managing access codes](#managing-access-codes)
- [Turning the gate off](#turning-the-gate-off)
- [Troubleshooting](#troubleshooting)

---

## Local development

```bash
npm install
npm run dev
```

Native module note: `better-sqlite3` compiles on install. On a fresh machine
without build tools that step fails — the Docker image installs `python3 make
g++` for exactly this reason.

Scripts:

| Command | Does |
|---|---|
| `npm run dev` | dev server with HMR |
| `npm run build` | production build |
| `npm start` | serve the build |
| `npx tsc --noEmit` | typecheck |

There is no lint script — ESLint is not installed, and `next.config.ts` sets
`eslint.ignoreDuringBuilds`. Typecheck is the gate.

> **Never run `npm run build` while `npm run dev` is running.** They write the
> same `.next` directory and the build corrupts the dev server's state. Stop dev
> first; if you forget, `rm -rf .next` and restart.

To reach the site locally you need a code. Create one through the admin UI at
`/admin`, or straight over the API:

```bash
curl -s -X POST localhost:3000/api/admin/tokens -H 'Content-Type: application/json' -d '{"name":"Local dev"}'
```

Then open `http://localhost:3000/?code=1234-5`.

---

## Environment variables

| Variable | Default | Meaning |
|---|---|---|
| `FK_DB_PATH` | `<cwd>/data/access.db` | where SQLite lives |
| `FK_PUBLIC_ORIGIN` | — | origin baked into generated QR codes and copied links |

**Set `FK_DB_PATH` explicitly in production.** The default is relative to
`process.cwd()`, so a process started from a different working directory quietly
opens a *different, empty* database. `docker-compose.yaml` pins it.

`FK_PUBLIC_ORIGIN` must match the origin visitors actually use, or every QR code
you print will point somewhere wrong. It is currently
`https://home.finnkrause.com`, matching the address shown on the gate. **If one
of those changes, change the other** — they are the same fact stored twice
(`docker-compose.yaml` and the copy in `src/components/access/AccessScreen.tsx`).

---

## Deployment

```bash
docker compose up -d --build
```

Container listens on `3000`, published as `8070`.

### `.dockerignore` is load-bearing

The image installs and **compiles `better-sqlite3` for linux-musl** in an early
layer. `COPY . .` comes later. Without `.dockerignore` excluding `node_modules`,
that copy drops a host-built (darwin/win32) `node_modules` on top of the Linux
one and **the container fails to start** with a native-module error.

It also keeps `data/` out of the image, so local analytics never end up baked
into a layer.

### The volume is the data

```yaml
volumes:
  - homepage-data:/app/data
```

Without it every redeploy starts from an empty database — all codes and all
statistics gone. It is the single most important line in the compose file.

---

## The admin surface has no lock of its own

`/admin` and `/api/admin/*` implement **no authentication**. This is deliberate
and documented in `src/app/admin/page.tsx`: a reverse proxy in front of the
application decides who may reach those paths.

The consequence is blunt and worth stating plainly:

> If the container is ever exposed directly — a published port, a misconfigured
> proxy, a `docker compose` on a public host without the front end — then
> anyone can list, create and delete access codes and read the full visitor log.

The proxy must reject unauthenticated requests to **both** `/admin` and
`/api/admin/` (the second is easy to forget; the dashboard is useless without
it, but the API alone is enough to do damage).

---

## The database

One SQLite file in WAL mode. In normal operation you'll see three files:

```
access.db        the database
access.db-wal    recent writes, not yet folded in
access.db-shm    shared-memory index for the WAL
```

The `-wal` file being large while `access.db` stays small is **normal**. SQLite
checkpoints it into the main file on clean shutdown, at which point `-wal` and
`-shm` disappear. Do not "tidy up" by deleting them on a running system — that
is how you lose recent writes.

### Backups

Copy the file while the app is stopped, or use SQLite's online backup so the WAL
is included:

```bash
docker compose exec homepage-nextjs-app \
  sqlite3 /app/data/access.db ".backup '/app/data/backup.db'"
```

Copying `access.db` alone from a *running* system without the `-wal` gives you a
stale database. This is the most likely way to lose data here.

### Retention

Events older than 182 days are deleted automatically (`pruneOldEvents()`, run on
every DB open and in the stats route). Tokens and visitor bindings are kept.

---

## Managing access codes

Through `/admin`, or directly:

```bash
# list / create
curl -s localhost:3000/api/admin/tokens
curl -s -X POST localhost:3000/api/admin/tokens \
  -H 'Content-Type: application/json' \
  -d '{"name":"Business card","description":"Batch printed 2026-08"}'

# enable / disable
curl -s -X PATCH localhost:3000/api/admin/tokens \
  -H 'Content-Type: application/json' -d '{"id":2,"enabled":false}'

# delete (history is kept, anonymised)
curl -s -X DELETE 'localhost:3000/api/admin/tokens?id=2'
```

QR PNG for a code: `GET /api/admin/qr?code=1234-5`.

### Disabling a code does not evict anyone

A visitor who already entered holds an `fk-access` cookie for 12 months, and the
edge middleware only checks that the cookie exists. Disabling stops **new**
entries; it does not lock out devices that already came in. To actually revoke
access you would have to change the cookie name in `src/config/access.ts`, which
logs out *everyone*.

---

## Turning the gate off

`VERIFICATION_ENABLED` in `src/config/access.ts`.

Set it to `false` and the site becomes fully public: middleware passes
everything through, and `layout.tsx` swaps the deliberately-sparse gated
metadata for the full indexable set (title, description, keywords, OpenGraph,
`robots: index`). No other change is needed — the gate is a layer on top, not a
dependency of the content.

---

## Troubleshooting

**Blank page, empty `<body>`, no build error.**
Almost certainly an image `quality` value not listed in `next.config.ts`'s
`qualities` array. It is a runtime crash and the build will not catch it.

**Images 404 in production but work locally.**
Case-sensitive filesystem. macOS matched `.jpg` against `.JPG`; Linux won't.

**Container exits immediately after deploy.**
Native module mismatch — check `.dockerignore` still excludes `node_modules`.

**Admin shows an empty database after a deploy.**
Either the `homepage-data` volume was dropped, or `FK_DB_PATH` doesn't point
into it and the app opened a fresh file elsewhere. Check with:

```bash
docker compose exec homepage-nextjs-app sh -c 'echo $FK_DB_PATH && ls -la /app/data'
```

**Unique-visitor counts look too low.**
Check that `/api/access` still mints the visitor UUID *before* writing the
`granted` event. Reversing that order writes `visitor_id = NULL` and
`COUNT(DISTINCT visitor_id)` silently drops those rows.

**Sticky positioning stopped working.**
Look for an `overflow-hidden` that was added to an ancestor.
