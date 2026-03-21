import { Router } from 'express';
import { config } from '../config/env';

const router = Router();

/**
 * GET /api/office/open/:fileId
 * Returns WOPI configuration for opening a file in Collabora
 * 
 * Response includes:
 * - wopiSrc: The WOPI file URL that Collabora will use
 * - accessToken: Auth token for WOPI requests
 */
router.get('/open/:fileId', (req, res) => {
  try {
    const { fileId } = req.params;
    const ext = (req.query.ext as string) || 'xlsx';
    
    // Build WOPI source URL
    // Use host.docker.internal so Collabora (running in Docker) can reach the HBMP server
    const serverUrl = `http://host.docker.internal:${config.port}`;
    const wopiSrc = `${serverUrl}/wopi/files/${fileId}`;
    
    // Return WOPI configuration
    res.json({
      wopiSrc,
      accessToken: 'dev-token', // MVP: Simple token
      fileId,
      ext,
    });
  } catch (error) {
    console.error('Office open endpoint error:', error);
    res.status(500).json({ error: 'Failed to generate office open URL' });
  }
});

export default router;
