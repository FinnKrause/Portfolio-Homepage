# Finn Krause — Portfolio

Personal portfolio site. Next.js 15 (App Router) · React 19 · TypeScript ·
Tailwind CSS v4 · framer-motion · SQLite.

The site sits behind a short access code, so it reaches people rather than
crawlers and scrapers. Codes are handed out on cards, CVs and QR links and are
managed from a private admin dashboard that also reports how each code is
performing.

## Quick start

```bash
npm install
cp .env.example .env    # optional locally; required for deployment
npm run dev
```

Then create a code and use it:

```bash
curl -s -X POST localhost:3000/api/admin/tokens -H 'Content-Type: application/json' -d '{"name":"Local dev"}'
```

Open `http://localhost:3000/?code=<the code>`. The admin dashboard is at
`/admin`.

| Command | Does |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm start` | serve the build |
| `npx tsc --noEmit` | typecheck (there is no lint step) |
| `npm run redeploy` | full Docker redeploy: stop, rebuild, start, wait for health |

## Documentation

| Document | Covers |
|---|---|
| [docs/architecture.md](docs/architecture.md) | request lifecycle, edge/node split, rendering model, module map |
| [docs/access-and-analytics.md](docs/access-and-analytics.md) | the gate, cookies, database schema, event flow, what every metric means |
| [docs/frontend.md](docs/frontend.md) | content & i18n, design tokens, components, image/video pipeline, motion |
| [docs/operations.md](docs/operations.md) | deployment, environment, backups, troubleshooting |

## Three things to know before changing anything

**The admin surface has no authentication of its own.** A reverse proxy is
responsible for `/admin` *and* `/api/admin/*`. That now includes a SQL console
at `/api/admin/query` that runs free-form **read and write** queries against the
live database — so a misconfigured proxy is a remote `DROP TABLE`. Never expose
the container directly.
→ [operations](docs/operations.md#the-admin-surface-has-no-lock-of-its-own)

**Configuration lives in `.env`** (`cp .env.example .env`). `FK_PUBLIC_ORIGIN`
must be set in production: the app cannot discover its own public origin — a
route handler sees the container's `localhost:3000`, not the proxied `Host` —
so QR codes and copied admin links read it from there, and the QR route refuses
to generate rather than print a code pointing at localhost.
→ [operations](docs/operations.md#environment-variables)

**`./data` on the host is the database.** It is a bind mount, and it holds every
access code you have handed out. Without it every redeploy starts from zero
codes and zero statistics.
→ [operations](docs/operations.md#the-data-lives-on-the-host)

**`next.config.mjs` must stay plain JavaScript.** `next start` reads it at
runtime; as TypeScript it needs the `typescript` package, which production
dependencies do not include, so Next tries to npm-install it at boot and the
container never serves. Also: an image `quality` value used by a component but
missing from that file is a runtime crash the build does not catch — the page
renders with an empty body.
→ [operations](docs/operations.md#the-image-is-two-stages) · [frontend](docs/frontend.md#images)

## Deployment

```bash
./scripts/redeploy.sh
```

Stops the running container, rebuilds, restarts, and waits for the healthcheck —
printing logs and failing loudly if it does not come up. `--no-cache`, `--prune`
and `--logs` are available; `npm run redeploy` is the same script.

Container listens on `3000`, published as `8070`, behind the reverse proxy. It
builds on a Raspberry Pi 4; the base image is pinned to Node 22 because that is
the oldest Node with a prebuilt `better-sqlite3` binary — on Node 20 the Pi
compiles SQLite from source and the build takes ten minutes instead of one.
→ [operations](docs/operations.md#build-time-on-the-pi)
