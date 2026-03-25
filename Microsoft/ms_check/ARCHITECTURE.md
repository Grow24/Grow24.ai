# Microsoft Excel Viewer - Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         EXCEL VIEWER ARCHITECTURE                    │
│                  (Mirrors Google Sheets Implementation)              │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  excel.html (Main Excel Viewer)                             │   │
│  │                                                              │   │
│  │  ┌──────────────┐  ┌─────┐  ┌──────────────────────────┐  │   │
│  │  │   Sidebar    │  │ ▐▌  │  │    Viewer Container      │  │   │
│  │  │              │  │     │  │                          │  │   │
│  │  │ Search Box   │  │ R   │  │  Toolbar                 │  │   │
│  │  │ ┌──────────┐ │  │ e   │  │  ┌────────────────────┐ │  │   │
│  │  │ │  🔍      │ │  │ s   │  │  │ 📊 filename.xlsx   │ │  │   │
│  │  │ └──────────┘ │  │ i   │  │  │ [Open][Toggle]     │ │  │   │
│  │  │              │  │ z   │  │  └────────────────────┘ │  │   │
│  │  │ File List    │  │ e   │  │                          │  │   │
│  │  │ ┌──────────┐ │  │     │  │  Excel Iframe            │  │   │
│  │  │ │📊 File 1 │◄├──┼─────┼──┤  ┌────────────────────┐ │  │   │
│  │  │ └──────────┘ │  │ H   │  │  │                    │ │  │   │
│  │  │ ┌──────────┐ │  │ a   │  │  │  Office Online     │ │  │   │
│  │  │ │📊 File 2 │ │  │ n   │  │  │  Embed Viewer      │ │  │   │
│  │  │ └──────────┘ │  │ d   │  │  │                    │ │  │   │
│  │  │ ┌──────────┐ │  │ l   │  │  │  [Excel Content]   │ │  │   │
│  │  │ │📊 File 3 │ │  │ e   │  │  │                    │ │  │   │
│  │  │ └──────────┘ │  │     │  │  └────────────────────┘ │  │   │
│  │  └──────────────┘  └─────┘  └──────────────────────────┘  │   │
│  │                                                              │   │
│  │  Width: 200-600px (Resizable)      100% of remaining space │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                │ HTTP Requests
                                │ GET /api/excel/files
                                │ GET /api/excel/:fileId
                                │
┌───────────────────────────────▼───────────────────────────────────┐
│                              BACKEND                                │
│                          server.js (Express)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Authentication Endpoints:                                           │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  GET  /auth/login     → Microsoft OAuth redirect          │   │
│  │  GET  /auth/callback  → Token exchange & store            │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  Excel Endpoints:                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  GET  /api/excel/files      → List Excel files            │   │
│  │  GET  /api/excel/:fileId    → Get file details + embedUrl │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  OneDrive Endpoints:                                                 │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  GET  /api/drive      → List all OneDrive files           │   │
│  │  GET  /api/recent     → Recent files                       │   │
│  │  GET  /api/shared     → Shared with me                     │   │
│  │  GET  /api/search     → Search files                       │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  User Endpoints:                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  GET  /api/me         → User profile                       │   │
│  │  GET  /api/photo      → Profile photo                      │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                │ Microsoft Graph API
                                │ Authorization: Bearer {token}
                                │
┌───────────────────────────────▼───────────────────────────────────┐
│                        MICROSOFT GRAPH API                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Graph Endpoints Used:                                               │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  /me                                    → User info        │   │
│  │  /me/photo/$value                       → Profile photo    │   │
│  │  /me/drive/root/children                → List files       │   │
│  │  /me/drive/root/search(q='.xlsx')      → Search Excel     │   │
│  │  /me/drive/items/{id}                   → Get file         │   │
│  │  /me/drive/recent                       → Recent files     │   │
│  │  /me/drive/sharedWithMe                 → Shared files     │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  OAuth 2.0 Flow:                                                     │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  1. /oauth2/v2.0/authorize  → User consent                │   │
│  │  2. /oauth2/v2.0/token      → Access token                │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                │ Access OneDrive Data
                                │
┌───────────────────────────────▼───────────────────────────────────┐
│                           ONEDRIVE STORAGE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  User's OneDrive:                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  /Documents/                                               │   │
│  │    ├── Budget_2024.xlsx                                    │   │
│  │    ├── Sales_Report.xlsx                                   │   │
│  │    └── Invoice_Template.xls                                │   │
│  │                                                             │   │
│  │  /Projects/                                                │   │
│  │    └── Project_Timeline.xlsx                               │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────────────────┬───────────────────────────────────┘
                                │
                                │ Embed URL Generation
                                │
┌───────────────────────────────▼───────────────────────────────────┐
│                        OFFICE ONLINE EMBED                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Embed URL Format:                                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  https://view.officeapps.live.com/op/embed.aspx?          │   │
│  │    src={encodeURIComponent(file.webUrl)}                   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  Renders:                                                            │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │  - Full Excel spreadsheet                                  │   │
│  │  - Sheet tabs navigation                                   │   │
│  │  - Formula bar (read-only)                                 │   │
│  │  - Cell formatting                                         │   │
│  │  - Charts and pivot tables                                 │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘


DATA FLOW:
══════════

User Login Flow:
────────────────
1. User clicks "Sign in with Microsoft"
2. Backend redirects to Microsoft OAuth
3. User consents to permissions
4. Microsoft redirects to /auth/callback
5. Backend exchanges code for access token
6. Redirects to dashboard with token

Excel Viewing Flow:
───────────────────
1. User navigates to /excel.html?token={token}
2. Frontend calls GET /api/excel/files?token={token}
3. Backend calls Graph API search for .xlsx/.xls files
4. Backend constructs embedUrl for each file
5. Frontend displays file list in sidebar
6. User clicks a file
7. Frontend loads iframe with file.embedUrl
8. Office Online renders Excel in iframe


COMPARISON WITH GOOGLE SHEETS:
════════════════════════════════

Google Sheets Implementation:
┌─────────────────────────────────────┐
│ Frontend (React + TypeScript)       │
│   ↓                                  │
│ /google/sheets (Express API)        │
│   ↓                                  │
│ Google Drive API + Sheets API       │
│   ↓                                  │
│ Embed: sheet.webViewLink            │
└─────────────────────────────────────┘

Microsoft Excel Implementation:
┌─────────────────────────────────────┐
│ Frontend (Vanilla HTML + JS)        │
│   ↓                                  │
│ /api/excel/* (Express API)          │
│   ↓                                  │
│ Microsoft Graph API                 │
│   ↓                                  │
│ Embed: view.officeapps.live.com    │
└─────────────────────────────────────┘

SHARED PATTERNS:
• Resizable sidebar (200-600px)
• File list with search
• Active file highlighting
• Iframe embedding
• Toggle sidebar visibility
• Open in native app
• OAuth authentication
```
