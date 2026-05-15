import apiClient from './client';

export const usersApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get('/users/', { params });
    return response.data;
  },
  
  create: async (data: any) => {
    const response = await apiClient.post('/users/', data);
    return response.data;
  },
  
  update: async (id: number, data: any) => {
    const response = await apiClient.patch(`/users/${id}/`, data);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await apiClient.delete(`/users/${id}/`);
    return response.data;
  }
};
