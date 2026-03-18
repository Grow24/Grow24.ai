FROM node:22-alpine
LABEL "language"="nodejs"
LABEL "framework"="univer"

WORKDIR /src

RUN npm install -g pnpm@10.24.0

COPY . .

RUN pnpm install

RUN pnpm build

RUN pnpm build:demo

FROM zeabur/caddy-static

COPY --from=0 /src/examples/local /usr/share/caddy

EXPOSE 8080