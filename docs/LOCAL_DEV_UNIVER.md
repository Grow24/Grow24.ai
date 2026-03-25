# Run main site + Univer + HBMPONE + HBMP_DOCS_PLATFORM + ivvychainv2 + Microsoft + OpenStreetMaps on localhost

## What you get

| URL | App |
|-----|-----|
| `http://localhost:5173/` | Main website (Vite) |
| `http://localhost:5173/univer/` | Univer (proxied to the Univer dev server) |
| `http://localhost:5173/HBMPONE/` | HBMPONE client (proxied to HBMPONE Vite on **5175**) |
| `http://localhost:5173/HBMP_DOCS_PLATFORM/` | HBMP_DOCS_PLATFORM client (proxied to Vite on **5177**) |
| `http://localhost:5173/ivvychainv2/` | ivvychainv2 client (proxied to CRA dev server on **5176**) |
| `http://localhost:5173/Microsoft/` | Microsoft Graph viewer (proxied to **5180**) |
| `http://localhost:5173/OpenStreetMaps/` | OpenStreetMaps app (proxied to **5181**) |
| `http://localhost:5180/` | Microsoft Graph viewer (`Microsoft/ms_check`) |
| `http://localhost:5181/` | OpenStreetMaps static map app |

Root Vite listens on **5173** and:

- Forwards `/univer` → Univer on **3002** (path prefix stripped for Univer).
- Forwards `/HBMPONE` → HBMPONE client on **5175** (prefix **kept**; client `base` is `/HBMPONE/`).
- Forwards `/HBMP_DOCS_PLATFORM` → HBMP_DOCS_PLATFORM client on **5177** (prefix **kept**; client `base` is `/HBMP_DOCS_PLATFORM/`).
- Forwards `/ivvychainv2` → ivvychainv2 on **5176** (prefix stripped for CRA dev server).
- Forwards `/api` → HBMP Express server on **4000** (except `/api/send-email` → **3000**).

See root `vite.config.ts` → `server.proxy`.

## One-time setup (Univer + HBMPONE + HBMP_DOCS_PLATFORM + ivvychainv2 clients)

From the repo root:

```bash
corepack enable && corepack prepare pnpm@10.24.0 --activate
cd univer && pnpm install && cd ..
cd HBMPONE/client && npm install && cd ../..
cd HBMP_DOCS_PLATFORM/client && npm install && cd ../..
cd ivvychainv2 && npm install && cd ..
```

(`npm install` at the repo root does **not** install nested app dependencies — run the line above once.)

## Start all apps (recommended)

From the **repository root**:

```bash
npm install
npm run dev:all
```

**If you see `Port 5173 is already in use`:** you already have root Vite running (e.g. `npm run dev` in another terminal). Only one process can bind **5173**. Either:

- **Stop** the other dev server, then run `npm run dev:all` again, **or**
- **Keep** that server and start only Univer + HBMPONE (they use **3002** and **5175**):

  ```bash
  npm run dev:univer-hbmp
  ```

  Your existing main Vite must have been started with the same proxy env if you changed ports:

  `HBMPONE_PORT=5175 UNIVER_PORT=3002 HBMP_API_PORT=4000 npm run dev`

That runs:

1. `npm run dev` → root Vite on `5173` (with proxies above)
2. `npm run dev:univer` → Univer examples on `3002`
3. `npm run dev:hbmpone` → HBMPONE client on `5175` with `base=/HBMPONE/` and `VITE_API_URL=/api`
4. `npm run dev:hbmp-docs-platform` → HBMP_DOCS_PLATFORM client on `5177` with `base=/HBMP_DOCS_PLATFORM/` and `VITE_API_URL=/api`
5. `npm run dev:ivvychainv2` → ivvychainv2 CRA dev server on `5176` with `PUBLIC_URL=/ivvychainv2`
6. `npm run dev:microsoft` → Microsoft Graph Express server on `5180`
7. `npm run dev:openstreetmaps` → OpenStreetMaps static server on `5181`

**HBMP API:** For `/HBMPONE/` to load documents from the backend, start the HBMP server in another terminal (default port **4000**):

```bash
cd HBMPONE/server && npm install && npm run dev
```

Then open:

