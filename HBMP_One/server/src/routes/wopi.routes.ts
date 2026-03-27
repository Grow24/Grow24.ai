import { Router } from 'express';
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { decodeWopiToken } from '../utils/wopiToken';
import { checkFileAccess } from '../services/share.service';

const router = Router();

// WOPI uploads directory
const WOPI_UPLOADS_DIR = path.join(__dirname, '../../uploads/wopi');

// File locks storage (in-memory for MVP, migrate to Redis/DB in production)
interface FileLock {
  lockId: string;
  fileId: string;
  userId: string;
  userName: string;
  createdAt: number;
  expiresAt: number;
}

const fileLocks = new Map<string, FileLock>();

// Lock expiration time (30 minutes)
const LOCK_EXPIRY_MS = 30 * 60 * 1000;

// Ensure uploads directory exists
async function ensureWopiDir() {
  if (!existsSync(WOPI_UPLOADS_DIR)) {
    await fs.mkdir(WOPI_UPLOADS_DIR, { recursive: true });
  }
}

/**
 * Clean up expired locks
 */
function cleanupExpiredLocks() {
  const now = Date.now();
  for (const [fileId, lock] of fileLocks.entries()) {
    if (lock.expiresAt < now) {
      fileLocks.delete(fileId);
    }
  }
}

/**
 * WOPI Auth Middleware - now extracts user info from token
 */
function wopiAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.query.access_token as string || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized - Missing access token' });
  }
  
  // Try to decode token (new system)
  let userInfo = decodeWopiToken(token);
  
  // Fallback to old "dev-token" for backward compatibility
  if (!userInfo && token === 'dev-token') {
    userInfo = {
      userId: 'dev-user',
      userName: 'Dev User',
      userEmail: 'dev@example.com',
    };
  }
  
  if (!userInfo) {
    return res.status(401).json({ error: 'Unauthorized - Invalid access token' });
  }
  
  // Attach user info to request for use in handlers
  (req as any).wopiUser = userInfo;
  next();
}

/**
 * GET /wopi/files/:fileId
 * Returns CheckFileInfo JSON with file metadata
 * https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/rest/files/checkfileinfo
 */
router.get('/files/:fileId', wopiAuth, async (req, res) => {
  try {
    cleanupExpiredLocks();
    
    const { fileId } = req.params;
    const userInfo = (req as any).wopiUser;
    const shareToken = req.query.share as string | undefined;
    const ext = fileId.startsWith('slide_') ? 'pptx' : 'xlsx';
    const filePath = path.join(WOPI_UPLOADS_DIR, `${fileId}.${ext}`);

    // Check file access via share token
    const accessCheck = await checkFileAccess(fileId, userInfo.userEmail, shareToken);
    if (!accessCheck.hasAccess) {
      return res.status(403).json({ error: 'Access denied - Invalid or expired share token' });
    }

    // Check if file exists, if not create empty placeholder
    await ensureWopiDir();
    if (!existsSync(filePath)) {
      // Create empty file for new documents
      await fs.writeFile(filePath, Buffer.from([]));
    }

    const stats = await fs.stat(filePath);
    const lock = fileLocks.get(fileId);
    const isLocked = lock && lock.expiresAt > Date.now();
    const isLockedByMe = isLocked && lock!.userId === userInfo.userId;
    
    // Determine write permission based on share permission
    const canWrite = accessCheck.permission === 'OWNER' || accessCheck.permission === 'EDITOR';
    
    // Return WOPI CheckFileInfo response
    const checkFileInfo: any = {
      // Required fields
      BaseFileName: `${fileId}.${ext}`,
      Size: stats.size,
      Version: stats.mtime.getTime().toString(), // Use modification time as version
      
      // User info (now from token)
      UserId: userInfo.userId,
      UserFriendlyName: userInfo.userName,
      
      // Permissions (based on share permission)
      UserCanWrite: canWrite,
      SupportsUpdate: canWrite,
      SupportsLocks: canWrite, // Only enable locks if user can write
      SupportsGetLock: canWrite,
      
      // Lock status
      IsLocked: isLocked || false,
      LockedByOtherUser: isLocked && !isLockedByMe,
      
      // Optional but useful
      OwnerId: userInfo.userId,
      LastModifiedTime: stats.mtime.toISOString(),
    };
    
    // Add lock info if locked
    if (isLocked && lock) {
      checkFileInfo.LockValue = lock.lockId;
      if (isLockedByMe) {
        checkFileInfo.LockExpiresAt = new Date(lock.expiresAt).toISOString();
      }
    }

    res.json(checkFileInfo);
  } catch (error) {
    console.error('WOPI CheckFileInfo error:', error);
    res.status(500).json({ error: 'Failed to get file info' });
  }
});

