FROM node:20-alpine

# better-sqlite3 is a native module and needs a toolchain to build.
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
# `ci` builds exactly the lockfile, so a deploy can't silently pick up a
# different dependency tree than the one this was tested against.
RUN npm ci

COPY . .

RUN npm run build

# The database lives here; docker-compose mounts a volume over it.
RUN mkdir -p /app/data
VOLUME ["/app/data"]

EXPOSE 3000

CMD ["npm","start"]
