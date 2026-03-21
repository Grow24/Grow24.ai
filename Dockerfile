FROM node:22-alpine AS builder
LABEL "language"="nodejs"
LABEL "framework"="vite"

WORKDIR /src

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM caddy:latest

WORKDIR /app

COPY --from=builder /src/dist /usr/share/caddy

RUN mkdir -p /etc/caddy && cat > /etc/caddy/Caddyfile << 'EOF'
:8080 {
	root * /usr/share/caddy
	@unsafePath {
		path /.git/* /univer/.git/* /node_modules/* /vendor/* /.venv/*
	}
	respond @unsafePath 404

	@univerExact path /univer
	redir @univerExact /univer/ 308

	@univerAssets path_regexp univer_assets ^/univer/.*\.(js|mjs|css|map|json|wasm|ttf|woff|woff2|svg|png|jpg|jpeg|gif|webp)$
	handle @univerAssets {
		root * /usr/share/caddy
		try_files {path} =404
		file_server
	}

	handle_path /univer/* {
		root * /usr/share/caddy/univer
		try_files {path} {path}/ /index.html
		file_server
	}

	@univerRootAssets {
		path_regexp univer_root ^/(chunk-.*\.js(\.map)?|lazy-.*\.js(\.map)?|very-lazy-.*\.js(\.map)?|vs/.*|worker\.js|lazy\.js)$
	}
	handle @univerRootAssets {
		root * /usr/share/caddy/univer
		try_files {path} =404
		file_server
	}

	handle {
		try_files {path} /index.html
		file_server
	}

	log {
		output stderr
	}
}
EOF

EXPOSE 8080

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]

