import { Request, Response } from 'express';
import {
  createFileShare,
  getFileShares,
  revokeShare,
  validateShareToken,
} from '../services/share.service';

/**
 * POST /api/files/:fileId/share
 * Create a shareable link for a file
 */
export const createShare = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const { permission = 'EDITOR', expiresInDays } = req.body;
    
    // Get user email from headers (set by frontend)
    const userEmail = req.headers['x-user-email'] as string || 'unknown@example.com';
    
    // Detect file type from fileId
    const fileType = fileId.startsWith('slide_') ? 'SLIDE' : 'SHEET';
    
    // Calculate expiration if provided
    let expiresAt: Date | undefined;
    if (expiresInDays && expiresInDays > 0) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }
    
    const { shareToken, shareUrl } = await createFileShare(
      fileId,
      fileType,
      userEmail,
      permission,
      expiresAt
    );
    
    // Get base URL from config or request
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const fullShareUrl = `${baseUrl}/projects/:projectId/office/${fileId}?share=${shareToken}`;
    
    res.json({
      shareToken,
      shareUrl: fullShareUrl,
      expiresAt: expiresAt?.toISOString(),
    });
  } catch (error: any) {
    console.error('Create share error:', error);
    res.status(500).json({
      error: {
        code: 'SHARE_ERROR',
        message: 'Failed to create share',
        details: error.message,
      },
    });
  }
};

/**
 * GET /api/files/:fileId/shares
 * Get all shares for a file
 */
export const getShares = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const userEmail = req.headers['x-user-email'] as string || 'unknown@example.com';
    
    const shares = await getFileShares(fileId);
    
    // Filter to only show shares created by current user or if user is owner
    const ownerShare = shares.find(s => s.sharedBy === userEmail && s.permission === 'OWNER');
    const visibleShares = ownerShare
      ? shares // Show all if user is owner
      : shares.filter(s => s.sharedBy === userEmail); // Only own shares otherwise
    
    res.json({
      shares: visibleShares.map(share => ({
        id: share.id,
        shareToken: share.shareToken,
        permission: share.permission,
        sharedBy: share.sharedBy,
        createdAt: share.createdAt,
        expiresAt: share.expiresAt,
      })),
    });
  } catch (error: any) {
    console.error('Get shares error:', error);
    res.status(500).json({
      error: {
        code: 'FETCH_ERROR',
        message: 'Failed to fetch shares',
        details: error.message,
      },
    });
  }
};

/**
 * DELETE /api/files/:fileId/share/:shareToken
 * Revoke a share
 */
export const revokeShareEndpoint = async (req: Request, res: Response) => {
  try {
    const { shareToken } = req.params;
    const userEmail = req.headers['x-user-email'] as string || 'unknown@example.com';
    
    const success = await revokeShare(shareToken, userEmail);
    
    if (!success) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to revoke this share',
        },
      });
    }
    
    res.json({ success: true });
  } catch (error: any) {
    console.error('Revoke share error:', error);
    res.status(500).json({
      error: {
        code: 'REVOKE_ERROR',
        message: 'Failed to revoke share',
        details: error.message,
      },
    });
  }
};

/**
 * GET /api/shares/validate/:shareToken
 * Validate a share token (for checking access before opening)
 */
export const validateShare = async (req: Request, res: Response) => {
  try {
    const { shareToken } = req.params;
    
    const shareInfo = await validateShareToken(shareToken);
    
    if (!shareInfo) {
      return res.status(404).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Share token is invalid or expired',
        },
      });
    }
    
    res.json({
      fileId: shareInfo.fileId,
      fileType: shareInfo.fileType,
      permission: shareInfo.permission,
    });
  } catch (error: any) {
    console.error('Validate share error:', error);
    res.status(500).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Failed to validate share token',
        details: error.message,
      },
    });
  }
};

