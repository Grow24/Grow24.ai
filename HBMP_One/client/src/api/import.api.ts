import httpClient from './httpClient';

export interface ImportItem {
  type: 'GOOGLE_DOC' | 'GOOGLE_SHEET' | 'GOOGLE_SLIDE' | 'LINK' | 'FILE';
  url?: string;
  attachmentId?: string;
  rawText?: string;
  title?: string;
}

export interface ImportRequest {
  documentId: string;
  sectionIds: string[]; // Support multiple sections
  imports: ImportItem[];
  mode: 'LINK_ONLY' | 'AUTO_FILL';
  accessToken?: string; // Google OAuth access token
}

export interface ImportResponse {
  dockets: any[];
  totalItemsCreated: number;
  fieldValueUpdates: number;
}

export const importApi = {
  /**
   * Import documents/links and optionally auto-fill section fields
   */
  import: async (data: ImportRequest): Promise<ImportResponse> => {
    const response = await httpClient.post('/import', data);
    return response.data;
  },
};


