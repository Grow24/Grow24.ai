# HBMP Meet Module - API Structure Documentation

## Overview

The HBMP Meet module uses a **RESTful API architecture** with 3 main service layers:

1. **OBS Recording Services** (9 endpoints)
2. **Google Calendar/Meet Services** (18 endpoints)
3. **Authentication Services** (3 endpoints)

**Base URL:** `http://localhost:3005`

---

## 🎥 OBS Recording API

### WebSocket Connection

#### Connect to OBS Studio

```http
POST /obs/connect
```

**Purpose:** Establish WebSocket connection to OBS Studio

**Response:**

```json
{
  "success": true,
  "message": "Connected to OBS Studio"
}
```

**Implementation:** `backend/obsService.js` → `connectOBS()`

---

#### Disconnect from OBS

```http
POST /obs/disconnect
```

**Purpose:** Close WebSocket connection to OBS Studio

**Response:**

```json
{
  "success": true,
  "message": "Disconnected from OBS"
}
```

---

#### Check Connection Status

```http
GET /obs/status
```

**Purpose:** Get current OBS connection status

**Response:**

```json
{
  "connected": true,
  "host": "localhost",
  "port": 4455
}
```

---

### Recording Control

#### Start Recording

```http
POST /obs/recording/start
```

**Purpose:** Start OBS recording

**Response:**

```json
{
  "success": true,
  "message": "Recording started"
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Not connected to OBS",
  "hint": "Make sure OBS is running with WebSocket enabled on port 4455"
}
```

**Implementation:** `backend/obsService.js` → `startRecording()`

---

#### Stop Recording

```http
POST /obs/recording/stop
```

**Purpose:** Stop current recording

**Response:**

```json
{
  "success": true,
  "outputPath": "/Users/username/Videos/recording_2024-11-03_14-30-00.mkv"
}
```

---

#### Get Recording Status

```http
GET /obs/recording/status
```

**Purpose:** Get current recording state

**Response:**

```json
{
  "isRecording": true,
  "isPaused": false,
  "recordingTime": "00:05:30"
}
```

---

#### Pause Recording

```http
POST /obs/recording/pause
```

**Purpose:** Pause current recording

**Response:**

```json
{
  "success": true,
  "message": "Recording paused"
}
```

---

#### Resume Recording

```http
POST /obs/recording/resume
```

**Purpose:** Resume paused recording

**Response:**

```json
{
  "success": true,
  "message": "Recording resumed"
}
```

---

### OBS Information

#### Get OBS Info

```http
GET /obs/info
```

**Purpose:** Get OBS version and system stats

**Response:**

```json
{
  "success": true,
  "version": "30.0.0",
  "websocketVersion": "5.0.0",
  "platform": "macos",
  "stats": {
    "fps": 60,
    "cpuUsage": 12.5,
    "memoryUsage": 234.5
  }
}
```

---

## 📅 Google Calendar/Meet API

### Authentication

#### Initiate Google OAuth

```http
GET /google/auth
```

**Purpose:** Start Google OAuth 2.0 authentication flow

**Response:** Redirects to Google consent screen

**Scopes Required:**

- `https://www.googleapis.com/auth/calendar`
- `https://www.googleapis.com/auth/calendar.events`
- `https://www.googleapis.com/auth/gmail.send`
- `https://www.googleapis.com/auth/meetings.space.created`
- `https://www.googleapis.com/auth/meetings.space.readonly`

**Implementation:** `backend/googleClient.js` → `getAuthUrl()`

---

#### OAuth Callback

```http
GET /google/oauth/callback?code={authCode}
```

**Purpose:** Handle OAuth callback and store tokens

**Flow:**

1. Exchange auth code for access/refresh tokens
2. Save tokens to `backend/tokens.json`
3. Redirect to frontend with success message

**Response:** Redirects to `http://localhost:5179` with success page

---

#### Check Auth Status

```http
GET /auth/status
```

**Purpose:** Check if user is authenticated

**Response:**

```json
{
  "authorized": true
}
```

---

### Meeting Operations

#### List Upcoming Meetings

```http
GET /google/calendar/events
```

**Purpose:** Get list of upcoming meetings

**Query Parameters:**

