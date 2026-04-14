# Dockerfile

# ─── Base ───────────────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl
RUN npm install -g pnpm

# ─── Dependencias ───────────────────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ─── Build ──────────────────────────────────────────────────────
FROM deps AS builder
COPY prisma ./prisma
RUN pnpm prisma generate
COPY . .
RUN pnpm build

# ─── Producción ─────────────────────────────────────────────────
FROM base AS production
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY prisma ./prisma
RUN pnpm prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main"]