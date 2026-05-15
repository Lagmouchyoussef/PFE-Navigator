import apiClient from './client';
import { Session, LoginCredentials } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login/', credentials);
    const { access, refresh, user } = response.data;
    
    localStorage.setItem('pfe_access_token', access);
    localStorage.setItem('pfe_refresh_token', refresh);
    
    return user as Session;
  },
  
  logout: async () => {
    localStorage.removeItem('pfe_access_token');
    localStorage.removeItem('pfe_refresh_token');
    // Optionally call logout endpoint on backend
    // await apiClient.post('/auth/logout/');
  },
  
  me: async () => {
    const response = await apiClient.get('/auth/me/');
    return response.data as Session;
  },
  
  updateSettings: async (settings: any) => {
    const response = await apiClient.patch('/auth/settings/', settings);
    return response.data;
  }
};
