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

There is no lint script — ESLint is not installed, and `next.config.mjs` sets
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
./scripts/redeploy.sh
```

That is the whole thing: it stops the running container, rebuilds the image,
starts it again and waits until the healthcheck passes, printing the last 60 log
lines and exiting non-zero if it does not. `npm run redeploy` is the same
script.

| Flag | Does |
|---|---|
| `--no-cache` | rebuild from scratch — use after a dependency change that Docker's cache misses |
| `--prune` | delete dangling images afterwards |
| `--logs` | follow the logs once it is up |

Container listens on `3000`, published as `8070`.

### Build time on the Pi

This builds on a Raspberry Pi 4 (arm64), where the build used to take over ten
minutes. Almost all of that was one thing:

**`better-sqlite3` was being compiled from source.** It is a native module and
ships prebuilt binaries keyed by Node's ABI version — but the lowest prebuild it
publishes is ABI 127, which is **Node 22**. The image was on `node:20-alpine`
(ABI 115), found no prebuild, and silently fell back to `node-gyp rebuild`,
compiling SQLite on a Pi. Moving the base image to `node:22-alpine` makes
`prebuild-install` fetch `node-v127-linuxmusl-arm64` and finish in seconds.

**Do not move the base image back to an older Node to "be safe".** It is the
most expensive single change available in this file, and it fails silently — the
build still works, it just takes ten minutes. To check which ABI a Node major
has: `node -p process.versions.modules`.

Three smaller things, all in the same direction:

- **One `npm ci`, not two.** A previous revision had a separate `deps` stage for
  production modules, so dependencies were installed — and, back then, compiled
  — twice. Installing once and running `npm prune --omit=dev` after the build
  produces the same lean tree for about half the work.
- **The npm cache is a BuildKit cache mount**, so a rebuild that does not change
  `package-lock.json` reuses the downloaded tarballs instead of pulling them
  over the Pi's network again. `scripts/redeploy.sh` exports `DOCKER_BUILDKIT=1`
  so this works even on an older daemon.
- **`public/` never enters the builder.** It is ~140 MB of photography and video
  that `next build` does not read, so it is copied straight from the build
  context into the runner. Routing it through the builder moved it twice across
  SD-card I/O for nothing.

If you ever build this image on your laptop for the Pi, build it **on** the Pi
or with a native arm64 builder. Cross-building arm64 under qemu emulation is far
slower than anything described above.

### The image is two stages

`builder` installs dependencies and runs `next build`, then drops
devDependencies with `npm prune --omit=dev`. `runner` copies the result and
carries no toolchain.

**Both stages must sit on the identical base image.** The native `.node` binary
installed in `builder` is copied verbatim into `runner`; change one base without
the other and you get a binary the runtime cannot load — and it fails at
container start, not at build time. The build calls
`node -e "require('better-sqlite3')"` right after install so that failure
surfaces during the build instead.

`runner` copies exactly five things: `node_modules`, `.next`, `public`,
`package.json` and **`next.config.mjs`**.

**`next.config.mjs` is plain JavaScript on purpose — do not rename it back to
`.ts`.** `next start` reads it at runtime, and when it is TypeScript it needs
the `typescript` package to do so. Production dependencies do not include it, so
Next tries to *npm-install TypeScript at boot*: the container hangs on a network
fetch instead of serving, and the symptom looks like the application being
broken rather than a config file being the wrong extension. This is exactly how
this deployment broke.

Dependencies install with `npm ci`, not `npm install`: `ci` installs exactly what
`package-lock.json` pins and fails if the lockfile is out of sync. That also
means **package.json and package-lock.json must agree** or the image will not
build — check with `npm ci --dry-run`.

### The file is `Dockerfile`, not `dockerfile`

Docker looks for the capitalised name by default. On macOS the filesystem is
case-insensitive so either works; on the Pi it is not, and the lowercase name is
simply not found.

### `.dockerignore` is load-bearing

Without `node_modules` excluded, a host-built (darwin/win32) `node_modules`
would be copied over the Linux one and **the container fails to start** with a
native-module error. It also keeps `data/` out of the image, so production
analytics never end up baked into a layer — and keeps the build context small
as that database grows.

### Health

The container has a healthcheck hitting `/api/health`, which opens SQLite and
runs a trivial query: a server answering requests but unable to reach its
database is not healthy, and a missing `/app/data` mount is the most likely
thing to go wrong here.

It deliberately does **not** point at a page the gate logs. A healthcheck on
`/gate` would write a `gate_view` row every thirty seconds forever, burying the
real visitor numbers and permanently skewing the bounce rate.

`docker compose ps` shows the health state; `./scripts/redeploy.sh` waits for it.

### The data lives on the host

```yaml
volumes:
  - ./data:/app/data
