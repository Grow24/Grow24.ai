# HBMP Slides Module

Google Slides integration for creating and managing presentations.

## Quick Start

```bash
cd slides
chmod +x start.sh
./start.sh
```

Or manually:

**Backend (Port 3003):**

```bash
cd backend
npm install
npm run dev
```

**Frontend (Port 5177):**

```bash
cd frontend
npm install
npm run dev
```

## Setup

1. Copy Google OAuth credentials from sheets or docs module
2. Update `backend/.env` with your credentials
3. Run `./start.sh`
4. Visit `http://localhost:5177`
5. Authorize Google access

## Features

✨ **Core Features:**

- Create new presentations
- List all presentations
- View presentations in embedded iframe
- Rename presentations
- Delete presentations
- Share presentations (coming soon)
- Template support (coming soon)

## API Endpoints

- `GET /google/auth` - Initiate OAuth
- `GET /google/slides/list` - List presentations
- `GET /google/slides/:id` - Get presentation details
- `POST /google/slides/create` - Create new presentation
- `POST /google/slides/:id/add-slide` - Add slide
- `POST /google/slides/:id/update-slide` - Update slide content
- `PATCH /google/slides/:id/rename` - Rename presentation
- `DELETE /google/slides/:id` - Delete presentation
- `POST /google/slides/:id/share` - Share presentation

## Technology Stack

- Backend: Node.js + Express + Google Slides API
- Frontend: React + TypeScript + Tailwind CSS
- Auth: OAuth 2.0

## Ports

- Backend: 3003
- Frontend: 5177
