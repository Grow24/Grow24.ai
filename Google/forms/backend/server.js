import express from "express";
import cors from "cors";
import fs from "fs-extra";
import { google } from "googleapis";
import { oauth2Client, getAuthUrl } from "./googleClient.js";

const app = express();
const PORT = process.env.PORT || 3002;

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
      console.log("✅ Loaded existing Google tokens from file");
    } else {
      console.log("⚠️  No tokens found. Please authenticate at /google/auth");
    }
  } catch (err) {
    console.error("Error loading tokens:", err);
  }
})();

app.listen(PORT, () => {
  console.log(`🚀 HBMP Forms Backend running on http://localhost:${PORT}`);
});

// Helper function to create HTML email template for approval
function createApprovalEmailTemplate(submittedBy, formName, formLink, message, dueDate, allowEdits, formId) {
  const dueDateText = dueDate ? `<p><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}</p>` : '';
  
  const editPermissionText = allowEdits ? 
    '<p><strong>Permissions:</strong> You can edit this form</p>' : 
    '<p><strong>Permissions:</strong> You can view this form</p>';
  
  const appBaseUrl = 'http://localhost:5176/tools/forms';
  const approveLink = `${appBaseUrl}?formId=${formId}&action=approve`;
  const rejectLink = `${appBaseUrl}?formId=${formId}&action=reject`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f97316; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .button { 
          display: inline-block; 
          background: #f97316; 
          color: white !important; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 4px; 
          margin: 10px 5px;
          font-weight: bold;
        }
        .button:hover { background: #ea580c; }
        .button-success { background: #f97316; }
        .button-success:hover { background: #ea580c; }
        .button-danger { background: #ea4335; }
        .button-danger:hover { background: #c5362c; }
        .form-link { color: #f97316; text-decoration: none; word-break: break-all; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="color: white; margin: 0; font-size: 24px;">Form Approval Request</h2>
        </div>
        <div class="content">
          <p><strong>${submittedBy}</strong> has submitted a form for your approval.</p>
          
          <p><strong>Form:</strong> ${formName}</p>
          
          ${message ? `<p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>` : ''}
          
          ${dueDateText}
          
          ${editPermissionText}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${formLink}" class="button" style="color: white !important; text-decoration: none;" target="_blank">Open Form in Google Forms</a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 15px;">Take Action:</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${approveLink}" class="button button-success" style="color: white !important; text-decoration: none;" target="_blank">✓ Approve Form</a>
            <a href="${rejectLink}" class="button button-danger" style="color: white !important; text-decoration: none;" target="_blank">✗ Reject Form</a>
          </div>
          
          <p style="text-align: center; font-size: 12px; color: #666; font-style: italic;">
            These buttons will open HBMP Tools where you can review and approve/reject the form.
          </p>
          
          <p><strong>Instructions:</strong></p>
          <ul>
            <li>Click "Open Form" to review the questions and settings in Google Forms</li>
            <li>After reviewing, click "Approve" or "Reject" button above</li>
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
  res.json({ status: "ok", message: "HBMP Forms Backend is running on port " + PORT });
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
    res.send("✅ Google account connected successfully! You can close this window and return to HBMP Forms.");
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.status(500).send("OAuth error");
  }
});

// 🔹 3️⃣ List Google Forms from Drive
app.get("/google/forms/list", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const forms = google.forms({ version: "v1", auth: oauth2Client });

    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.form' and trashed=false",
      fields: "files(id, name, webViewLink, createdTime, modifiedTime)",
      pageSize: 100,
      orderBy: "modifiedTime desc",
    });

    // Fetch responderUri for each form
    const filesWithResponderUri = await Promise.all(
      (response.data.files || []).map(async (file) => {
        try {
          const formDetails = await forms.forms.get({ formId: file.id });
          return {
            ...file,
            editLink: `https://docs.google.com/forms/d/${file.id}/edit`,
            responderUri: formDetails.data.responderUri || file.webViewLink,
          };
        } catch (err) {
          console.error(`Error fetching responderUri for ${file.id}:`, err.message);
          return {
            ...file,
            editLink: `https://docs.google.com/forms/d/${file.id}/edit`,
            responderUri: file.webViewLink, // Fallback to edit link
          };
        }
      })
    );

    console.log(`📋 Found ${filesWithResponderUri.length} forms`);
    res.json({ files: filesWithResponderUri });
  } catch (err) {
    console.error("Error listing forms:", err);
    res.status(500).send("Error listing forms");
  }
});

