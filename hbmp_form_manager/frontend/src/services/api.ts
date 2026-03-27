import type { Question, PreviewResponse, UploadImageRequest, PublishResponse } from '../types';

const API_PREFIX = import.meta.env.VITE_API_BASE || '/api';
const API_BASE = `${API_PREFIX}/admin`;

// Get secret token from localStorage or prompt
function getSecretToken(): string {
  const token = localStorage.getItem('hbmp_secret_token');
  if (!token) {
    const input = prompt('Enter admin secret token:');
    if (input) {
      localStorage.setItem('hbmp_secret_token', input);
      return input;
    }
    throw new Error('Secret token required');
  }
  return token;
}

export function clearSecretToken() {
  localStorage.removeItem('hbmp_secret_token');
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getSecretToken();
  const headers = {
    'Content-Type': 'application/json',
    'x-secret-token': token,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (response.status === 401) {
    clearSecretToken();
    throw new Error('Unauthorized. Please refresh and enter token again.');
  }
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  return response.json();
}

export const api = {
  async getTests(): Promise<{ ok: boolean; tests: any[]; count: number }> {
    return fetchWithAuth(`${API_BASE}/tests`);
  },

  async getQuestions(sheetName?: string): Promise<{ ok: boolean; questions: Question[]; count: number }> {
    const url = sheetName ? `${API_BASE}/questions?sheetName=${encodeURIComponent(sheetName)}` : `${API_BASE}/questions`;
    return fetchWithAuth(url);
  },

  async getPreview(sheetName?: string): Promise<PreviewResponse> {
    return fetchWithAuth(`${API_BASE}/preview`, {
      method: 'POST',
      body: JSON.stringify({ sheetName }),
    });
  },

  async uploadImage(request: UploadImageRequest): Promise<{ ok: boolean; imageUrl: string }> {
    return fetchWithAuth(`${API_BASE}/upload-image`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  async publish(data: { sheetName?: string; formTitle?: string; formDescription?: string }): Promise<PublishResponse> {
    return fetchWithAuth(`${API_BASE}/publish`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateQuestion(questionId: string, updates: { text?: string; options?: string[]; type?: string; constraints?: any; sheetName?: string }): Promise<{ ok: boolean; message: string }> {
    return fetchWithAuth(`${API_PREFIX}/questions/${questionId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // OAuth2 Auth methods
  async checkAuthStatus(): Promise<{ ok: boolean; authenticated: boolean }> {
    const response = await fetch(`${API_PREFIX}/auth/status`);
    return response.json();
  },

  async getGoogleAuthUrl(): Promise<{ ok: boolean; authUrl: string }> {
    const response = await fetch(`${API_PREFIX}/auth/google`);
    return response.json();
  },

  async disconnectDrive(): Promise<{ ok: boolean; message: string }> {
    const token = getSecretToken();
    const response = await fetch(`${API_PREFIX}/auth/disconnect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-secret-token': token,
      },
    });
    return response.json();
  },
};

