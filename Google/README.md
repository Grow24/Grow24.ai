# HBMP Tools - Holistic Business Management Platform

A comprehensive suite of tools for managing business documents, spreadsheets, and presentations using Google Workspace APIs.

## 🚀 Modules

### 📄 Docs Module

Google Docs integration with templates, approval workflows, and collaboration features.

**Features:**

- ✅ Create, edit, delete Google Docs
- ✅ 11 professional business templates
- ✅ Approval workflow with email notifications
- ✅ Share and collaborate with team members
- ✅ Variables panel with @ mention picker
- ✅ Document navigation and search

**Ports:**

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5174`

[📖 Full Documentation →](docs/README.md)

---

### 📊 Sheets Module

Google Sheets integration for data management and analysis.

**Features:**

- ✅ Create, edit, delete Google Sheets
- ✅ 10 spreadsheet templates (Budget, Inventory, Sales, etc.)
- ✅ Approval workflow with email notifications
- ✅ Share and collaborate with team members
- ✅ Variables panel for quick data insertion
- ✅ Smart input with @ variable picker

**Ports:**

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:5175`

[📖 Full Documentation →](sheets/README.md)

---

### 🎞️ Slides Module

Google Slides integration for creating and managing presentations.

**Features:**

- ✅ Create, copy-from-template, and delete presentations
- ✅ List and open presentations
- ✅ Rename and share presentations
- ✅ Add and update slide content via batch requests

**Ports:**

- Backend: `http://localhost:3003`
- Frontend: `http://localhost:5177`

[📖 Full Documentation →](slides/README.md)

---

## 🛠️ Technology Stack

### Backend

- Node.js + Express
- Google APIs (googleapis npm package)
- OAuth 2.0 authentication
- Gmail API for email notifications
- File-based token storage

### Frontend

- React 19
- TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router DOM

## 📦 Installation

### Prerequisites

- Node.js 20+
- npm or yarn
- Google Cloud Project with OAuth credentials

### Quick Start

1. Clone the repository:

```bash
git clone <repository-url>
cd hbmp-tools
```

2. Set up Docs module:

```bash
# Backend
cd docs/backend
npm install
cp .env.example .env  # Add your Google OAuth credentials
npm run dev

# Frontend (new terminal)
cd docs/frontend
npm install
npm run dev
```

3. Set up Sheets module:

```bash
# Backend
cd sheets/backend
npm install
cp .env.example .env  # Add your Google OAuth credentials
npm run dev

# Frontend (new terminal)
cd sheets/frontend
npm install
npm run dev
```

4. Set up Slides module:

```bash
# Backend
cd slides/backend
npm install
cp .env.example .env  # Add your Google OAuth credentials
npm run dev

# Frontend (new terminal)
cd slides/frontend
npm install
npm run dev
```

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable APIs:
   - Google Docs API
   - Google Sheets API
   - Google Drive API
   - Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/google/oauth/callback` (Docs)
   - `http://localhost:3001/google/oauth/callback` (Sheets)
   - `http://localhost:3003/google/auth/callback` (Slides)
6. Copy credentials to respective `.env` files

## 📚 Module Documentation

- [Docs Module](docs/README.md) - Detailed docs module documentation
- [Sheets Module](sheets/README.md) - Detailed sheets module documentation

## 🎨 Features Overview

### Template System

Both modules include professional templates:

- **Docs**: Competitive Analysis, Meeting Notes, Project Tracker, etc.
- **Sheets**: Budget Tracker, Inventory, Sales Tracker, etc.

### Approval Workflow

- Submit documents/sheets for approval
- Email notifications to approvers
- Approve/Reject with reasons
- Due date tracking
- Permission management

### Collaboration

- Share with team members
- Role-based access (Editor, Commenter, Viewer)
- Real-time collaboration via Google Workspace
- Remove collaborators

### Variables System

- Insert dynamic data with @ mentions
- Current date, user info, document/sheet metadata
- Copy-to-clipboard functionality
- Category-based organization

## 🗂️ Project Structure

```
hbmp-tools/
├── docs/                   # Google Docs module
│   ├── backend/           # Node.js Express API
│   │   ├── server.js      # Main server file
│   │   ├── googleClient.js # OAuth config
│   │   └── package.json
│   └── frontend/          # React TypeScript app
│       ├── src/
│       │   ├── pages/
│       │   │   └── Docs.tsx
│       │   └── components/
│       │       ├── TemplateDialog.tsx
│       │       ├── SmartInput.tsx
│       │       └── VariablePicker.tsx
│       └── package.json
├── sheets/                 # Google Sheets module
│   ├── backend/           # Node.js Express API
│   │   ├── server.js      # Main server file
│   │   ├── googleClient.js # OAuth config
│   │   └── package.json
│   └── frontend/          # React TypeScript app
│       ├── src/
│       │   ├── pages/
│       │   │   └── Sheets.tsx
│       │   └── components/
│       │       ├── TemplateDialog.tsx
│       │       ├── SmartInput.tsx
│       │       └── VariablePicker.tsx
│       └── package.json
└── README.md
```

## 🚦 Running All Services

To run all modules simultaneously:

```bash
# Terminal 1 - Docs Backend
cd docs/backend && npm run dev

# Terminal 2 - Docs Frontend
cd docs/frontend && npm run dev

# Terminal 3 - Sheets Backend
cd sheets/backend && npm run dev

# Terminal 4 - Sheets Frontend
cd sheets/frontend && npm run dev

# Terminal 5 - Slides Backend
cd slides/backend && npm run dev

# Terminal 6 - Slides Frontend
cd slides/frontend && npm run dev
```

Access the applications:

- Docs: http://localhost:5174
- Sheets: http://localhost:5175
- Slides: http://localhost:5177

## 📝 License

Part of HBMP Tools - Holistic Business Management Platform

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request
