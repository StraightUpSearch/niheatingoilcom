FROM node:20-slim AS base
WORKDIR /app

# Build stage - needs all deps including devDependencies for vite/esbuild
FROM base AS build
COPY package.json package-lock.json ./
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm ci
COPY . .
RUN npm run build

# Production deps only
FROM base AS prod-deps
COPY package.json package-lock.json ./
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm ci --omit=dev --omit=optional

# Production image
FROM base AS production
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
EXPOSE 5000
CMD ["node", "dist/index.js"]
