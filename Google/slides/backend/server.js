import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs-extra";
import { oauth2Client, getAuthUrl, REDIRECT_URI } from "./googleClient.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const TOKEN_PATH = "./tokens.json";
const TEMPLATES_FOLDER_ID = process.env.TEMPLATES_FOLDER_ID;

// Middleware
app.use(cors({
  origin: ["http://localhost:5177", "http://localhost:5178"],
  credentials: true
}));
app.use(express.json());

// Load existing tokens if available
if (await fs.pathExists(TOKEN_PATH)) {
  const tokens = await fs.readJson(TOKEN_PATH);
  oauth2Client.setCredentials(tokens);
  console.log("✅ Loaded existing Google tokens from file");
}

// Simple auth status endpoint
app.get("/auth/status", async (req, res) => {
  try {
    const hasTokens = await fs.pathExists(TOKEN_PATH);
    // Consider authorized if we have tokens loaded
    return res.json({ authorized: hasTokens });
  } catch (e) {
    return res.json({ authorized: false });
  }
});

// =============================================================================
// AUTHENTICATION ENDPOINTS
// =============================================================================

/**
 * Initiate OAuth flow
 * GET /google/auth
 */
app.get("/google/auth", (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

/**
 * OAuth callback
 * GET /google/auth/callback
 */
app.get("/google/auth/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    // If callback is hit directly or without code, restart the OAuth flow for better UX
    return res.status(302).redirect("/google/auth");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Save tokens to file
    await fs.writeJson(TOKEN_PATH, tokens);
    console.log("✅ Google tokens saved successfully");

    res.send(`
      <html>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h2 style="color: #10b981;">✅ Authorization Successful!</h2>
          <p>You can now close this window and return to the application.</p>
          <script>setTimeout(() => window.close(), 3000);</script>
        </body>
      </html>
    `);
  } catch (err) {
    console.error("❌ Error during OAuth callback:", err);
    res.status(500).send("Error during authorization");
  }
});

// Compatibility route: support '/google/oauth/callback' as an alias for '/google/auth/callback'
app.get("/google/oauth/callback", (req, res) => {
  const params = new URLSearchParams(req.query).toString();
  const suffix = params ? `?${params}` : "";
  return res.redirect(`/google/auth/callback${suffix}`);
});

// =============================================================================
// GOOGLE SLIDES API ENDPOINTS
// =============================================================================

/**
 * List all presentations
 * GET /google/slides/list
 */
app.get("/google/slides/list", async (req, res) => {
  try {
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    
    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.presentation' and trashed=false",
      fields: "files(id, name, webViewLink, createdTime, modifiedTime)",
      orderBy: "modifiedTime desc",
      pageSize: 100,
    });

    console.log(`📊 Found ${response.data.files?.length || 0} presentations`);
    res.json({ files: response.data.files || [] });
  } catch (err) {
    console.error("Error listing presentations:", err);
    if (err.code === 401) {
      res.status(401).json({ error: "Not authorized. Please authenticate first." });
    } else {
      res.status(500).json({ error: "Failed to list presentations" });
    }
  }
});

/**
 * List templates from a Drive folder (optional)
 * GET /google/slides/templates
 * Env: TEMPLATES_FOLDER_ID (Drive folder ID containing template presentations)
 */
