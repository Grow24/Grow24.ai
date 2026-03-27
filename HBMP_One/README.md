# HBMP Docs Platform

A comprehensive document management platform for creating and managing business documentation through Conceptual → Logical → Implementation levels.

## 🎯 Overview

HBMP Docs Platform allows users to create structured business documents (Business Case, BRD, SRS, Test Plans) entirely within the platform. Documents can be exported to Google Docs, Word, or PDF for review, but HBMP remains the single source of truth.

## 🏗️ Architecture

- **Backend**: Node.js 20 + Express + TypeScript + Prisma + SQLite
- **Frontend**: React + Vite + TypeScript + shadcn/ui + Tailwind CSS
- **Monorepo**: Separate `server/` and `client/` folders

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn

### Backend Setup

```bash
cd server
npm install
npm run dev
```

Backend runs on http://localhost:4000

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on http://localhost:5173

## 📁 Project Structure

```
hbmp-docs-platform/
├── docs/           # System specifications
├── server/         # Backend API
└── client/         # Frontend React app
```

## 📚 Documentation

See `docs/` folder for:
- System overview
- Domain model
- API specification
- UI/UX specifications

## 🎨 Features (MVP)

- ✅ Project management
- ✅ Business Case document creation & editing
- ✅ Rich text editing with toolbar
- ✅ Document status workflow (Draft → Review → Approved)
- ✅ Export to DOCX/PDF
- 🔄 BRD, SRS, UAT, SIT, UTP (coming soon)

## 📝 License

Proprietary