```

A bind mount, not a named volume. The database is the only irreplaceable thing
in this deployment — every access code you have handed out is in it — and a bind
mount means you can see the file, copy it with `cp`, and move it to another
machine without knowing anything about Docker's internal volume store.
`docker compose down -v` cannot take it with it.

Without this line every redeploy starts from an empty database: all codes and
all statistics gone.

#### Migrating from the old named volume

This used to be a named volume called `homepage-data`. Those are different
places — redeploying without moving the data leaves the old database stranded
inside Docker and starts a fresh empty one, which silently invalidates every
code already in circulation.

`./scripts/redeploy.sh` refuses to run if it finds the old volume and no
`./data/access.db`, and prints the command to move it:

```bash
docker run --rm -v portfolio_homepage-data:/from -v "$(pwd)/data":/to alpine sh -c 'cp -a /from/. /to/'
```

(The volume is prefixed with the compose project name, usually the directory —
`docker volume ls` shows the real one.) Once `./data/access.db` exists the check
is skipped and the old volume can be removed with `docker volume rm`.

#### Ownership

The container runs as root, so files under `./data` are root-owned on the host.
That is normal for a Docker bind mount and nothing needs to change; it just
means `sudo` to inspect them directly.

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
docker compose exec homepage \
  sqlite3 /app/data/access.db ".backup '/app/data/backup.db'"
```

Copying `access.db` alone from a *running* system without the `-wal` gives you a
stale database. This is the most likely way to lose data here.

### Retention

Events older than 182 days are deleted automatically (`pruneOldEvents()`, run on
every DB open and in the stats route). `tokens`, `visitors` and `totals` are
kept — `visitors` and `totals` carry the running counters behind the **All time**
card, which is the only part of the dashboard that survives event pruning. See
[access-and-analytics](access-and-analytics.md#retention).

---

## Managing access codes

Through `/admin`, or directly:

```bash
# list / create
curl -s localhost:3000/api/admin/tokens
curl -s -X POST localhost:3000/api/admin/tokens \
  -H 'Content-Type: application/json' \
  -d '{"name":"Business card — printed 2026-08","section":"championship"}'

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
Almost certainly an image `quality` value not listed in `next.config.mjs`'s
`qualities` array. It is a runtime crash and the build will not catch it.

**Images 404 in production but work locally.**
Case-sensitive filesystem. macOS matched `.jpg` against `.JPG`; Linux won't.

**Container exits immediately after deploy.**
Native module mismatch — check `.dockerignore` still excludes `node_modules`.

**Admin shows an empty database after a deploy.**
Either the `./data` bind mount is missing or unwritable, or `FK_DB_PATH` doesn't point
into it and the app opened a fresh file elsewhere. Check with:

```bash
docker compose exec homepage sh -c 'echo $FK_DB_PATH && ls -la /app/data'
```

**Unique-visitor counts look too low.**
Check that `/api/access` still mints the visitor UUID *before* writing the
`granted` event. Reversing that order writes `visitor_id = NULL` and
`COUNT(DISTINCT visitor_id)` silently drops those rows.

**Sticky positioning stopped working.**
Look for an `overflow-hidden` that was added to an ancestor.
