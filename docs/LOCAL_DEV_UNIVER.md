# Run main site + Univer + HBMPONE on one port (localhost)

## What you get

| URL | App |
|-----|-----|
| `http://localhost:5173/` | Main website (Vite) |
| `http://localhost:5173/univer/` | Univer (proxied to the Univer dev server) |
| `http://localhost:5173/HBMPONE/` | HBMPONE client (proxied to HBMPONE Vite on **5175**) |

Root Vite listens on **5173** and:

- Forwards `/univer` → Univer on **3002** (path prefix stripped for Univer).
- Forwards `/HBMPONE` → HBMPONE client on **5175** (prefix **kept**; client `base` is `/HBMPONE/`).
- Forwards `/api` → HBMP Express server on **4000** (except `/api/send-email` → **3000**).

See root `vite.config.ts` → `server.proxy`.

## One-time setup (Univer)

From the repo root:

```bash
corepack enable && corepack prepare pnpm@10.24.0 --activate
cd univer && pnpm install
cd ..
```

## Start all three apps (recommended)

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

**HBMP API:** For `/HBMPONE/` to load documents from the backend, start the HBMP server in another terminal (default port **4000**):

```bash
cd HBMPONE/server && npm install && npm run dev
```

Then open:

- Main: [http://localhost:5173/](http://localhost:5173/)
- Univer: [http://localhost:5173/univer/](http://localhost:5173/univer/)
- HBMPONE: [http://localhost:5173/HBMPONE/](http://localhost:5173/HBMPONE/)

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

`UNIVER_PORT`, `HBMPONE_PORT`, and `HBMP_API_PORT` must match root `vite.config.ts` defaults (`3002`, `5175`, `4000`) unless you override them consistently.

## Troubleshooting

- **`Port 5173 is already in use`** — Stop the other root Vite (`npm run dev` / old `dev:both`). Or run `npm run dev:univer-hbmp` while keeping a single main dev server on 5173.
- **`Requested UNIVER_PORT 3002 is not available`** — Free port 3002 or set `UNIVER_PORT` and the same value in the Vite proxy target (env `UNIVER_PORT` is read in `vite.config.ts` for `/univer`).
- **Univer 404 or blank** — Ensure Univer finished starting (see `Local server: http://localhost:3002` in the terminal) before opening `/univer/`.
- **`Port 5175 is already in use` (HBMPONE)** — Stop the other process or set `HBMPONE_PORT` and the same value for root Vite (`HBMPONE_PORT` in `vite.config.ts` proxy).
- **HBMPONE API errors** — Run `HBMPONE/server` on port **4000** (or set `HBMP_API_PORT` on root Vite and `PORT` on the server to match).
