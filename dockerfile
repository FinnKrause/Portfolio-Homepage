# Two stages, one base image.
#
# The split exists for one reason: better-sqlite3 is a native module and has to
# be compiled, which needs python3/make/g++. Those are build tools, not runtime
# tools — shipping them (plus every devDependency) in the image that actually
# runs in production is ~300 MB of attack surface for no benefit.
#
# Both stages sit on the identical base, so the .node binary compiled in the
# builder is valid when copied into the runner. Do not change one stage's base
# without changing the other's: a mismatch produces a binary the runner cannot
# load, and the container fails at startup rather than at build time.

FROM node:20-alpine AS builder

WORKDIR /app

# Native module build dependencies (better-sqlite3 on arm64/musl).
RUN apk add --no-cache python3 make g++

# `npm ci` rather than `npm install`: it installs exactly what package-lock.json
# pins and fails if the lockfile is out of sync, so an image built today matches
# one built six months ago. `npm install` silently resolves newer versions.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Drop devDependencies now that the build is done. The native better-sqlite3
# binary is a runtime dependency and survives this.
RUN npm prune --omit=dev


FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next       ./.next
COPY --from=builder /app/public      ./public
COPY --from=builder /app/package.json ./
# Required at *runtime*, not just at build: `next start` reads it, and the
# image optimizer needs `images.qualities` — a missing quality value is a
# runtime crash that renders the page with an empty body (see docs/frontend.md).
COPY --from=builder /app/next.config.ts ./

EXPOSE 3000

CMD ["npm", "start"]
