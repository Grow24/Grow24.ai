import express from "express";
import { createServer } from "http";
import { google } from "googleapis";
import dotenv from "dotenv";
import cors from "cors";
import compression from "compression";
import fs from "fs-extra";
import { oauth2Client, getAuthUrl } from "./googleClient.js";
import { pubsub } from "./pubsub.js";
import { initializeSocket } from "./socket.js";

dotenv.config();

const TOKEN_PATH = "./tokens.json";
const PORT = process.env.PORT || 3001;

const app = express();
const httpServer = createServer(app);

// Enable response compression for faster data transfer
app.use(compression());

app.use(
  cors({
    origin: ["http://localhost:5175", "http://localhost:5176"],
    credentials: true,
  })
);
app.use(express.json());

let tokens = null;

// Load tokens if file exists
if (fs.existsSync(TOKEN_PATH)) {
  const saved = fs.readJSONSync(TOKEN_PATH);
  oauth2Client.setCredentials(saved);
  tokens = saved;
  console.log("✅ Loaded existing Google tokens from file");
}

// 📧 Gmail Email Helper Function
async function sendApprovalEmail(to, subject, htmlBody) {
  try {
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    
    const message = [
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${subject}`,
      '',
      htmlBody
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log(`✅ Email sent successfully. Message ID: ${result.data.id}`);
    return { success: true, messageId: result.data.id };
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    return { success: false, error: error.message };
  }
}

// 📧 Email Template Functions
function createApprovalEmailTemplate(submittedBy, sheetName, sheetLink, message, dueDate, allowEdits, sheetId) {
  const dueDateText = dueDate ? `<p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}</p>` : '';
  
  const editPermissionText = allowEdits ? 
    '<p><strong>Permissions:</strong> You can edit this spreadsheet</p>' : 
    '<p><strong>Permissions:</strong> You can view and comment on this spreadsheet</p>';
  
  // Generate app links for approve/reject actions
  const appBaseUrl = 'http://localhost:5175/tools/sheets';
  const approveLink = `${appBaseUrl}?sheetId=${sheetId}&action=approve`;
  const rejectLink = `${appBaseUrl}?sheetId=${sheetId}&action=reject`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #34a853; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .button { 
          display: inline-block; 
          background: #34a853; 
          color: white !important; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 4px; 
          margin: 10px 5px;
          font-weight: bold;
        }
        .button:hover {
          background: #2d8e47;
        }
        .button-success { 
          background: #34a853; 
        }
        .button-success:hover {
          background: #2d8e47;
        }
        .button-danger { 
          background: #ea4335; 
        }
        .button-danger:hover {
          background: #c5362c;
        }
        .doc-link {
          color: #34a853;
          text-decoration: none;
          word-break: break-all;
        }
        .footer { margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="color: white; margin: 0; font-size: 24px;">Spreadsheet Approval Request</h2>
        </div>
        <div class="content">
          <p><strong>${submittedBy}</strong> has submitted a spreadsheet for your approval.</p>
          
          <p><strong>Spreadsheet:</strong> ${sheetName}</p>
          
          ${message ? `<p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
          
          ${dueDateText}
          
          ${editPermissionText}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${sheetLink}" class="button" style="color: white !important; text-decoration: none;" target="_blank">Open Spreadsheet in Google Sheets</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 15px;">Take Action:</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${approveLink}" class="button button-success" style="color: white !important; text-decoration: none;" target="_blank">✓ Approve Spreadsheet</a>
            <a href="${rejectLink}" class="button button-danger" style="color: white !important; text-decoration: none;" target="_blank">✗ Reject Spreadsheet</a>
          </div>
          
          <p style="text-align: center; font-size: 12px; color: #666; font-style: italic;">
            These buttons will open HBMP Tools where you can review and approve/reject the spreadsheet.
          </p>
          
          <p><strong>Instructions:</strong></p>
          <ul>
            <li>Click "Open Spreadsheet" to review the content in Google Sheets</li>
            <li>After reviewing, click "Approve" or "Reject" button above</li>
            <li>Add comments in Google Sheets if you have feedback</li>
            <li>The submitter will be notified of your decision</li>
          </ul>
        </div>
        <div class="footer">
          <p>This email was sent from HBMP Tools - Holistic Business Management Platform</p>
          <p>If you have any questions, please contact <strong>${submittedBy}</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// 🔹 Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "HBMP Sheets Backend is running on port " + PORT });
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
    console.log("✅ Tokens saved to file");
    res.send("✅ Google account connected successfully! You can close this window and return to HBMP Sheets.");
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.status(500).send("OAuth error");
  }
});

