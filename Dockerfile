FROM node:24 AS build

WORKDIR /src

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm run build

FROM zeabur/caddy-static:latest

WORKDIR /usr/share/caddy

COPY --from=build /src/dist ./

COPY Caddyfile /etc/caddy/Caddyfile

