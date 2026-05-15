import apiClient from './client';

export const studentsApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get('/students/', { params });
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await apiClient.get(`/students/${id}/`);
    return response.data;
  },
  
  updateEvaluation: async (id: number, data: any) => {
    const response = await apiClient.patch(`/students/${id}/evaluation/`, data);
    return response.data;
  },
  
  getDocuments: async (id: number) => {
    const response = await apiClient.get(`/students/${id}/documents/`);
    return response.data;
  }
};