// 🔹 3️⃣ List Google Sheets from Drive
app.get("/google/sheets/list", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
      fields: "files(id, name, webViewLink, createdTime, modifiedTime)",
      pageSize: 100,
      orderBy: "modifiedTime desc",
    });

    console.log(`📊 Found ${response.data.files?.length || 0} spreadsheets`);
    res.json(response.data);
  } catch (err) {
    console.error("Error listing sheets:", err);
    res.status(500).send("Error listing spreadsheets");
  }
});

// 🔹 4️⃣ Create a new Google Sheet
app.post("/google/sheets/create", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const sheets = google.sheets({ version: "v4", auth: oauth2Client });
    const { title, templateData, columnTypes } = req.body;
    const sheetTitle = title || `New Spreadsheet ${new Date().toLocaleString()}`;

    console.log(`📊 Creating sheet with columnTypes:`, columnTypes);

    // Create the spreadsheet
    const created = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: sheetTitle,
        },
      },
    });

    const spreadsheetId = created.data.spreadsheetId;

    // If template data is provided, populate the spreadsheet
    if (templateData && templateData.length > 0) {
      console.log(`📝 Applying template data with ${templateData.length} rows`);
      
      // Prepare batch update requests
      const requests = [];
      
      // Format header row (first row)
      if (templateData.length > 0) {
        requests.push({
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: 0,
              endRowIndex: 1,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.2, green: 0.66, blue: 0.33 }, // Green header
                textFormat: {
                  foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 }, // White text
                  fontSize: 11,
                  bold: true,
                },
                horizontalAlignment: "CENTER",
              },
            },
            fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)",
          },
        });
      }

      // Add data validation rules if columnTypes provided
      if (columnTypes && Array.isArray(columnTypes)) {
        console.log(`🔒 Adding data validation rules for ${columnTypes.length} columns`);
        
        columnTypes.forEach((columnType, colIndex) => {
          if (!columnType || !columnType.types || columnType.types.length === 0) return;
          
          const types = columnType.types;
          const numRows = 1000; // Apply validation to first 1000 rows
          
          let validationRule = null;
          
          // Build validation based on types
          if (types.includes('email')) {
            validationRule = {
              condition: {
                type: 'CUSTOM_FORMULA',
                values: [{
                  userEnteredValue: `=OR(ISBLANK(INDIRECT("R[0]C[0]", FALSE)), REGEXMATCH(TO_TEXT(INDIRECT("R[0]C[0]", FALSE)), "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"))`
                }]
              },
              showCustomUi: true,
              strict: true,
              inputMessage: `This column accepts: ${types.join(', ')}. Please enter a valid email address (e.g., user@example.com).`
            };
          } else if (types.includes('url')) {
            validationRule = {
              condition: {
                type: 'CUSTOM_FORMULA',
                values: [{
                  userEnteredValue: `=OR(ISBLANK(INDIRECT("R[0]C[0]", FALSE)), REGEXMATCH(TO_TEXT(INDIRECT("R[0]C[0]", FALSE)), "^https?://"))`
                }]
              },
              showCustomUi: true,
              strict: true,
              inputMessage: `This column accepts: ${types.join(', ')}. Please enter a valid URL starting with http:// or https:// (e.g., https://example.com).`
            };
          } else if (types.includes('number') && !types.includes('text')) {
            validationRule = {
              condition: {
                type: 'NUMBER_GREATER_THAN_EQ',
                values: [{ userEnteredValue: '-999999999999' }]
              },
              showCustomUi: true,
              strict: true,
              inputMessage: `This column accepts: ${types.join(', ')}. Please enter a valid number.`
            };
          } else if (types.includes('date')) {
            validationRule = {
              condition: {
                type: 'DATE_IS_VALID'
              },
              showCustomUi: true,
              strict: true,
              inputMessage: `This column accepts: ${types.join(', ')}. Please enter a valid date (e.g., MM/DD/YYYY).`
            };
          } else if (types.includes('currency')) {
            validationRule = {
              condition: {
                type: 'CUSTOM_FORMULA',
                values: [{
                  userEnteredValue: `=OR(ISBLANK(INDIRECT("R[0]C[0]", FALSE)), ISNUMBER(VALUE(REGEXREPLACE(TO_TEXT(INDIRECT("R[0]C[0]", FALSE)), "[^0-9.-]", ""))))`
                }]
              },
              showCustomUi: true,
              strict: true,
              inputMessage: `This column accepts: ${types.join(', ')}. Please enter a valid currency amount (e.g., $100 or 100.00).`
            };
          }
          
          if (validationRule) {
            requests.push({
              setDataValidation: {
                range: {
                  sheetId: 0,
                  startRowIndex: 1, // Start after header
                  endRowIndex: numRows + 1,
                  startColumnIndex: colIndex,
                  endColumnIndex: colIndex + 1,
                },
                rule: validationRule
              },
            });
            console.log(`  ✓ Added validation for column ${colIndex + 1}: ${columnType.name} (${types.join('/')})`);
          }
        });
      }
      
      // Auto-resize columns
      const numColumns = templateData[0]?.length || 0;
      for (let i = 0; i < numColumns; i++) {
        requests.push({
          autoResizeDimensions: {
            dimensions: {
              sheetId: 0,
              dimension: "COLUMNS",
              startIndex: i,
              endIndex: i + 1,
            },
          },
        });
      }
      
      // Freeze header row
      requests.push({
        updateSheetProperties: {
          properties: {
            sheetId: 0,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
          fields: "gridProperties.frozenRowCount",
        },
      });
      
      // Apply formatting
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests },
      });
      
      // Write data to cells
      const range = `Sheet1!A1:${String.fromCharCode(64 + numColumns)}${templateData.length}`;
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: templateData,
        },
      });
      
      console.log(`✅ Template applied successfully to ${range}`);
    }

    // Get the webViewLink via Drive API - optimize to only fetch needed fields
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const meta = await drive.files.get({
      fileId: spreadsheetId,
      fields: "id, name, webViewLink, createdTime", // Only fetch necessary fields
    });

    console.log(`✅ Created spreadsheet: ${meta.data.name}`);
    
    // Return optimized response with only essential data
    res.json({
      id: meta.data.id,
      name: meta.data.name,
      webViewLink: meta.data.webViewLink,
      createdTime: meta.data.createdTime
    });
  } catch (err) {
    console.error("Error creating sheet:", err.message || err);
    res.status(500).json({ 
      error: "Error creating spreadsheet", 
      details: err.message,
      code: err.code 
    });
  }
});

