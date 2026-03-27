import express from "express";
import cors from "cors";
import fs from "fs-extra";
import { google } from "googleapis";
import { oauth2Client, getAuthUrl } from "./googleClient.js";
import * as obsService from "./obsService.js";

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

const TOKEN_PATH = "./tokens.json";
let tokens = null;

// Load tokens from file if they exist
(async () => {
  try {
    if (await fs.pathExists(TOKEN_PATH)) {
      tokens = await fs.readJSON(TOKEN_PATH);
      oauth2Client.setCredentials(tokens);
      console.log("[SUCCESS] Loaded existing Google tokens from file");
    } else {
      console.log("[WARNING]  No tokens found. Please authenticate at /google/auth");
    }
  } catch (err) {
    console.error("Error loading tokens:", err);
  }
})();

// ========================================
// OBS RECORDING ENDPOINTS
// ========================================

// 🔹 1️⃣ Connect to OBS WebSocket
app.post("/obs/connect", async (req, res) => {
  try {
    const result = await obsService.connectOBS();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔹 2️⃣ Disconnect from OBS WebSocket
app.post("/obs/disconnect", async (req, res) => {
  try {
    const result = await obsService.disconnectOBS();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔹 3️⃣ Get OBS connection status
app.get("/obs/status", (req, res) => {
  try {
    const status = obsService.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ connected: false, error: error.message });
  }
});

// 🔹 4️⃣ Start recording
app.post("/obs/recording/start", async (req, res) => {
  try {
    const result = await obsService.startRecording();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔹 5️⃣ Stop recording
app.post("/obs/recording/stop", async (req, res) => {
  try {
    const result = await obsService.stopRecording();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔹 6️⃣ Get recording status
app.get("/obs/recording/status", async (req, res) => {
  try {
    const result = await obsService.getRecordingStatus();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, isRecording: false });
  }
});

// 🔹 7️⃣ Pause recording
app.post("/obs/recording/pause", async (req, res) => {
  try {
    const result = await obsService.pauseRecording();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔹 8️⃣ Resume recording
app.post("/obs/recording/resume", async (req, res) => {
  try {
    const result = await obsService.resumeRecording();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔹 9️⃣ Get OBS info (version, stats)
app.get("/obs/info", async (req, res) => {
  try {
    const result = await obsService.getOBSInfo();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 🔹 🔟 Upload recording to Google Drive
app.post("/obs/recording/upload-to-drive", async (req, res) => {
  try {
    const { filePath, fileName, folderId } = req.body;

    if (!tokens) {
      return res.status(401).json({ 
        success: false, 
        error: "Not authorized. Please connect your Google account first." 
      });
    }

    if (!filePath || !fileName) {
      return res.status(400).json({ 
        success: false, 
        error: "Missing filePath or fileName" 
      });
    }

    // Check if file exists
    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({ 
        success: false, 
        error: "Recording file not found at specified path" 
      });
    }

    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // File metadata
    const fileMetadata = {
      name: fileName,
      mimeType: "video/x-matroska" // Default for MKV files
    };

    // If folderId is provided, upload to specific folder
    if (folderId) {
      fileMetadata.parents = [folderId];
    }

    // Read file stream
    const fileStream = fs.createReadStream(filePath);
    const fileSize = (await fs.stat(filePath)).size;

    console.log(`[DRIVE] Uploading ${fileName} (${(fileSize / 1024 / 1024).toFixed(2)} MB) to Google Drive...`);

    // Upload file
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: "video/x-matroska",
        body: fileStream
      },
      fields: "id, name, webViewLink, size, createdTime"
    });

    console.log(`[DRIVE] Upload successful! File ID: ${response.data.id}`);

    res.json({
      success: true,
      message: "Recording uploaded to Google Drive successfully",
      file: {
        id: response.data.id,
        name: response.data.name,
        webViewLink: response.data.webViewLink,
        size: response.data.size,
        createdTime: response.data.createdTime
      }
    });

  } catch (error) {
    console.error("[DRIVE] Upload error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: "Failed to upload to Google Drive",
      details: error.message 
    });
  }
});

// 🔹 1️⃣1️⃣ List Google Drive folders (for folder selection)
app.get("/google/drive/folders", async (req, res) => {
  try {
    if (!tokens) {
      return res.status(401).json({ 
        success: false, 
        error: "Not authorized" 
      });
    }

    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
      fields: "files(id, name, createdTime, modifiedTime)",
      orderBy: "modifiedTime desc",
      pageSize: 50
    });

    res.json({
      success: true,
      folders: response.data.files || []
    });

  } catch (error) {
    console.error("[DRIVE] Error listing folders:", error.message);
    res.status(500).json({ 
      success: false, 
      error: "Failed to list Drive folders",
      details: error.message 
    });
  }
});

// 🔹 1️⃣2️⃣ Create new folder in Google Drive
app.post("/google/drive/folders", async (req, res) => {
  try {
    const { folderName } = req.body;

    if (!tokens) {
      return res.status(401).json({ 
        success: false, 
        error: "Not authorized" 
      });
    }

    if (!folderName) {
      return res.status(400).json({ 
        success: false, 
        error: "Folder name is required" 
      });
    }

    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const fileMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder"
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      fields: "id, name, webViewLink"
    });

    console.log(`[DRIVE] Created folder: ${folderName} (ID: ${response.data.id})`);

    res.json({
      success: true,
      message: "Folder created successfully",
      folder: {
        id: response.data.id,
        name: response.data.name,
        webViewLink: response.data.webViewLink
      }
    });

  } catch (error) {
    console.error("[DRIVE] Error creating folder:", error.message);
    res.status(500).json({ 
      success: false, 
      error: "Failed to create Drive folder",
      details: error.message 
    });
  }
});

// 🔹 1️⃣3️⃣ Delete local recording file (after successful Drive upload)
app.post("/obs/recording/delete-local", async (req, res) => {
  try {
    const { filePath } = req.body;

    if (!filePath) {
      return res.status(400).json({ 
        success: false, 
        error: "File path is required" 
      });
    }

    // Check if path is unknown
    if (filePath === 'Unknown' || filePath === 'unknown') {
      return res.status(400).json({ 
        success: false, 
        error: "Cannot delete: Recording path is unknown"
      });
    }

    // Check if file exists
    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({ 
        success: false, 
        error: "File not found at specified path",
        filePath: filePath
      });
    }

    // Delete the file
    await fs.remove(filePath);
    console.log(`[FILE] ✅ Deleted local recording: ${filePath}`);

    res.json({
      success: true,
      message: "Local recording file deleted successfully",
      filePath: filePath
    });

  } catch (error) {
    console.error("[FILE] ❌ Error deleting local file:", error.message);
    res.status(500).json({ 
      success: false, 
      error: "Failed to delete local file",
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`[SERVER] HBMP Meet Backend running on http://localhost:${PORT}`);
  console.log(`[OBS] OBS WebSocket integration ready`);
});

// Helper function to create HTML email template for meeting invitation
function createMeetingInvitationEmail(organizer, meetingTitle, meetingLink, description, startTime, endTime, attendees) {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  
  const dateText = startDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const timeText = `${startDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })} - ${endDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .meeting-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #06b6d4; }
        .button { 
          display: inline-block; 
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); 
          color: white !important; 
          padding: 14px 28px; 
          text-decoration: none; 
          border-radius: 6px; 
          margin: 20px 0;
          font-weight: bold;
          box-shadow: 0 4px 6px rgba(6, 182, 212, 0.3);
        }
        .button:hover { background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); }
        .attendees { background: #e0f2fe; padding: 15px; border-radius: 6px; margin-top: 15px; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; padding-top: 20px; border-top: 1px solid #ddd; }
        .icon { font-size: 20px; margin-right: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: white; margin: 0; font-size: 28px;">Meeting Invitation</h1>
        </div>
        <div class="content">
          <p style="font-size: 16px;"><strong>${organizer}</strong> has invited you to a meeting.</p>
          
          <div class="meeting-details">
            <h2 style="color: #0891b2; margin-top: 0;">${meetingTitle}</h2>
            
            ${description ? `<p style="margin: 15px 0;"><strong>Description:</strong><br>${description.replace(/\n/g, '<br>')}</p>` : ''}
            
            <p style="margin: 10px 0;">
              
              <strong>Date:</strong> ${dateText}
            </p>
            
            <p style="margin: 10px 0;">
              <span class="icon">🕐</span>
              <strong>Time:</strong> ${timeText}
            </p>
            
            ${attendees && attendees.length > 0 ? `
              <div class="attendees">
                <p style="margin: 0 0 10px 0;"><strong>👥 Attendees:</strong></p>
                <ul style="margin: 0; padding-left: 20px;">
                  ${attendees.map(email => `<li>${email}</li>`).join('')}
                </ul>
              </div>
            ` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${meetingLink}" class="button" style="color: white !important; text-decoration: none;" target="_blank">
              Join Meeting
            </a>
          </div>
          
          <p style="text-align: center; color: #666; font-size: 14px;">
            Or copy and paste this link in your browser:<br>
            <a href="${meetingLink}" style="color: #06b6d4; word-break: break-all;">${meetingLink}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #666;">
            <strong>Instructions:</strong>
          </p>
          <ul style="font-size: 14px; color: #666;">
            <li>Click the "Join Meeting" button at the scheduled time</li>
            <li>Make sure you have a stable internet connection</li>
            <li>Test your audio and video before joining</li>
            <li>Add this meeting to your calendar for reminders</li>
          </ul>
        </div>
        <div class="footer">
          <p>This invitation was sent from <strong>HBMP Tools - Meet Module</strong></p>
          <p>Holistic Business Management Platform</p>
          <p>If you have any questions, please contact <strong>${organizer}</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Helper function to create approval request email
function createApprovalEmailTemplate(submittedBy, meetingTitle, meetingLink, message, startTime, endTime, meetingId) {
  const startDate = new Date(startTime);
  
  const dateText = startDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const appBaseUrl = 'http://localhost:5179';
  const approveLink = `${appBaseUrl}?meetingId=${meetingId}&action=approve`;
  const rejectLink = `${appBaseUrl}?meetingId=${meetingId}&action=reject`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .button { 
          display: inline-block; 
          background: #06b6d4; 
          color: white !important; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 4px; 
          margin: 10px 5px;
          font-weight: bold;
        }
        .button:hover { background: #0891b2; }
        .button-success { background: #10b981; }
        .button-success:hover { background: #059669; }
        .button-danger { background: #ea4335; }
        .button-danger:hover { background: #c5362c; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="color: white; margin: 0; font-size: 24px;">Meeting Approval Request</h2>
        </div>
        <div class="content">
          <p><strong>${submittedBy}</strong> has requested approval for a meeting.</p>
          
          <p><strong>Meeting:</strong> ${meetingTitle}</p>
          <p><strong>Scheduled:</strong> ${dateText}</p>
          
          ${message ? `<p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${meetingLink}" class="button" style="color: white !important; text-decoration: none;" target="_blank">View Meeting Details</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 15px;">Take Action:</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${approveLink}" class="button button-success" style="color: white !important; text-decoration: none;" target="_blank">✓ Approve Meeting</a>
            <a href="${rejectLink}" class="button button-danger" style="color: white !important; text-decoration: none;" target="_blank">✗ Reject Meeting</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 🔹 Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "HBMP Meet Backend is running on port " + PORT });
});

// 🔹 1️⃣ Redirect user to Google OAuth
app.get("/google/auth", (req, res) => {
  const url = getAuthUrl();
  res.redirect(url);
});

// 🔹 2️⃣ Handle callback and store tokens
app.get("/google/oauth/callback", async (req, res) => {
  try {
    const code = req.query.code;
    const { tokens: googleTokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleTokens);
    tokens = googleTokens;

    await fs.writeJSON(TOKEN_PATH, googleTokens);
    console.log("[SUCCESS] Tokens saved to file");
    res.send("✅ Google account connected successfully! You can close this window and return to HBMP Meet.");
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.status(500).send("OAuth error");
  }
});

// 🔹 3️⃣ List upcoming meetings from Google Calendar
app.get("/google/calendar/events", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];
    
    console.log(`[CALENDAR] Found ${events.length} upcoming meetings`);
    res.json({ events });
  } catch (err) {
    console.error("Error listing events:", err);
    res.status(500).send("Error listing calendar events");
  }
});

// 🔹 4️⃣ Get all meetings (including past meetings)
app.get("/google/calendar/events/all", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
    // Get events from 30 days ago to future
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: thirtyDaysAgo.toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];
    
    console.log(`[CALENDAR] Found ${events.length} meetings (past 30 days + upcoming)`);
    res.json({ events });
  } catch (err) {
    console.error("Error listing all events:", err);
    res.status(500).send("Error listing all calendar events");
  }
});

