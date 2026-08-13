FROM node:20-alpine

WORKDIR /app

# native module build dependencies (needed for better-sqlite3 on arm64/musl)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm","start"]