- `timeMin` - Start time (default: now)
- `maxResults` - Max events to return (default: 50)

**Response:**

```json
{
  "events": [
    {
      "id": "event123",
      "summary": "Team Standup",
      "description": "Daily team sync",
      "start": {
        "dateTime": "2025-11-04T10:00:00Z",
        "timeZone": "America/New_York"
      },
      "end": {
        "dateTime": "2025-11-04T10:15:00Z",
        "timeZone": "America/New_York"
      },
      "htmlLink": "https://calendar.google.com/calendar/event?eid=...",
      "hangoutLink": "https://meet.google.com/abc-defg-hij",
      "conferenceData": {
        "entryPoints": [
          {
            "entryPointType": "video",
            "uri": "https://meet.google.com/abc-defg-hij",
            "label": "abc-defg-hij"
          }
        ],
        "conferenceSolution": {
          "name": "Google Meet"
        }
      },
      "attendees": [
        {
          "email": "user1@example.com",
          "responseStatus": "accepted"
        },
        {
          "email": "user2@example.com",
          "responseStatus": "needsAction"
        }
      ],
      "status": "confirmed",
      "creator": {
        "email": "organizer@example.com"
      },
      "organizer": {
        "email": "organizer@example.com"
      }
    }
  ]
}
```

**Implementation:** `backend/server.js` line 344

---

#### List All Meetings

```http
GET /google/calendar/events/all
```

**Purpose:** Get all meetings (past 30 days + upcoming)

**Query Parameters:**

- `timeMin` - Start time (default: 30 days ago)
- `maxResults` - Max events to return (default: 100)

**Response:** Same structure as `/google/calendar/events`

**Implementation:** `backend/server.js` line 373

---

#### Create New Meeting

```http
POST /google/calendar/events
```

**Purpose:** Create new meeting with Google Meet link

**Request Body:**

```json
{
  "summary": "Team Meeting",
  "description": "Weekly sync meeting",
  "startTime": "2025-11-04T10:00:00",
  "endTime": "2025-11-04T11:00:00",
  "attendees": ["user1@example.com", "user2@example.com"],
  "sendNotifications": true,
  "addMeet": true
}
```

**Response:**

```json
{
  "id": "event123",
  "summary": "Team Meeting",
  "description": "Weekly sync meeting",
  "hangoutLink": "https://meet.google.com/abc-defg-hij",
  "start": {
    "dateTime": "2025-11-04T10:00:00Z"
  },
  "end": {
    "dateTime": "2025-11-04T11:00:00Z"
  },
  "conferenceData": {
    "entryPoints": [
      {
        "entryPointType": "video",
        "uri": "https://meet.google.com/abc-defg-hij"
      }
    ]
  },
  "attendees": [
    {
      "email": "user1@example.com"
    }
  ]
}
```

**Implementation:** `backend/server.js` line 403

---

#### Get Single Meeting

```http
GET /google/calendar/events/:eventId
```

**Purpose:** Get details of a specific meeting

**Parameters:**

- `eventId` - Calendar event ID

**Response:** Single event object (same structure as list response)

**Implementation:** `backend/server.js` line 466

---

#### Update Meeting

```http
PUT /google/calendar/events/:eventId
```

**Purpose:** Update existing meeting

**Parameters:**

- `eventId` - Calendar event ID

**Request Body:**

```json
{
  "summary": "Updated Team Meeting",
  "description": "Updated description",
  "startTime": "2025-11-04T11:00:00",
  "endTime": "2025-11-04T12:00:00",
  "attendees": ["user1@example.com", "user3@example.com"],
  "sendNotifications": true
}
```

**Response:** Updated event object

**Implementation:** `backend/server.js` line 508

---

#### Delete Meeting

```http
DELETE /google/calendar/events/:eventId?sendNotifications=true
```

**Purpose:** Delete a meeting

**Parameters:**

- `eventId` - Calendar event ID

**Query Parameters:**

- `sendNotifications` - Send cancellation emails (default: false)

**Response:**

```json
{
  "success": true,
  "message": "Meeting deleted successfully"
}
```

**Implementation:** `backend/server.js` line 567

---

### Email & Invitations

#### Send Meeting Invitations

