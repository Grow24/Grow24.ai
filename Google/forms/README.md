# Forms Module - HBMP Tools

> Complete Google Forms management system with OAuth 2.0 authentication, templates, collaboration, and approval workflows.

## 🚀 Features

### Core Features

- ✅ **OAuth 2.0 Authentication** - Secure Google account integration
- ✅ **Form CRUD Operations** - Create, read, rename, delete forms
- ✅ **Template System** - 10 pre-built form templates across 7 categories
- ✅ **Custom Template Builder** - Create and save your own form templates
- ✅ **Form Collaboration** - Share forms with team members (viewer/commenter/editor roles)
- ✅ **Approval Workflow** - Submit forms for approval with email notifications
- ✅ **Response Viewer** - View form responses directly in the app
- ✅ **Real-time Updates** - Auto-refresh form list and status

### Template Categories

- **Surveys** - Customer Feedback, Product Survey
- **Events** - Event Registration, Meeting RSVP
- **HR** - Job Application, Employee Evaluation
- **General** - Contact Form, Feedback Request
- **Education** - Quiz & Assessment
- **Sales** - Order Form
- **Custom** - Your saved templates

### Question Types Supported

1. Short Answer
2. Paragraph
3. Multiple Choice
4. Checkboxes
5. Dropdown
6. Linear Scale (1-10)
7. Date
8. Time

## 📋 Prerequisites

- **Node.js** v18+ and npm
- **Google Cloud Project** with Forms API enabled
- **OAuth 2.0 Credentials** (Client ID & Secret)

## 🔧 Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable APIs:
   - Google Forms API
   - Google Drive API v3
   - Gmail API (for approval emails)
4. Create OAuth 2.0 Credentials:
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:3002/google/callback`
   - Download credentials JSON
5. Add test users in OAuth consent screen (if app is in testing mode)

### 2. Backend Setup

```bash
cd forms/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `.env` file:**

```env
PORT=3002
CLIENT_ID=your-google-client-id
CLIENT_SECRET=your-google-client-secret
REDIRECT_URI=http://localhost:3002/google/callback
TOKEN_PATH=./tokens.json
```

### 3. Frontend Setup

```bash
cd forms/frontend

# Install dependencies
npm install
```

**Edit `.env` file (already created):**

```env
VITE_API_BASE_URL=http://localhost:3002
```

### 4. Start the Application

**Option 1: Use the start script (recommended)**

```bash
# From forms/ directory
chmod +x start.sh
./start.sh
```

**Option 2: Manual start**

Terminal 1 (Backend):

```bash
cd forms/backend
npm start
```

Terminal 2 (Frontend):

```bash
cd forms/frontend
npm run dev
```

### 5. First-time Authentication

1. Open browser to `http://localhost:5176`
2. Click "Connect Google Account" or create a new form
3. Login with your Google account
4. Grant permissions
5. You'll be redirected back to the app

## 🌐 API Endpoints

### Authentication

- `GET /google/auth` - Initiate OAuth flow
- `GET /google/callback` - OAuth callback handler

### Form Operations

- `GET /google/forms/list` - List all forms
- `POST /google/forms/create` - Create new form
- `GET /google/forms/:id` - Get form details
- `DELETE /google/forms/:id` - Delete form
- `PUT /google/forms/:id/rename` - Rename form
- `GET /google/forms/:id/responses` - Get form responses

### Collaboration

- `POST /google/forms/:id/share` - Share form with user
- `GET /google/forms/:id/collaborators` - List collaborators
- `DELETE /google/forms/:id/collaborators/:permissionId` - Remove collaborator

### Approval Workflow

- `POST /google/forms/:id/submit-approval` - Submit for approval
- `GET /google/forms/:id/approval-status` - Get approval status
- `POST /google/forms/:id/approve` - Approve form
- `POST /google/forms/:id/reject` - Reject form

## 🎨 Theme Customization

The Forms module uses an **orange/amber** color scheme:

- Primary: `#f97316` (orange-600)
- Secondary: `#ea580c` (orange-700)
- Accent: `#fb923c` (orange-400)

To customize, edit `forms/frontend/tailwind.config.js`.

## 📁 Project Structure

