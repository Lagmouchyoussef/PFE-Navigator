import apiClient from './client';
import { Session, LoginCredentials } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login/', credentials);
    const { access, refresh, user } = response.data as { access: string; refresh: string; user: any };

    if (!access || !user) {
      throw new Error('Invalid response from server.');
    }

    localStorage.setItem('pfe_access_token', access);
    localStorage.setItem('pfe_refresh_token', refresh);

    if (user && typeof user.role === 'string') {
      user.role = user.role.toLowerCase();
    }

    return user as Session;
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout/', {});
    } catch {
      // Always clear tokens even if the server request fails
    } finally {
      localStorage.removeItem('pfe_access_token');
      localStorage.removeItem('pfe_refresh_token');
    }
  },

  me: async () => {
    const response = await apiClient.get('/auth/me/');
    const user: any = response.data;
    if (user && typeof user.role === 'string') {
      user.role = user.role.toLowerCase();
    }
    return user as Session;
  },

  updateSettings: async (settings: any) => {
    const response = await apiClient.patch('/auth/settings/', settings);
    return response.data;
  }
};