// 🔹 5️⃣ Create a new Google Meet meeting
app.post("/google/calendar/events", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const { summary, description, startTime, endTime, attendees, sendNotifications, addMeet } = req.body;

    // Convert datetime-local format to ISO 8601
    const startISO = new Date(startTime).toISOString();
    const endISO = new Date(endTime).toISOString();

    // Prepare attendees array
    const attendeesList = attendees && attendees.length > 0 
      ? attendees.map(email => ({ email })) 
      : [];

    // Create event object
    const event = {
      summary: summary || `New Meeting ${new Date().toLocaleString()}`,
      description: description || "",
      start: {
        dateTime: startISO,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: endISO,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      attendees: attendeesList,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    // Only add Google Meet if requested
    if (addMeet !== false) { // Default to true for backward compatibility
      event.conferenceData = {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      };
    }

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: addMeet !== false ? 1 : 0,
      sendUpdates: sendNotifications ? "all" : "none",
    });

    const createdEvent = response.data;
    console.log(`✅ Created meeting: ${createdEvent.summary}`);
    
    res.json({
      id: createdEvent.id,
      summary: createdEvent.summary,
      description: createdEvent.description,
      start: createdEvent.start,
      end: createdEvent.end,
      htmlLink: createdEvent.htmlLink,
      hangoutLink: createdEvent.hangoutLink,
      conferenceData: createdEvent.conferenceData,
      attendees: createdEvent.attendees,
    });
  } catch (err) {
    console.error("Error creating meeting:", err.message || err);
    console.error("Full error:", err);
    res.status(500).json({ 
      error: "Error creating meeting", 
      details: err.message,
      code: err.code 
    });
  }
});

