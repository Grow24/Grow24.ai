# Zeabur Deployment Guide (Frontend + Backend)

This project should run as **two or more Zeabur services**:

- `web-frontend`: static app + routed sub-apps (including `/n8n/*`) served by Caddy (root `Dockerfile`). n8n runs in the same container by default.
- `web-backend`: Express API in `backend/` (`backend/Dockerfile`)
- **Optional** `hbmp-api`: HBMPONE API in `HBMPONE/server` (`HBMPONE/server/Dockerfile`) — required for the HBMPONE app to load/save data

## 0) CRITICAL: Use Docker deployment only

The root **`Dockerfile`** runs `npm run build` (main + HBMPONE + ivvychainv2 + Univer) and serves **`dist/`** with the repo **`Caddyfile`**:

- `/` → main SPA
- `/univer/` → Univer + chunks under `/univer/*`
- `/HBMPONE/` → HBMPONE + assets under `/HBMPONE/*`
- `/ivvychainv2/` → ivvychainv2 + assets under `/ivvychainv2/*`
- `/n8n/` → proxied to internal n8n on `127.0.0.1:5678` by default (or to `N8N_UPSTREAM` if set)

In Zeabur → frontend → **Dockerfile** build, port **8080**.
Do **not** deploy this repo as a static-site build, because sub-app route handling and `/n8n/` proxying require runtime Caddy config from the Docker image.

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
   - Optional: `N8N_UPSTREAM=<host:port>` (runtime override). If omitted, frontend uses internal n8n process.
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

## 2c) n8n service (optional override for `/n8n/`)

1. Create another Zeabur service from the same repo only if you do not want bundled n8n.
2. Set service root to **`n8n/n8n-tesseract`** so Zeabur uses `n8n/n8n-tesseract/Dockerfile`.
3. Expose port **5678**.
4. Add environment variables:
   - `N8N_BASIC_AUTH_ACTIVE=true`
   - `N8N_BASIC_AUTH_USER=<your_username>`
   - `N8N_BASIC_AUTH_PASSWORD=<your_strong_password>`
   - `N8N_PORT=5678`
   - `N8N_PROTOCOL=https`
   - `N8N_HOST=<frontend-domain-without-protocol>`  
     Example: `myapp.zeabur.app`
   - `N8N_EDITOR_BASE_URL=https://<frontend-domain>/n8n/`
   - `WEBHOOK_URL=https://<frontend-domain>/n8n/`
   - `N8N_PATH=/n8n/`
   - `N8N_COMMUNITY_PACKAGES_ENABLED=true`
   - `N8N_CUSTOM_EXTENSIONS=/data/community_nodes`
   - `N8N_USER_FOLDER=/data`
5. Attach a persistent volume mounted at **`/data`** (to keep workflows/executions across redeploys).
6. Deploy.

## 3) Validate integration

After both services are live:

- Frontend URL:
  - `/` should load main app
  - `/univer/` should load Univer app
  - `/HBMPONE/` should load the HBMPONE app (static assets must be JS/CSS, not HTML)
  - `/n8n/` should load n8n login/editor through the frontend domain
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
