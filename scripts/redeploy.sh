#!/usr/bin/env bash
#
# Full redeploy: stop the running container, rebuild the image, bring it back up
# and wait until it reports healthy.
#
#   ./scripts/redeploy.sh            rebuild and restart
#   ./scripts/redeploy.sh --no-cache rebuild from scratch (dependency changes)
#   ./scripts/redeploy.sh --prune    also delete dangling images afterwards
#   ./scripts/redeploy.sh --logs     follow the logs once it is up
#
# The database is a bind mount on ./data and is never touched by any of this.

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

NO_CACHE=""
PRUNE=0
FOLLOW=0
for arg in "$@"; do
  case "$arg" in
    --no-cache) NO_CACHE="--no-cache" ;;
    --prune)    PRUNE=1 ;;
    --logs)     FOLLOW=1 ;;
    -h|--help)  sed -n '3,12p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

# The Dockerfile uses a BuildKit cache mount for the npm cache, which is what
# keeps a rebuild from re-downloading every dependency over the Pi's network.
# BuildKit is the default in current Docker, but exporting these costs nothing
# and makes the build work on older daemons where it is not.
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# `docker compose` (v2 plugin) or the standalone `docker-compose` binary.
if docker compose version >/dev/null 2>&1; then
  compose() { docker compose "$@"; }
elif command -v docker-compose >/dev/null 2>&1; then
  compose() { docker-compose "$@"; }
else
  echo "Neither 'docker compose' nor 'docker-compose' is available." >&2
  exit 1
fi

step() { printf '\n\033[1;34m==>\033[0m %s\n' "$1"; }
fail() { printf '\n\033[1;31m!!\033[0m %s\n' "$1" >&2; }

# The bind mount will not create this for us with the right owner, and a missing
# host directory is the single most common reason this container starts and then
# cannot write its database.
mkdir -p data

# ---------------------------------------------------------------------------
# Data location guard.
#
# This project used to keep the database in a Docker *named volume*
# (homepage-data). It now uses a bind mount on ./data so the file is visible and
# backupable on the host. Those are different places: redeploying without moving
# the data leaves the old database stranded inside Docker and starts a brand new
# empty one, which silently invalidates every access code already handed out.
#
# So: if ./data has no database but an old named volume still exists, stop and
# say how to move it. This costs nothing once the migration has happened.
if [ ! -f data/access.db ]; then
  OLD_VOLUME="$(docker volume ls -q 2>/dev/null | grep -E '(^|_)homepage-data$' | head -n1 || true)"
  if [ -n "${OLD_VOLUME:-}" ]; then
    fail "Found the old Docker volume '$OLD_VOLUME', and ./data/access.db does not exist yet."
    cat <<EOF

  The database now lives on the host at ./data. Copy it across first —
  every access code you have handed out is in there:

    docker run --rm -v "$OLD_VOLUME":/from -v "$(pwd)/data":/to alpine sh -c 'cp -a /from/. /to/'

  Then run this script again. Once ./data/access.db exists this check is
  skipped, and you can delete the old volume with:

    docker volume rm "$OLD_VOLUME"

EOF
    exit 1
  fi
fi

step "Stopping the running instance"
# Not `down -v`: -v would remove volumes. The database is a bind mount so it
# would survive anyway, but the habit is worth not forming.
compose down --remove-orphans

step "Building the image${NO_CACHE:+ (no cache)}"
if ! compose build $NO_CACHE; then
  fail "Build failed — the previous container is already stopped."
  exit 1
fi

step "Starting"
compose up -d

step "Waiting for the container to report healthy"
CONTAINER="$(compose ps -q homepage)"
if [ -z "$CONTAINER" ]; then
  fail "No container was created."
  compose logs --tail=50
  exit 1
fi

# start_period in the healthcheck is 20s, so allow comfortably more than that.
for i in $(seq 1 60); do
  STATE="$(docker inspect -f '{{.State.Status}}' "$CONTAINER" 2>/dev/null || echo missing)"
  HEALTH="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$CONTAINER" 2>/dev/null || echo none)"

  if [ "$STATE" != "running" ]; then
    fail "Container is '$STATE', not running. Last 60 log lines:"
    compose logs --tail=60
    exit 1
  fi

  case "$HEALTH" in
    healthy)
      printf '\n\033[1;32m✓\033[0m Healthy after %ss.\n' "$i"
      break
      ;;
    unhealthy)
      fail "Container reported unhealthy. Last 60 log lines:"
      compose logs --tail=60
      exit 1
      ;;
  esac

  if [ "$i" -eq 60 ]; then
    fail "Timed out after 60s waiting for health. Last 60 log lines:"
    compose logs --tail=60
    exit 1
  fi
  printf '.'
  sleep 1
done

if [ "$PRUNE" -eq 1 ]; then
  step "Removing dangling images"
  docker image prune -f
fi

step "Status"
compose ps
echo
echo "  Local:    http://localhost:8070"
echo "  Database: $(pwd)/data/access.db"
echo

if [ "$FOLLOW" -eq 1 ]; then
  compose logs -f
fi
