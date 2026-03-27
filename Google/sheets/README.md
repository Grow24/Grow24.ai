# HBMP Sheets Module

Google Sheets integration module for the Holistic Business Management Platform.

## Features

- ✅ Create, read, update, delete Google Sheets
- ✅ Template library with 10 professional spreadsheet templates
- ✅ Share and collaborate with team members
- ✅ Approval workflow system with email notifications
- ✅ Variables panel for quick data insertion
- ✅ Smart input with @ variable picker
- ✅ Professional UI with green theme

## Setup

### Backend Setup

1. Navigate to backend directory:

```bash
cd sheets/backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env`:

```
PORT=3001
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=http://localhost:3001/google/oauth/callback
```

4. Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd sheets/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables in `.env`:

```
VITE_API_BASE_URL=http://localhost:3001
```

4. Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5175`

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Sheets API
   - Google Drive API
   - Gmail API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:3001/google/oauth/callback`
5. Copy the Client ID and Client Secret to your `.env` files

## Usage

1. Open `http://localhost:5175` in your browser
2. Click "Connect your Google account" to authorize
3. Start creating and managing spreadsheets!

## Available Templates

- Budget Tracker
- Project Timeline
- Inventory Tracker
- Contact List
- Sales Tracker
- Employee Schedule
- Expense Report
- Task List
- Invoice
- Attendance Tracker

## API Endpoints

### Health Check

- `GET /` - Check server status

### Authentication

- `GET /google/auth` - Initiate OAuth flow
- `GET /google/oauth/callback` - OAuth callback handler

### Sheets Operations

- `GET /google/sheets/list` - List all sheets
- `POST /google/sheets/create` - Create new sheet
- `GET /google/sheets/:sheetId` - Get sheet content
- `POST /google/sheets/:sheetId/update` - Update sheet
- `DELETE /google/sheets/:sheetId` - Delete sheet
- `PATCH /google/sheets/:sheetId` - Rename sheet

### Collaboration

- `POST /google/sheets/:sheetId/share` - Share sheet with users
- `GET /google/sheets/:sheetId/permissions` - Get collaborators
- `DELETE /google/sheets/:sheetId/permissions/:permissionId` - Remove collaborator

### Approval Workflow

- `POST /google/sheets/:sheetId/submit-approval` - Submit for approval
- `GET /google/sheets/:sheetId/approval-status` - Get approval status
- `POST /google/sheets/:sheetId/approve` - Approve sheet
- `POST /google/sheets/:sheetId/reject` - Reject sheet

## Technology Stack

### Backend

- Node.js + Express
- Google APIs (googleapis)
- Gmail API for email notifications
- OAuth 2.0 authentication

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM

## Development

### Backend Development

```bash
cd sheets/backend
npm run dev  # Runs with nodemon for auto-reload
```

### Frontend Development

```bash
cd sheets/frontend
npm run dev  # Runs Vite dev server
```

### Build for Production

Frontend:

```bash
cd sheets/frontend
npm run build
```

## License

Part of HBMP Tools - Holistic Business Management Platform
