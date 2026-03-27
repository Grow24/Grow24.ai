import httpClient from './httpClient';

export interface Template {
  id: string;
  name: string;
  code: string;
  level: 'C' | 'L' | 'I';
  version: number;
  isActive: boolean;
}

export interface TemplateField {
  id: string;
  label: string;
  dataType: 'RICH_TEXT' | 'STRING' | 'TEXT' | 'NUMBER' | 'DATE' | 'SELECT' | 'BOOLEAN';
  mandatory: boolean;
  helpText?: string;
  options?: string;
  order: number;
}

export interface TemplateSection {
  id: string;
  title: string;
  order: number;
  description?: string;
  fields: TemplateField[];
}

export interface TemplateDetail extends Template {
  sections: TemplateSection[];
}

export const templatesApi = {
  getAll: async (params?: { level?: string; code?: string }): Promise<{ templates: Template[] }> => {
    const response = await httpClient.get('/templates', { params });
    return response.data;
  },

  getById: async (id: string): Promise<TemplateDetail> => {
    const response = await httpClient.get(`/templates/${id}`);
    return response.data;
  },
};

