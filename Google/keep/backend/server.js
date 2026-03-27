import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import fs from "fs-extra";
import { google } from "googleapis";
import { oauth2Client, getAuthUrl } from "./googleClient.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;
const TOKEN_PATH = "./tokens.json";

// Middleware
app.use(cors());
app.use(express.json());
app.use(compression()); // Performance optimization

// Helper function to load saved tokens
async function loadSavedCredentials() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    oauth2Client.setCredentials(credentials);
    return true;
  } catch (err) {
    return false;
  }
}

// Helper function to save credentials
async function saveCredentials(tokens) {
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
  oauth2Client.setCredentials(tokens);
}

// Helper function to send email notifications
async function sendEmail(to, subject, body) {
  try {
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      "",
      body,
    ].join("\n");

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
}

// Helper function to create note metadata structure
function createNoteMetadata(title, content, options = {}) {
  return {
    title: title || "Untitled Note",
    content: content || "",
    color: options.color || "default",
    labels: options.labels || [],
    isPinned: options.isPinned || false,
    isArchived: options.isArchived || false,
    checklist: options.checklist || [],
    collaborators: options.collaborators || [],
    approvalStatus: options.approvalStatus || "draft", // draft, pending, approved, rejected
    approver: options.approver || null,
    createdTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
  };
}

// ENDPOINT 1: OAuth authentication
app.get("/google/auth", (req, res) => {
  const authUrl = getAuthUrl();
  res.json({ authUrl });
});

// ENDPOINT 2: OAuth callback
app.get("/google/oauth/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    await saveCredentials(tokens);
    res.send(
      "<script>window.close(); window.opener.postMessage('auth-success', '*');</script>"
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).send("Authentication failed");
  }
});

