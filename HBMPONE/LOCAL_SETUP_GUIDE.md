# HBMP Docs Platform - Local Setup Guide

Complete guide to run the HBMP document management platform with Collabora Office integration locally.

## Prerequisites

- **Node.js** 18+ and npm
- **Docker Desktop** (for Collabora CODE)
- **Git**
- **macOS/Linux/Windows** (tested on macOS)

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│  React Client   │────▶│  Express Server  │────▶│  SQLite Database    │
│  (Port 5173)    │     │  (Port 4000)     │     │  (dev.db)           │
└─────────────────┘     └──────────────────┘     └─────────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌──────────────────────────────────────────────────┐
│         Collabora CODE (Docker)                   │
│              (Port 9980)                          │
│  - Spreadsheet Editor (.xlsx)                     │
│  - Presentation Editor (.pptx)                    │
└──────────────────────────────────────────────────┘
```

## Step 1: Clone and Install

```bash
cd /path/to/HBMP_DOCS_PLATFORM

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Step 2: Database Setup

```bash
cd server

# Generate Prisma client
npx prisma generate

# Run migrations to create database schema
npx prisma migrate dev

# Seed the database with sample data (optional)
npx prisma db seed
```

This creates `server/prisma/dev.db` with the schema and sample templates.

## Step 3: Start Collabora CODE (Docker)

```bash
cd /path/to/HBMP_DOCS_PLATFORM

# Start Collabora in the background
docker-compose -f docker-compose.collabora.yml up -d

# Verify it's running
docker ps | grep hbmp-collabora

# Check logs (optional)
docker logs hbmp-collabora
```

**Collabora URL:** http://localhost:9980

**Configuration:**

- Allows connections from `host.docker.internal:4000` (your HBMP server)
- HTTP mode (no SSL) for local development
- Development mode with username/password: admin/admin

## Step 4: Start the Backend Server

```bash
cd server

# Development mode with auto-reload
npm run dev
```

**Server URL:** http://localhost:4000

**Key Endpoints:**

- `GET /api/health` - Health check
- `POST /api/projects` - Create project
- `GET /api/templates` - List templates
- `GET /wopi/files/:fileId` - WOPI CheckFileInfo
- `GET /wopi/files/:fileId/contents` - WOPI GetFile
- `POST /wopi/files/:fileId/contents` - WOPI PutFile

## Step 5: Start the Frontend Client

```bash
cd client

# Development mode with hot reload
npm run dev
```

**Client URL:** http://localhost:5173

## Step 6: Access the Application

1. **Open browser:** http://localhost:5173
2. **Login** (default user - no auth in MVP)
3. **Create a project**
4. **Create a document** from a template
5. **Open any section** to see the mini-docket
6. **Add items:**
   - Create Spreadsheet (Excel-like editor)
   - Create Presentation (PowerPoint-like editor)
   - Link Google Docs/Sheets/Slides
   - Upload files
   - Add web links

## Testing Collabora Integration

### Test Spreadsheet Editor

1. Open any document section
2. Click **"+ Add Item"** → **"Create Spreadsheet"**
3. Enter title (e.g., "Budget 2025")
4. Click **"Create Spreadsheet"**
5. Click **"Open"** button on the created item
6. Spreadsheet opens in Collabora editor
7. Make changes (add data, formulas, formatting)
8. Changes auto-save via WOPI protocol

### Test Presentation Editor

1. Open any document section
2. Click **"+ Add Item"** → **"Create Presentation"**
3. Enter title (e.g., "Project Proposal")
4. Click **"Create Presentation"**
5. Click **"Open"** button on the created item
6. Presentation opens in Collabora editor
7. Add slides, text, images
8. Changes auto-save via WOPI protocol

## File Storage

Created files are stored in:

```
server/uploads/wopi/
├── sheet_<timestamp>_<hash>.xlsx
├── slide_<timestamp>_<hash>.pptx
└── ...
```

## Troubleshooting

