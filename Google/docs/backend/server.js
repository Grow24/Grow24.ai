import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs-extra";
import { oauth2Client, getAuthUrl } from "./googleClient.js";

dotenv.config();

const TOKEN_PATH = "./tokens.json";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());

let tokens = null; // store in memory for now

// Load tokens if file exists
if (fs.existsSync(TOKEN_PATH)) {
  const saved = fs.readJSONSync(TOKEN_PATH);
  oauth2Client.setCredentials(saved);
  tokens = saved;
  console.log("✅ Loaded existing Google tokens from file");
}

// 📧 Gmail Email Helper Function
async function sendApprovalEmail(to, subject, htmlBody, textBody) {
  try {
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    
    // Create email message
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `Content-Type: text/html; charset=utf-8`,
      `Content-Transfer-Encoding: quoted-printable`,
      ``,
      htmlBody
    ].join('\n');
    
    // Encode message in base64url format
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    // Send email
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });
    
    console.log(`✅ Email sent successfully to ${to}:`, result.data.id);
    return { success: true, messageId: result.data.id };
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

// 📧 Email Template Functions
function createApprovalEmailTemplate(submittedBy, documentName, documentLink, message, dueDate, allowEdits) {
  const dueDateText = dueDate ? `<p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}</p>` : '';
  
  const editPermissionText = allowEdits ? 
    '<p><strong>Permissions:</strong> You can edit this document</p>' : 
    '<p><strong>Permissions:</strong> You can view and comment on this document</p>';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4285f4; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .button { 
          display: inline-block; 
          background: #4285f4; 
          color: white !important; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 4px; 
          margin: 10px 0;
          font-weight: bold;
        }
        .button:hover {
          background: #3367d6;
        }
        .doc-link {
          color: #4285f4;
          text-decoration: none;
          word-break: break-all;
        }
        .footer { margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Document Approval Request</h2>
        </div>
        <div class="content">
          <p><strong>${submittedBy}</strong> has submitted a document for your approval.</p>
          
          <p><strong>Document:</strong> ${documentName}</p>
          
          ${message ? `<p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
          
          ${dueDateText}
          
          ${editPermissionText}
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${documentLink}" class="button" style="color: white;">Open Document</a>
          </div>
          
          <p style="text-align: center; font-size: 12px; color: #666;">
            Or click here: <a href="${documentLink}" class="doc-link">${documentLink}</a>
          </p>
          
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Click the button above to open the document in Google Docs</li>
            <li>Review the content thoroughly</li>
            <li>Return to HBMP Tools to approve or reject the document</li>
            <li>Add comments if you have feedback</li>
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
  res.json({ status: "ok", message: "HBMP Backend is running" });
});

// 🔹 Test email endpoint
app.post("/test-email", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email address is required" });
    }
    
    const subject = "🧪 HBMP Tools - Email Test";
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #4285f4; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2>🧪 Email Test Successful!</h2>
          </div>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
            <p><strong>Congratulations!</strong> Your HBMP Tools email system is working correctly.</p>
            <p>This test email was sent at: <strong>${new Date().toLocaleString()}</strong></p>
            <p>You should now receive approval notifications when documents are submitted for review.</p>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">
              HBMP Tools - Holistic Business Management Platform
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const result = await sendApprovalEmail(email, subject, htmlBody);
    
    if (result.success) {
      res.json({ 
        success: true, 
        message: "Test email sent successfully",
        messageId: result.messageId 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: result.error 
      });
    }
  } catch (err) {
    console.error("Test email error:", err);
    res.status(500).json({ 
      success: false, 
      error: "Failed to send test email" 
    });
  }
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
    await fs.writeJSON(TOKEN_PATH, googleTokens); // 👈 persist tokens
    console.log("✅ Tokens saved to file");
    res.send("✅ Google account connected. Tokens saved to file.");
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.status(500).send("OAuth error");
  }
});

// 🔹 3️⃣ List Google Docs from Drive
app.get("/google/docs/list", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.document' and trashed=false",
      fields: "files(id, name, webViewLink, createdTime, modifiedTime)",
      pageSize: 100, // Increased from 10 to 100
      orderBy: "modifiedTime desc", // Sort by most recently modified
    });

    console.log(`\n📄 GET /google/docs/list - Found ${response.data.files?.length || 0} documents`);
    console.log("📤 Response JSON:");
    console.log(JSON.stringify(response.data, null, 2));
    res.json(response.data);
  } catch (err) {
    console.error("Error listing docs:", err);
    res.status(500).send("Error listing documents");
  }
});

// ✅ Create a new Google Doc using the Google Docs API
app.post("/google/docs/create", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    console.log("\n📝 POST /google/docs/create - Creating new document");

    // 1️⃣ Create a blank doc
    const docs = google.docs({ version: "v1", auth: oauth2Client });
    const { title } = req.body;
    const docTitle = title || `New HBMP Document ${new Date().toLocaleString()}`;
    
    const created = await docs.documents.create({
      requestBody: { title: docTitle },
    });

    console.log("✅ Docs API Response:");
    console.log(JSON.stringify(created.data, null, 2));

    const documentId = created.data.documentId;

    // 2️⃣ Retrieve the document link via Drive API
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const meta = await drive.files.get({
      fileId: documentId,
      fields: "id, name, webViewLink",
    });

    console.log("✅ Drive API Metadata:");
    console.log(JSON.stringify(meta.data, null, 2));

    // 3️⃣ Send this info to the frontend
    console.log("📤 Final Response to Frontend:");
    console.log(JSON.stringify(meta.data, null, 2));
    res.json(meta.data);
  } catch (err) {
    console.error("❌ Docs API create error:", err?.response?.data || err);
    res.status(500).send("Error creating document");
  }
});

// 🔹 5️⃣ Get Google Doc content
app.get("/google/docs/:docId", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const docs = google.docs({ version: "v1", auth: oauth2Client });

    console.log(`\n📖 GET /google/docs/${req.params.docId} - Fetching document`);

    const doc = await docs.documents.get({
      documentId: req.params.docId,
    });

    console.log(`✅ Retrieved document: ${doc.data.title}`);
    console.log("📤 Document JSON (first 500 chars):");
    console.log(JSON.stringify(doc.data, null, 2).substring(0, 500) + "...");
    res.json(doc.data);
  } catch (err) {
    console.error("Error getting doc:", err);
    res.status(500).send("Error retrieving document");
  }
});

// 🔹 6️⃣ Update Google Doc content
app.post("/google/docs/:docId/update", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const docs = google.docs({ version: "v1", auth: oauth2Client });

    const { requests } = req.body; // Array of batch update requests

    console.log(`\n✏️ POST /google/docs/${req.params.docId}/update`);
    console.log("📥 Request Body:");
    console.log(JSON.stringify(req.body, null, 2));

    const result = await docs.documents.batchUpdate({
      documentId: req.params.docId,
      requestBody: {
        requests: requests,
      },
    });

    console.log(`✅ Document updated successfully`);
    console.log("📤 Response:");
    console.log(JSON.stringify(result.data, null, 2));
    res.json(result.data);
  } catch (err) {
    console.error("Error updating doc:", err);
    res.status(500).send("Error updating document");
  }
});

// 🔹 7️⃣ Delete Google Doc
app.delete("/google/docs/:docId", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    console.log(`\n🗑️ DELETE /google/docs/${req.params.docId}`);

    await drive.files.delete({
      fileId: req.params.docId,
    });

    console.log(`✅ Document deleted successfully`);
    res.json({ success: true, message: "Document deleted" });
  } catch (err) {
    console.error("Error deleting doc:", err);
    res.status(500).send("Error deleting document");
  }
});

// 🔹 8️⃣ Rename Google Doc
app.patch("/google/docs/:docId", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const { name } = req.body;
    console.log(`\n✏️ PATCH /google/docs/${req.params.docId} - Renaming to: ${name}`);

    const result = await drive.files.update({
      fileId: req.params.docId,
      requestBody: { name },
      fields: "id, name, webViewLink",
    });

    console.log(`✅ Document renamed successfully`);
    res.json(result.data);
  } catch (err) {
    console.error("Error renaming doc:", err);
    res.status(500).send("Error renaming document");
  }
});

// 🔹 9️⃣ Share Google Doc with collaborators
app.post("/google/docs/:docId/share", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const { email, role, type } = req.body; 
    // role: "reader" | "commenter" | "writer" | "owner"
    // type: "user" | "group" | "domain" | "anyone"

    console.log(`\n👥 POST /google/docs/${req.params.docId}/share`);
    console.log(`📧 Sharing with: ${email} as ${role}`);
    console.log(`📋 Request body:`, JSON.stringify(req.body, null, 2));

    const permission = await drive.permissions.create({
      fileId: req.params.docId,
      requestBody: {
        type: type || "user",
        role: role || "writer",
        emailAddress: email,
      },
      sendNotificationEmail: true,
      emailMessage: "You have been given access to collaborate on this document.",
      fields: "id, emailAddress, role, type",
    });

    console.log(`✅ Permission granted successfully`);
    console.log("📤 Response:", JSON.stringify(permission.data, null, 2));
    res.json(permission.data);
  } catch (err) {
    console.error("❌ Error sharing doc:", err?.response?.data || err?.message || err);
    const errorMessage = err?.response?.data?.error?.message || err?.message || "Error sharing document";
    res.status(err?.response?.status || 500).json({ 
      error: errorMessage,
      details: err?.response?.data?.error || {}
    });
  }
});

// 🔹 🔟 List document permissions (collaborators)
app.get("/google/docs/:docId/permissions", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    console.log(`\n👥 GET /google/docs/${req.params.docId}/permissions`);

    const permissions = await drive.permissions.list({
      fileId: req.params.docId,
      fields: "permissions(id, emailAddress, role, type, displayName)",
    });

    console.log(`✅ Found ${permissions.data.permissions?.length || 0} collaborators`);
    console.log("📤 Response:", JSON.stringify(permissions.data, null, 2));
    res.json(permissions.data);
  } catch (err) {
    console.error("Error listing permissions:", err);
    res.status(500).send("Error listing collaborators");
  }
});

// 🔹 1️⃣1️⃣ Remove collaborator
app.delete("/google/docs/:docId/permissions/:permissionId", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    console.log(`\n🗑️ DELETE /google/docs/${req.params.docId}/permissions/${req.params.permissionId}`);

    await drive.permissions.delete({
      fileId: req.params.docId,
      permissionId: req.params.permissionId,
    });

    console.log(`✅ Collaborator removed successfully`);
    res.json({ success: true, message: "Collaborator removed" });
  } catch (err) {
    console.error("Error removing collaborator:", err);
    res.status(500).send("Error removing collaborator");
  }
});

// 🔹 1️⃣2️⃣ Get document approval status
app.get("/google/docs/:docId/approval-status", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    console.log(`\n📋 GET /google/docs/${req.params.docId}/approval-status`);

    // Get document properties (we'll store approval status in appProperties)
    const file = await drive.files.get({
      fileId: req.params.docId,
      fields: "appProperties, capabilities",
    });

    const properties = file.data.appProperties || {};
    const approvalStatus = {
      status: properties.approvalStatus || "draft", // draft, pending, approved, rejected
      submittedBy: properties.submittedBy || null,
      submittedAt: properties.submittedAt || null,
      approvedBy: properties.approvedBy || null,
      approvedAt: properties.approvedAt || null,
      rejectionReason: properties.rejectionReason || null,
      isReadOnly: properties.approvalStatus === "approved",
      approvers: properties.approvers ? JSON.parse(properties.approvers) : [],
      message: properties.message || "",
      dueDate: properties.dueDate || null,
      allowEdits: properties.allowEdits === "true",
      lockFile: properties.lockFile === "true",
    };

    console.log("✅ Approval status:", approvalStatus);
    res.json(approvalStatus);
  } catch (err) {
    console.error("Error getting approval status:", err);
    res.status(500).send("Error getting approval status");
  }
});

// 🔹 1️⃣3️⃣ Submit document for approval
app.post("/google/docs/:docId/submit-approval", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const { 
      submittedBy, 
      approvers = [], 
      message = "", 
      dueDate = null, 
      allowEdits = false, 
      lockFile = true 
    } = req.body;

    console.log(`\n📤 POST /google/docs/${req.params.docId}/submit-approval`);
    console.log(`Submitted by: ${submittedBy}`);
    console.log(`Approvers: ${approvers.join(', ')}`);
    console.log(`Message: ${message}`);
    console.log(`Due date: ${dueDate}`);
    console.log(`Allow edits: ${allowEdits}, Lock file: ${lockFile}`);

    // Update document properties with enhanced approval data
    await drive.files.update({
      fileId: req.params.docId,
      requestBody: {
        appProperties: {
          approvalStatus: "pending",
          submittedBy,
          submittedAt: new Date().toISOString(),
          approvers: JSON.stringify(approvers),
          message: message || "",
          dueDate: dueDate || "",
          allowEdits: allowEdits.toString(),
          lockFile: lockFile.toString(),
        },
      },
    });

    // Get document name for email
    const docInfo = await drive.files.get({
      fileId: req.params.docId,
      fields: "name, webViewLink",
    });
    const documentName = docInfo.data.name;
    const documentLink = docInfo.data.webViewLink;

    // Share with all approvers and send emails
    const sharePromises = approvers.map(async (approverEmail) => {
      try {
        const role = allowEdits ? "writer" : "reader";
        
        // Share document
        await drive.permissions.create({
          fileId: req.params.docId,
          requestBody: {
            type: "user",
            role: role,
            emailAddress: approverEmail,
          },
          sendNotificationEmail: false, // Disable unreliable Drive notifications
        });
        console.log(`✅ Shared with approver: ${approverEmail}`);
        
        // Send custom email notification
        const subject = `Document Approval Request: ${documentName}`;
        const htmlBody = createApprovalEmailTemplate(
          submittedBy, 
          documentName, 
          documentLink, 
          message, 
          dueDate, 
          allowEdits
        );
        
        const emailResult = await sendApprovalEmail(approverEmail, subject, htmlBody);
        if (emailResult.success) {
          console.log(`✅ Email notification sent to: ${approverEmail}`);
        } else {
          console.log(`⚠️ Email notification failed for ${approverEmail}: ${emailResult.error}`);
        }
        
      } catch (permErr) {
        console.log(`Warning: Could not share with ${approverEmail}:`, permErr.message);
      }
    });

    await Promise.all(sharePromises);

    // Lock file if requested
    if (lockFile) {
      try {
        // Get all current permissions
        const permissions = await drive.permissions.list({
          fileId: req.params.docId,
          fields: "permissions(id, emailAddress, role, type)",
        });

        // Update all non-owner permissions to reader
        const lockPromises = permissions.data.permissions
          ?.filter(perm => perm.role !== "owner")
          .map(async (perm) => {
            try {
              await drive.permissions.update({
                fileId: req.params.docId,
                permissionId: perm.id,
                requestBody: {
                  role: "reader",
                },
              });
            } catch (lockErr) {
              console.log(`Warning: Could not lock permission ${perm.id}:`, lockErr.message);
            }
          }) || [];

        await Promise.all(lockPromises);
        console.log("✅ File locked for approval process");
      } catch (lockErr) {
        console.log("Warning: Could not lock file:", lockErr.message);
      }
    }

    console.log("✅ Document submitted for approval");
    res.json({ 
      success: true, 
      status: "pending",
      approvers: approvers.length,
      locked: lockFile
    });
  } catch (err) {
    console.error("Error submitting for approval:", err);
    res.status(500).send("Error submitting document for approval");
  }
});

// 🔹 1️⃣4️⃣ Approve document
app.post("/google/docs/:docId/approve", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const { approvedBy, makeReadOnly } = req.body;

    console.log(`\n✅ POST /google/docs/${req.params.docId}/approve`);
    console.log(`Approved by: ${approvedBy}, Make read-only: ${makeReadOnly}`);

    // Update document properties
    await drive.files.update({
      fileId: req.params.docId,
      requestBody: {
        appProperties: {
          approvalStatus: "approved",
          approvedBy,
          approvedAt: new Date().toISOString(),
        },
      },
    });

    // Make document read-only if requested
    if (makeReadOnly) {
      // Get all permissions
      const permissions = await drive.permissions.list({
        fileId: req.params.docId,
        fields: "permissions(id, emailAddress, role, type)",
      });

      // Update all non-owner permissions to reader
      for (const perm of permissions.data.permissions || []) {
        if (perm.role !== "owner") {
          try {
            await drive.permissions.update({
              fileId: req.params.docId,
              permissionId: perm.id,
              requestBody: {
                role: "reader",
              },
            });
          } catch (permErr) {
            console.log(`Warning: Could not update permission ${perm.id}:`, permErr.message);
          }
        }
      }
    }

    // Send approval notification email to submitter
    try {
      const docInfo = await drive.files.get({
        fileId: req.params.docId,
        fields: "name, webViewLink",
      });
      
      const properties = await drive.files.get({
        fileId: req.params.docId,
        fields: "appProperties",
      });
      
      const submittedBy = properties.data.appProperties?.submittedBy;
      if (submittedBy) {
        const subject = `✅ Document Approved: ${docInfo.data.name}`;
        const htmlBody = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #4caf50; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2>✅ Document Approved</h2>
              </div>
              <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
                <p><strong>Great news!</strong> Your document has been approved.</p>
                <p><strong>Document:</strong> ${docInfo.data.name}</p>
                <p><strong>Approved by:</strong> ${approvedBy}</p>
                <p><strong>Approved at:</strong> ${new Date().toLocaleString()}</p>
                ${makeReadOnly ? '<p><strong>Status:</strong> Document is now read-only</p>' : ''}
                <p><a href="${docInfo.data.webViewLink}" style="background: #4caf50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">📄 View Document</a></p>
              </div>
            </div>
          </body>
          </html>
        `;
        
        await sendApprovalEmail(submittedBy, subject, htmlBody);
        console.log(`✅ Approval notification sent to: ${submittedBy}`);
      }
    } catch (emailErr) {
      console.log("Warning: Could not send approval notification:", emailErr.message);
    }

    console.log("✅ Document approved successfully");
    res.json({ success: true, status: "approved", isReadOnly: makeReadOnly });
  } catch (err) {
    console.error("Error approving document:", err);
    res.status(500).send("Error approving document");
  }
});