// ENDPOINT 3: List all notes
app.get("/google/keep/notes", async (req, res) => {
  try {
    const hasTokens = await loadSavedCredentials();
    if (!hasTokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Query for notes stored in Drive appData folder
    const response = await drive.files.list({
      spaces: "appDataFolder",
      fields: "files(id, name, modifiedTime, createdTime)",
      pageSize: 100,
      q: "mimeType='application/json' and name contains 'keep-note'",
    });

    // Fetch content for each note
    const notesWithContent = await Promise.all(
      response.data.files.map(async (file) => {
        try {
          const content = await drive.files.get(
            { fileId: file.id, alt: "media" },
            { responseType: "text" }
          );
          const noteData = JSON.parse(content.data);
          return {
            id: file.id,
            name: file.name,
            properties: noteData,
            modifiedTime: file.modifiedTime,
            createdTime: file.createdTime,
          };
        } catch (error) {
          console.error(`Error fetching note ${file.id}:`, error);
          return null;
        }
      })
    );

    const notes = notesWithContent.filter((note) => note !== null);

    res.json({ notes });
  } catch (error) {
    console.error("List notes error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINT 4: Create new note
app.post("/google/keep/notes", async (req, res) => {
  try {
    const hasTokens = await loadSavedCredentials();
    if (!hasTokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { title, content, color, labels, checklist, isPinned } = req.body;

    const noteMetadata = createNoteMetadata(title, content, {
      color,
      labels,
      checklist,
      isPinned,
    });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Create note as JSON file in appData folder
    const fileMetadata = {
      name: `keep-note-${Date.now()}.json`,
      parents: ["appDataFolder"],
      properties: noteMetadata,
    };

    const media = {
      mimeType: "application/json",
      body: JSON.stringify(noteMetadata),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, name, properties, createdTime, modifiedTime",
    });

    res.json({
      id: response.data.id,
      name: response.data.name,
      properties: response.data.properties,
      createdTime: response.data.createdTime,
      modifiedTime: response.data.modifiedTime,
    });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINT 5: Get specific note
app.get("/google/keep/notes/:noteId", async (req, res) => {
  try {
    const hasTokens = await loadSavedCredentials();
    if (!hasTokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { noteId } = req.params;
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const response = await drive.files.get({
      fileId: noteId,
      fields: "id, name, properties, createdTime, modifiedTime",
    });

    // Get file content
    const content = await drive.files.get(
      { fileId: noteId, alt: "media" },
      { responseType: "text" }
    );

    res.json({
      id: response.data.id,
      name: response.data.name,
      properties: response.data.properties,
      content: JSON.parse(content.data),
      createdTime: response.data.createdTime,
      modifiedTime: response.data.modifiedTime,
    });
  } catch (error) {
    console.error("Get note error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINT 6: Update note
app.patch("/google/keep/notes/:noteId", async (req, res) => {
  try {
    const hasTokens = await loadSavedCredentials();
    if (!hasTokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { noteId } = req.params;
    const updates = req.body;

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Get current note data
    const currentNote = await drive.files.get({
      fileId: noteId,
      fields: "properties",
    });

    const currentProps = currentNote.data.properties || {};

    // Merge updates with current properties
    const updatedMetadata = {
      ...currentProps,
      ...updates,
      modifiedTime: new Date().toISOString(),
    };

    // Update file properties
    const fileMetadata = {
      properties: updatedMetadata,
    };

    // Update file content
    const media = {
      mimeType: "application/json",
      body: JSON.stringify(updatedMetadata),
    };

    const response = await drive.files.update({
      fileId: noteId,
      requestBody: fileMetadata,
      media: media,
      fields: "id, name, properties, modifiedTime",
    });

    res.json({
      id: response.data.id,
      name: response.data.name,
      properties: response.data.properties,
      modifiedTime: response.data.modifiedTime,
    });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINT 7: Delete note
app.delete("/google/keep/notes/:noteId", async (req, res) => {
  try {
    const hasTokens = await loadSavedCredentials();
    if (!hasTokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { noteId } = req.params;
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    await drive.files.delete({
      fileId: noteId,
    });

    res.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINT 8: Archive/Unarchive note
app.post("/google/keep/notes/:noteId/archive", async (req, res) => {
  try {
    const hasTokens = await loadSavedCredentials();
    if (!hasTokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { noteId } = req.params;
    const { archived } = req.body;

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const currentNote = await drive.files.get({
      fileId: noteId,
      fields: "properties",
    });

    const updatedMetadata = {
      ...currentNote.data.properties,
      isArchived: archived,
      modifiedTime: new Date().toISOString(),
    };

    const response = await drive.files.update({
      fileId: noteId,
      requestBody: { properties: updatedMetadata },
      fields: "id, properties",
    });

    res.json({
      id: response.data.id,
      properties: response.data.properties,
    });
  } catch (error) {
    console.error("Archive note error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINT 9: Pin/Unpin note
app.post("/google/keep/notes/:noteId/pin", async (req, res) => {
  try {
    const hasTokens = await loadSavedCredentials();
    if (!hasTokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { noteId } = req.params;
    const { pinned } = req.body;

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const currentNote = await drive.files.get({
      fileId: noteId,
      fields: "properties",
    });

    const updatedMetadata = {
      ...currentNote.data.properties,
      isPinned: pinned,
      modifiedTime: new Date().toISOString(),
    };

    const response = await drive.files.update({
      fileId: noteId,
      requestBody: { properties: updatedMetadata },
      fields: "id, properties",
    });

    res.json({
      id: response.data.id,
      properties: response.data.properties,
    });
  } catch (error) {
    console.error("Pin note error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINT 10: Share note with collaborator
app.post("/google/keep/notes/:noteId/share", async (req, res) => {
  try {
    const hasTokens = await loadSavedCredentials();
    if (!hasTokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { noteId } = req.params;
    const { email, role } = req.body; // role: 'reader' or 'writer'

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Create permission
    const permission = await drive.permissions.create({
      fileId: noteId,
      requestBody: {
        type: "user",
        role: role || "reader",
        emailAddress: email,
      },
      sendNotificationEmail: true,
      fields: "id",
    });

    // Update collaborators in metadata
    const currentNote = await drive.files.get({
      fileId: noteId,
      fields: "properties",
    });

    const currentCollaborators = currentNote.data.properties?.collaborators || [];
    const updatedCollaborators = [
      ...currentCollaborators,
      { email, role: role || "reader", permissionId: permission.data.id },
    ];

    await drive.files.update({
      fileId: noteId,
      requestBody: {
        properties: {
          ...currentNote.data.properties,
          collaborators: updatedCollaborators,
        },
      },
    });

    res.json({
      success: true,
      permissionId: permission.data.id,
      message: `Note shared with ${email}`,
    });
  } catch (error) {
    console.error("Share note error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINT 11: List collaborators
app.get("/google/keep/notes/:noteId/permissions", async (req, res) => {
  try {
    const hasTokens = await loadSavedCredentials();
    if (!hasTokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { noteId } = req.params;
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const response = await drive.permissions.list({
      fileId: noteId,
      fields: "permissions(id, emailAddress, role, displayName)",
    });

    res.json({ permissions: response.data.permissions });
  } catch (error) {
    console.error("List permissions error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINT 12: Remove collaborator
app.delete("/google/keep/notes/:noteId/permissions/:permissionId", async (req, res) => {
  try {
    const hasTokens = await loadSavedCredentials();
    if (!hasTokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { noteId, permissionId } = req.params;
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    await drive.permissions.delete({
      fileId: noteId,
      permissionId: permissionId,
    });

    // Update collaborators in metadata
    const currentNote = await drive.files.get({
      fileId: noteId,
      fields: "properties",
    });

    const currentCollaborators = currentNote.data.properties?.collaborators || [];
    const updatedCollaborators = currentCollaborators.filter(
      (c) => c.permissionId !== permissionId
    );

    await drive.files.update({
      fileId: noteId,
      requestBody: {
        properties: {
          ...currentNote.data.properties,
          collaborators: updatedCollaborators,
        },
      },
    });

    res.json({ success: true, message: "Collaborator removed" });
  } catch (error) {
    console.error("Remove collaborator error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINT 13: Submit note for approval
app.post("/google/keep/notes/:noteId/submit-approval", async (req, res) => {
  try {
    const hasTokens = await loadSavedCredentials();
    if (!hasTokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { noteId } = req.params;
    const { approverEmail } = req.body;

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const currentNote = await drive.files.get({
      fileId: noteId,
      fields: "properties, name",
    });

    const updatedMetadata = {
      ...currentNote.data.properties,
      approvalStatus: "pending",
      approver: approverEmail,
      submittedTime: new Date().toISOString(),
    };

    await drive.files.update({
      fileId: noteId,
      requestBody: { properties: updatedMetadata },
    });

    // Send email notification
    const noteName = currentNote.data.properties?.title || "Untitled Note";
    await sendEmail(
      approverEmail,
      `Approval Request: ${noteName}`,
      `A note titled "${noteName}" has been submitted for your approval.\n\nNote ID: ${noteId}\n\nPlease review and approve or reject.`
    );

    res.json({
      success: true,
      message: "Note submitted for approval",
      approvalStatus: "pending",
    });
  } catch (error) {
    console.error("Submit approval error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINT 14: Approve note
app.post("/google/keep/notes/:noteId/approve", async (req, res) => {
  try {
    const hasTokens = await loadSavedCredentials();
    if (!hasTokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { noteId } = req.params;
    const { approverEmail, comments } = req.body;

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const currentNote = await drive.files.get({
      fileId: noteId,
      fields: "properties",
    });

    const updatedMetadata = {
      ...currentNote.data.properties,
      approvalStatus: "approved",
      approvedBy: approverEmail,
      approvedTime: new Date().toISOString(),
      approvalComments: comments || "",
    };

    await drive.files.update({
      fileId: noteId,
      requestBody: { properties: updatedMetadata },
    });

    // Get owner's email from permissions
    const permissions = await drive.permissions.list({
      fileId: noteId,
      fields: "permissions(emailAddress, role)",
    });

    const owner = permissions.data.permissions.find((p) => p.role === "owner");

    if (owner) {
      const noteName = currentNote.data.properties?.title || "Untitled Note";
      await sendEmail(
        owner.emailAddress,
        `Note Approved: ${noteName}`,
        `Your note "${noteName}" has been approved by ${approverEmail}.\n\n${comments ? `Comments: ${comments}` : ""}`
      );
    }

    res.json({
      success: true,
      message: "Note approved",
      approvalStatus: "approved",
    });
  } catch (error) {
    console.error("Approve note error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ENDPOINT 15: Reject note
app.post("/google/keep/notes/:noteId/reject", async (req, res) => {
  try {
    const hasTokens = await loadSavedCredentials();
    if (!hasTokens) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { noteId } = req.params;
    const { approverEmail, comments } = req.body;

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const currentNote = await drive.files.get({
      fileId: noteId,
      fields: "properties",
    });

    const updatedMetadata = {
      ...currentNote.data.properties,
      approvalStatus: "rejected",
      rejectedBy: approverEmail,
      rejectedTime: new Date().toISOString(),
      rejectionComments: comments || "",
    };

    await drive.files.update({
      fileId: noteId,
      requestBody: { properties: updatedMetadata },
    });

    // Get owner's email from permissions
    const permissions = await drive.permissions.list({
      fileId: noteId,
      fields: "permissions(emailAddress, role)",
    });

    const owner = permissions.data.permissions.find((p) => p.role === "owner");

    if (owner) {
      const noteName = currentNote.data.properties?.title || "Untitled Note";
      await sendEmail(
        owner.emailAddress,
        `Note Rejected: ${noteName}`,
        `Your note "${noteName}" has been rejected by ${approverEmail}.\n\nReason: ${comments || "No comments provided"}`
      );
    }

    res.json({
      success: true,
      message: "Note rejected",
      approvalStatus: "rejected",
    });
  } catch (error) {
    console.error("Reject note error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", service: "hbmp-keep-backend" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎵 Keep Backend running on http://localhost:${PORT}`);
});
