import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const templatesAPI = {
  getTemplates: async () => {
    const response = await axios.get(`${API_BASE_URL}/templates`);
    return response.data;
  },

  getTemplate: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/templates/${id}`);
    return response.data;
  }
};