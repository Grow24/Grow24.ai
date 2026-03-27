# Meet Module - HBMP Tools

> Complete Google Meet & Calendar management system with OAuth 2.0 authentication, templates, invitations, and approval workflows.

## 🚀 Features

### Core Features

- ✅ **OAuth 2.0 Authentication** - Secure Google account integration
- ✅ **Calendar Integration** - View and manage Google Calendar events
- ✅ **Google Meet Creation** - Automatically create Meet links for meetings
- ✅ **Meeting CRUD Operations** - Create, read, update, delete meetings
- ✅ **Template System** - 18 pre-built meeting templates across 6 categories
- ✅ **Email Invitations** - Send beautiful HTML email invitations with meeting details
- ✅ **Approval Workflow** - Submit meetings for approval with email notifications
- ✅ **Attendee Management** - Add, remove, and track meeting attendees
- ✅ **Real-time Updates** - Auto-refresh meeting list and status
- ✅ **Meeting History** - View upcoming and past meetings

### Meeting Template Categories

- **Team & Collaboration** - Daily Standup, Team Meeting, All-Hands, Sprint Retrospective
- **1-on-1** - Individual meetings, Manager 1-on-1, Mentoring sessions
- **Client & External** - Client Calls, Demos, Sales Calls
- **Interviews & HR** - Technical Interview, Behavioral Interview, Performance Review
- **Planning & Strategy** - Brainstorming, Planning Meetings, Workshops
- **Quick & Informal** - Quick Sync, Coffee Chat

## 📋 Prerequisites

- **Node.js** v18+ and npm
- **Google Cloud Project** with Calendar API enabled
- **OAuth 2.0 Credentials** (Client ID & Secret)

## 🔧 Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable APIs:
   - **Google Calendar API**
   - **Google Drive API v3** (for some features)
   - **Gmail API** (for sending invitations and approval emails)
4. Create OAuth 2.0 Credentials:
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:3005/google/oauth/callback`
   - Download credentials JSON
5. Add test users in OAuth consent screen (if app is in testing mode)

### 2. Backend Setup

```bash
cd meet/backend

# Install dependencies
npm install

# Create .env file with your credentials
nano .env
```

**Edit `.env` file:**

```env
PORT=3005
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3005/google/oauth/callback
```

### 3. Frontend Setup

```bash
cd meet/frontend

# Install dependencies
npm install
```

The frontend is pre-configured to use `http://localhost:3005` as the API base URL.

### 4. Start the Application

**Option 1: Use the start script (recommended)**

```bash
# From meet/ directory
chmod +x start.sh
./start.sh
```

**Option 2: Manual start**

Terminal 1 (Backend):

```bash
cd meet/backend
npm start
```

Terminal 2 (Frontend):

```bash
cd meet/frontend
npm run dev
```

### 5. First-time Authentication

1. Open browser to `http://localhost:5179`
2. Click "Connect Google Account"
3. Login with your Google account
4. Grant permissions for Calendar and Gmail
5. You'll be redirected back to the app

## 🌐 API Endpoints

### Authentication

- `GET /google/auth` - Initiate OAuth flow
- `GET /google/oauth/callback` - OAuth callback handler
- `GET /auth/status` - Check authentication status

### Meeting Operations

- `GET /google/calendar/events` - List upcoming meetings
- `GET /google/calendar/events/all` - List all meetings (past 30 days + upcoming)
- `POST /google/calendar/events` - Create new meeting with Google Meet link
- `GET /google/calendar/events/:id` - Get meeting details
- `PUT /google/calendar/events/:id` - Update meeting
- `DELETE /google/calendar/events/:id` - Delete meeting

### Invitations & Notifications

- `POST /google/calendar/events/:id/send-invitation` - Send email invitations

### Approval Workflow

- `POST /google/calendar/events/:id/submit-approval` - Submit for approval
- `POST /google/calendar/events/:id/approve` - Approve meeting
- `POST /google/calendar/events/:id/reject` - Reject meeting

### Calendar Management

- `GET /google/calendar/list` - List user's calendars

## 🎨 Theme Customization

The Meet module uses a **teal/cyan** color scheme:

- Primary: `#06b6d4` (cyan-500)
- Secondary: `#0891b2` (cyan-600)
- Accent: `#22d3ee` (cyan-400)

To customize, edit `meet/frontend/tailwind.config.js`.

## 📁 Project Structure

