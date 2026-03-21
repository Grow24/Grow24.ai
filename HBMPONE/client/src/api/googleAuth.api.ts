import httpClient from './httpClient';

export interface GoogleAuthResponse {
  authUrl: string;
}

export interface GoogleTokenResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export const googleAuthApi = {
  /**
   * Get Google OAuth authorization URL
   */
  getAuthUrl: async (): Promise<GoogleAuthResponse> => {
    const response = await httpClient.get('/auth/google');
    return response.data;
  },

  /**
   * Exchange authorization code for access token
   */
  exchangeCode: async (code: string): Promise<GoogleTokenResponse> => {
    const response = await httpClient.get('/auth/google/callback', {
      params: { code },
    });
    return response.data;
  },
};

/**
 * Store Google access token in localStorage
 */
export const storeGoogleToken = (token: string) => {
  localStorage.setItem('google_access_token', token);
};

/**
 * Get Google access token from localStorage
 */
export const getGoogleToken = (): string | null => {
  return localStorage.getItem('google_access_token');
};

/**
 * Clear Google access token
 */
export const clearGoogleToken = () => {
  localStorage.removeItem('google_access_token');
};


