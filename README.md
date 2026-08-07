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

## Documentation

| Document | Covers |
|---|---|
| [docs/architecture.md](docs/architecture.md) | request lifecycle, edge/node split, rendering model, module map |
| [docs/access-and-analytics.md](docs/access-and-analytics.md) | the gate, cookies, database schema, event flow, what every metric means |
| [docs/frontend.md](docs/frontend.md) | content & i18n, design tokens, components, image/video pipeline, motion |
| [docs/operations.md](docs/operations.md) | deployment, environment, backups, troubleshooting |

## Three things to know before changing anything

**The admin surface has no authentication of its own.** A reverse proxy is
responsible for `/admin` *and* `/api/admin/*`. Never expose the container
directly. → [operations](docs/operations.md#the-admin-surface-has-no-lock-of-its-own)

**The `homepage-data` volume is the database.** Without it, every redeploy
starts from zero codes and zero statistics. → [operations](docs/operations.md#the-volume-is-the-data)

**An image `quality` value missing from `next.config.ts` is a runtime crash the
build does not catch** — the page renders with an empty body.
→ [frontend](docs/frontend.md#images)

## Deployment

```bash
docker compose up -d --build
```

Container listens on `3000`, published as `8070`, behind the reverse proxy.
