import fetchClient from './client';

export const usersApi = {
  getAll: async (role?: string) => {
    const url = role ? `/users/?role=${role}` : '/users/';
    const res = await fetchClient.get(url);
    return res.data;
  },
  getSupervisors: async () => {
    const res = await fetchClient.get('/users/supervisors/');
    return res.data;
  },
  getJuryMembers: async () => {
    const res = await fetchClient.get('/users/jury_members/');
    return res.data;
  },
  getStudents: async () => {
    const res = await fetchClient.get('/users/students/');
    return res.data;
  },
  getById: async (id: number) => {
    const res = await fetchClient.get(`/users/${id}/`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await fetchClient.post('/users/', data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await fetchClient.patch(`/users/${id}/`, data);
    return res.data;
  },
  updateMe: async (data: any) => {
    const res = await fetchClient.patch('/auth/me/', data);
    return res.data;
  },
  delete: async (id: number) => {
    await fetchClient.delete(`/users/${id}/`);
  },
};
