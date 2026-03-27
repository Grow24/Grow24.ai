# HBMP Tools

Holistic Business Management Platform - Google Workspace Integration

## Project Structure

```
hbmp-tools/
└── docs/
    ├── frontend/    # React + Vite + TypeScript frontend
    └── backend/     # Express + Google APIs backend
```

## Quick Start

### Backend

```sh
cd docs/backend
npm install
npm start
```

Backend runs on: `http://localhost:3000`

### Frontend

```sh
cd docs/frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Features

- **Google Docs Integration**: List, create, view, and manage Google Docs
- **Google Slides Integration**: List, create, view, and manage Google Slides  
- **OAuth 2.0 Authentication**: Secure Google account connection
- **Persistent Sessions**: Token storage for automatic re-login

## First Time Setup

1. **Set up Google Cloud Project** with OAuth 2.0 credentials
2. **Configure environment variables** in both `docs/backend/.env` and `docs/frontend/.env`
3. **Install dependencies** in both frontend and backend
4. **Start backend** first, then frontend
5. **Authorize** your Google account at `http://localhost:3000/google/auth`

## Documentation

See individual README files in the respective folders for more details.