// 🔹 5️⃣ Get Google Sheet content
app.get("/google/sheets/:sheetId", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    const sheet = await sheets.spreadsheets.get({
      spreadsheetId: req.params.sheetId,
    });

    res.json(sheet.data);
  } catch (err) {
    console.error("Error getting sheet:", err);
    res.status(500).send("Error getting spreadsheet");
  }
});

// 🔹 6️⃣ Update Google Sheet (batch update)
app.post("/google/sheets/:sheetId/update", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    const { requests } = req.body;

    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: req.params.sheetId,
      requestBody: { requests },
    });

    console.log(`✅ Updated spreadsheet`);
    res.json(response.data);
  } catch (err) {
    console.error("Error updating sheet:", err);
    res.status(500).send("Error updating spreadsheet");
  }
});

// 🔹 7️⃣ Delete Google Sheet
app.delete("/google/sheets/:sheetId", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    console.log(`🗑️ Attempting to delete spreadsheet: ${req.params.sheetId}`);

    await drive.files.delete({
      fileId: req.params.sheetId,
    });

    console.log(`✅ Deleted spreadsheet: ${req.params.sheetId}`);
    res.json({ success: true, message: "Spreadsheet deleted" });
  } catch (err) {
    console.error("Error deleting sheet:", err);
    console.error("Error details:", err.message);
    console.error("Error response:", err.response?.data);
    res.status(500).json({ 
      error: "Error deleting spreadsheet",
      details: err.message,
      code: err.code
    });
  }
});