```http
POST /google/calendar/events/:eventId/send-invitation
```

**Purpose:** Send HTML email invitations to attendees

**Parameters:**

- `eventId` - Calendar event ID

**Request Body:**

```json
{
  "recipients": ["user1@example.com", "user2@example.com"],
  "organizer": "organizer@example.com"
}
```

**Email Template Features:**

- Professional HTML design
- Meeting title and description
- Date, time, and duration
- Google Meet join button
- List of all attendees
- Responsive layout

**Response:**

```json
{
  "success": true,
  "message": "Invitations sent successfully"
}
```

**Implementation:** `backend/server.js` line 587
**Template Function:** `createMeetingInvitationEmail()` line 130

---

### Approval Workflow

#### Submit Meeting for Approval

```http
POST /google/calendar/events/:eventId/submit-approval
```

**Purpose:** Submit meeting for approval by managers/directors

**Parameters:**

- `eventId` - Calendar event ID

**Request Body:**

```json
{
  "approvers": ["manager@example.com", "director@example.com"],
  "message": "Please review and approve this client meeting",
  "submittedBy": "employee@example.com"
}
```

**Email Template Features:**

- Meeting details summary
- Requester information
- Approve/Reject action buttons
- Custom message from submitter

**Response:**

```json
{
  "success": true,
  "message": "Approval request sent successfully"
}
```

**Implementation:** `backend/server.js` line 652
**Template Function:** `createApprovalEmailTemplate()` line 247

---

#### Approve Meeting

```http
POST /google/calendar/events/:eventId/approve
```

**Purpose:** Approve a meeting (called from email link)

**Parameters:**

- `eventId` - Calendar event ID

**Response:**

```json
{
  "success": true,
  "status": "approved",
  "message": "Meeting approved successfully"
}
```

**Implementation:** `backend/server.js` line 722

---

#### Reject Meeting

```http
POST /google/calendar/events/:eventId/reject
```

**Purpose:** Reject a meeting (called from email link)

**Parameters:**

- `eventId` - Calendar event ID

**Response:**

```json
{
  "success": true,
  "status": "rejected",
  "message": "Meeting rejected"
}
```

**Implementation:** `backend/server.js` line 735

---

### Calendar Management

#### List Calendars

```http
GET /google/calendar/list
```

**Purpose:** Get all user's calendars

**Response:**

```json
{
  "calendars": [
    {
      "id": "primary",
      "summary": "My Calendar",
      "primary": true,
      "backgroundColor": "#9fe1e7"
    },
    {
      "id": "work@example.com",
      "summary": "Work Calendar",
      "primary": false,
      "backgroundColor": "#f09300"
    }
  ]
}
```

**Implementation:** `backend/server.js` line 750

---

### Google Meet Advanced Features

#### Get Meeting Recordings

```http
GET /google/meet/:conferenceId/recordings
```

**Purpose:** Get recordings for a Meet conference

**Parameters:**

- `conferenceId` - Google Meet conference ID (e.g., "abc-defg-hij")

**API:** Google Meet API v2

**Response:**

```json
{
  "recordings": [
    {
      "name": "spaces/abc-defg-hij/recordings/recording123",
      "state": "ENDED",
      "startTime": "2025-11-03T10:00:00Z",
      "endTime": "2025-11-03T11:00:00Z",
      "driveDestination": {
        "file": "https://drive.google.com/file/d/...",
        "exportUri": "https://..."
      }
    }
  ]
}
```

**Implementation:** `backend/server.js` line 780

---

#### Get Meeting Transcripts

```http
GET /google/meet/:conferenceId/transcripts
```

**Purpose:** Get transcripts for a Meet conference

**Parameters:**

- `conferenceId` - Google Meet conference ID

**Response:**

```json
{
  "transcripts": [
    {
      "name": "spaces/abc-defg-hij/transcripts/transcript123",
      "state": "ENDED",
      "startTime": "2025-11-03T10:00:00Z",
      "endTime": "2025-11-03T11:00:00Z",
      "docsDestination": {
        "document": "https://docs.google.com/document/d/...",
        "exportUri": "https://..."
      }
    }
  ]
}
```

**Implementation:** `backend/server.js` line 808