```
forms/
├── backend/
│   ├── server.js           # Express server with 15 API endpoints
│   ├── googleClient.js     # Google OAuth & API client
│   ├── package.json        # Backend dependencies
│   ├── .env.example        # Environment template
│   ├── .env                # Your credentials (not in git)
│   └── tokens.json         # OAuth tokens (auto-generated)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Forms.tsx   # Main forms page (1,369 lines)
│   │   ├── components/
│   │   │   ├── TemplateDialog.tsx      # Template gallery
│   │   │   └── CustomFormBuilder.tsx   # Custom template creator
│   │   ├── layouts/
│   │   │   └── AppLayout.tsx           # App shell
│   │   ├── main.tsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── public/             # Static assets
│   ├── index.html          # HTML template
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.ts      # Vite configuration
│   ├── tsconfig.json       # TypeScript config
│   └── tailwind.config.js  # Tailwind CSS config
├── README.md               # This file
└── start.sh                # Startup script

```

## 🔐 Security Notes

- **tokens.json** stores OAuth refresh tokens - never commit to git
- **.env** contains sensitive credentials - keep secure
- **Google Cloud Project** should have proper OAuth consent screen configuration
- **Test users** must be added in Google Cloud Console during development

## 🐛 Troubleshooting

### "Not authorized" error

- Make sure you've completed OAuth flow
- Check if `tokens.json` exists in `backend/`
- Try deleting `tokens.json` and re-authenticating

### Forms API not working

- Verify Google Forms API is enabled in Cloud Console
- Check if your Google account has permission to create forms
- Ensure OAuth scopes include `forms` and `forms.body`

### Email notifications not sending

- Verify Gmail API is enabled
- Check OAuth scopes include `gmail.send`
- Confirm sender email in server.js matches your Google account

### Template not saving

- Check browser console for errors
- Verify localStorage is enabled
- Try clearing browser cache and reloading

### Port already in use

- Backend: Change `PORT` in `.env`
- Frontend: Change port in `vite.config.ts`

## 📝 Usage Examples

### Create Form from Template

1. Click "+ New" button
2. Select "Start from template"
3. Choose a template (e.g., Customer Feedback Survey)
4. Form is created and ready to use

### Create Custom Template

1. Click "+ New" → "Start from template"
2. Click "Create New Template" button
3. Add questions using the form builder
4. Save template for future use

### Share Form with Team

1. Click 3-dot menu on any form
2. Select "Share"
3. Enter email and choose role
4. Click "Share" button

### Submit for Approval

1. Click 3-dot menu on any form
2. Select "Submit for Approval"
3. Add approvers (email addresses)
4. Customize message and due date
5. Click "Submit for Approval"
6. Approvers receive email notification

### Approve/Reject Form

1. Manager/Admin sees approval banner on pending forms
2. Click "Approve" or "Reject" button
3. Form status updates automatically
4. Submitter receives email notification

## 🆚 Differences from Sheets Module

| Feature              | Sheets (Green)                | Forms (Orange)                      |
| -------------------- | ----------------------------- | ----------------------------------- |
| **Primary Color**    | Green (#059669)               | Orange (#f97316)                    |
| **Ports**            | Backend: 3001, Frontend: 5175 | Backend: 3002, Frontend: 5176       |
| **Google API**       | Sheets API v4                 | Forms API v1                        |
| **Question Types**   | N/A                           | 8 supported types                   |
| **Templates**        | 10 templates                  | 10 templates (different categories) |
| **Custom Templates** | Spreadsheet-based             | Form/question-based                 |

## 📦 Dependencies

### Backend

- express ^4.18.2
- googleapis ^140.0.0
- cors ^2.8.5
- dotenv ^16.4.5
- fs-extra ^11.2.0

### Frontend

- react ^19.0.0
- react-dom ^19.0.0
- typescript ^5.6.2
- vite ^6.0.11
- tailwindcss ^3.4.17
- @vitejs/plugin-react ^4.3.4

## 🤝 Integration with HBMP Tools

This module is part of the **HBMP Tools** ecosystem:

- **Docs Module** - Document management (ports 3000/5174)
- **Sheets Module** - Spreadsheet management (ports 3001/5175)
- **Forms Module** - Form management (ports 3002/5176) ← You are here

All modules follow the same architecture pattern with OAuth, CRUD, templates, and approval workflows.

## 📄 License

Part of HBMP Tools project.

## 🎯 Next Steps

1. **Test all features** - Create, edit, share, approve forms
2. **Customize templates** - Add your own form templates
3. **Configure email** - Update sender email in server.js
4. **Production deployment** - Update redirect URIs and environment variables
5. **User training** - Share this README with your team

---

**Need Help?** Check `TROUBLESHOOTING.md` or review the Sheets module for similar implementation patterns.
