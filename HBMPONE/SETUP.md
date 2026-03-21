# HBMP Docs Platform - Setup Instructions

## Quick Start

### 1. Backend Setup

```bash
cd server
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Backend will run on http://localhost:4000

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend will run on http://localhost:5173

### 3. Access the Application

1. Open http://localhost:5173
2. Login with any email/password (fake auth for v1)
3. Create a project
4. Create a Business Case document
5. Edit sections with rich text
6. Export to DOCX/PDF

## Project Structure

```
hbmp-docs-platform/
├── docs/              # System specifications
├── server/            # Backend API
│   ├── prisma/        # Database schema & migrations
│   └── src/           # Express routes & controllers
└── client/            # React frontend
    └── src/           # Pages & components
```

## Key Features Implemented

✅ Project management
✅ Business Case template with 11 sections
✅ Rich text editor (TipTap)
✅ Document status workflow
✅ Export to DOCX/PDF
✅ CLI stepper (Conceptual/Logical/Implementation)
✅ Zoho-inspired dashboard layout

## Next Steps

- Add BRD template
- Add SRS template
- Implement "Generate SRS from BRD"
- Add UAT, SIT, UTP templates
- Google Docs export integration
- Authentication system

## Troubleshooting

**Database errors:**
- Delete `server/prisma/dev.db` and run `npm run prisma:migrate` again

**Port conflicts:**
- Backend: Change PORT in `server/.env`
- Frontend: Change port in `client/vite.config.ts`

**CORS errors:**
- Ensure backend is running on port 4000
- Check `server/src/config/env.ts` for CORS settings

