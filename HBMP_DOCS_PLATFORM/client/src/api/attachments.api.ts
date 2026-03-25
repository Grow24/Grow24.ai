import httpClient from './httpClient';

export interface Attachment {
  id: string;
  documentId: string;
  fileName: string;
  mimeType: string;
  storagePath: string;
  uploadedBy: string;
  uploadedAt: string;
}

export const attachmentsApi = {
  /**
   * Get all attachments for a document
   */
  getByDocument: async (documentId: string): Promise<{ attachments: Attachment[] }> => {
    const response = await httpClient.get(`/documents/${documentId}/attachments`);
    return response.data;
  },

  /**
   * Upload a file attachment
   */
  upload: async (documentId: string, file: File): Promise<Attachment> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await httpClient.post(`/documents/${documentId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Download an attachment
   */
  download: async (attachmentId: string): Promise<Blob> => {
    const response = await httpClient.get(`/attachments/${attachmentId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};