// 🔹 4️⃣ Create a new Google Form
app.post("/google/forms/create", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const forms = google.forms({ version: "v1", auth: oauth2Client });
    const { title, description, questions } = req.body;
    const formTitle = title || `New Form ${new Date().toLocaleString()}`;

    // Create the form
    const created = await forms.forms.create({
      requestBody: {
        info: {
          title: formTitle,
          documentTitle: formTitle,
        },
      },
    });

    const formId = created.data.formId;

    // Add description if provided
    if (description || (questions && questions.length > 0)) {
      const updates = [];

      // Add description
      if (description) {
        updates.push({
          updateFormInfo: {
            info: {
              title: formTitle,
              description: description,
            },
            updateMask: "description",
          },
        });
      }

      // Add questions
      if (questions && questions.length > 0) {
        questions.forEach((question, index) => {
          updates.push({
            createItem: {
              item: {
                title: question.title,
                questionItem: {
                  question: {
                    required: question.required || false,
                    [question.type]: question.options || {},
                  },
                },
              },
              location: {
                index: index,
              },
            },
          });
        });
      }

      // Apply updates
      if (updates.length > 0) {
        await forms.forms.batchUpdate({
          formId: formId,
          requestBody: {
            requests: updates,
          },
        });
      }
    }

    // Get the form details
    const form = await forms.forms.get({ formId });

    // Get webViewLink from Drive
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const meta = await drive.files.get({
      fileId: formId,
      fields: "id, name, webViewLink",
    });

    console.log(`✅ Created form: ${meta.data.name}`);
    res.json({
      id: meta.data.id,
      name: meta.data.name,
      webViewLink: meta.data.webViewLink,
      editLink: `https://docs.google.com/forms/d/${formId}/edit`,
      formId: formId,
      responderUri: form.data.responderUri,
    });
  } catch (err) {
    console.error("Error creating form:", err.message || err);
    res.status(500).json({ 
      error: "Error creating form", 
      details: err.message,
      code: err.code 
    });
  }
});

// 🔹 5️⃣ Get Form Details
app.get("/google/forms/:formId", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const forms = google.forms({ version: "v1", auth: oauth2Client });
    const { formId } = req.params;

    const form = await forms.forms.get({ formId });

    console.log(`📋 Retrieved form: ${form.data.info.title}`);
    res.json(form.data);
  } catch (err) {
    console.error("Error getting form:", err);
    res.status(500).send("Error getting form details");
  }
});

// 🔹 6️⃣ Delete a Form
app.delete("/google/forms/:formId", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const { formId } = req.params;

    console.log(`🗑️ Attempting to delete form: ${formId}`);

    await drive.files.delete({ fileId: formId });

    console.log(`✅ Form deleted: ${formId}`);
    res.json({ success: true, message: "Form deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting form:", err.message || err);
    res.status(500).json({ 
      error: "Error deleting form", 
      details: err.message,
      code: err.code 
    });
  }
});

// 🔹 7️⃣ Rename a Form
app.put("/google/forms/:formId/rename", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const forms = google.forms({ version: "v1", auth: oauth2Client });
    const { formId } = req.params;
    const { name } = req.body;

    // Update in Drive
    await drive.files.update({
      fileId: formId,
      requestBody: { name },
    });

    // Update form title
    await forms.forms.batchUpdate({
      formId: formId,
      requestBody: {
        requests: [{
          updateFormInfo: {
            info: {
              title: name,
            },
            updateMask: "title",
          },
        }],
      },
    });

    console.log(`✏️ Renamed form to: ${name}`);
    res.json({ success: true, name });
  } catch (err) {
    console.error("Error renaming form:", err);
    res.status(500).send("Error renaming form");
  }
});