// 🔹 1️⃣5️⃣ Reject document
app.post("/google/docs/:docId/reject", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const { rejectedBy, reason } = req.body;

    console.log(`\n❌ POST /google/docs/${req.params.docId}/reject`);
    console.log(`Rejected by: ${rejectedBy}, Reason: ${reason}`);

    // Update document properties
    await drive.files.update({
      fileId: req.params.docId,
      requestBody: {
        appProperties: {
          approvalStatus: "rejected",
          rejectedBy,
          rejectedAt: new Date().toISOString(),
          rejectionReason: reason,
        },
      },
    });

    // Send rejection notification email to submitter
    try {
      const docInfo = await drive.files.get({
        fileId: req.params.docId,
        fields: "name, webViewLink",
      });
      
      const properties = await drive.files.get({
        fileId: req.params.docId,
        fields: "appProperties",
      });
      
      const submittedBy = properties.data.appProperties?.submittedBy;
      if (submittedBy) {
        const subject = `❌ Document Rejected: ${docInfo.data.name}`;
        const htmlBody = `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: #f44336; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2>❌ Document Rejected</h2>
              </div>
              <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
                <p>Your document has been rejected and requires revisions.</p>
                <p><strong>Document:</strong> ${docInfo.data.name}</p>
                <p><strong>Rejected by:</strong> ${rejectedBy}</p>
                <p><strong>Rejected at:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Reason:</strong> ${reason}</p>
                <p><a href="${docInfo.data.webViewLink}" style="background: #f44336; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">📄 View Document</a></p>
                <p><strong>Next Steps:</strong></p>
                <ul>
                  <li>Review the feedback provided</li>
                  <li>Make necessary revisions</li>
                  <li>Resubmit for approval when ready</li>
                </ul>
              </div>
            </div>
          </body>
          </html>
        `;
        
        await sendApprovalEmail(submittedBy, subject, htmlBody);
        console.log(`✅ Rejection notification sent to: ${submittedBy}`);
      }
    } catch (emailErr) {
      console.log("Warning: Could not send rejection notification:", emailErr.message);
    }

    console.log("✅ Document rejected");
    res.json({ success: true, status: "rejected" });
  } catch (err) {
    console.error("Error rejecting document:", err);
    res.status(500).send("Error rejecting document");
  }
});

