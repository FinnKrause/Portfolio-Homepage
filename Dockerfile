# syntax=docker/dockerfile:1
#
# Two stages, one base image.
#
#   builder  installs dependencies, runs `next build`, then drops devDependencies
#   runner   the image that ships: build output + production deps only
#
# Tuned for building *on* a Raspberry Pi 4 (arm64). Four things dominate build
# time there, in order; read the notes at each step before changing them.
#
#   1. Node 22, not 20.  better-sqlite3 is a native module. It ships prebuilt
#      binaries keyed by Node's ABI, and the lowest one published is ABI 127 =
#      Node 22. On Node 20 (ABI 115) there is no prebuild, so `npm ci` silently
#      falls back to `node-gyp rebuild` and compiles SQLite from source — which
#      on a Pi is most of a ten-minute build. On Node 22 it downloads
#      `node-v127-linuxmusl-arm64` and is done in seconds. Do not move this back
#      to an older Node to "be safe": it is the single most expensive mistake
#      available in this file.
#
#   2. One `npm ci`, not two.  An earlier revision had a separate `deps` stage
#      for production modules, which meant installing — and compiling — twice.
#      Installing once and running `npm prune --omit=dev` after the build gets
#      the same lean tree for roughly half the work.
#
#   3. The npm cache is a BuildKit cache mount, so a rebuild that does not
#      change package-lock.json re-uses the downloaded tarballs instead of
#      fetching them again over the Pi's network.
#
#   4. public/ never enters the builder.  It is ~140 MB of photography and video
#      that `next build` does not read (verified), so it is copied straight from
#      the build context into the runner. Routing it through the builder meant
#      moving it twice over SD-card I/O for nothing.
#
# **Both stages must sit on the identical base.** The native .node binary
# installed in `builder` is copied verbatim into `runner`; change one base
# without the other and you get a binary the runtime cannot load, which fails at
# container start rather than at build time.
#
# The file is named `Dockerfile`, not `dockerfile`. Docker looks for the
# capitalised name by default, and on a case-sensitive filesystem — i.e. the Pi
# this deploys to — the lowercase one is simply not found.

ARG NODE_IMAGE=node:22-alpine

# ---------------------------------------------------------------- builder
FROM ${NODE_IMAGE} AS builder
WORKDIR /app

# libc6-compat: glibc shims some Node native code expects on musl.
#
# Deliberately NO python3/make/g++. With Node 22 the better-sqlite3 prebuild
# exists for linuxmusl-arm64, so nothing is compiled and a C++ toolchain is
# ~200 MB of download the Pi does not need. If a future dependency bump ever
# removes that prebuild, `npm ci` will fail loudly on the missing compiler —
# at which point add `python3 make g++` to this line and accept the slower
# build, rather than wondering why the image stopped working.
RUN apk add --no-cache libc6-compat

# Manifests first, so this layer stays cached until a dependency actually
# changes. `npm ci` rather than `npm install`: it installs exactly what
# package-lock.json pins and fails if the lockfile is out of sync.
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --no-audit --no-fund

# Prove the native module actually loads, here, where the error is legible.
# Otherwise a bad binary surfaces as the container exiting at start-up with a
# stack trace nobody reads.
RUN node -e "require('better-sqlite3'); console.log('better-sqlite3 loads OK')"

# Only what the build reads. public/ is excluded on purpose — see note 4 above.
COPY tsconfig.json next.config.mjs postcss.config.mjs ./
COPY src ./src
RUN npm run build

# Shed devDependencies now the build is done. `prune` only removes; it does not
# reinstall or recompile, so the native binary installed above survives intact.
RUN npm prune --omit=dev


# ---------------------------------------------------------------- runner
FROM ${NODE_IMAGE} AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next        ./.next

# Straight from the build context, never through the builder.
COPY public ./public

# next.config.mjs is needed at *runtime*, not just at build: `next start` reads
# it, and the image optimizer needs its `images.qualities` list.
#
# It is plain JavaScript deliberately. As TypeScript, `next start` needs the
# `typescript` package to load it — which production deps do not include — so
# Next tries to npm-install it at boot and the container hangs on a network
# fetch instead of serving. That exact failure is what broke this deployment.
COPY package.json next.config.mjs ./

# The database lives here, on a bind mount from the host. Created so the path
# exists even if the mount is somehow absent: the app then writes to the
# container layer and loses data on redeploy, which is bad, but a container that
# refuses to start is harder to diagnose.
RUN mkdir -p /app/data

EXPOSE 3000

# Hits /api/health, which pings SQLite: a server answering requests but unable
# to open its database is not healthy, and a missing /app/data mount is the most
# likely thing to go wrong here. Deliberately NOT pointed at a page the gate
# logs — that would write a gate_view every 30s forever and bury the real
# visitor numbers.
#
# Probing with node rather than wget: node is guaranteed present in a node
# image, whereas the wget in Alpine's busybox has had inconsistent `--spider`
# support across versions.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/api/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))" || exit 1

CMD ["npm", "start"]