// 🔹 6️⃣ Get meeting details
app.get("/google/calendar/events/:eventId", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const { eventId } = req.params;

    const response = await calendar.events.get({
      calendarId: "primary",
      eventId: eventId,
    });

    console.log(`📋 Retrieved meeting: ${response.data.summary}`);
    res.json(response.data);
  } catch (err) {
    console.error("Error getting event:", err);
    res.status(500).send("Error getting meeting details");
  }
});

// 🔹 7️⃣ Update a meeting
app.put("/google/calendar/events/:eventId", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const { eventId } = req.params;
    const { summary, description, startTime, endTime, attendees, sendNotifications } = req.body;

    // Get current event
    const currentEvent = await calendar.events.get({
      calendarId: "primary",
      eventId: eventId,
    });

    // Prepare attendees array
    const attendeesList = attendees && attendees.length > 0 
      ? attendees.map(email => ({ email })) 
      : currentEvent.data.attendees || [];

    // Update event
    const event = {
      summary: summary || currentEvent.data.summary,
      description: description !== undefined ? description : currentEvent.data.description,
      start: startTime ? {
        dateTime: startTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      } : currentEvent.data.start,
      end: endTime ? {
        dateTime: endTime,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      } : currentEvent.data.end,
      attendees: attendeesList,
    };

    const response = await calendar.events.update({
      calendarId: "primary",
      eventId: eventId,
      resource: event,
      sendUpdates: sendNotifications ? "all" : "none",
    });

    console.log(`✏️ Updated meeting: ${response.data.summary}`);
    res.json(response.data);
  } catch (err) {
    console.error("Error updating event:", err);
    res.status(500).send("Error updating meeting");
  }
});

