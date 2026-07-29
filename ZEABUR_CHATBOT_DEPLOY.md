# Zeabur — Chatbot Deploy Guide (Grow24.ai)

This guide gets the **PBMP chatbot** working on Zeabur.

## Architecture

| Service | Repo / path | Domain (current) | Role |
|---------|-------------|------------------|------|
| **Chat backend** | `Grow24/PBMPChatBot` → `pbmp-backend/` | `https://pbmpchatbotbackend.zeabur.app` | `/api/chat`, `/api/leads` |
| **Optional site backend** | `Grow24/Grow24.ai` → `backend/` | `https://grow24-backend.zeabur.app` | chat + leads + send-email |
| **Frontend** | `Grow24/Grow24.ai` → root `Dockerfile` | your frontend domain | Vite SPA (chat widget) |

**Use the working chat API today:**

```text
https://pbmpchatbotbackend.zeabur.app/api/chat
```

`grow24-backend.zeabur.app` still had deprecated `gemini-2.0-flash` until this repo’s `backend/server.js` is redeployed with `gemini-2.5-flash`.

---

## 1) Chat backend (already on Zeabur)

Service: **PBMPChatBot → pbmpchatbot**  
Repo: https://github.com/Grow24/PBMPChatBot  
Root directory: `pbmp-backend`  
Port: Zeabur `WEB_PORT` / `8080` (app listens on `PORT`)

### Variables (required)

```env
GEMINI_API_KEY=<your_key>
GEMINI_MODEL=gemini-2.5-flash
ASTRA_DB_API_ENDPOINT=<optional>
ASTRA_DB_APPLICATION_TOKEN=<optional>
PBMP_ASTRA_DB_COLLECTION=<optional>
SENDGRID_API_KEY=<optional; email only>
EMAIL_FROM=noreply@grow24.ai
NODE_ENV=production
```

### Verify

```bash
curl https://pbmpchatbotbackend.zeabur.app/
curl -X POST https://pbmpchatbotbackend.zeabur.app/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"messages":[{"role":"user","parts":[{"type":"text","text":"hi"}]}]}'
```

Success = streaming text (not `gemini-2.0-flash` error).

---

## 2) Frontend (Grow24.ai on Zeabur)

Service: root of https://github.com/Grow24/Grow24.ai  
Build: **Dockerfile** (not static site)  
Port: **8080**

### Build-time Variables (must set, then Rebuild)

Vite bakes `VITE_*` at **build** time. Runtime-only vars will **not** update the chatbot URL.

```env
BUILD_PROFILE=core
VITE_API_ENDPOINT=https://pbmpchatbotbackend.zeabur.app/api/chat
VITE_WHATSAPP_NUMBER=+919370239600
# Optional:
# VITE_SEND_EMAIL_ENDPOINT=https://grow24-backend.zeabur.app/api/send-email
# VITE_CLERK_PUBLISHABLE_KEY=pk_...
# VITE_API_URL=https://<hbmp-api>.zeabur.app/api
```

`BUILD_PROFILE=core` skips Univer and prevents `@univerjs/core#build` OOM failures on Zeabur Dev (2 vCPU / 4 GB).

### Deploy steps

1. Push latest `main` from this repo.
2. Zeabur → **grow24.ai** → **Settings** → Dockerfile section → **Load from GitHub** → **Save**  
   (Old override that runs `npm run build` rebuilds Univer and fails.)
3. **Variable** tab → set:
   - `BUILD_PROFILE=core`
   - `VITE_API_ENDPOINT=https://pbmpchatbotbackend.zeabur.app/api/chat`
4. **Overview** → **Redeploy**
5. Open `https://www.grow24.ai` → hard refresh → Network: chat must hit `pbmpchatbotbackend.zeabur.app`

---

## 3) Optional: fix `grow24-backend.zeabur.app`

If you want chat on the Grow24.ai `backend/` service too:

1. Service root: `backend/`
2. Push includes `model: gemini-2.5-flash` (or `GEMINI_MODEL` env).
3. Variables:

```env
GEMINI_API_KEY=<your_key>
GEMINI_MODEL=gemini-2.5-flash
ASTRA_DB_API_ENDPOINT=...
ASTRA_DB_APPLICATION_TOKEN=...
PBMP_ASTRA_DB_COLLECTION=pbmp_chat
SENDGRID_API_KEY=...
EMAIL_FROM=noreply@grow24.ai
PORT=3000
```

4. Redeploy backend, then you may point frontend at:

```env
VITE_API_ENDPOINT=https://grow24-backend.zeabur.app/api/chat
```

Until then, keep frontend on `pbmpchatbotbackend`.

---

## 4) Quick checklist

- [ ] `pbmpchatbotbackend` returns chat text (not 404 model error)
- [ ] Frontend Variable `VITE_API_ENDPOINT=https://pbmpchatbotbackend.zeabur.app/api/chat`
- [ ] Frontend **Rebuild** after setting Variable
- [ ] Browser Network shows `pbmpchatbotbackend` (not `grow24-backend` with old model)
- [ ] Optional: redeploy `grow24-backend` with Gemini 2.5 fix

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|--------|-----|
| `gemini-2.0-flash` 404 | Old backend image / wrong host | Use `pbmpchatbotbackend` or redeploy backend with 2.5 |
| Frontend still hits `grow24-backend` | Old Vite build | Set Variable + **Rebuild** frontend |
| Restart doesn’t help | Restart ≠ new code/build | Redeploy / Rebuild from Git |
| SendGrid credits error | Email only | Chat still works; fix SendGrid later |
