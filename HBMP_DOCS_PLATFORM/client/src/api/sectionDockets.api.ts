import httpClient from './httpClient';

export type SectionDocketItemType = 'HBMP_DOC' | 'GOOGLE_DOC' | 'GOOGLE_SHEET' | 'GOOGLE_SLIDE' | 'FILE' | 'LINK';

export interface SectionDocketItem {
  id: string;
  sectionDocketId: string;
  itemType: SectionDocketItemType;
  title: string;
  refId?: string;
  url?: string;
  attachmentId?: string;
  orderIndex: number;
  metadata?: any; // JSON object
  createdAt: string;
  updatedAt: string;
}

export interface SectionDocket {
  id: string;
  documentId: string;
  sectionId: string;
  title: string;
  description?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  items: SectionDocketItem[];
}

export interface CreateSectionDocketInput {
  documentId: string;
  sectionId: string;
  title?: string;
  description?: string;
}

export interface AddSectionDocketItemInput {
  itemType: SectionDocketItemType;
  title: string;
  refId?: string;
  url?: string;
  attachmentId?: string;
  metadata?: any;
}

export interface ReorderSectionDocketItemsInput {
  orderedItemIds: string[];
}

export interface CreateChildDocInput {
  templateId: string;
  title?: string;
}

export const sectionDocketsApi = {
  /**
   * Create a section docket (idempotent - returns existing if found)
   */
  create: async (data: CreateSectionDocketInput): Promise<SectionDocket> => {
    const response = await httpClient.post('/section-dockets', data);
    return response.data;
  },

  /**
   * Get section docket by documentId and sectionId
   */
  getBySection: async (documentId: string, sectionId: string): Promise<SectionDocket | null> => {
    try {
      const response = await httpClient.get('/section-dockets/by-section', {
        params: { documentId, sectionId },
      });
      return response.data;
    } catch (error: any) {
      // If 404, return null (no docket exists yet)
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Add an item to a section docket
   */
  addItem: async (docketId: string, data: AddSectionDocketItemInput): Promise<{ item: SectionDocketItem; docket: SectionDocket }> => {
    const response = await httpClient.post(`/section-dockets/${docketId}/items`, data);
    return response.data;
  },

  /**
   * Reorder items in a section docket
   */
  reorderItems: async (docketId: string, data: ReorderSectionDocketItemsInput): Promise<SectionDocket> => {
    const response = await httpClient.put(`/section-dockets/${docketId}/items/reorder`, data);
    return response.data;
  },

  /**
   * Delete a section docket item
   */
  deleteItem: async (itemId: string): Promise<void> => {
    await httpClient.delete(`/section-dockets/items/${itemId}`);
  },

  /**
   * Create a child document and link it as a SectionDocketItem
   */
  createChildDoc: async (docketId: string, data: CreateChildDocInput): Promise<{ document: any; item: SectionDocketItem }> => {
    const response = await httpClient.post(`/section-dockets/${docketId}/create-child-doc`, data);
    return response.data;
  },
};