// 🔹 8️⃣ Delete a meeting
app.delete("/google/calendar/events/:eventId", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const { eventId } = req.params;
    const { sendNotifications } = req.query;

    console.log(`🗑️ Attempting to delete meeting: ${eventId}`);

    await calendar.events.delete({
      calendarId: "primary",
      eventId: eventId,
      sendUpdates: sendNotifications === "true" ? "all" : "none",
    });

    console.log(`✅ Meeting deleted: ${eventId}`);
    res.json({ success: true, message: "Meeting deleted successfully" });
  } catch (err) {
    console.error("[ERROR] Error deleting meeting:", err.message || err);
    res.status(500).json({ 
      error: "Error deleting meeting", 
      details: err.message,
      code: err.code 
    });
  }
});

// 🔹 9️⃣ Send meeting invitation via email
app.post("/google/calendar/events/:eventId/send-invitation", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const { eventId } = req.params;
    const { recipients, organizer } = req.body;

    // Get event details
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const event = await calendar.events.get({
      calendarId: "primary",
      eventId: eventId,
    });

    const meetingTitle = event.data.summary;
    const meetingLink = event.data.hangoutLink || event.data.htmlLink;
    const description = event.data.description || "";
    const startTime = event.data.start.dateTime || event.data.start.date;
    const endTime = event.data.end.dateTime || event.data.end.date;
    const attendees = event.data.attendees?.map(a => a.email) || [];

    // Send email to each recipient
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    
    for (const recipientEmail of recipients) {
      const emailContent = createMeetingInvitationEmail(
        organizer,
        meetingTitle,
        meetingLink,
        description,
        startTime,
        endTime,
        attendees
      );

      const rawEmail = [
        `To: ${recipientEmail}`,
        `Subject: Meeting Invitation: ${meetingTitle}`,
        `Content-Type: text/html; charset=utf-8`,
        ``,
        emailContent,
      ].join("\n");

      const encodedEmail = Buffer.from(rawEmail)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedEmail,
        },
      });

      console.log(`[EMAIL] Meeting invitation sent to: ${recipientEmail}`);
    }

    res.json({ success: true, message: "Invitations sent successfully" });
  } catch (err) {
    console.error("Error sending invitation:", err);
    res.status(500).send("Error sending meeting invitation");
  }
});

