import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

/**
 * Generate a secure share token for link-based sharing
 */
export function generateShareToken(): string {
  // Generate a random 32-character token
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Create a shareable link for a file
 */
export async function createFileShare(
  fileId: string,
  fileType: 'SHEET' | 'SLIDE',
  sharedBy: string,
  permission: 'OWNER' | 'EDITOR' | 'VIEWER' = 'EDITOR',
  expiresAt?: Date
): Promise<{ shareToken: string; shareUrl: string }> {
  // Check if share already exists for this file and user
  const existingShare = await prisma.fileShare.findFirst({
    where: {
      fileId,
      sharedBy,
      permission: 'OWNER', // Only one owner share per file
    },
  });

  let shareToken: string;
  
  if (existingShare) {
    // Reuse existing share token
    shareToken = existingShare.shareToken;
    
    // Update expiration if provided
    if (expiresAt) {
      await prisma.fileShare.update({
        where: { id: existingShare.id },
        data: { expiresAt, updatedAt: new Date() },
      });
    }
  } else {
    // Create new share
    shareToken = generateShareToken();
    
    await prisma.fileShare.create({
      data: {
        fileId,
        fileType,
        shareToken,
        sharedBy,
        permission,
        expiresAt,
      },
    });
  }

  // Generate share URL (frontend will construct full URL with projectId)
  const shareUrl = `/projects/:projectId/office/${fileId}?share=${shareToken}`;

  return { shareToken, shareUrl: shareUrl };
}

/**
 * Validate a share token and get file access info
 */
export async function validateShareToken(
  shareToken: string
): Promise<{ fileId: string; fileType: string; permission: string; sharedBy: string } | null> {
  const share = await prisma.fileShare.findUnique({
    where: { shareToken },
  });

  if (!share) {
    return null;
  }

  // Check expiration
  if (share.expiresAt && share.expiresAt < new Date()) {
    return null;
  }

  return {
    fileId: share.fileId,
    fileType: share.fileType,
    permission: share.permission,
    sharedBy: share.sharedBy,
  };
}

/**
 * Get all shares for a file
 */
export async function getFileShares(fileId: string) {
  return prisma.fileShare.findMany({
    where: { fileId },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Revoke a share (delete by token)
 */
export async function revokeShare(shareToken: string, requestedBy: string): Promise<boolean> {
  const share = await prisma.fileShare.findUnique({
    where: { shareToken },
  });

  if (!share) {
    return false;
  }

  // Only owner or the person who shared can revoke
  if (share.sharedBy !== requestedBy && share.permission !== 'OWNER') {
    // Check if requester is owner
    const ownerShare = await prisma.fileShare.findFirst({
      where: {
        fileId: share.fileId,
        permission: 'OWNER',
        sharedBy: requestedBy,
      },
    });

    if (!ownerShare) {
      return false;
    }
  }

  await prisma.fileShare.delete({
    where: { shareToken },
  });

  return true;
}

/**
 * Check if user has access to file (via share token or ownership)
 */
export async function checkFileAccess(
  fileId: string,
  userEmail: string,
  shareToken?: string
): Promise<{ hasAccess: boolean; permission: 'OWNER' | 'EDITOR' | 'VIEWER' | null }> {
  // If share token provided, validate it
  if (shareToken) {
    const shareInfo = await validateShareToken(shareToken);
    if (shareInfo && shareInfo.fileId === fileId) {
      return {
        hasAccess: true,
        permission: shareInfo.permission as 'OWNER' | 'EDITOR' | 'VIEWER',
      };
    }
  }

  // Check if user is owner or has a share
  const share = await prisma.fileShare.findFirst({
    where: {
      fileId,
      OR: [
        { sharedBy: userEmail, permission: 'OWNER' },
        { shareToken: shareToken || '' },
      ],
    },
  });

  if (share) {
    return {
      hasAccess: true,
      permission: share.permission as 'OWNER' | 'EDITOR' | 'VIEWER',
    };
  }

  // Default: allow access (backward compatibility - can restrict later)
  return { hasAccess: true, permission: 'EDITOR' };
}

