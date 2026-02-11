FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# ── Development ──────────────────────────────────────────────────
FROM base AS development
COPY . .
CMD ["npm", "run", "dev"]

# ── Build ────────────────────────────────────────────────────────
FROM base AS builder
COPY . .
RUN npm run build

# ── Production ───────────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
