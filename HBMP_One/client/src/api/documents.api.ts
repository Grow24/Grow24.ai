import httpClient from './httpClient';

export interface DocumentField {
  id: string;
  label: string;
  dataType: string;
  mandatory: boolean;
  helpText?: string;
  fieldValueId?: string;
  value: string;
}

export interface DocumentSection {
  id: string;
  title: string;
  order: number;
  description?: string;
  sectionInstanceId?: string;
  fields: DocumentField[];
}

export interface Document {
  id: string;
  title: string;
  projectId: string;
  docketId: string;
  templateId: string;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'SUPERSEDED';
  version: number;
  level: 'C' | 'L' | 'I';
  template: {
    name: string;
    code: string;
    sections: DocumentSection[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface DocumentListItem {
  id: string;
  title: string;
  templateId: string;
  templateName: string;
  docketId: string;
  docketName: string;
  status: string;
  level: string;
  version: number;
  updatedAt: string;
}

export interface WorkflowHistoryEntry {
  id: string;
  fromStatus: string;
  toStatus: string;
  performedBy: string;
  performedAt: string;
  comment?: string;
}

export interface WorkflowHistory {
  documentId: string;
  currentStatus: string;
  history: WorkflowHistoryEntry[];
}

export interface WorkflowTransition {
  action: 'SUBMIT' | 'APPROVE' | 'REQUEST_CHANGES';
  nextStatus: string;
  label: string;
}

export interface AvailableTransitions {
  documentId: string;
  currentStatus: string;
  availableTransitions: WorkflowTransition[];
}

export const documentsApi = {
  create: async (
    projectId: string,
    docketId: string,
    data: { templateId: string; title: string }
  ): Promise<Document> => {
    const response = await httpClient.post(
      `/projects/${projectId}/dockets/${docketId}/documents`,
      data
    );
    return response.data;
  },

  getById: async (documentId: string): Promise<Document> => {
    const response = await httpClient.get(`/documents/${documentId}`);
    return response.data;
  },

  update: async (documentId: string, data: { fieldValues: Array<{ fieldValueId: string; value: string }>; title?: string }): Promise<{ id: string; updatedAt: string }> => {
    const response = await httpClient.put(`/documents/${documentId}`, data);
    return response.data;
  },

  updateStatus: async (documentId: string, status: string): Promise<{ id: string; status: string; updatedAt: string }> => {
    const response = await httpClient.post(`/documents/${documentId}/status`, { status });
    return response.data;
  },

  getByProject: async (projectId: string): Promise<{ documents: DocumentListItem[] }> => {
    const response = await httpClient.get(`/projects/${projectId}/documents`);
    return response.data;
  },

  export: async (documentId: string, format: 'docx' | 'pdf' | 'xlsx'): Promise<Blob> => {
    try {
      const response = await httpClient.get(`/documents/${documentId}/export`, {
        params: { format },
        responseType: 'blob',
      });
      
      // Check if response is actually an error blob
      if (response.data.type === 'application/json') {
        const text = await response.data.text();
        const error = JSON.parse(text);
        throw new Error(error.error?.message || error.message || 'Export failed');
      }
      
      return response.data;
    } catch (error: any) {
      // If it's already an Error object, rethrow it
      if (error instanceof Error) {
        throw error;
      }
      // Otherwise, wrap it
      throw new Error(error.message || 'Failed to export document');
    }
  },

  exportToGoogle: async (format: 'google-doc' | 'google-sheets', documentId: string): Promise<{ url?: string; message: string }> => {
    const endpoint = format === 'google-doc' 
      ? `/documents/${documentId}/export/google-doc`
      : `/documents/${documentId}/export/google-sheets`;
    const response = await httpClient.post(endpoint);
    return response.data;
  },

  // Workflow API
  executeWorkflowTransition: async (
    documentId: string,
    action: 'SUBMIT' | 'APPROVE' | 'REQUEST_CHANGES',
    comment?: string
  ): Promise<{ id: string; status: string; updatedAt: string; history: WorkflowHistoryEntry[] }> => {
    const response = await httpClient.post(`/documents/${documentId}/workflow/transition`, {
      action,
      comment,
    });
    return response.data;
  },

  getWorkflowHistory: async (documentId: string): Promise<WorkflowHistory> => {
    const response = await httpClient.get(`/documents/${documentId}/workflow/history`);
    return response.data;
  },

  getAvailableTransitions: async (documentId: string): Promise<AvailableTransitions> => {
    const response = await httpClient.get(`/documents/${documentId}/workflow/transitions`);
    return response.data;
  },
};