// 🔹 8️⃣ Copy a Form
app.post("/google/forms/:formId/copy", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const forms = google.forms({ version: "v1", auth: oauth2Client });
    const { formId } = req.params;

    // Get the original form name
    const originalFile = await drive.files.get({
      fileId: formId,
      fields: "name",
    });

    const originalName = originalFile.data.name;
    const copyName = `Copy of ${originalName}`;

    // Copy the file in Drive
    const copiedFile = await drive.files.copy({
      fileId: formId,
      requestBody: {
        name: copyName,
      },
      fields: "id, name, webViewLink, createdTime, modifiedTime",
    });

    const copiedFormId = copiedFile.data.id;

    // Ensure the copied form is published
    try {
      await forms.forms.batchUpdate({
        formId: copiedFormId,
        requestBody: {
          requests: [{
            updateSettings: {
              settings: {
                publishSettings: {
                  isPublished: true,
                  isAcceptingResponses: true
                }
              },
              updateMask: "publishSettings.isPublished,publishSettings.isAcceptingResponses"
            }
          }]
        }
      });
      console.log(`✅ Published copied form: ${copiedFormId}`);
    } catch (publishErr) {
      console.warn(`⚠️ Could not publish form (may already be published): ${publishErr.message}`);
    }

    // Get the form details including responderUri
    const formDetails = await forms.forms.get({
      formId: copiedFormId,
    });

    console.log(`📋 Created copy: ${copyName} (${copiedFormId})`);
    
    res.json({
      id: copiedFormId,
      name: copiedFile.data.name,
      webViewLink: copiedFile.data.webViewLink,
      editLink: `https://docs.google.com/forms/d/${copiedFormId}/edit`,
      responderUri: formDetails.data.responderUri,
      createdTime: copiedFile.data.createdTime,
      modifiedTime: copiedFile.data.modifiedTime,
    });
  } catch (err) {
    console.error("❌ Error copying form:", err.message || err);
    res.status(500).json({ 
      error: "Error copying form", 
      details: err.message,
      code: err.code 
    });
  }
});

// 🔹 🔟 Update Form (Add/Edit/Delete Questions)
app.post("/google/forms/:formId/update", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const forms = google.forms({ version: "v1", auth: oauth2Client });
    const { formId } = req.params;
    const { requests } = req.body;

    if (!requests || !Array.isArray(requests)) {
      return res.status(400).json({ error: "requests array is required" });
    }

    // Apply the batch update
    const result = await forms.forms.batchUpdate({
      formId,
      requestBody: { requests }
    });

    console.log(`✏️ Updated form: ${formId} with ${requests.length} requests`);
    
    // Get the updated form details
    const updatedForm = await forms.forms.get({ formId });
    
    res.json({
      success: true,
      replies: result.data.replies,
      form: updatedForm.data
    });
  } catch (err) {
    console.error("❌ Error updating form:", err.message || err);
    res.status(500).json({ 
      error: "Error updating form", 
      details: err.message,
      code: err.code 
    });
  }
});

// 🔹 9️⃣ Get Form Responses
app.get("/google/forms/:formId/responses", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const forms = google.forms({ version: "v1", auth: oauth2Client });
    const { formId } = req.params;

    const responses = await forms.forms.responses.list({ formId });

    console.log(`📊 Retrieved ${responses.data.responses?.length || 0} responses`);
    res.json(responses.data);
  } catch (err) {
    console.error("Error getting responses:", err);
    res.status(500).send("Error getting form responses");
  }
});

// 🔹 9️⃣ List Form Collaborators
app.get("/google/forms/:formId/collaborators", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const { formId } = req.params;

    const permissions = await drive.permissions.list({
      fileId: formId,
      fields: "permissions(id, emailAddress, role, type, displayName)",
    });

    console.log(`👥 Found ${permissions.data.permissions?.length || 0} collaborators`);
    res.json(permissions.data.permissions || []);
  } catch (err) {
    console.error("Error listing collaborators:", err);
    res.status(500).send("Error listing collaborators");
  }
});

// 🔹 🔟 Share Form with User
app.post("/google/forms/:formId/share", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const { formId } = req.params;
    const { email, role } = req.body;

    const permission = await drive.permissions.create({
      fileId: formId,
      requestBody: {
        type: "user",
        role: role || "writer",
        emailAddress: email,
      },
      sendNotificationEmail: true,
    });

    console.log(`📧 Shared form with: ${email} as ${role}`);
    res.json(permission.data);
  } catch (err) {
    console.error("Error sharing form:", err);
    res.status(500).send("Error sharing form");
  }
});

