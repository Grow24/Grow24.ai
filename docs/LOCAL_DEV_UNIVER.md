# Run main site + Univer on one port (localhost)

## What you get

| URL | App |
|-----|-----|
| `http://localhost:5173/` | Main website (Vite) |
| `http://localhost:5173/univer/` | Univer (proxied to the Univer dev server) |

Vite listens on **5173** and forwards anything under `/univer` to **Univer on port 3002** (see `vite.config.ts` → `server.proxy`).

## One-time setup (Univer)

From the repo root:

```bash
corepack enable && corepack prepare pnpm@10.24.0 --activate
cd univer && pnpm install
cd ..
```

## Start both apps (recommended)

From the **repository root**:

```bash
npm install
npm run dev:both
```

That runs:

1. `npm run dev` → Vite on `5173`
2. `npm run dev:univer` → Univer examples on `3002` (with `UNIVER_PORT=3002` so it matches the proxy)

Then open:

- Main: [http://localhost:5173/](http://localhost:5173/)
- Univer: [http://localhost:5173/univer/](http://localhost:5173/univer/) (use a **new tab** if you like)

## Manual (two terminals)

**Terminal 1**

```bash
UNIVER_PORT=3002 npm run dev:univer
```

**Terminal 2**

```bash
UNIVER_PORT=3002 npm run dev
```

`UNIVER_PORT` must match `vite.config.ts` (default `3002`).

## Troubleshooting

- **`Port 5173 is already in use`** — Stop whatever is using 5173, or temporarily change `server.port` in `vite.config.ts`.
- **`Requested UNIVER_PORT 3002 is not available`** — Free port 3002 or set `UNIVER_PORT` and the same value in the Vite proxy target (env `UNIVER_PORT` is read in `vite.config.ts` for `/univer`).
- **Univer 404 or blank** — Ensure Univer finished starting (see `Local server: http://localhost:3002` in the terminal) before opening `/univer/`.
