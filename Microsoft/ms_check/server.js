require('dotenv').config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
app.use(bodyParser.json());

// Configure session middleware for multi-client support
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS attacks
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files
app.use(express.static('public'));

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SCOPES = "openid profile email User.Read Files.Read.All Files.ReadWrite.All Team.ReadBasic.All Channel.ReadBasic.All ChannelMessage.Read.All TeamMember.Read.All Notes.Read offline_access";

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.accessToken) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Please login first',
      loginUrl: '/auth/login'
    });
  }
  next();
};

// Home route - removed, now served from public/index.html

// Initiate OAuth login
app.get('/auth/login', (req, res) => {
  // Use 'select_account' to force account picker, or 'consent' to force re-consent
  // For multi-client support, use 'select_account' to let users choose which account to use
  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&prompt=select_account`;
  res.redirect(authUrl);
});

// OAuth callback endpoint
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;
  const error = req.query.error;
  const errorDescription = req.query.error_description;
  
  // Handle OAuth errors
  if (error) {
    console.error("❌ OAuth Error:", error, errorDescription);
    return res.send(`
      <html>
        <head>
          <title>Authentication Error</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 40px; max-width: 600px; margin: 0 auto; }
            h2 { color: #e53e3e; }
            .error-box { background: #fff5f5; border: 1px solid #feb2b2; padding: 20px; border-radius: 8px; }
            .solution { background: #f0f9ff; border: 1px solid #bfdbfe; padding: 20px; border-radius: 8px; margin-top: 20px; }
            code { background: #edf2f7; padding: 2px 6px; border-radius: 4px; }
            a { color: #3182ce; text-decoration: none; font-weight: 600; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h2>Authentication Failed</h2>
          <div class="error-box">
            <p><strong>Error:</strong> ${error}</p>
            <p><strong>Description:</strong> ${errorDescription || 'No description provided'}</p>
          </div>
          <div class="solution">
            <h3>💡 Solution:</h3>
            <p>This error usually means:</p>
            <ol>
              <li>You need to grant permission to the app to access your Microsoft account</li>
              <li>Some scopes require admin consent (if using work/school account)</li>
              <li>The app needs to be registered as "multi-tenant" in Azure</li>
            </ol>
            <p><a href="/auth/login">Try Again</a> | <a href="/">Back to Home</a></p>
          </div>
        </body>
      </html>
    `);
  }
  
  if (!code) return res.send("Missing code");

try {
  const response = await axios.post(
    "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    new URLSearchParams({
      client_id: CLIENT_ID,
      scope: SCOPES,
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
      client_secret: CLIENT_SECRET
    }).toString(),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  const { access_token, expires_in, refresh_token } = response.data;
  
  // Store tokens securely in server-side session
  req.session.accessToken = access_token;
  req.session.refreshToken = refresh_token;
  req.session.expiresAt = Date.now() + (expires_in * 1000);
  
  console.log("✅ Token acquired successfully for user session:", req.sessionID);
  
  // Redirect to dashboard (no token in URL)
  res.redirect(`/dashboard.html`);
} catch (err) {
  console.error("❌ Token Exchange Error:", err.response?.data || err.message);
  const errorData = err.response?.data || {};
  res.send(`
    <html>
      <head>
        <title>Token Exchange Failed</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h2 { color: #e53e3e; }
          .error-box { background: #fff5f5; border: 1px solid #feb2b2; padding: 20px; border-radius: 8px; }
          pre { background: #2d3748; color: #e2e8f0; padding: 15px; border-radius: 8px; overflow-x: auto; }
          a { color: #3182ce; text-decoration: none; font-weight: 600; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <h2>Token Exchange Failed</h2>
        <div class="error-box">
          <p><strong>Error:</strong> ${errorData.error || 'Unknown error'}</p>
          <p><strong>Description:</strong> ${errorData.error_description || err.message}</p>
        </div>
        <h3>Error Details:</h3>
        <pre>${JSON.stringify(errorData, null, 2)}</pre>
        <p><a href="/auth/login">Try Again</a> | <a href="/">Back to Home</a></p>
      </body>
    </html>
  `);
}})

// Logout endpoint - destroy session
app.get('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Logout error:", err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.redirect('/');
  });
});

// Check authentication status
app.get('/api/auth/status', (req, res) => {
  if (req.session.accessToken) {
    const isExpired = req.session.expiresAt && Date.now() > req.session.expiresAt;
    res.json({
      authenticated: !isExpired,
      expiresAt: req.session.expiresAt,
      sessionId: req.sessionID
    });
  } else {
    res.json({ authenticated: false });
  }
});

app.listen(process.env.PORT || 5173, () => console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5173}`));

// API Endpoints for testing

// Get user profile (now uses session)
app.get("/api/me", requireAuth, async (req, res) => {
  try {
    const response = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${req.session.accessToken}` },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Graph /me Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Get profile photo
app.get("/api/photo", requireAuth, async (req, res) => {
  try {
    const response = await axios.get("https://graph.microsoft.com/v1.0/me/photo/$value", {
      headers: { Authorization: `Bearer ${req.session.accessToken}` },
      responseType: 'arraybuffer'
    });
    res.set('Content-Type', 'image/jpeg');
    res.send(response.data);
  } catch (err) {
    console.error("Graph /photo Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Photo not available or error occurred" });
  }
});

// List OneDrive files
app.get("/api/drive", requireAuth, async (req, res) => {
  try {
    // Fetch with expanded query to get more results
    const response = await axios.get(
      "https://graph.microsoft.com/v1.0/me/drive/root/children?$top=1000&$select=id,name,size,lastModifiedDateTime,folder,file,webUrl",
      {
        headers: { Authorization: `Bearer ${req.session.accessToken}` },
      }
    );
    
    console.log(`📂 Found ${response.data.value?.length || 0} items in OneDrive root`);
    res.json(response.data);
  } catch (err) {
    console.error("Graph /drive Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Get folder contents (for navigation)
app.get("/api/folder/:folderId/children", requireAuth, async (req, res) => {
  const folderId = req.params.folderId;
  
  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/items/${folderId}/children?$top=1000&$select=id,name,size,lastModifiedDateTime,folder,file,webUrl`,
      {
        headers: { Authorization: `Bearer ${req.session.accessToken}` },
      }
    );
    
    console.log(`📂 Found ${response.data.value?.length || 0} items in folder ${folderId}`);
    res.json(response.data);
  } catch (err) {
    console.error("Graph /folder/:folderId/children Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// List Excel files only
app.get("/api/excel/files", requireAuth, async (req, res) => {
  const token = req.session.accessToken;

  try {
    console.log("🔍 Searching for Excel files...");
    
    // Try multiple approaches to find Excel files
    let allFiles = [];
    
    // Method 1: Get all files from root and check recursively
    try {
      const rootResponse = await axios.get(
        "https://graph.microsoft.com/v1.0/me/drive/root/children",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      console.log(`📂 Found ${rootResponse.data.value.length} items in OneDrive root`);
      
      // Process root files
      for (const item of rootResponse.data.value) {
        // Check if it's a file (not a folder)
        const isFile = item.file || !item.folder;
        const name = (item.name || '').toLowerCase();
        const isExcel = name.endsWith('.xlsx') || name.endsWith('.xls');
        
        console.log(`  📄 ${item.name}: isFile=${!!item.file}, isFolder=${!!item.folder}, isExcel=${isExcel}`);
        
        if (isFile && isExcel) {
          allFiles.push(item);
          console.log(`    ✅ Added Excel file: ${item.name}`);
        }
        
        // If it's a folder, search inside it
        if (item.folder) {
          try {
            const folderResponse = await axios.get(
              `https://graph.microsoft.com/v1.0/me/drive/items/${item.id}/children`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            const excelInFolder = folderResponse.data.value.filter(f => {
              const name = f.name?.toLowerCase() || '';
              return f.file && (name.endsWith('.xlsx') || name.endsWith('.xls'));
            });
            allFiles = allFiles.concat(excelInFolder);
          } catch (folderErr) {
            console.log(`⚠️  Could not access folder ${item.name}`);
          }
        }
      }
      console.log(`✅ Found ${allFiles.length} Excel files using folder traversal`);
    } catch (err) {
      console.log("⚠️  Folder traversal failed, trying search API...");
    }
    
    // Method 2: Use search API as fallback (if Method 1 found nothing)
    if (allFiles.length === 0) {
      try {
        const searchResponse = await axios.get(
          "https://graph.microsoft.com/v1.0/me/drive/root/search(q='.xlsx')",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        allFiles = searchResponse.data.value.filter(f => {
          const name = f.name?.toLowerCase() || '';
          return f.file && (name.endsWith('.xlsx') || name.endsWith('.xls'));
        });
        console.log(`✅ Found ${allFiles.length} Excel files using search API`);
      } catch (searchErr) {
        console.log("⚠️  Search API also failed");
      }
    }
    
    // Map files with embed URL
    const excelFiles = allFiles.map(file => {
      // Use the @content.downloadUrl for embedding (temporary authenticated URL)
      const embedUrl = file['@microsoft.graph.downloadUrl'] 
        ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file['@microsoft.graph.downloadUrl'])}`
        : file.webUrl; // Fallback to regular webUrl
      
      return {
        id: file.id,
        name: file.name,
        webUrl: file.webUrl,
        embedUrl: embedUrl,
        downloadUrl: file['@microsoft.graph.downloadUrl'],
        size: file.size,
        lastModifiedDateTime: file.lastModifiedDateTime,
        createdDateTime: file.createdDateTime,
        parentPath: file.parentReference?.path || '/'
      };
    });    console.log(`📊 Returning ${excelFiles.length} Excel files`);
    res.json({ value: excelFiles });
  } catch (err) {
    console.error("❌ Graph /excel/files Error:", err.response?.data || err.message);
    res.status(500).json({ 
      error: err.response?.data || err.message,
      details: "Failed to retrieve Excel files. Check server logs for details."
    });
  }
});

// Get specific Excel file details with embed URL
app.get("/api/excel/:fileId", requireAuth, async (req, res) => {
  const token = req.session.accessToken;
  const fileId = req.params.fileId;

  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    const file = response.data;
    
    // Use downloadUrl for authenticated embedding
    const embedUrl = file['@microsoft.graph.downloadUrl']
      ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file['@microsoft.graph.downloadUrl'])}`
      : file.webUrl;
    
    // Return file with embed URL
    res.json({
      id: file.id,
      name: file.name,
      webUrl: file.webUrl,
      embedUrl: embedUrl,
      downloadUrl: file['@microsoft.graph.downloadUrl'],
      size: file.size,
      lastModifiedDateTime: file.lastModifiedDateTime,
      createdDateTime: file.createdDateTime
    });
  } catch (err) {
    console.error("Graph /excel/:fileId Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Get specific Word document details with embed URL
app.get("/api/word/:fileId", requireAuth, async (req, res) => {
  const token = req.session.accessToken;
  const fileId = req.params.fileId;

  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    const file = response.data;
    
    // Use downloadUrl for authenticated embedding
    const embedUrl = file['@microsoft.graph.downloadUrl']
      ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file['@microsoft.graph.downloadUrl'])}`
      : file.webUrl;
    
    // Return file with embed URL
    res.json({
      id: file.id,
      name: file.name,
      webUrl: file.webUrl,
      embedUrl: embedUrl,
      downloadUrl: file['@microsoft.graph.downloadUrl'],
      size: file.size,
      lastModifiedDateTime: file.lastModifiedDateTime,
      createdDateTime: file.createdDateTime
    });
  } catch (err) {
    console.error("Graph /word/:fileId Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Get specific PowerPoint presentation details with embed URL
app.get("/api/powerpoint/:fileId", requireAuth, async (req, res) => {
  const token = req.session.accessToken;
  const fileId = req.params.fileId;

  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    const file = response.data;
    
    // Use downloadUrl for authenticated embedding
    const embedUrl = file['@microsoft.graph.downloadUrl']
      ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(file['@microsoft.graph.downloadUrl'])}`
      : file.webUrl;
    
    // Return file with embed URL
    res.json({
      id: file.id,
      name: file.name,
      webUrl: file.webUrl,
      embedUrl: embedUrl,
      downloadUrl: file['@microsoft.graph.downloadUrl'],
      size: file.size,
      lastModifiedDateTime: file.lastModifiedDateTime,
      createdDateTime: file.createdDateTime
    });
  } catch (err) {
    console.error("Graph /powerpoint/:fileId Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Generic file endpoint for other file types
app.get("/api/file/:fileId", requireAuth, async (req, res) => {
  const token = req.session.accessToken;
  const fileId = req.params.fileId;

  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    const file = response.data;
    
    // For direct viewing, use the downloadUrl directly (it's a temporary authenticated URL from Microsoft)
    const downloadUrl = file['@microsoft.graph.downloadUrl'];
    
    // Return file info
    res.json({
      id: file.id,
      name: file.name,
      webUrl: file.webUrl,
      embedUrl: downloadUrl, // Use direct download URL for embedding
      downloadUrl: downloadUrl,
      mimeType: file.file?.mimeType,
      size: file.size,
      lastModifiedDateTime: file.lastModifiedDateTime,
      createdDateTime: file.createdDateTime
    });
  } catch (err) {
    console.error("Graph /file/:fileId Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Get recent files
app.get("/api/recent", requireAuth, async (req, res) => {
  const token = req.session.accessToken;
  if (!token) return res.status(400).json({ error: "Missing access token" });

  try {
    const response = await axios.get("https://graph.microsoft.com/v1.0/me/drive/recent", {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Graph /recent Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Get Microsoft Forms
app.get("/api/forms", requireAuth, async (req, res) => {
  const token = req.session.accessToken;
  if (!token) return res.status(400).json({ error: "Missing access token" });

  try {
    // Microsoft Forms API endpoint - list all forms created by the user
    // Using the Forms API in Microsoft Graph (beta endpoint has better support)
    const response = await axios.get(
      "https://graph.microsoft.com/beta/me/forms",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    console.log(`📝 Found ${response.data.value?.length || 0} Microsoft Forms`);
    res.json(response.data);
  } catch (err) {
    console.error("Graph /forms Error:", err.response?.data || err.message);
    
    // Return the actual error to the frontend so it can handle MSA limitation
    res.status(err.response?.status || 500).json(err.response?.data || { 
      error: { message: err.message }
    });
  }
});

// OneNote: list notebooks
app.get("/api/onenote/notebooks", requireAuth, async (req, res) => {
  const token = req.session.accessToken;
  if (!token) return res.status(400).json({ error: "Missing access token" });

  try {
    const response = await axios.get(
      "https://graph.microsoft.com/v1.0/me/onenote/notebooks?$top=200",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Graph /onenote/notebooks Error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: { message: err.message } });
  }
});

// OneNote: list sections for a notebook
app.get("/api/onenote/notebooks/:notebookId/sections", requireAuth, async (req, res) => {
  const token = req.session.accessToken;
  const { notebookId } = req.params;
  if (!token) return res.status(400).json({ error: "Missing access token" });

  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/onenote/notebooks/${notebookId}/sections?$top=500`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(`Graph /onenote/notebooks/${notebookId}/sections Error:`, err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: { message: err.message } });
  }
});

// OneNote: list pages for a section
app.get("/api/onenote/sections/:sectionId/pages", requireAuth, async (req, res) => {
  const token = req.session.accessToken;
  const { sectionId } = req.params;
  if (!token) return res.status(400).json({ error: "Missing access token" });

  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/onenote/sections/${sectionId}/pages?$top=500&$orderby=createdDateTime desc`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(`Graph /onenote/sections/${sectionId}/pages Error:`, err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { error: { message: err.message } });
  }
});

// OneNote: get page content (HTML)
app.get("/api/onenote/pages/:pageId/content", requireAuth, async (req, res) => {
  const token = req.session.accessToken;
  const { pageId } = req.params;
  if (!token) return res.status(400).json({ error: "Missing access token" });

  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/onenote/pages/${pageId}/content`,
      {
        headers: { Authorization: `Bearer ${token}`, Accept: 'text/html' },
      }
    );

    // Return HTML as a string in JSON to the frontend
    res.json({ content: response.data });
  } catch (err) {
    console.error(`Graph /onenote/pages/${pageId}/content Error:`, err.response?.data || err.message);
    // Graph may return HTML or JSON error; forward the error JSON when available
    res.status(err.response?.status || 500).json(err.response?.data || { error: { message: err.message } });
  }
});

// Get Microsoft Teams
app.get("/api/teams", requireAuth, async (req, res) => {
  const token = req.session.accessToken;
  if (!token) return res.status(400).json({ error: "Missing access token" });

  try {
    const response = await axios.get(
      "https://graph.microsoft.com/v1.0/me/joinedTeams",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    console.log(`👥 Found ${response.data.value?.length || 0} Teams`);
    res.json(response.data);
  } catch (err) {
    console.error("Graph /teams Error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { 
      error: { message: err.message }
    });
  }
});

// Get channels for a specific team
app.get("/api/teams/:teamId/channels", requireAuth, async (req, res) => {
  const token = req.session.accessToken;
  const { teamId } = req.params;
  
  if (!token) return res.status(400).json({ error: "Missing access token" });

  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/teams/${teamId}/channels`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    res.json(response.data);
  } catch (err) {
    console.error(`Graph /teams/${teamId}/channels Error:`, err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { 
      error: { message: err.message }
    });
  }
});

// Get OneNote notebooks
app.get("/api/onenote/notebooks", requireAuth, async (req, res) => {
  const token = req.session.accessToken;
  if (!token) return res.status(400).json({ error: "Missing access token" });

  try {
    const response = await axios.get(
      "https://graph.microsoft.com/v1.0/me/onenote/notebooks",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    console.log(`📓 Found ${response.data.value?.length || 0} OneNote notebooks`);
    res.json(response.data);
  } catch (err) {
    console.error("Graph /onenote/notebooks Error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { 
      error: { message: err.message }
    });
  }
});

// Get sections for a specific notebook
app.get("/api/onenote/notebooks/:notebookId/sections", requireAuth, async (req, res) => {
  const token = req.session.accessToken;
  const { notebookId } = req.params;
  
  if (!token) return res.status(400).json({ error: "Missing access token" });

  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/onenote/notebooks/${notebookId}/sections`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    res.json(response.data);
  } catch (err) {
    console.error(`Graph /onenote/notebooks/${notebookId}/sections Error:`, err.response?.data || err.message);
    res.status(err.response?.status || 500).json(err.response?.data || { 
      error: { message: err.message }
    });
  }
});

// Debug: List ALL files (for troubleshooting)
app.get("/api/debug/all-files", requireAuth, async (req, res) => {
  const token = req.session.accessToken;

  try {
    console.log("🐛 Debug: Fetching ALL files from OneDrive root...");
    const response = await axios.get(
      "https://graph.microsoft.com/v1.0/me/drive/root/children",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    const files = response.data.value.map(item => ({
      name: item.name,
      type: item.folder ? 'folder' : 'file',
      size: item.size,
      extension: item.name.split('.').pop(),
      webUrl: item.webUrl
    }));
    
    console.log(`📂 Found ${files.length} items in root`);
    console.log(files);
    
    res.json({ 
      total: files.length,
      files: files 
    });
  } catch (err) {
    console.error("Graph /debug/all-files Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Get shared files
app.get("/api/shared", requireAuth, async (req, res) => {
  const token = req.session.accessToken;

  try {
    const response = await axios.get("https://graph.microsoft.com/v1.0/me/drive/sharedWithMe", {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Graph /shared Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// List SharePoint sites
app.get("/api/sites", requireAuth, async (req, res) => {
  const token = req.session.accessToken;

  try {
    const response = await axios.get("https://graph.microsoft.com/v1.0/sites?search=*", {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (err) {
    console.error("Graph /sites Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Upload test file
app.get("/api/upload-test", requireAuth, async (req, res) => {
  const token = req.session.accessToken;
  if (!token) return res.status(400).json({ error: "Missing access token" });

  try {
    const fileName = `test-${Date.now()}.txt`;
    const fileContent = `This is a test file created at ${new Date().toISOString()}`;
    
    const response = await axios.put(
      `https://graph.microsoft.com/v1.0/me/drive/root:/${fileName}:/content`,
      fileContent,
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/plain'
        },
      }
    );
    res.json({ success: true, file: response.data });
  } catch (err) {
    console.error("Graph /upload Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Search files
app.get("/api/search", requireAuth, async (req, res) => {
  const token = req.session.accessToken;
  const query = req.query.q || 'test';

  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/me/drive/root/search(q='${query}')`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("Graph /search Error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// Legacy endpoints for backward compatibility
app.get("/me", requireAuth, async (req, res) => {
  const token = req.session.accessToken;

  try {
    const response = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    res.send(`<h2>👤 Microsoft User Profile</h2><pre>${JSON.stringify(response.data, null, 2)}</pre>`);
  } catch (err) {
    console.error("Graph /me Error:", err.response?.data || err.message);
    res.status(500).send(`<h3>Error fetching profile</h3><pre>${JSON.stringify(err.response?.data || err.message, null, 2)}</pre>`);
  }
});

// Test route: get OneDrive root files
app.get("/drive", requireAuth, async (req, res) => {
  const token = req.session.accessToken;

  try {
    const response = await axios.get("https://graph.microsoft.com/v1.0/me/drive/root/children", {
      headers: { Authorization: `Bearer ${token}` },
    });

    res.send(`<h2>📁 OneDrive Root Files</h2><pre>${JSON.stringify(response.data, null, 2)}</pre>`);
  } catch (err) {
    console.error("Graph /drive Error:", err.response?.data || err.message);
    res.status(500).send(`<h3>Error fetching files</h3><pre>${JSON.stringify(err.response?.data || err.message, null, 2)}</pre>`);
  }
});
