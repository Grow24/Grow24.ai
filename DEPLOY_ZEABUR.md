# Zeabur Deployment Guide (Frontend + Backend)

This project should run as **two Zeabur services**:

- `web-frontend`: static app + `/univer/*` served by Caddy (root `Dockerfile`)
- `web-backend`: Express API in `backend/` (`backend/Dockerfile`)

## 1) Frontend service

1. In Zeabur, create a service from this repo using the root `Dockerfile`.
2. Ensure port is `8080`.
3. Add environment variables:
   - `VITE_CLERK_PUBLISHABLE_KEY=<your_key>`
   - `VITE_API_ENDPOINT=https://<backend-domain>/api/chat`
   - Optional: `VITE_SEND_EMAIL_ENDPOINT=https://<backend-domain>/api/send-email`
   - Optional: `VITE_WHATSAPP_NUMBER=+919370239600`
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

## 3) Validate integration

After both services are live:

- Frontend URL:
  - `/` should load main app
  - `/univer/` should load Univer app
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