// 🔹 1️⃣6️⃣ Grant edit access (admin only)
app.post("/google/docs/:docId/grant-edit-access", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const { userEmail, grantedBy } = req.body;

    console.log(`\n🔓 POST /google/docs/${req.params.docId}/grant-edit-access`);
    console.log(`Granting edit access to: ${userEmail} by ${grantedBy}`);

    // Find the permission for this user
    const permissions = await drive.permissions.list({
      fileId: req.params.docId,
      fields: "permissions(id, emailAddress, role)",
    });

    const userPerm = permissions.data.permissions?.find(
      (p) => p.emailAddress === userEmail
    );

    if (userPerm) {
      await drive.permissions.update({
        fileId: req.params.docId,
        permissionId: userPerm.id,
        requestBody: {
          role: "writer",
        },
      });
      console.log("✅ Edit access granted");
      res.json({ success: true, message: "Edit access granted" });
    } else {
      // Create new permission if user doesn't have access
      await drive.permissions.create({
        fileId: req.params.docId,
        requestBody: {
          type: "user",
          role: "writer",
          emailAddress: userEmail,
        },
        sendNotificationEmail: true,
      });
      console.log("✅ Edit access granted (new permission created)");
      res.json({ success: true, message: "Edit access granted" });
    }
  } catch (err) {
    console.error("Error granting edit access:", err);
    res.status(500).send("Error granting edit access");
  }
});

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
);
