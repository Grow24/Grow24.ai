# HBMP Docs Platform — KT (New Intern Quick Guide)

## What this project is

HBMP Docs Platform is a document management web app where teams create business documents inside the system (Business Case, BRD, SRS, Test Plans). HBMP is the single source of truth; exports to Word/PDF/Google Docs are for review only.

## Core ideas (in plain English)

- **Projects** contain all work for a client/initiative.
- **Dockets** group documents (Business Case, Requirements, Test).
- **Templates** define document sections/fields.
- **Documents** are instances of templates with status workflow.
- **CLI levels**: Conceptual → Logical → Implementation. Certain docs unlock only after approvals.

## Tech stack

- **Frontend**: React + Vite + TypeScript + Tailwind + shadcn/ui
- **Backend**: Node.js 20 + Express + TypeScript + Prisma
- **Database**: SQLite (`server/prisma/dev.db`)
- **Optional**: Collabora CODE (Docker) for spreadsheet/presentation editing via WOPI

## Repository layout

- **client/**: React app
- **server/**: API + Prisma schema/migrations
- **docs/**: specs (system overview, domain model, API, UI)
- **docker-compose.collabora.yml**: Collabora setup

## First-time setup (local)

**Prerequisites:** Node.js 20+, npm, Git. Docker only if you need Collabora.

1. **Install dependencies**

- `cd server && npm install`
- `cd ../client && npm install`

2. **Initialize database**

- `cd server`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run prisma:seed`

3. **Start backend**

- `cd server`
- `npm run dev`
- API: http://localhost:4000/api

4. **Start frontend**

- `cd client`
- `npm run dev`
- App: http://localhost:5173

5. **Login**

- Fake auth in v1: any email/password works.

## Optional: Collabora (spreadsheets/presentations)

If you need the embedded office editor:

- `docker-compose -f docker-compose.collabora.yml up -d`
- Collabora: http://localhost:9980

## Daily dev flow

- Run backend and frontend in separate terminals.
- Create a project → Create a Business Case → Edit sections → Export.

## Workflow rules (important)

- **Logical** docs unlock only after Conceptual docs are Approved.
- **Implementation** docs unlock only after SRS is Approved.
- Example: SRS requires an Approved BRD.

## Common endpoints

- Health: `GET /api/health`
- Templates: `GET /api/templates`
- Projects: `GET /api/projects`

## Where to look first

- Architecture/specs: docs/
- API routes: server/src/routes/
- Controllers: server/src/controllers/
- UI pages: client/src/pages/
- UI components: client/src/components/

## Quick troubleshooting

- Blank UI or API errors: ensure backend is running on 4000.
- Template missing: rerun `npm run prisma:seed` in server.
- Port conflict: stop the process on 4000/5173 and restart.

## Notes for interns

- Keep edits inside HBMP; exports do not sync back.
- Start with Business Case flow; it is the most complete.
- Ask before modifying Prisma schema or migrations.