app.get("/google/slides/templates", async (req, res) => {
  try {
    if (!TEMPLATES_FOLDER_ID) {
      // Graceful fallback: no folder configured
      return res.json({ templates: [], note: "No TEMPLATES_FOLDER_ID configured" });
    }
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const response = await drive.files.list({
      q: `'${TEMPLATES_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.presentation' and trashed=false`,
      fields: "files(id, name, thumbnailLink, createdTime, modifiedTime)",
      orderBy: "name asc",
      pageSize: 100,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    const templates = (response.data.files || []).map(f => ({
      id: f.id,
      name: f.name,
      thumbnailLink: f.thumbnailLink,
    }));
    res.json({ templates });
  } catch (err) {
    console.error("Error listing templates:", err);
    if (err.code === 401) {
      res.status(401).json({ error: "Not authorized. Please authenticate first." });
    } else {
      res.status(500).json({ error: "Failed to list templates" });
    }
  }
});

/**
 * Get presentation details
 * GET /google/slides/:presentationId
 */
app.get("/google/slides/:presentationId", async (req, res) => {
  try {
    const { presentationId } = req.params;
    const slides = google.slides({ version: "v1", auth: oauth2Client });
    
    const presentation = await slides.presentations.get({
      presentationId: presentationId,
    });

    console.log(`📄 Retrieved presentation: ${presentation.data.title}`);
    res.json(presentation.data);
  } catch (err) {
    console.error("Error getting presentation:", err);
    res.status(500).json({ error: "Failed to get presentation" });
  }
});

/**
 * Create a new presentation
 * POST /google/slides/create
 * Body: { title: string, templateId?: string }
 */
app.post("/google/slides/create", async (req, res) => {
  try {
    const { title, templateId } = req.body;
    const slides = google.slides({ version: "v1", auth: oauth2Client });
    
    let presentation;
    
    if (templateId) {
      // Create from template by copying
      const drive = google.drive({ version: "v3", auth: oauth2Client });
      const copiedFile = await drive.files.copy({
        fileId: templateId,
        requestBody: {
          name: title,
        },
      });
      
      presentation = await slides.presentations.get({
        presentationId: copiedFile.data.id,
      });
    } else {
      // Create blank presentation
      presentation = await slides.presentations.create({
        requestBody: {
          title: title,
        },
      });
    }

    console.log(`✅ Created presentation: ${presentation.data.title}`);
    res.json({
      id: presentation.data.presentationId,
      name: presentation.data.title,
      webViewLink: `https://docs.google.com/presentation/d/${presentation.data.presentationId}/edit`,
    });
  } catch (err) {
    console.error("Error creating presentation:", err);
    res.status(500).json({ error: "Failed to create presentation", details: err.message });
  }
});

/**
 * Add a slide to presentation
 * POST /google/slides/:presentationId/add-slide
 * Body: { layout?: string, insertionIndex?: number }
 */
app.post("/google/slides/:presentationId/add-slide", async (req, res) => {
  try {
    const { presentationId } = req.params;
    const { layout = "BLANK", insertionIndex } = req.body;
    const slides = google.slides({ version: "v1", auth: oauth2Client });

    const requests = [{
      createSlide: {
        slideLayoutReference: {
          predefinedLayout: layout,
        },
        insertionIndex: insertionIndex,
      },
    }];

    const response = await slides.presentations.batchUpdate({
      presentationId: presentationId,
      requestBody: {
        requests: requests,
      },
    });

    console.log(`✅ Added slide to presentation`);
    res.json({ success: true, response: response.data });
  } catch (err) {
    console.error("Error adding slide:", err);
    res.status(500).json({ error: "Failed to add slide" });
  }
});

/**
 * Update slide content
 * POST /google/slides/:presentationId/update-slide
 * Body: { slideId: string, elements: Array }
 */
app.post("/google/slides/:presentationId/update-slide", async (req, res) => {
  try {
    const { presentationId } = req.params;
    const { requests } = req.body;
    const slides = google.slides({ version: "v1", auth: oauth2Client });

    const response = await slides.presentations.batchUpdate({
      presentationId: presentationId,
      requestBody: {
        requests: requests,
      },
    });

    console.log(`✅ Updated slide content`);
    res.json({ success: true, response: response.data });
  } catch (err) {
    console.error("Error updating slide:", err);
    res.status(500).json({ error: "Failed to update slide" });
  }
});

/**
 * Delete presentation
 * DELETE /google/slides/:presentationId
 */
app.delete("/google/slides/:presentationId", async (req, res) => {
  try {
    const { presentationId } = req.params;
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    
    await drive.files.delete({
      fileId: presentationId,
    });

    console.log(`✅ Deleted presentation: ${presentationId}`);
    res.json({ success: true, message: "Presentation deleted successfully" });
  } catch (err) {
    console.error("Error deleting presentation:", err);
    res.status(500).json({ error: "Failed to delete presentation", details: err.message });
  }
});

/**
 * Rename presentation
 * PATCH /google/slides/:presentationId/rename
 * Body: { name: string }
 */
app.patch("/google/slides/:presentationId/rename", async (req, res) => {
  try {
    const { presentationId } = req.params;
    const { name } = req.body;
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    
    await drive.files.update({
      fileId: presentationId,
      requestBody: {
        name: name,
      },
    });

    console.log(`✅ Renamed presentation to: ${name}`);
    res.json({ success: true, message: "Presentation renamed successfully" });
  } catch (err) {
    console.error("Error renaming presentation:", err);
    res.status(500).json({ error: "Failed to rename presentation" });
  }
});

/**
 * Share presentation
 * POST /google/slides/:presentationId/share
 * Body: { email?: string, role: string, type?: string }
 */
app.post("/google/slides/:presentationId/share", async (req, res) => {
  try {
    const { presentationId } = req.params;
    const { email, role = "writer", type = "user" } = req.body;
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    
    const requestBody = {
      type: type, // "user", "anyone", "domain"
      role: role, // "reader", "commenter", "writer"
    };

    if (type === "user" && email) {
      requestBody.emailAddress = email;
    }
    
    await drive.permissions.create({
      fileId: presentationId,
      requestBody: requestBody,
      sendNotificationEmail: type === "user",
    });

    const message = type === "anyone" 
      ? "Presentation is now accessible to anyone with the link"
      : `Shared presentation with: ${email}`;
    
    console.log(`✅ ${message}`);
    res.json({ success: true, message });
  } catch (err) {
    console.error("Error sharing presentation:", err);
    res.status(500).json({ error: "Failed to share presentation", details: err.message });
  }
});

/**
 * Get presentation permissions
 * GET /google/slides/:presentationId/permissions
 */
app.get("/google/slides/:presentationId/permissions", async (req, res) => {
  try {
    const { presentationId } = req.params;
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    
    const response = await drive.permissions.list({
      fileId: presentationId,
      fields: "permissions(id, type, role, emailAddress, displayName)",
    });

    res.json({ permissions: response.data.permissions || [] });
  } catch (err) {
    console.error("Error getting permissions:", err);
    res.status(500).json({ error: "Failed to get permissions" });
  }
});

/**
 * Remove permission
 * DELETE /google/slides/:presentationId/permissions/:permissionId
 */
app.delete("/google/slides/:presentationId/permissions/:permissionId", async (req, res) => {
  try {
    const { presentationId, permissionId } = req.params;
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    
    await drive.permissions.delete({
      fileId: presentationId,
      permissionId: permissionId,
    });

    res.json({ success: true, message: "Permission removed" });
  } catch (err) {
    console.error("Error removing permission:", err);
    res.status(500).json({ error: "Failed to remove permission" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 HBMP Slides Backend running on http://localhost:${PORT}`);
  console.log(`📊 Ready to handle Google Slides operations`);
  console.log(`🔗 OAuth redirect URI in use: ${REDIRECT_URI}`);
  console.log(`🛡️  CORS allowed origins: [http://localhost:5177, http://localhost:5178]`);
});