// 🔹 8️⃣ Rename Google Sheet
app.patch("/google/sheets/:sheetId", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const { name } = req.body;

    const updated = await drive.files.update({
      fileId: req.params.sheetId,
      requestBody: { name },
      fields: "id, name",
    });

    console.log(`✅ Renamed spreadsheet to: ${name}`);
    res.json(updated.data);
  } catch (err) {
    console.error("Error renaming sheet:", err);
    res.status(500).send("Error renaming spreadsheet");
  }
});

// 🔹 9️⃣ Share Google Sheet
app.post("/google/sheets/:sheetId/share", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const { email, role, type } = req.body;

    const permission = await drive.permissions.create({
      fileId: req.params.sheetId,
      requestBody: {
        type: type || "user",
        role: role || "writer",
        emailAddress: email,
      },
      sendNotificationEmail: false,
    });

    console.log(`✅ Shared spreadsheet with ${email}`);
    res.json(permission.data);
  } catch (err) {
    console.error("Error sharing sheet:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 🔟 Get permissions/collaborators
app.get("/google/sheets/:sheetId/permissions", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const permissions = await drive.permissions.list({
      fileId: req.params.sheetId,
      fields: "permissions(id, emailAddress, role, type, displayName)",
    });

    res.json(permissions.data);
  } catch (err) {
    console.error("Error getting permissions:", err);
    res.status(500).send("Error getting permissions");
  }
});

// 🔹 1️⃣1️⃣ Remove permission
app.delete("/google/sheets/:sheetId/permissions/:permissionId", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    await drive.permissions.delete({
      fileId: req.params.sheetId,
      permissionId: req.params.permissionId,
    });

    console.log(`✅ Removed permission`);
    res.json({ success: true });
  } catch (err) {
    console.error("Error removing permission:", err);
    res.status(500).send("Error removing permission");
  }
});

