##########  builder  ##########
FROM node:20 AS builder
WORKDIR /app

# exact pnpm that matches your lockfile
RUN corepack enable && corepack prepare pnpm@10.11.0 --activate

# 1. install *all* deps (dev + prod) so we can compile
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 2. copy the source and build it
COPY . .
# Make sure the prisma directory is properly copied
COPY prisma ./prisma/
RUN npx prisma generate 
# Generate OpenAPI YAML file
RUN npm run openapi:gen
RUN pnpm run build
# 3. drop dev-deps we no longer need
RUN pnpm prune --prod       

##########  runtime  ##########
FROM node:20 AS runtime
WORKDIR /app

# Install corepack in the runtime stage if needed
RUN corepack enable

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Copy Prisma schema and generated client for runtime usage
COPY --from=builder /app/prisma ./prisma
# Copy OpenAPI docs
COPY --from=builder /app/src/docs ./dist/docs

CMD ["node", "dist/server.js"]
