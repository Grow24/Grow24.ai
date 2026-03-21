FROM node:22-alpine AS builder
LABEL "language"="nodejs"
LABEL "framework"="vite"

WORKDIR /src

COPY package*.json ./
RUN npm install

COPY . .

# Baked into HBMPONE client build (see npm run build → build:hbmpone).
# On Zeabur: set to your HBMP API public URL, e.g. https://your-hbmp-service.zeabur.app/api
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

FROM caddy:latest

WORKDIR /app

COPY --from=builder /src/dist /usr/share/caddy
COPY --from=builder /src/Caddyfile /etc/caddy/Caddyfile

EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
