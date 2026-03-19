FROM node:24 AS build

WORKDIR /src

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build:main

# Build Univer demo (static files end up in univer/examples/local)
RUN npm install -g pnpm@10.24.0
RUN cd univer && pnpm run install:ci
RUN cd univer && pnpm run build:static

FROM zeabur/caddy-static:latest

WORKDIR /usr/share/caddy

COPY --from=build /src/dist ./
COPY --from=build /src/univer/examples/local ./univer

COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 8080