```
meet/
├── backend/
│   ├── server.js           # Express server with 14 API endpoints
│   ├── googleClient.js     # Google OAuth & API client
│   ├── package.json        # Backend dependencies
│   ├── .env.example        # Environment template
│   ├── .env                # Your credentials (not in git)
│   └── tokens.json         # OAuth tokens (auto-generated)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── Meet.tsx    # Main meetings page
│   │   ├── components/
│   │   │   └── TemplateDialog.tsx  # Template gallery
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

### Calendar API not working

- Verify Google Calendar API is enabled in Cloud Console
- Check if your Google account has permission to create events
- Ensure OAuth scopes include `calendar` and `calendar.events`

### Email notifications not sending

- Verify Gmail API is enabled
- Check OAuth scopes include `gmail.send`
- Confirm sender email matches your Google account

### Google Meet links not appearing

- Make sure you're using the correct API endpoint
- Check that `conferenceDataVersion: 1` is set in the request
- Verify your Google Workspace or personal Google account supports Meet

### Port already in use

- Backend: Change `PORT` in `.env`
- Frontend: Change port in `vite.config.ts`
- Check for other processes: `lsof -ti:3005 | xargs kill -9`

## 📝 Usage Examples

### Create Meeting from Template

1. Click "Use Template" button
2. Select a template (e.g., Team Standup, Client Call)
3. Review pre-filled details
4. Adjust time, attendees, etc.
5. Click "Create Meeting"

### Create Custom Meeting

1. Click "+ New Meeting" button
2. Fill in meeting details
3. Add attendees (optional)
4. Set start and end times
5. Enable/disable calendar invitations
6. Click "Create Meeting"

### Send Meeting Invitations

1. Click 3-dot menu on any meeting
2. Select "Send Invitations"
3. Add recipient email addresses
4. Click "Send Invitations"
5. Recipients receive beautifully formatted emails

### Submit for Approval

1. Click 3-dot menu on any meeting
2. Select "Submit for Approval"
3. Add approver email addresses
4. Add optional message
5. Click "Submit for Approval"
6. Approvers receive email notification with approve/reject buttons

### Join Meeting

1. Click on a meeting with Google Meet link (🎥 icon)
2. Click "Join Meeting" button in the details panel
3. Or use the 3-dot menu → "Join Meeting"

## 🆚 Comparison with Other Modules

| Feature              | Forms (Orange)                | Meet (Teal/Cyan)                |
| -------------------- | ----------------------------- | ------------------------------- |
| **Primary Color**    | Orange (#f97316)              | Cyan (#06b6d4)                  |
| **Ports**            | Backend: 3002, Frontend: 5176 | Backend: 3005, Frontend: 5179   |
| **Google API**       | Forms API v1, Drive v3        | Calendar API v3, Gmail v1       |
| **Main Purpose**     | Form creation & management    | Meeting & calendar management   |
| **Templates**        | 10 form templates             | 18 meeting templates            |
| **Key Feature**      | Custom question builder       | Google Meet link generation     |
| **Collaboration**    | Form sharing & permissions    | Meeting invitations & attendees |

## 📦 Dependencies

### Backend

- express ^4.18.2
- googleapis ^118.0.0
- cors ^2.8.5
- dotenv ^16.0.3
- fs-extra ^11.1.1

### Frontend

- react ^19.0.0
- react-dom ^19.0.0
- typescript ^5.2.2
- vite ^5.0.8
- tailwindcss ^3.4.0
- @vitejs/plugin-react ^4.2.1

## 🤝 Integration with HBMP Tools

This module is part of the **HBMP Tools** ecosystem:

- **Docs Module** - Document management (ports 3000/5174) - Blue
- **Sheets Module** - Spreadsheet management (ports 3001/5175) - Green
- **Forms Module** - Form management (ports 3002/5176) - Orange
- **Slides Module** - Presentation management (ports 3003/5177) - Red
- **Keep Module** - Notes management (ports 3004/5178) - Yellow
- **Meet Module** - Meeting management (ports 3005/5179) - Teal/Cyan ← You are here

All modules follow the same architecture pattern with OAuth, CRUD, templates, and approval workflows.

## 🎯 Feature Highlights

### 1. Google Meet Integration

Every meeting created through the app automatically gets a Google Meet link, making it easy for team members to join virtual meetings.

### 2. Beautiful Email Templates

Email invitations and approval requests use professionally designed HTML templates with:
- Meeting details clearly displayed
- Direct join links
- Attendee lists
- Responsive design

### 3. Template System

Save time with 18 pre-built templates for common meeting types:
- **Quick meetings**: 15-minute standups
- **Standard meetings**: 30-60 minute team calls
- **Extended sessions**: 2-hour workshops

### 4. Approval Workflow

Optional approval process for meeting requests:
- Submit meeting for review
- Approvers receive email with approve/reject buttons
- Track approval status
- Email notifications for submitter

### 5. Meeting History

View both upcoming and past meetings:
- Filter between "Upcoming" and "All" views
- See past meetings from last 30 days
- Visual indicators for past events

## 📄 License

Part of HBMP Tools project.

## 🎯 Next Steps

1. **Test all features** - Create, schedule, invite, approve meetings
2. **Customize templates** - Adjust meeting durations and descriptions
3. **Configure email** - Update sender information in server.js
4. **Production deployment** - Update redirect URIs and environment variables
5. **User training** - Share this README with your team

---

**Need Help?** Check the troubleshooting section above or review other modules (Forms, Sheets) for similar implementation patterns.

## 🌟 Tips & Best Practices

- **Use templates** for recurring meeting types to save time
- **Enable notifications** when creating meetings to automatically send calendar invites
- **Set appropriate meeting durations** - templates provide good defaults
- **Add descriptions** to provide context and agenda for attendees
- **Test Meet links** before important meetings
- **Use approval workflow** for large or important meetings that need review

## 🔄 Updates & Roadmap

Future enhancements may include:
- Recurring meetings support
- Meeting analytics and reporting
- Integration with other HBMP modules
- Calendar sync across multiple calendars
- Meeting recordings management
- Custom meeting reminders

---

Built with ❤️ as part of the HBMP Tools - Holistic Business Management Platform

