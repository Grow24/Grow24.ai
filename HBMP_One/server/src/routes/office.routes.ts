import { Router, Request } from 'express';
import { config } from '../config/env';
import { generateWopiToken } from '../utils/wopiToken';

const router = Router();

/**
 * Extract user info from request headers (sent by frontend)
 */
function getUserInfo(req: Request): { userId: string; userName: string; userEmail: string } | null {
  // Try to get from custom headers (frontend will send these)
  const userId = req.headers['x-user-id'] as string;
  const userName = req.headers['x-user-name'] as string;
  const userEmail = req.headers['x-user-email'] as string;
  
  if (userId && userName && userEmail) {
    return { userId, userName, userEmail };
  }
  
  // Fallback to dev user for backward compatibility
  return {
    userId: 'dev-user',
    userName: 'Dev User',
    userEmail: 'dev@example.com',
  };
}

/**
 * GET /api/office/open/:fileId
 * Returns WOPI configuration for opening a file in Collabora
 * 
 * Response includes:
 * - wopiSrc: The WOPI file URL that Collabora will use
 * - accessToken: Auth token for WOPI requests (now includes user info)
 */
router.get('/open/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;
    const ext = (req.query.ext as string) || 'xlsx';
    const shareToken = req.query.share as string | undefined;
    
    // Get user info from request
    const userInfo = getUserInfo(req);
    if (!userInfo) {
      return res.status(401).json({ error: 'User information required' });
    }
    
    // Generate token with user info
    const accessToken = generateWopiToken(userInfo);
    
    // Build WOPI source URL
    // Use host.docker.internal so Collabora (running in Docker) can reach the HBMP server
    const serverUrl = `http://host.docker.internal:${config.port}`;
    let wopiSrc = `${serverUrl}/wopi/files/${fileId}`;
    
    // Add share token to WOPI source URL if provided
    if (shareToken) {
      wopiSrc += `?share=${shareToken}`;
    }
    
    // Return WOPI configuration
    res.json({
      wopiSrc,
      accessToken,
      fileId,
      ext,
      shareToken, // Include share token in response for frontend
    });
  } catch (error) {
    console.error('Office open endpoint error:', error);
    res.status(500).json({ error: 'Failed to generate office open URL' });
  }
});

export default router;
