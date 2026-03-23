# Zeabur Deployment Guide (Frontend + Backend)

This project should run as **two or more Zeabur services**:

- `web-frontend`: static app + `/univer/*` + `/HBMPONE/*` served by Caddy (root `Dockerfile`)
- `web-backend`: Express API in `backend/` (`backend/Dockerfile`)
- **Optional** `hbmp-api`: HBMPONE API in `HBMPONE/server` (`HBMPONE/server/Dockerfile`) — required for the HBMPONE app to load/save data

## 0) CRITICAL: Docker vs Zeabur static (`zeabur.json`)

### Option A — Docker (recommended)

The root **`Dockerfile`** runs `npm run build` (main + HBMPONE + Univer) and serves **`dist/`** with the repo **`Caddyfile`**:

- `/` → main SPA
- `/univer/` → Univer + chunks under `/univer/*`
- `/HBMPONE/` → HBMPONE + assets under `/HBMPONE/*`

In Zeabur → frontend → **Dockerfile** build, port **8080**.

### Option B — Zeabur static site (`zeabur.json` → `outputDirectory: dist`)

Static hosting falls back **unknown paths to the root `index.html`**. Then **`https://yoursite/HBMPONE/` loads the main Grow24 app**, which has no route → **“Not Found”** with the normal header (what you see in the browser).

**Fix:** This repo includes **`public/_redirects`** (copied to **`dist/_redirects`** on build). Zeabur applies Netlify-style rules so **`/HBMPONE/*` → `/HBMPONE/index.html`** (and the same for `/univer/*`). **Redeploy** after pulling; confirm the build produces **`dist/HBMPONE/index.html`**.

**Prefer Option A** if you still see blank sub-apps (JS chunks getting HTML).

### Custom Caddyfile on Zeabur

If you edited the platform Caddyfile manually, add the same **`/HBMPONE/`** handling as in the repo **`Caddyfile`**, or switch to the Dockerfile image that ships the file.

## 1) Frontend service

1. In Zeabur, create a service from this repo using the root `Dockerfile`.
2. Ensure port is `8080`.
3. Add environment variables (build-time where noted):
   - `VITE_CLERK_PUBLISHABLE_KEY=<your_key>`
   - `VITE_API_ENDPOINT=https://<backend-domain>/api/chat`
   - Optional: `VITE_SEND_EMAIL_ENDPOINT=https://<backend-domain>/api/send-email`
   - Optional: `VITE_WHATSAPP_NUMBER=+919370239600`
   - **HBMPONE (build-time):** `VITE_API_URL` — public URL of the HBMP API including `/api`, e.g. `https://<hbmp-service>.zeabur.app/api`. If you omit it, the client is built with `/api` (same-origin); that only works if you terminate `/api` on the same host (not configured in the default Caddyfile — use a full URL unless you add your own reverse proxy).
4. Deploy.

## 2) Backend service

1. Create another Zeabur service from the same repo.
2. Set the service root to `backend/` so Zeabur uses `backend/Dockerfile`.
3. Ensure port is `3000`.
4. Add backend environment variables:
   - `GEMINI_API_KEY`
   - `ASTRA_DB_API_ENDPOINT` (optional but recommended)
   - `ASTRA_DB_APPLICATION_TOKEN` (optional but recommended)
   - `PBMP_ASTRA_DB_COLLECTION` (optional; default is used if missing)
   - `SENDGRID_API_KEY` (required for `/api/send-email`)
   - `EMAIL_FROM` (verified sender)
   - `EMAIL_LOGO_URL` (optional)
   - `PORT=3000`
5. Deploy and verify `https://<backend-domain>/` returns backend status JSON.

## 2b) HBMPONE API service (optional)

1. Create a Zeabur service from the same repo.
2. Set the service root to **`HBMPONE/server`** so Zeabur uses `HBMPONE/server/Dockerfile`.
3. Expose port **4000** (or set `PORT` and match your public URL).
4. Set environment variables (at minimum):
   - `DATABASE_URL` — e.g. `file:./data/prod.db` with a **persistent volume** mounted at `/app/data` (SQLite), or use a hosted database and point Prisma accordingly.
   - `CORS_ORIGIN` — your **frontend** origin, e.g. `https://<frontend>.zeabur.app` (must allow the browser to call the HBMP API from the main site).
   - Google OAuth / other secrets as needed for `HBMPONE/server`.
5. Deploy. Use the service’s public HTTPS origin as **`VITE_API_URL`** on the **frontend** Docker build (see §1).

## 3) Validate integration

After both services are live:

- Frontend URL:
  - `/` should load main app
  - `/univer/` should load Univer app
  - `/HBMPONE/` should load the HBMPONE app (static assets must be JS/CSS, not HTML)
- API from frontend:
  - Chat should call `https://<backend-domain>/api/chat`
  - Leads should call `https://<backend-domain>/api/leads`
  - Send Email should call `https://<backend-domain>/api/send-email`

## 4) Recommended CORS

`backend/server.js` already has CORS allow rules for common domains. Add your exact Zeabur frontend domain in allowed origins if needed.

## 5) Push commands

```bash
git add Dockerfile Caddyfile .env.example backend/.env.example backend/Dockerfile DEPLOY_ZEABUR.md
git commit -m "chore: add complete Zeabur frontend/backend deployment setup"
git push origin main
```
