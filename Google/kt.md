# HBMP Google Tools - Quick KT (Concise)

This folder contains Google Workspace integrations. Each tool is a separate full‑stack app (backend + frontend) that authenticates through Google Cloud Console using OAuth 2.0. The backend stores tokens in `tokens.json` after first login and uses the `googleapis` SDK.

## Common Google Cloud Console Steps (first time)

1. Create/select a Google Cloud project.
2. Configure OAuth consent screen (Internal/External) and add test users if in testing.
3. Enable required APIs (listed per tool below).
4. Create OAuth 2.0 Client ID (Web application).
5. Add the tool’s redirect URI.
6. Copy Client ID + Client Secret into the tool’s backend `.env`.
7. Start backend, then frontend, open the UI and complete OAuth.

## Tools in this folder

### Docs (Google Docs)

- Folder: `docs/`
- Backend port: 3000, Frontend port: 5174
- Redirect URI: `http://localhost:3000/google/oauth/callback`
- APIs to enable: Google Docs API, Google Drive API, Gmail API
- Run (stepwise commands):
  1. `cd docs/backend`
  2. `npm install`
  3. `npm run dev`
  4. New terminal → `cd docs/frontend`
  5. `npm install`
  6. `npm run dev`
  7. Open `http://localhost:5174` and connect account

### Sheets (Google Sheets)

- Folder: `sheets/`
- Backend port: 3001, Frontend port: 5175
- Redirect URI: `http://localhost:3001/google/oauth/callback`
- APIs to enable: Google Sheets API, Google Drive API, Gmail API
- Run (stepwise commands):
  1. `cd sheets/backend`
  2. `npm install`
  3. `npm run dev`
  4. New terminal → `cd sheets/frontend`
  5. `npm install`
  6. `npm run dev`
  7. Open `http://localhost:5175`

### Forms (Google Forms)

- Folder: `forms/`
- Backend port: 3002, Frontend port: 5176
- Redirect URI: `http://localhost:3002/google/callback`
- APIs to enable: Google Forms API, Google Drive API, Gmail API
- Run (stepwise commands):
  1. `cd forms`
  2. `chmod +x start.sh`
  3. `./start.sh`
  4. Open `http://localhost:5176`

### Slides (Google Slides)

- Folder: `slides/`
- Backend port: 3003, Frontend port: 5177
- Redirect URI: `http://localhost:3003/google/oauth/callback`
- APIs to enable: Google Slides API, Google Drive API
- Run (stepwise commands):
  1. `cd slides`
  2. `chmod +x start.sh`
  3. `./start.sh`
  4. Open `http://localhost:5177`

### Keep (Google Keep)

- Folder: `keep/`
- Backend port: 3004, Frontend port: 5178
- Redirect URI: `http://localhost:3004/google/oauth/callback`
- APIs to enable: Google Drive API (used for storage/permissions), Gmail API (emails)
- Run (stepwise commands):
  1. `cd keep`
  2. `chmod +x start.sh`
  3. `./start.sh`
  4. Open `http://localhost:5178`

### Meet (Google Calendar + Meet)

- Folder: `meet/`
- Backend port: 3005, Frontend port: 5179
- Redirect URI: `http://localhost:3005/google/oauth/callback`
- APIs to enable: Google Calendar API, Google Drive API, Gmail API
- Run (stepwise commands):
  1. `cd meet`
  2. `chmod +x start.sh`
  3. `./start.sh`
  4. Open `http://localhost:5179`

## How the tools connect to Google Cloud

- Each backend uses OAuth 2.0 Client ID/Secret + Redirect URI from Google Cloud.
- OAuth tokens are saved to `tokens.json` after first login and reused on restart.
- `googleapis` SDK is used to call Docs/Sheets/Forms/Slides/Calendar/Drive/Gmail APIs.

Notes:

- If OAuth fails, delete `tokens.json` and re‑authorize.
- Redirect URIs must match exactly.
