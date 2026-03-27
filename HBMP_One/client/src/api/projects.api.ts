import httpClient from './httpClient';

export interface Project {
  id: string;
  name: string;
  description?: string;
  clientName?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  dockets?: Docket[];
}

export interface Docket {
  id: string;
  projectId: string;
  name: string;
  type: 'BUSINESS_CASE' | 'BUSINESS_REQUIREMENTS' | 'TEST';
  level: string;
  createdAt: string;
}

export const projectsApi = {
  getAll: async (): Promise<{ projects: Project[] }> => {
    const response = await httpClient.get('/projects');
    return response.data;
  },

  getById: async (projectId: string): Promise<Project> => {
    const response = await httpClient.get(`/projects/${projectId}`);
    return response.data;
  },

  create: async (data: { name: string; description?: string; clientName?: string }): Promise<Project> => {
    const response = await httpClient.post('/projects', data);
    return response.data;
  },
};