// 🔹 1️⃣1️⃣ Update Collaborator Role
app.patch("/google/forms/:formId/collaborators/:permissionId", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const { formId, permissionId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!["reader", "writer", "commenter"].includes(role)) {
      return res.status(400).send("Invalid role. Must be reader, writer, or commenter");
    }

    const updatedPermission = await drive.permissions.update({
      fileId: formId,
      permissionId: permissionId,
      requestBody: {
        role: role,
      },
      fields: "id, emailAddress, role, type, displayName",
    });

    console.log(`✏️ Updated collaborator ${permissionId} role to: ${role}`);
    res.json(updatedPermission.data);
  } catch (err) {
    console.error("Error updating collaborator role:", err);
    res.status(500).send("Error updating collaborator role");
  }
});

// 🔹 1️⃣2️⃣ Remove Collaborator
app.delete("/google/forms/:formId/collaborators/:permissionId", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const { formId, permissionId } = req.params;

    await drive.permissions.delete({
      fileId: formId,
      permissionId: permissionId,
    });

    console.log(`🗑️ Removed collaborator: ${permissionId}`);
    res.json({ success: true });
  } catch (err) {
    console.error("Error removing collaborator:", err);
    res.status(500).send("Error removing collaborator");
  }
});

// 🔹 1️⃣3️⃣ Submit Form for Approval
app.post("/google/forms/:formId/submit-approval", async (req, res) => {
  try {
    if (!tokens) return res.status(401).send("Not authorized");
    oauth2Client.setCredentials(tokens);

    const { formId } = req.params;
    const { approvers, message, dueDate, allowEdits, lockFile, submittedBy } = req.body;

    // Get form details
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const forms = google.forms({ version: "v1", auth: oauth2Client });
    
    const formMeta = await drive.files.get({
      fileId: formId,
      fields: "id, name, webViewLink",
    });

    const formName = formMeta.data.name;
    const formLink = formMeta.data.webViewLink;

    // Send email to each approver
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    
    for (const approverEmail of approvers) {
      const emailContent = createApprovalEmailTemplate(
        submittedBy,
        formName,
        formLink,
        message,
        dueDate,
        allowEdits,
        formId
      );

      const rawEmail = [
        `To: ${approverEmail}`,
        `Subject: Form Approval Request: ${formName}`,
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

      console.log(`📧 Approval email sent to: ${approverEmail}`);
    }

    // Store approval metadata (in production, use a database)
    const approvalData = {
      status: "pending",
      submittedBy,
      approvers,
      message,
      dueDate,
      allowEdits,
      lockFile,
      submittedAt: new Date().toISOString(),
    };

    console.log(`✅ Form submitted for approval:`, approvalData);
    res.json({ success: true, approval: approvalData });
  } catch (err) {
    console.error("Error submitting approval:", err);
    res.status(500).send("Error submitting form for approval");
  }
});

// 🔹 1️⃣3️⃣ Get Approval Status
app.get("/google/forms/:formId/approval-status", async (req, res) => {
  try {
    // In production, retrieve from database
    // For now, return mock data
    res.json({
      status: "draft",
      submittedBy: null,
      approvers: [],
      dueDate: null,
      isReadOnly: false,
    });
  } catch (err) {
    console.error("Error getting approval status:", err);
    res.status(500).send("Error getting approval status");
  }
});

// 🔹 1️⃣4️⃣ Approve Form
app.post("/google/forms/:formId/approve", async (req, res) => {
  try {
    const { formId } = req.params;
    
    console.log(`✅ Form approved: ${formId}`);
    res.json({ success: true, status: "approved" });
  } catch (err) {
    console.error("Error approving form:", err);
    res.status(500).send("Error approving form");
  }
});

// 🔹 1️⃣5️⃣ Reject Form
app.post("/google/forms/:formId/reject", async (req, res) => {
  try {
    const { formId } = req.params;
    
    console.log(`❌ Form rejected: ${formId}`);
    res.json({ success: true, status: "rejected" });
  } catch (err) {
    console.error("Error rejecting form:", err);
    res.status(500).send("Error rejecting form");
  }
});