### Collabora Not Loading

```bash
# Check if container is running
docker ps | grep hbmp-collabora

# Check logs for errors
docker logs hbmp-collabora

# Restart Collabora
docker-compose -f docker-compose.collabora.yml restart

# Stop and start fresh
docker-compose -f docker-compose.collabora.yml down
docker-compose -f docker-compose.collabora.yml up -d
```

### Database Issues

```bash
cd server

# Reset database (WARNING: deletes all data)
rm prisma/dev.db
npx prisma migrate dev
npx prisma db seed
```

### Server Not Starting

```bash
cd server

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for port conflicts (port 4000)
lsof -i :4000
```

### Client Not Starting

```bash
cd client

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for port conflicts (port 5173)
lsof -i :5173
```

### WOPI Connection Errors

Check these in browser DevTools Console:

- ✅ WebSocket URL should be: `ws://localhost:9980/cool/<path>/ws`
- ✅ No `wss://` (secure WebSocket) - we're using HTTP
- ✅ WOPI endpoints respond with 200 OK
- ✅ Access token is "dev-token"

## Development Workflow

### Terminal 1: Backend

```bash
cd server
npm run dev
```

### Terminal 2: Frontend

```bash
cd client
npm run dev
```

### Terminal 3: Docker Logs (optional)

```bash
docker logs -f hbmp-collabora
```

## Stopping Everything

```bash
# Stop client (Ctrl+C in client terminal)

# Stop server (Ctrl+C in server terminal)

# Stop Collabora
docker-compose -f docker-compose.collabora.yml down
```

## Technology Stack

**Frontend:**

- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- React Router v6 (routing)
- TanStack Query (data fetching)

**Backend:**

- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite database

**Office Suite:**

- Collabora CODE (Docker)
- WOPI protocol (Web Application Open Platform Interface)

## Project Structure

```
HBMP_DOCS_PLATFORM/
├── client/                      # React frontend
│   ├── src/
│   │   ├── api/                 # API client functions
│   │   ├── components/          # Reusable components
│   │   │   └── document/        # Document-related components
│   │   │       ├── MiniDocketPanel.tsx      # Section mini-dockets
│   │   │       └── MiniDocketItemCard.tsx   # Docket item cards
│   │   ├── pages/
│   │   │   ├── OfficeViewer/    # Collabora iframe integration
│   │   │   └── ProjectDashboard/ # Document editor
│   │   └── types/               # TypeScript types
│   └── package.json
├── server/                      # Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── wopi.routes.ts   # WOPI protocol endpoints
│   │   │   └── office.routes.ts # Office helper endpoints
│   │   ├── controllers/         # Business logic
│   │   └── services/            # Service layer
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   └── dev.db              # SQLite database (generated)
│   └── uploads/wopi/            # File storage (auto-created)
├── docker-compose.collabora.yml # Collabora Docker config
└── LOCAL_SETUP_GUIDE.md        # This file
```

## Next Steps

- **Production Deployment:** Use HTTPS, implement real authentication, use PostgreSQL
- **User Management:** Add proper authentication and authorization
- **File Versioning:** Implement version history for documents
- **Collaborative Editing:** Multiple users editing simultaneously
- **Document Templates:** Create custom templates
- **Export/Import:** Export to PDF, import from various formats

## Support

For issues or questions:

1. Check logs in DevTools Console
2. Check server terminal for errors
3. Check Docker logs: `docker logs hbmp-collabora`
4. Review WOPI protocol documentation: https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/

## Success Checklist

- [ ] Server running on http://localhost:4000
- [ ] Client running on http://localhost:5173
- [ ] Collabora running on http://localhost:9980
- [ ] Can create projects and documents
- [ ] Can create spreadsheets and they open in Collabora
- [ ] Can create presentations and they open in Collabora
- [ ] Can edit and save changes
- [ ] Files stored in `server/uploads/wopi/`

---

**Happy Building! 🎉**