---

#### Get Transcript Entries

```http
GET /google/meet/:conferenceId/transcripts/:transcriptId/entries
```

**Purpose:** Get specific transcript entries with text content

**Parameters:**

- `conferenceId` - Google Meet conference ID
- `transcriptId` - Transcript ID

**Response:**

```json
{
  "entries": [
    {
      "name": "entry123",
      "participant": "user@example.com",
      "text": "Hello everyone, let's start the meeting",
      "languageCode": "en-US",
      "startTime": "2025-11-03T10:00:30Z",
      "endTime": "2025-11-03T10:00:35Z"
    },
    {
      "name": "entry124",
      "participant": "user2@example.com",
      "text": "Good morning!",
      "languageCode": "en-US",
      "startTime": "2025-11-03T10:00:36Z",
      "endTime": "2025-11-03T10:00:38Z"
    }
  ]
}
```

**Implementation:** `backend/server.js` line 836

---

#### Get Meet Space Details

```http
GET /google/meet/space/:conferenceId
```

**Purpose:** Get Google Meet space information

**Parameters:**

- `conferenceId` - Google Meet conference ID

**Response:**

```json
{
  "name": "spaces/abc-defg-hij",
  "meetingUri": "https://meet.google.com/abc-defg-hij",
  "meetingCode": "abc-defg-hij",
  "config": {
    "accessType": "OPEN",
    "entryPointAccess": "ALL"
  }
}
```

**Implementation:** `backend/server.js` line 864

---

## 📊 API Architecture & Patterns

### 1. Authentication Flow

```
User → Frontend → GET /google/auth → Google OAuth → Consent Screen
                                                            ↓
Frontend ← Redirect ← Save tokens.json ← Callback ← Authorization Code
```

**Token Storage:**

- **Location:** `backend/tokens.json`
- **Format:**

```json
{
  "access_token": "ya29.a0...",
  "refresh_token": "1//0g...",
  "scope": "https://www.googleapis.com/auth/calendar ...",
  "token_type": "Bearer",
  "expiry_date": 1699027200000
}
```

**Token Loading:** `backend/server.js` line 16-26

---

### 2. Error Handling Pattern

All endpoints follow this structure:

```javascript
app.post("/endpoint", async (req, res) => {
  try {
    // 1. Validate authentication
    if (!tokens) {
      return res.status(401).json({
        error: "Not authorized",
        hint: "Please connect your Google account first",
      });
    }

    // 2. Set credentials
    oauth2Client.setCredentials(tokens);

    // 3. Execute API call
    const result = await someGoogleAPI();

    // 4. Return success
    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    // 5. Log and return error
    console.error("[ERROR]", err.message);
    res.status(500).json({
      error: "Operation failed",
      details: err.message,
    });
  }
});
```

---

### 3. Google API Integration

**Calendar API:**

```javascript
const { google } = require("googleapis");
const calendar = google.calendar({
  version: "v3",
  auth: oauth2Client,
});

const response = await calendar.events.list({
  calendarId: "primary",
  timeMin: new Date().toISOString(),
  maxResults: 50,
  singleEvents: true,
  orderBy: "startTime",
});
```

**Gmail API:**

```javascript
const gmail = google.gmail({
  version: "v1",
  auth: oauth2Client,
});

const emailContent = createEmailTemplate();
const encodedEmail = Buffer.from(emailContent)
  .toString("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_");

await gmail.users.messages.send({
  userId: "me",
  requestBody: { raw: encodedEmail },
});
```

**Meet API:**

