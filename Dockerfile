# Production Dockerfile for TaxGeniusPro
# Tech Stack: Next.js 15.5.3, Node.js 20, PostgreSQL, Redis, MinIO, Clerk Auth, Prisma

FROM node:20-alpine AS builder

WORKDIR /app

# Accept build arguments for dummy env vars (prevents build failures, properly formatted)
ARG RESEND_API_KEY=re_123456789abcdefghijklmnop
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2xlcmsuZXhhbXBsZS5jb20k
ARG CLERK_SECRET_KEY=sk_test_abcdefghijklmnopqrstuvwxyz1234567890ABCD
ARG DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy?schema=public
ARG REDIS_URL=redis://localhost:6379
ARG NODE_ENV=production

# Install dependencies for native modules (sharp, prisma, argon2, etc.)
RUN apk add --no-cache libc6-compat python3 make g++ openssl openssl-dev

# Copy package files and Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies needed for build) and generate Prisma client
RUN npm ci --legacy-peer-deps --include=dev && \
    npx prisma generate

# Copy source code
COPY . .

# Set build-time environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV DOCKER_BUILD=true
ENV SKIP_ENV_VALIDATION=true
ENV DATABASE_URL=${DATABASE_URL}
ENV REDIS_URL=${REDIS_URL}
ENV RESEND_API_KEY=${RESEND_API_KEY}
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
ENV CLERK_SECRET_KEY=${CLERK_SECRET_KEY}

# Build Next.js application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache libc6-compat openssl

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/sharp ./node_modules/sharp

# Create upload directories with proper permissions
RUN mkdir -p /app/uploads && \
    chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3005

ENV PORT=3005
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
