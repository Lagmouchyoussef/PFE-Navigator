import apiClient from './client';

export const projectsApi = {
  getSubjects: async () => {
    const response = await apiClient.get('/projects/subjects/');
    return response.data;
  },
  
  getRepository: async (params?: any) => {
    const response = await apiClient.get('/projects/repository/', { params });
    return response.data;
  },
  
  uploadDocument: async (formData: FormData) => {
    const response = await apiClient.post('/projects/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  deleteDocument: async (id: number) => {
    const response = await apiClient.delete(`/projects/documents/${id}/`);
    return response.data;
  }
};