// 🔹 1️⃣2️⃣ Submit for approval
app.post("/google/sheets/:sheetId/submit-approval", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const { submittedBy, approvers, message, dueDate, allowEdits, lockFile } = req.body;
    const sheetId = req.params.sheetId;

    // Get sheet metadata
    const sheet = await drive.files.get({
      fileId: sheetId,
      fields: "id, name, webViewLink",
    });

    const sheetName = sheet.data.name;
    const sheetLink = sheet.data.webViewLink;

    // Store approval metadata in Drive appProperties
    await drive.files.update({
      fileId: sheetId,
      requestBody: {
        appProperties: {
          approvalStatus: "pending",
          submittedBy,
          submittedAt: new Date().toISOString(),
          approvers: JSON.stringify(approvers),
          message: message || "",
          dueDate: dueDate || "",
          allowEdits: allowEdits ? "true" : "false",
        },
      },
    });

    // Share with approvers
    for (const approverEmail of approvers) {
      const role = allowEdits ? "writer" : "commenter";
      
      await drive.permissions.create({
        fileId: sheetId,
        requestBody: {
          type: "user",
          role: role,
          emailAddress: approverEmail,
        },
        sendNotificationEmail: false,
      });

      // Send email
      const subject = `Spreadsheet Approval Request: ${sheetName}`;
      const htmlBody = createApprovalEmailTemplate(
        submittedBy,
        sheetName,
        sheetLink,
        message,
        dueDate,
        allowEdits,
        sheetId
      );

      await sendApprovalEmail(approverEmail, subject, htmlBody);
    }

    console.log(`✅ Submitted spreadsheet for approval`);
    res.json({ success: true, message: "Spreadsheet submitted for approval" });
  } catch (err) {
    console.error("Error submitting for approval:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🔹 1️⃣3️⃣ Get approval status
app.get("/google/sheets/:sheetId/approval-status", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const file = await drive.files.get({
      fileId: req.params.sheetId,
      fields: "appProperties",
    });

    const props = file.data.appProperties || {};
    const status = {
      status: props.approvalStatus || "draft",
      submittedBy: props.submittedBy || null,
      submittedAt: props.submittedAt || null,
      approvedBy: props.approvedBy || null,
      approvedAt: props.approvedAt || null,
      rejectionReason: props.rejectionReason || null,
      approvers: props.approvers ? JSON.parse(props.approvers) : [],
      message: props.message || "",
      dueDate: props.dueDate || "",
      allowEdits: props.allowEdits === "true",
      isReadOnly: props.approvalStatus === "approved",
    };

    res.json(status);
  } catch (err) {
    console.error("Error getting approval status:", err);
    res.status(500).send("Error getting approval status");
  }
});

// 🔹 1️⃣4️⃣ Approve spreadsheet
app.post("/google/sheets/:sheetId/approve", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const { approvedBy, makeReadOnly } = req.body;

    await drive.files.update({
      fileId: req.params.sheetId,
      requestBody: {
        appProperties: {
          approvalStatus: "approved",
          approvedBy,
          approvedAt: new Date().toISOString(),
        },
      },
    });

    console.log(`✅ Approved spreadsheet`);
    res.json({ success: true, message: "Spreadsheet approved" });
  } catch (err) {
    console.error("Error approving spreadsheet:", err);
    res.status(500).send("Error approving spreadsheet");
  }
});

// 🔹 1️⃣5️⃣ Reject spreadsheet
app.post("/google/sheets/:sheetId/reject", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const { rejectedBy, reason } = req.body;

    await drive.files.update({
      fileId: req.params.sheetId,
      requestBody: {
        appProperties: {
          approvalStatus: "rejected",
          rejectedBy,
          rejectedAt: new Date().toISOString(),
          rejectionReason: reason,
        },
      },
    });

    console.log(`✅ Rejected spreadsheet`);
    res.json({ success: true, message: "Spreadsheet rejected" });
  } catch (err) {
    console.error("Error rejecting spreadsheet:", err);
    res.status(500).send("Error rejecting spreadsheet");
  }
});

// =============================================================================
// 🔴 REAL-TIME FEATURES - Sheet Data & Push Notifications
// =============================================================================

/**
 * Get spreadsheet data for visualization
 * GET /google/sheets/:spreadsheetId/data
 */
app.get("/google/sheets/:spreadsheetId/data", async (req, res) => {
  try {
    if (!tokens) return res.status(401).json({ error: "Not authorized" });
    oauth2Client.setCredentials(tokens);
    
    const { spreadsheetId } = req.params;
    const { range = "Sheet1" } = req.query; // Default to Sheet1
    
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });
    
    // Get spreadsheet metadata
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: "properties.title,sheets(properties(title,sheetId,index))"
    });
    
    // Get values from the first sheet or specified range
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    
    const rows = response.data.values || [];
    
    console.log(`✅ Fetched ${rows.length} rows from ${spreadsheetId}`);
    
    res.json({
      spreadsheetId,
      title: metadata.data.properties.title,
      sheets: metadata.data.sheets.map(s => ({
        title: s.properties.title,
        sheetId: s.properties.sheetId,
        index: s.properties.index
      })),
      data: rows,
      rowCount: rows.length,
      columnCount: rows[0]?.length || 0,
    });
  } catch (err) {
    console.error("Error fetching sheet data:", err);
    if (err.code === 401 || err.code === 403) {
      res.status(401).json({ error: "Not authorized or insufficient permissions" });
    } else if (err.code === 404) {
      res.status(404).json({ error: "Spreadsheet not found" });
    } else {
      res.status(500).json({ error: "Failed to fetch sheet data", details: err.message });
    }
  }
});

