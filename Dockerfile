FROM node:24 AS build
WORKDIR /src
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
# Build main app
RUN npm run build:main
# Build Univer static files
RUN npm install -g pnpm@10.24.0
RUN cd univer && pnpm run install:ci
RUN cd univer && pnpm run build:static
# Final stage - serve with Caddy
FROM zeabur/caddy-static:latest
WORKDIR /usr/share/caddy
# Copy main app dist
COPY --from=build /src/dist ./
# Copy Univer static files to /univer subdirectory
COPY --from=build /src/univer/examples/local ./univer
# Copy custom Caddyfile for routing
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 8080

