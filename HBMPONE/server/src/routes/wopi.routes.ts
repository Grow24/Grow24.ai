import { Router } from 'express';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const router = Router();

// WOPI uploads directory
const WOPI_UPLOADS_DIR = path.join(__dirname, '../../uploads/wopi');

// Ensure uploads directory exists
async function ensureWopiDir() {
  if (!existsSync(WOPI_UPLOADS_DIR)) {
    await fs.mkdir(WOPI_UPLOADS_DIR, { recursive: true });
  }
}

/**
 * WOPI Auth Middleware
 * For MVP: Accept simple "dev-token" from query string or Authorization header
 * In production, validate actual tokens and map to user sessions
 */
function wopiAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  // Check query string first (WOPI standard)
  const token = req.query.access_token as string || req.headers.authorization?.replace('Bearer ', '');
  
  if (token !== 'dev-token') {
    return res.status(401).json({ error: 'Unauthorized - Invalid access token' });
  }
  
  // Token valid - continue
  next();
}

/**
 * GET /wopi/files/:fileId
 * Returns CheckFileInfo JSON with file metadata
 * https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/rest/files/checkfileinfo
 */
router.get('/files/:fileId', wopiAuth, async (req, res) => {
  try {
    const { fileId } = req.params;
    // Detect extension from fileId prefix
    const ext = fileId.startsWith('slide_') ? 'pptx' : 'xlsx';
    const filePath = path.join(WOPI_UPLOADS_DIR, `${fileId}.${ext}`);

    // Check if file exists, if not create empty placeholder
    await ensureWopiDir();
    if (!existsSync(filePath)) {
      // Create empty file for new documents
      await fs.writeFile(filePath, Buffer.from([]));
    }

    const stats = await fs.stat(filePath);
    
    // Return WOPI CheckFileInfo response
    const checkFileInfo = {
      // Required fields
      BaseFileName: `${fileId}.${ext}`,
      Size: stats.size,
      Version: stats.mtime.getTime().toString(), // Use modification time as version
      
      // User info (MVP: hardcoded)
      UserId: 'dev-user',
      UserFriendlyName: 'Dev User',
      
      // Permissions
      UserCanWrite: true,
      SupportsUpdate: true,
      SupportsLocks: false, // MVP: no lock support yet
      SupportsGetLock: false,
      
      // Optional but useful
      OwnerId: 'dev-user',
      LastModifiedTime: stats.mtime.toISOString(),
    };

    res.json(checkFileInfo);
  } catch (error) {
    console.error('WOPI CheckFileInfo error:', error);
    res.status(500).json({ error: 'Failed to get file info' });
  }
});

/**
 * GET /wopi/files/:fileId/contents
 * Returns the raw file bytes
 * https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/rest/files/getfile
 */
router.get('/files/:fileId/contents', wopiAuth, async (req, res) => {
  try {
    const { fileId } = req.params;
    // Detect extension from fileId prefix
    const ext = fileId.startsWith('slide_') ? 'pptx' : 'xlsx';
    const filePath = path.join(WOPI_UPLOADS_DIR, `${fileId}.${ext}`);

    await ensureWopiDir();

    // If file doesn't exist, return empty file
    if (!existsSync(filePath)) {
      return res.status(200).send(Buffer.from([]));
    }

    const fileBuffer = await fs.readFile(filePath);
    const stats = await fs.stat(filePath);

    // Set WOPI required headers
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', stats.size.toString());
    res.setHeader('X-WOPI-ItemVersion', stats.mtime.getTime().toString());
    
    res.send(fileBuffer);
  } catch (error) {
    console.error('WOPI GetFile error:', error);
    res.status(500).json({ error: 'Failed to get file contents' });
  }
});

/**
 * POST /wopi/files/:fileId/contents
 * Receives updated file bytes and saves them
 * https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/rest/files/putfile
 */
router.post(
  '/files/:fileId/contents',
  wopiAuth,
  express.raw({ type: '*/*', limit: '50mb' }), // Parse raw binary body
  async (req, res) => {
    try {
      const { fileId } = req.params;
      // Detect extension from fileId prefix
      const ext = fileId.startsWith('slide_') ? 'pptx' : 'xlsx';
      const filePath = path.join(WOPI_UPLOADS_DIR, `${fileId}.${ext}`);

      await ensureWopiDir();

      // Save the raw buffer to disk
      await fs.writeFile(filePath, req.body);

      const stats = await fs.stat(filePath);

      // Return success response with new version
      res.json({
        Name: `${fileId}.${ext}`,
        Size: stats.size,
        Version: stats.mtime.getTime().toString(),
        LastModifiedTime: stats.mtime.toISOString(),
      });

      console.log(`✅ WOPI: Saved file ${fileId}.${ext} (${stats.size} bytes)`);
    } catch (error) {
      console.error('WOPI PutFile error:', error);
      res.status(500).json({ error: 'Failed to save file contents' });
    }
  }
);

export default router;