// 🔹 🔟 Submit meeting for approval
app.post("/google/calendar/events/:eventId/submit-approval", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const { eventId } = req.params;
    const { approvers, message, submittedBy } = req.body;

    // Get event details
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const event = await calendar.events.get({
      calendarId: "primary",
      eventId: eventId,
    });

    const meetingTitle = event.data.summary;
    const meetingLink = event.data.htmlLink;
    const startTime = event.data.start.dateTime || event.data.start.date;
    const endTime = event.data.end.dateTime || event.data.end.date;

    // Send email to each approver
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    
    for (const approverEmail of approvers) {
      const emailContent = createApprovalEmailTemplate(
        submittedBy,
        meetingTitle,
        meetingLink,
        message,
        startTime,
        endTime,
        eventId
      );

      const rawEmail = [
        `To: ${approverEmail}`,
        `Subject: Meeting Approval Request: ${meetingTitle}`,
        `Content-Type: text/html; charset=utf-8`,
        ``,
        emailContent,
      ].join("\n");

      const encodedEmail = Buffer.from(rawEmail)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: encodedEmail,
        },
      });

      console.log(`[EMAIL] Approval email sent to: ${approverEmail}`);
    }

    // Store approval metadata (in production, use a database)
    const approvalData = {
      status: "pending",
      submittedBy,
      approvers,
      message,
      submittedAt: new Date().toISOString(),
    };

    console.log(`✅ Meeting submitted for approval:`, approvalData);
    res.json({ success: true, approval: approvalData });
  } catch (err) {
    console.error("Error submitting approval:", err);
    res.status(500).send("Error submitting meeting for approval");
  }
});

// 🔹 1️⃣1️⃣ Approve meeting
app.post("/google/calendar/events/:eventId/approve", async (req, res) => {
  try {
    const { eventId } = req.params;
    
    console.log(`✅ Meeting approved: ${eventId}`);
    res.json({ success: true, status: "approved" });
  } catch (err) {
    console.error("Error approving meeting:", err);
    res.status(500).send("Error approving meeting");
  }
});