- Main: [http://localhost:5173/](http://localhost:5173/)
- Univer: [http://localhost:5173/univer/](http://localhost:5173/univer/)
- HBMPONE: [http://localhost:5173/HBMPONE/](http://localhost:5173/HBMPONE/)
- HBMP_DOCS_PLATFORM: [http://localhost:5173/HBMP_DOCS_PLATFORM/](http://localhost:5173/HBMP_DOCS_PLATFORM/)
- ivvychainv2: [http://localhost:5173/ivvychainv2/](http://localhost:5173/ivvychainv2/)
- Microsoft: [http://localhost:5180/](http://localhost:5180/)
- OpenStreetMaps: [http://localhost:5181/](http://localhost:5181/)

## MCP server (manual, interactive)

`mcp_server/mcp` uses an interactive scraper pipeline (not a web dev server). Start it when needed:

```bash
npm run dev:mcp-server
```

It runs `scrape.py` (expects terminal interaction and credentials in `mcp_server/mcp/.env`).

## Start main + Univer only

```bash
npm run dev:both
```

## Manual (separate terminals)

**Univer**

```bash
UNIVER_PORT=3002 npm run dev:univer
```

**Root Vite (with matching env)**

```bash
HBMPONE_PORT=5175 UNIVER_PORT=3002 HBMP_API_PORT=4000 npm run dev
```

**HBMPONE client (optional; or use `npm run dev:hbmpone`)**

```bash
cd HBMPONE/client && HBMPONE_PORT=5175 HBMPONE_BASE=/HBMPONE/ VITE_API_URL=/api npx vite
```

**HBMP_DOCS_PLATFORM client (optional; or use `npm run dev:hbmp-docs-platform`)**

```bash
cd HBMP_DOCS_PLATFORM/client && HBMP_DOCS_PORT=5177 HBMP_DOCS_BASE=/HBMP_DOCS_PLATFORM/ VITE_API_URL=/api npx vite
```

**ivvychainv2 client (optional; or use `npm run dev:ivvychainv2`)**

```bash
cd ivvychainv2 && HOST=0.0.0.0 PORT=5176 WDS_SOCKET_PORT=5176 BROWSER=none PUBLIC_URL=/ivvychainv2 npm start
```

`UNIVER_PORT`, `HBMPONE_PORT`, `HBMP_DOCS_PORT`, `IVVY_PORT`, and `HBMP_API_PORT` must match root `vite.config.ts` defaults (`3002`, `5175`, `5177`, `5176`, `4000`) unless you override them consistently.

## Troubleshooting

- **`ENOSPC: System limit for number of file watchers reached`** — Linux ran out of inotify watches (common with large repos). Root `vite.config.ts` ignores `univer/`, `HBMPONE/`, and `ivvychainv2/` for the main dev server; if it still happens, raise the limit (until reboot unless you persist sysctl):
  ```bash
  sudo sysctl fs.inotify.max_user_watches=524288
  ```
  Or add `fs.inotify.max_user_watches=524288` under `/etc/sysctl.d/`.
- **`Port 5173 is already in use`** — Stop the other root Vite (`npm run dev` / old `dev:both`). Or run `npm run dev:univer-hbmp` while keeping a single main dev server on 5173.
- **`Requested UNIVER_PORT 3002 is not available`** — Free port 3002 or set `UNIVER_PORT` and the same value in the Vite proxy target (env `UNIVER_PORT` is read in `vite.config.ts` for `/univer`).
- **Univer 404 or blank** — Ensure Univer finished starting (see `Local server: http://localhost:3002` in the terminal) before opening `/univer/`.
- **`Port 5175 is already in use` (HBMPONE)** — Stop the other process or set `HBMPONE_PORT` and the same value for root Vite (`HBMPONE_PORT` in `vite.config.ts` proxy).
- **`Port 5177 is already in use` (HBMP_DOCS_PLATFORM)** — Stop the other process or set `HBMP_DOCS_PORT` and the same value for root Vite (`HBMP_DOCS_PORT` in `vite.config.ts` proxy).
- **HBMPONE API errors** — Run `HBMPONE/server` on port **4000** (or set `HBMP_API_PORT` on root Vite and `PORT` on the server to match).