/**
 * Webhook endpoint for Google Drive Push Notifications
 * POST /webhooks/drive
 * This receives notifications when watched files change
 */
app.post("/webhooks/drive", express.raw({ type: 'application/json' }), (req, res) => {
  try {
    // Google sends notification headers
    const resourceId = req.headers['x-goog-resource-id'];
    const resourceState = req.headers['x-goog-resource-state'];
    const channelId = req.headers['x-goog-channel-id'];
    
    console.log(`📬 Drive webhook received:`, {
      resourceId,
      resourceState,
      channelId,
      timestamp: new Date().toISOString()
    });
    
    // When a sheet is updated, publish to pub/sub
    if (resourceState === 'update' || resourceState === 'change') {
      // Extract spreadsheet ID from channel metadata (you'd store this when creating watch)
      // For demo purposes, we'll trigger a generic update
      pubsub.publishSheetUpdate(resourceId || 'unknown', {
        source: 'drive-webhook',
        state: resourceState
      });
    }
    
    // Always respond 200 to acknowledge receipt
    res.status(200).send('OK');
  } catch (err) {
    console.error("Error processing drive webhook:", err);
    res.status(200).send('OK'); // Still acknowledge to prevent retries
  }
});

/**
 * Manual trigger endpoint for testing real-time updates
 * POST /google/sheets/:spreadsheetId/trigger-update
 */
app.post("/google/sheets/:spreadsheetId/trigger-update", (req, res) => {
  const { spreadsheetId } = req.params;
  console.log(`🔔 Manual update triggered for: ${spreadsheetId}`);
  
  pubsub.publishSheetUpdate(spreadsheetId, {
    source: 'manual-trigger',
    triggeredBy: req.body.user || 'system'
  });
  
  res.json({ 
    success: true, 
    message: `Update event published for ${spreadsheetId}` 
  });
});

/**
 * Setup Drive API watch for a specific spreadsheet
 * POST /google/sheets/:spreadsheetId/watch
 */
app.post("/google/sheets/:spreadsheetId/watch", async (req, res) => {
  try {
    if (!tokens) return res.status(401).json({ error: "Not authorized" });
    oauth2Client.setCredentials(tokens);
    
    const { spreadsheetId } = req.params;
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    
    // Create a watch channel
    const response = await drive.files.watch({
      fileId: spreadsheetId,
      requestBody: {
        id: `sheet-watch-${spreadsheetId}-${Date.now()}`,
        type: 'web_hook',
        address: `${process.env.WEBHOOK_URL || 'https://your-domain.com'}/webhooks/drive`,
        expiration: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });
    
    console.log(`✅ Watch channel created for ${spreadsheetId}:`, response.data);
    
    res.json({
      success: true,
      channelId: response.data.id,
      resourceId: response.data.resourceId,
      expiration: response.data.expiration
    });
  } catch (err) {
    console.error("Error creating watch channel:", err);
    res.status(500).json({ error: "Failed to create watch channel", details: err.message });
  }
});

// Initialize Socket.IO
const io = initializeSocket(httpServer);

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 HBMP Sheets Backend running on http://localhost:${PORT}`);
  console.log(`📊 Ready to handle Google Sheets operations`);
  console.log(`🔌 Socket.IO real-time server active`);
  console.log(`📡 Pub/Sub system initialized`);
});
