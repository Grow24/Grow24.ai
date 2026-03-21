# HBMP docs API — deploy as a separate Zeabur service (root directory: HBMPONE/server).
FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json* ./
RUN npm ci

COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

RUN npx prisma generate && npm run build

ENV NODE_ENV=production
ENV PORT=4000

EXPOSE 4000

# Set on Zeabur: DATABASE_URL, CORS_ORIGIN (your frontend URL, e.g. https://your-app.zeabur.app),
# GOOGLE_* for OAuth, etc.
CMD ["node", "dist/index.js"]
