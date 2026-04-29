# Camunda MERN BPMN Setup

This folder contains a complete local + cloud setup:
- `docker-compose.yml` for Camunda 7 + MongoDB (local infra)
- `backend/` Express + Mongo API for draft/publish/start
- `workers/` Camunda external task workers
- `frontend/` CRA + bpmn.io editor

## Prerequisites
- Docker Desktop (or Docker Engine + Compose)
- Node.js 18+ and npm

## Local Run (same as root scripts)

### Option A: from repo root (recommended)
```bash
cd /home/bappu/websitenew/web
npm run dev:camunda
```

This starts:
- Camunda engine on `http://localhost:8080`
- Mongo on `mongodb://127.0.0.1:27018`
- Backend on `http://localhost:4001`
- Frontend through root proxy at `http://localhost:5173/camunda-bpmn/`

### Option B: manual per service

1) Start infra:
```bash
cd camunda-mern-bpmn-setup
docker compose up -d
```

2) Start backend:
```bash
cd backend
cp .env.example .env
npm install
PORT=4001 MONGO_URI=mongodb://127.0.0.1:27018/flows CAMUNDA_BASE_URL=http://localhost:8080 npm start
```

3) Start workers:
```bash
cd ../workers
cp .env.example .env
npm install
CAMUNDA_BASE_URL=http://localhost:8080 npm start
```

4) Start frontend:
```bash
cd ../frontend
npm install
HOST=0.0.0.0 PORT=5196 WDS_SOCKET_PORT=5196 BROWSER=none PUBLIC_URL=/camunda-bpmn REACT_APP_API_BASE=/camunda-bpmn/api npm start
```

5) Keep root Vite running for proxy path:
```bash
cd /home/bappu/websitenew/web
npm run dev
```

## Quick Functional Test
1. Open `http://localhost:5173/camunda-bpmn/`
2. Save Draft
3. Publish Latest Draft
4. Start process:
```bash
curl -X POST "http://localhost:4001/api/workflows/order_flow/start" \
  -H "Content-Type: application/json" \
  -d '{"variables":{"sku":{"value":"ABC-123","type":"String"}}}'
```
5. Confirm worker terminal handles `checkInventory`

## Zeabur Deployment (match local behavior)

Create separate Zeabur services:
1. **camunda-engine**  
   - image: `camunda/camunda-bpm-platform:run-latest`
   - port: `8080`

2. **camunda-mongo**  
   - managed MongoDB service (recommended)

3. **camunda-backend**  
   - service root: `camunda-mern-bpmn-setup/backend`
   - Dockerfile: `camunda-mern-bpmn-setup/backend/Dockerfile`
   - env:
     - `PORT=4001`
     - `MONGO_URI=<mongodb-connection-string>`
     - `CAMUNDA_BASE_URL=https://<camunda-engine-domain>`
     - `ALLOWED_TOPICS=checkInventory,sendEmail,httpRequest`

4. **camunda-workers**  
   - service root: `camunda-mern-bpmn-setup/workers`
   - Dockerfile: `camunda-mern-bpmn-setup/workers/Dockerfile`
   - env:
     - `CAMUNDA_BASE_URL=https://<camunda-engine-domain>`

5. **camunda-frontend**  
   - service root: `camunda-mern-bpmn-setup/frontend`
   - Dockerfile: `camunda-mern-bpmn-setup/frontend/Dockerfile`
   - env:
     - `PORT=5196`
     - `PUBLIC_URL=/camunda-bpmn`
     - `REACT_APP_API_BASE=/camunda-bpmn/api`

6. **web-frontend (main Caddy service)**  
   set:
   - `CAMUNDA_FRONTEND_UPSTREAM=https://<camunda-frontend-domain>`
   - `CAMUNDA_BACKEND_UPSTREAM=https://<camunda-backend-domain>`

Then open:
- `https://<main-domain>/camunda-bpmn/`

## Notes
- Backend validates BPMN and blocks unsafe elements (`scriptTask`, `callActivity`).
- Allowed topics are controlled by `ALLOWED_TOPICS`.
- Keep Camunda backend/workers running whenever you publish/start workflows.
