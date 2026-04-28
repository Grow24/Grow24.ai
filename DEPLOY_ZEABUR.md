# Zeabur Deployment Guide (Frontend + Backend + Camunda)

This project should run as **multiple Zeabur services**:

- `web-frontend`: static app + routed sub-apps served by Caddy (root `Dockerfile`).
- `web-backend`: Express API in `backend/` (`backend/Dockerfile`)
- **Optional** `hbmp-api`: HBMPONE API in `HBMPONE/server` (`HBMPONE/server/Dockerfile`) — required for the HBMPONE app to load/save data
- **Camunda stack (recommended as separate services):**
  - `camunda-engine` (Camunda 7, port `8080`)
  - `camunda-mongo` (MongoDB)
  - `camunda-backend` (`camunda-mern-bpmn-setup/backend`)
  - `camunda-workers` (`camunda-mern-bpmn-setup/workers`)
  - `camunda-frontend` (`camunda-mern-bpmn-setup/frontend`)

## 0) CRITICAL: Use Docker deployment only

The root **`Dockerfile`** runs `npm run build` (main + HBMPONE + ivvychainv2 + Univer) and serves **`dist/`** with the repo **`Caddyfile`**:

- `/` → main SPA
- `/univer/` → Univer + chunks under `/univer/*`
- `/HBMPONE/` → HBMPONE + assets under `/HBMPONE/*`
- `/ivvychainv2/` → ivvychainv2 + assets under `/ivvychainv2/*`

In Zeabur → frontend → **Dockerfile** build, port **8080**.
Do **not** deploy this repo as a static-site build, because sub-app route handling requires runtime Caddy config from the Docker image.

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
   - **Camunda reverse proxy targets (runtime):**
     - `CAMUNDA_FRONTEND_UPSTREAM=https://<camunda-frontend-domain>`
     - `CAMUNDA_BACKEND_UPSTREAM=https://<camunda-backend-domain>`
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

After services are live:

- Frontend URL:
  - `/` should load main app
  - `/univer/` should load Univer app
  - `/HBMPONE/` should load the HBMPONE app (static assets must be JS/CSS, not HTML)
  - `/camunda-bpmn/` should load the Camunda BPMN app through the main domain
- API from frontend:
  - Chat should call `https://<backend-domain>/api/chat`
  - Leads should call `https://<backend-domain>/api/leads`
  - Send Email should call `https://<backend-domain>/api/send-email`
  - Camunda UI should call `/camunda-bpmn/api/*` and receive backend responses via Caddy proxy

## 3b) Camunda service setup (Zeabur)

Create these services and set the following:

1. **`camunda-engine` service**
   - Image: `camunda/camunda-bpm-platform:run-latest`
   - Port: `8080`
   - Verify: `https://<camunda-engine-domain>/camunda`

2. **`camunda-mongo` service**
   - Use Zeabur MongoDB service (recommended) or your own Mongo container.
   - Keep connection string ready for backend.

3. **`camunda-backend` service** (repo path: `camunda-mern-bpmn-setup/backend`)
   - Build/start from that folder (Node service)
   - Port: `4001` (or your chosen value)
   - Env:
     - `PORT=4001`
     - `MONGO_URI=<camunda-mongo-connection-string>`
     - `CAMUNDA_BASE_URL=https://<camunda-engine-domain>`
     - optional: `ALLOWED_TOPICS=checkInventory,chargeCard,shipOrder`

4. **`camunda-workers` service** (repo path: `camunda-mern-bpmn-setup/workers`)
   - Env:
     - `CAMUNDA_BASE_URL=https://<camunda-engine-domain>`
   - Start command: `npm start`

5. **`camunda-frontend` service** (repo path: `camunda-mern-bpmn-setup/frontend`)
   - Port: `5196` (or your chosen value)
   - Env:
     - `PUBLIC_URL=/camunda-bpmn`
     - `REACT_APP_API_BASE=/camunda-bpmn/api`
     - `BROWSER=none`
   - Start command: `npm start`

6. **Link Camunda to main frontend**
   - In `web-frontend` env, set:
     - `CAMUNDA_FRONTEND_UPSTREAM=https://<camunda-frontend-domain>`
     - `CAMUNDA_BACKEND_UPSTREAM=https://<camunda-backend-domain>`
   - Redeploy `web-frontend`.

## 4) Recommended CORS

`backend/server.js` already has CORS allow rules for common domains. Add your exact Zeabur frontend domain in allowed origins if needed.

## 5) Push commands

```bash
git add Caddyfile DEPLOY_ZEABUR.md
git commit -m "chore: add Zeabur Camunda proxy and deployment steps"
git push origin main
```