/**
 * POST /wopi/files/:fileId
 * Lock a file (WOPI Lock operation)
 */
router.post('/files/:fileId', wopiAuth, express.json(), async (req, res) => {
  try {
    cleanupExpiredLocks();
    
    const { fileId } = req.params;
    const userInfo = (req as any).wopiUser;
    const lockId = req.headers['x-wopi-lock'] as string;
    
    if (!lockId) {
      return res.status(400).json({ error: 'Lock ID required' });
    }
    
    // Check if file is already locked by another user
    const existingLock = fileLocks.get(fileId);
    if (existingLock && existingLock.expiresAt > Date.now()) {
      if (existingLock.userId !== userInfo.userId) {
        res.setHeader('X-WOPI-Lock', existingLock.lockId);
        return res.status(409).json({ error: 'File is locked by another user' });
      }
      // Same user refreshing lock - update expiry
      existingLock.expiresAt = Date.now() + LOCK_EXPIRY_MS;
      fileLocks.set(fileId, existingLock);
      return res.status(200).json({});
    }
    
    // Create new lock
    const lock: FileLock = {
      lockId,
      fileId,
      userId: userInfo.userId,
      userName: userInfo.userName,
      createdAt: Date.now(),
      expiresAt: Date.now() + LOCK_EXPIRY_MS,
    };
    
    fileLocks.set(fileId, lock);
    res.status(200).json({});
  } catch (error) {
    console.error('WOPI Lock error:', error);
    res.status(500).json({ error: 'Failed to lock file' });
  }
});

/**
 * DELETE /wopi/files/:fileId
 * Unlock a file (WOPI Unlock operation)
 */
router.delete('/files/:fileId', wopiAuth, async (req, res) => {
  try {
    const { fileId } = req.params;
    const userInfo = (req as any).wopiUser;
    const lockId = req.headers['x-wopi-lock'] as string;
    
    const existingLock = fileLocks.get(fileId);
    if (!existingLock || existingLock.lockId !== lockId) {
      return res.status(409).json({ error: 'Lock mismatch' });
    }
    
    if (existingLock.userId !== userInfo.userId) {
      return res.status(403).json({ error: 'Cannot unlock file locked by another user' });
    }
    
    fileLocks.delete(fileId);
    res.status(200).json({});
  } catch (error) {
    console.error('WOPI Unlock error:', error);
    res.status(500).json({ error: 'Failed to unlock file' });
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
 * Receives updated file bytes and saves them (now checks locks)
 * https://learn.microsoft.com/en-us/microsoft-365/cloud-storage-partner-program/rest/files/putfile
 */
router.post(
  '/files/:fileId/contents',
  wopiAuth,
  express.raw({ type: '*/*', limit: '50mb' }), // Parse raw binary body
  async (req, res) => {
    try {
      cleanupExpiredLocks();
      
      const { fileId } = req.params;
      const userInfo = (req as any).wopiUser;
      const shareToken = req.query.share as string | undefined;
      const lockId = req.headers['x-wopi-lock'] as string;
      const ext = fileId.startsWith('slide_') ? 'pptx' : 'xlsx';
      const filePath = path.join(WOPI_UPLOADS_DIR, `${fileId}.${ext}`);

      // Check file access and permission
      const accessCheck = await checkFileAccess(fileId, userInfo.userEmail, shareToken);
      if (!accessCheck.hasAccess) {
        return res.status(403).json({ error: 'Access denied' });
      }
      
      // Check if user has write permission
      if (accessCheck.permission === 'VIEWER') {
        return res.status(403).json({ error: 'Viewer permission - cannot edit file' });
      }

      // Check lock if provided
      if (lockId) {
        const existingLock = fileLocks.get(fileId);
        if (existingLock && existingLock.expiresAt > Date.now()) {
          if (existingLock.lockId !== lockId) {
            res.setHeader('X-WOPI-Lock', existingLock.lockId);
            return res.status(409).json({ error: 'File is locked by another user' });
          }
          if (existingLock.userId !== userInfo.userId) {
            return res.status(403).json({ error: 'Cannot save file locked by another user' });
          }
        }
      }

      await ensureWopiDir();
      await fs.writeFile(filePath, req.body);

      const stats = await fs.stat(filePath);

      // Return success response with new version
      res.json({
        Name: `${fileId}.${ext}`,
        Size: stats.size,
        Version: stats.mtime.getTime().toString(),
        LastModifiedTime: stats.mtime.toISOString(),
      });

      console.log(`✅ WOPI: Saved file ${fileId}.${ext} (${stats.size} bytes) by ${userInfo.userName}`);
    } catch (error) {
      console.error('WOPI PutFile error:', error);
      res.status(500).json({ error: 'Failed to save file contents' });
    }
  }
);

export default router;
