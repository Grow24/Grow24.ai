import { httpClient } from './httpClient';

export interface FileShare {
  id: string;
  shareToken: string;
  permission: 'OWNER' | 'EDITOR' | 'VIEWER';
  sharedBy: string;
  createdAt: string;
  expiresAt?: string;
}

export interface CreateShareResponse {
  shareToken: string;
  shareUrl: string;
  expiresAt?: string;
}

export interface SharesResponse {
  shares: FileShare[];
}

export const shareApi = {
  /**
   * Create a shareable link for a file
   */
  createShare: async (
    fileId: string,
    permission: 'OWNER' | 'EDITOR' | 'VIEWER' = 'EDITOR',
    expiresInDays?: number
  ): Promise<CreateShareResponse> => {
    const response = await httpClient.post(`/files/${fileId}/share`, {
      permission,
      expiresInDays,
    });
    return response.data;
  },

  /**
   * Get all shares for a file
   */
  getShares: async (fileId: string): Promise<SharesResponse> => {
    const response = await httpClient.get(`/files/${fileId}/shares`);
    return response.data;
  },

  /**
   * Revoke a share
   */
  revokeShare: async (fileId: string, shareToken: string): Promise<void> => {
    await httpClient.delete(`/files/${fileId}/share/${shareToken}`);
  },

  /**
   * Validate a share token
   */
  validateShare: async (shareToken: string): Promise<{
    fileId: string;
    fileType: string;
    permission: string;
  }> => {
    const response = await httpClient.get(`/shares/validate/${shareToken}`);
    return response.data;
  },
};

