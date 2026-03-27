import { Router } from 'express';
import {
  createShare,
  getShares,
  revokeShareEndpoint,
  validateShare,
} from '../controllers/share.controller';

const router = Router();

/**
 * POST /api/files/:fileId/share
 * Create a shareable link
 */
router.post('/files/:fileId/share', createShare);

/**
 * GET /api/files/:fileId/shares
 * Get all shares for a file
 */
router.get('/files/:fileId/shares', getShares);

/**
 * DELETE /api/files/:fileId/share/:shareToken
 * Revoke a share
 */
router.delete('/files/:fileId/share/:shareToken', revokeShareEndpoint);

/**
 * GET /api/shares/validate/:shareToken
 * Validate a share token
 */
router.get('/shares/validate/:shareToken', validateShare);

export default router;