// 🔹 1️⃣2️⃣ Reject meeting
app.post("/google/calendar/events/:eventId/reject", async (req, res) => {
  try {
    const { eventId } = req.params;
    
    console.log(`❌ Meeting rejected: ${eventId}`);
    res.json({ success: true, status: "rejected" });
  } catch (err) {
    console.error("Error rejecting meeting:", err);
    res.status(500).send("Error rejecting meeting");
  }
});

// 🔹 1️⃣3️⃣ Get user's calendar list
app.get("/google/calendar/list", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    
    const response = await calendar.calendarList.list();

    console.log(`[CALENDAR] Found ${response.data.items?.length || 0} calendars`);
    res.json({ calendars: response.data.items || [] });
  } catch (err) {
    console.error("Error listing calendars:", err);
    res.status(500).send("Error listing calendars");
  }
});

// 🔹 1️⃣4️⃣ Check authentication status
app.get("/auth/status", async (req, res) => {
  try {
    const hasTokens = await fs.pathExists(TOKEN_PATH);
    res.json({ authorized: hasTokens });
  } catch (err) {
    res.json({ authorized: false });
  }
});

// 🔹 1️⃣5️⃣ Get meeting recordings
app.get("/google/meet/:conferenceId/recordings", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const { conferenceId } = req.params;
    
    // Construct the meeting space name from conference ID
    const spaceName = `spaces/${conferenceId}`;
    
    // Use Google Meet API v2
    const url = `https://meet.googleapis.com/v2/${spaceName}/recordings`;
    
    const response = await oauth2Client.request({
      url: url,
      method: 'GET',
    });

    console.log(`[OBS] Found ${response.data.recordings?.length || 0} recordings`);
    res.json({ recordings: response.data.recordings || [] });
  } catch (err) {
    console.error("Error fetching recordings:", err.message);
    // Recordings might not be available yet or meeting hasn't ended
    res.json({ recordings: [], message: "No recordings available yet or meeting hasn't ended" });
  }
});

// 🔹 1️⃣6️⃣ Get meeting transcripts
app.get("/google/meet/:conferenceId/transcripts", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const { conferenceId } = req.params;
    
    // Construct the meeting space name from conference ID
    const spaceName = `spaces/${conferenceId}`;
    
    // Use Google Meet API v2
    const url = `https://meet.googleapis.com/v2/${spaceName}/transcripts`;
    
    const response = await oauth2Client.request({
      url: url,
      method: 'GET',
    });

    console.log(`📝 Found ${response.data.transcripts?.length || 0} transcripts`);
    res.json({ transcripts: response.data.transcripts || [] });
  } catch (err) {
    console.error("Error fetching transcripts:", err.message);
    // Transcripts might not be available yet or feature not enabled
    res.json({ transcripts: [], message: "No transcripts available yet or captions weren't enabled" });
  }
});

// 🔹 1️⃣7️⃣ Get specific transcript entries
app.get("/google/meet/:conferenceId/transcripts/:transcriptId/entries", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const { conferenceId, transcriptId } = req.params;
    
    const spaceName = `spaces/${conferenceId}`;
    const url = `https://meet.googleapis.com/v2/${spaceName}/transcripts/${transcriptId}/entries`;
    
    const response = await oauth2Client.request({
      url: url,
      method: 'GET',
    });

    console.log(`📄 Found ${response.data.entries?.length || 0} transcript entries`);
    res.json({ entries: response.data.entries || [] });
  } catch (err) {
    console.error("Error fetching transcript entries:", err.message);
    res.json({ entries: [], message: "No transcript entries available" });
  }
});

// 🔹 1️⃣8️⃣ Get meeting space details
app.get("/google/meet/space/:conferenceId", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const { conferenceId } = req.params;
    
    const spaceName = `spaces/${conferenceId}`;
    const url = `https://meet.googleapis.com/v2/${spaceName}`;
    
    const response = await oauth2Client.request({
      url: url,
      method: 'GET',
    });

    console.log(`🏢 Retrieved meeting space: ${response.data.name}`);
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching meeting space:", err.message);
    res.status(500).json({ error: "Error fetching meeting space details" });
  }
});

