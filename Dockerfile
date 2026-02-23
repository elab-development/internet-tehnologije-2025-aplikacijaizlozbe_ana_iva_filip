# 1. Stage za instalaciju zavisnosti
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# 2. Stage za build aplikacije
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Onemogućavamo Next.js telemetriju tokom build-a
ENV NEXT_TELEMETRY_DISABLED=1
ENV JWT_SECRET=prazna_vrednost_za_build
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
ENV NEXT_PUBLIC_API_URL=http://localhost:3000
RUN npm run build

# 3. Stage za pokretanje (Runner)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Kopiramo samo neophodne fajlove da bi slika bila lagana
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
