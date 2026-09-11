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

Configuration lives in **`.env`** in the repository root. `.env.example` is the
committed template:

```bash
cp .env.example .env      # then edit
./scripts/redeploy.sh     # apply
```

| Variable | Default | Meaning |
|---|---|---|
| `FK_PUBLIC_ORIGIN` | *(empty)* | the origin visitors actually use — baked into QR codes and copied admin links |
| `FK_DB_PATH` | `/app/data/access.db` | where SQLite lives **inside** the container |
| `FK_DATA_DIR` | `./data` | where the database lives **on the host** (the bind mount) |
| `FK_HOST_PORT` | `8070` | the port published on the host |
| `TZ` | `Europe/Berlin` | container timezone, which admin timestamps render against |

`docker-compose.yaml` substitutes each with a fallback, so a missing `.env`
still starts — it just starts with defaults.

### `.env` is read in two different places

This trips people up, so it is worth stating plainly:

1. **`docker compose`** reads it for `${VAR}` substitution in
   `docker-compose.yaml` — that is how the container gets its settings.
2. **Next.js itself** reads it when you run `npm run dev` / `npm start`
   *directly on your machine*, which is why local development picks it up with
   no extra setup.

Inside the container only (1) applies: `.env` is never copied into the image —
the builder copies an explicit list of files and `.env` is not on it — so the
container's settings come entirely from the compose `environment:` block.

A consequence worth knowing when testing locally: `.env` will override a
variable you think you unset on the command line, because Next loads the file
after your shell.

### `FK_PUBLIC_ORIGIN` is not optional in production

It must match the origin visitors actually type or scan. **The app cannot work
it out for itself**, and this is the single most confusing failure in the
deployment, so it is worth being precise about why:

A Next.js **route handler** builds its own origin from the address the container
is listening on — `http://localhost:3000` — *not* from the `Host` header the
reverse proxy forwards. Forwarding `Host` correctly does not change this.
Verified directly: with `Host: home.finnkrause.com`, `new URL("/", req.url)`
still evaluates to `http://localhost:3000/`.

So two things had to change:

- **Redirects no longer build absolute URLs at all.** `/api/access` sets a
  *relative* `Location` (`/#engagement`), which the browser resolves against the
  URL it actually requested. That is correct on any domain, behind any proxy,
  with no configuration. See `redirectTo` in `src/app/api/access/route.ts`.
  Middleware is the exception and may use absolute URLs — it builds `req.url`
  from the `Host` header, so its redirects come out relative anyway.
- **QR codes and copied admin links use `FK_PUBLIC_ORIGIN`**, because those must
  be absolute — they get printed onto cards and pasted into messages. If it is
  unset while `NODE_ENV=production`, the QR route returns **500 with an
  explanation rather than generating a PNG**. A printed QR pointing at
  `localhost` cannot be recalled, so guessing is worse than refusing.

`FK_PUBLIC_ORIGIN` is also the address shown on the gate screen. **If one
changes, change the other** — they are the same fact stored twice (`.env` and
the copy in `src/components/access/AccessScreen.tsx`).

### `FK_DB_PATH`

**Set it explicitly in production.** The default is relative to
`process.cwd()`, so a process started from a different working directory quietly
opens a *different, empty* database. Compose pins it.

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

The container has a healthcheck, and `./scripts/redeploy.sh` waits on it;
`docker compose ps` shows the state.

It probes **`/impressum`** — a page that already exists, is public, is statically
prerendered and records nothing. There is deliberately **no `/api/health`
route**: an endpoint whose only purpose is to be polled is one more thing
reachable from the outside, and this app's whole premise is that its surface is
small. The probe answers the question that actually matters in practice — is the
server accepting connections and serving pages.

It must never point at `/` or `/gate`. Those are the gate, and every request to
them writes a `gate_view` row; a healthcheck there would log a visitor every
thirty seconds forever, bury the real numbers and permanently skew the bounce
rate.

The trade-off: this is a liveness check, not a database check. A server that
serves pages but cannot open SQLite reports healthy. That is the price of not
having a dedicated endpoint, and it is the right trade here — a broken database
surfaces immediately on `/admin` and on the first real visit.

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