```javascript
// Direct HTTP requests via oauth2Client
const response = await oauth2Client.request({
  url: `https://meet.googleapis.com/v2/spaces/${conferenceId}/recordings`,
  method: "GET",
});
```

---

### 4. Email Template System

**HTML Email Generation:**

**Invitation Email Function:** `createMeetingInvitationEmail()` (line 130)

```javascript
function createMeetingInvitationEmail(
  eventData,
  recipientEmail,
  organizerEmail
) {
  const { summary, description, start, end, hangoutLink, attendees } =
    eventData;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          /* Professional styling */
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Meeting Invitation</h1>
          </div>
          
          <div class="content">
            <h2>${summary}</h2>
            <p>${description}</p>
            
            <div class="meeting-details">
              <div class="detail-row">
                <span class="icon">📅</span>
                <strong>Date:</strong> ${formatDate(start)}
              </div>
              <!-- More details -->
            </div>
            
            <a href="${hangoutLink}" class="join-button">
              Join Meeting
            </a>
          </div>
        </div>
      </body>
    </html>
  `;
}
```

**Approval Email Function:** `createApprovalEmailTemplate()` (line 247)

```javascript
function createApprovalEmailTemplate(
  eventData,
  approverEmail,
  submitterEmail,
  message
) {
  return `
    <!DOCTYPE html>
    <html>
      <!-- Professional approval request layout -->
      <div class="actions">
        <a href="${baseUrl}/google/calendar/events/${eventData.id}/approve" 
           class="button approve-button">
          Approve Meeting
        </a>
        <a href="${baseUrl}/google/calendar/events/${eventData.id}/reject" 
           class="button reject-button">
          Reject Meeting
        </a>
      </div>
    </html>
  `;
}
```

**MIME Email Format:**

```javascript
const rawEmail = [
  `From: ${organizerEmail}`,
  `To: ${recipientEmail}`,
  `Subject: Meeting Invitation: ${summary}`,
  "MIME-Version: 1.0",
  "Content-Type: text/html; charset=utf-8",
  "",
  htmlContent,
].join("\r\n");
```

---

## 🎨 Frontend API Integration

### Configuration

**API Base URL:**

```typescript
// frontend/src/pages/Meet.tsx
const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3005";
```

**Environment File:** `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:3005
```

---

### Usage Examples

#### Fetch Meetings

```typescript
const fetchEvents = async () => {
  setLoading(true);

  try {
    const endpoint =
      viewFilter === "upcoming"
        ? "/google/calendar/events"
        : "/google/calendar/events/all";

    const res = await fetch(`${apiBase}${endpoint}`);
    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Not authorized. Please connect your Google account.");
      }
      throw new Error("Failed to fetch meetings");
    }

    setEvents(data.events || []);
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

#### Create Meeting

```typescript
const handleCreateMeeting = async () => {
  try {
    const res = await fetch(`${apiBase}/google/calendar/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        summary: meetingTitle,
        description: meetingDescription,
        startTime: startDateTime,
        endTime: endDateTime,
        attendees: attendees,
        sendNotifications: sendNotifications,
        addMeet: true,
      }),
    });

    if (!res.ok) throw new Error("Failed to create meeting");

    const createdMeeting = await res.json();

    await fetchEvents();
    setShowCreateModal(false);

    if (createdMeeting.hangoutLink) {
      window.open(createdMeeting.hangoutLink, "_blank");
    }
  } catch (err: any) {
    alert("Error creating meeting: " + err.message);
  }
};
```

---

#### Delete Meeting

```typescript
const handleDeleteMeeting = async (eventId: string) => {
  if (!confirm("Are you sure you want to delete this meeting?")) return;

  try {
    const res = await fetch(
      `${apiBase}/google/calendar/events/${eventId}?sendNotifications=true`,
      { method: "DELETE" }
    );

    if (!res.ok) throw new Error("Failed to delete meeting");

    await fetchEvents();

    if (selectedEvent?.id === eventId) {
      setSelectedEvent(null);
    }

    alert("Meeting deleted successfully!");
  } catch (err: any) {
    alert("Error deleting meeting: " + err.message);
  }
};
```

---

#### Send Invitations

```typescript
const handleSendInvitations = async () => {
  if (!invitingEvent || inviteRecipients.length === 0) return;

  try {
    const res = await fetch(
      `${apiBase}/google/calendar/events/${invitingEvent.id}/send-invitation`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: inviteRecipients,
          organizer: userEmail,
        }),
      }
    );

    if (!res.ok) throw new Error("Failed to send invitations");

    setShowInviteModal(false);
    setInvitingEvent(null);
    setInviteRecipients([]);

    alert("Invitations sent successfully!");
  } catch (err: any) {
    alert("Error sending invitations: " + err.message);
  }
};
```

---

#### Submit for Approval

```typescript
const handleSubmitForApproval = async () => {
  if (!selectedEvent || approvers.length === 0) return;

  try {
    const res = await fetch(
      `${apiBase}/google/calendar/events/${selectedEvent.id}/submit-approval`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvers: approvers.map((a) => a.email),
          message: approvalMessage,
          submittedBy: userEmail,
        }),
      }
    );

    if (!res.ok) throw new Error("Failed to submit for approval");

    setShowApprovalModal(false);
    setApprovers([]);

    alert("Meeting submitted for approval!");
  } catch (err: any) {
    alert("Error submitting for approval: " + err.message);
  }
};
```

---

#### Connect to OBS

```typescript
const connectOBS = async () => {
  try {
    const res = await fetch(`${apiBase}/obs/connect`, {
      method: "POST",
    });
    const data = await res.json();

    if (data.success) {
      setConnected(true);
      setMessage("[SUCCESS] Connected to OBS Studio");

      // Get OBS info
      const infoRes = await fetch(`${apiBase}/obs/info`);
      const infoData = await infoRes.json();

      if (infoData.success) {
        setObsInfo(infoData);
      }
    } else {
      setMessage(`[ERROR] ${data.message || "Failed to connect"}`);
      if (data.hint) {
        setMessage((prev) => `${prev}\n[TIP] ${data.hint}`);
      }
    }
  } catch (err: any) {
    setMessage(`[ERROR] Connection failed: ${err.message}`);
  }
};
```

---

#### Start Recording

```typescript
const startRecording = async () => {
  setRecording(true);

  try {
    const res = await fetch(`${apiBase}/obs/recording/start`, {
      method: "POST",
    });
    const data = await res.json();

    if (data.success) {
      setIsRecording(true);
      setMessage("Recording started!");
      onRecordingStart?.();
    } else {
      setMessage(`[ERROR] ${data.message || "Failed to start recording"}`);
    }
  } catch (err: any) {
    setMessage(`[ERROR] Error: ${err.message}`);
  } finally {
    setRecording(false);
  }
};
```

---

## 🔐 Security & Authentication

### OAuth 2.0 Configuration

**Scopes Required:**

```javascript
// backend/googleClient.js
const scopes = [
  "https://www.googleapis.com/auth/calendar", // Read/write calendar
  "https://www.googleapis.com/auth/calendar.events", // Manage events
  "https://www.googleapis.com/auth/drive", // Access Drive
  "https://www.googleapis.com/auth/drive.file", // Create/access files
  "https://www.googleapis.com/auth/gmail.send", // Send emails
  "https://www.googleapis.com/auth/meetings.space.created", // Create Meet spaces
  "https://www.googleapis.com/auth/meetings.space.readonly", // Read Meet data
];
```

### Environment Variables

**Backend Configuration:** `backend/.env`

```env
PORT=3005
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3005/google/oauth/callback

OBS_HOST=localhost
OBS_PORT=4455
OBS_PASSWORD=your-obs-password
```

**Frontend Configuration:** `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:3005
```

### Token Management

**Automatic Refresh:**

- Google OAuth client automatically refreshes expired tokens
- Refresh tokens stored in `backend/tokens.json`
- No manual intervention needed

**Token Validation:**

```javascript
// Check if tokens exist
if (!tokens) {
  return res.status(401).json({ error: "Not authorized" });
}

// Set credentials
oauth2Client.setCredentials(tokens);

// API call will auto-refresh if needed
const result = await calendar.events.list({
  /* ... */
});
```

---

## 📈 Complete Request/Response Flow

### Example: Create Meeting with Instant Join

```
1. User fills meeting form in Frontend
   ↓
2. Frontend sends POST /google/calendar/events
   {
     summary: "Team Standup",
     startTime: "2025-11-04T10:00:00",
     endTime: "2025-11-04T10:15:00",
     attendees: ["user1@example.com"],
     sendNotifications: true,
     addMeet: true
   }
   ↓
3. Backend validates authentication
   ↓
4. Backend calls Google Calendar API
   - Creates calendar event
   - Adds conferenceData for Google Meet
   ↓
5. Google generates Meet link: meet.google.com/abc-defg-hij
   ↓
6. Backend returns event with Meet link
   {
     id: "event123",
     summary: "Team Standup",
     hangoutLink: "https://meet.google.com/abc-defg-hij"
   }
   ↓
7. Frontend opens Meet link in new window
   ↓
8. Frontend displays meeting controls (OBS recording)
   ↓
9. (Optional) User sends email invitations
   ↓
10. (Optional) User submits for approval
```

### Example: OBS Recording Flow

```
1. User opens meeting in Frontend
   ↓
2. User clicks "Connect to OBS"
   - Frontend sends POST /obs/connect
   ↓
3. Backend connects to OBS via WebSocket (port 4455)
   ↓
4. Backend returns connection status
   {
     success: true,
     message: "Connected to OBS Studio"
   }
   ↓
5. User clicks "Start Recording"
   - Frontend sends POST /obs/recording/start
   ↓
6. Backend sends recording command to OBS
   ↓
7. OBS starts recording
   ↓
8. Backend returns success
   {
     success: true,
     message: "Recording started"
   }
   ↓
9. Frontend shows recording timer
   ↓
10. User clicks "Stop Recording"
    - Frontend sends POST /obs/recording/stop
    ↓
11. Backend stops OBS recording
    ↓
12. Backend returns recording file path
    {
      success: true,
      outputPath: "/Users/username/Videos/recording.mkv"
    }
    ↓
13. Frontend displays success message with file location
```

### Example: Approval Workflow

```
1. User selects meeting and clicks "Submit for Approval"
   ↓
2. User enters approver emails: ["manager@company.com"]
   ↓
3. Frontend sends POST /submit-approval
   {
     approvers: ["manager@company.com"],
     message: "Please review this meeting"
   }
   ↓
4. Backend:
   a. Gets meeting details from Calendar API
   b. Generates HTML email with:
      - Meeting information
      - Approve button
      - Reject button
   c. Sends email via Gmail API
   ↓
5. Manager receives email with action buttons
   ↓
6. Manager clicks "Approve" button
   - Email link: POST /events/{eventId}/approve
   ↓
7. Backend updates approval status
   ↓
8. Backend returns confirmation page
   "Meeting approved successfully"
   ↓
9. (Optional) Backend sends notification to organizer
```

---

## 🔗 Related Files

### Backend

- **Main Server:** `backend/server.js` (893 lines)
- **OAuth Client:** `backend/googleClient.js` (OAuth 2.0 setup)
- **OBS Service:** `backend/obsService.js` (WebSocket client)
- **Token Storage:** `backend/tokens.json` (Generated after auth)
- **Environment:** `backend/.env` (Configuration)

### Frontend

- **Main Page:** `frontend/src/pages/Meet.tsx` (1490 lines)
- **OBS Controls:** `frontend/src/components/OBSControls.tsx`
- **Template Dialog:** `frontend/src/components/TemplateDialog.tsx`
- **Quick Event:** `frontend/src/components/QuickEventDialog.tsx`
- **Calendar Widget:** `frontend/src/components/PublicCalendarWidget.tsx`
- **Mini Calendar:** `frontend/src/components/MiniCalendar.tsx`
- **Environment:** `frontend/.env`

### Chrome Extension

- **Manifest:** `chrome-extension/manifest.json`
- **Content Script:** `chrome-extension/content.js`
- **Popup:** `chrome-extension/popup.html`

---

## 📚 API Standards & Best Practices

### HTTP Status Codes

- `200 OK` - Successful GET/POST/PUT
- `401 Unauthorized` - Missing or invalid authentication
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Server-side error

### Response Format

**Success:**

```json
{
  "success": true,
  "data": {
    /* response data */
  }
}
```

**Error:**

```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information",
  "hint": "Optional suggestion to fix the issue"
}
```

### Naming Conventions

- **Endpoints:** Lowercase with hyphens (`/google/calendar/events`)
- **Methods:** REST standard (GET, POST, PUT, DELETE)
- **Parameters:** camelCase in JSON (`startTime`, `sendNotifications`)
- **Response Keys:** camelCase (`hangoutLink`, `conferenceData`)

---

**Last Updated:** 2025-11-04  
**Version:** 1.0.0  
**Base URL:** http://localhost:3005
