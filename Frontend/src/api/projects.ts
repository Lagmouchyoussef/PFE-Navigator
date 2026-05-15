import fetchClient from './client';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const authHeaders = () => {
  const token = localStorage.getItem('pfe_access_token');
  return token ? { Authorization: `Token ${token}` } : {};
};

// ── PROJECTS ──────────────────────────────────────────────────────────────────

export const projectsApi = {
  getAll: async () => {
    const res = await fetchClient.get('/projects/projects/');
    return res.data;
  },
  getById: async (id: number) => {
    const res = await fetchClient.get(`/projects/projects/${id}/`);
    return res.data;
  },
  getDashboard: async () => {
    const res = await fetchClient.get('/projects/projects/dashboard/');
    return res.data;
  },
  getStats: async () => {
    const res = await fetchClient.get('/projects/projects/stats/');
    return res.data;
  },
  getAdminStats: async () => {
    const res = await fetchClient.get('/projects/admin-stats/');
    return res.data;
  },
  create: async (data: any) => {
    const res = await fetchClient.post('/projects/projects/', data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await fetchClient.patch(`/projects/projects/${id}/`, data);
    return res.data;
  },
  getSubjects: async () => {
    const res = await fetchClient.get('/projects/subjects/');
    return res.data;
  },
  getRepository: async () => {
    const res = await fetchClient.get('/projects/repository/');
    return res.data;
  },
};

// ── DOCUMENTS ─────────────────────────────────────────────────────────────────

export const documentsApi = {
  getAll: async () => {
    const res = await fetchClient.get('/projects/documents/');
    return res.data;
  },
  upload: async (formData: FormData) => {
    const response = await fetch(`${BASE}/projects/documents/`, {
      method: 'POST',
      headers: authHeaders(),
      body: formData,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Upload failed');
    }
    return response.json();
  },
  delete: async (id: number) => {
    await fetchClient.delete(`/projects/documents/${id}/`);
  },
  approve: async (id: number) => {
    const res = await fetchClient.post(`/projects/documents/${id}/approve/`, {});
    return res.data;
  },
  reject: async (id: number, reason: string) => {
    const res = await fetchClient.post(`/projects/documents/${id}/reject/`, { reason });
    return res.data;
  },
};

// ── DOCUMENT REMARKS ──────────────────────────────────────────────────────────

export const documentRemarksApi = {
  getAll: async () => {
    const res = await fetchClient.get('/projects/document-remarks/');
    return res.data;
  },
  create: async (data: { document: number; comment: string; score?: number }) => {
    const res = await fetchClient.post('/projects/document-remarks/', data);
    return res.data;
  },
  delete: async (id: number) => {
    await fetchClient.delete(`/projects/document-remarks/${id}/`);
  },
};

// ── APPOINTMENTS ──────────────────────────────────────────────────────────────

export const appointmentsApi = {
  getAll: async () => {
    const res = await fetchClient.get('/projects/appointments/');
    return res.data;
  },
  create: async (data: any) => {
    const res = await fetchClient.post('/projects/appointments/', data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await fetchClient.patch(`/projects/appointments/${id}/`, data);
    return res.data;
  },
  delete: async (id: number) => {
    await fetchClient.delete(`/projects/appointments/${id}/`);
  },
  cancel: async (id: number) => {
    const res = await fetchClient.post(`/projects/appointments/${id}/cancel/`, {});
    return res.data;
  },
  confirm: async (id: number) => {
    const res = await fetchClient.post(`/projects/appointments/${id}/confirm/`, {});
    return res.data;
  },
};

// ── MILESTONES ────────────────────────────────────────────────────────────────

export const milestonesApi = {
  getAll: async () => {
    const res = await fetchClient.get('/projects/milestones/');
    return res.data;
  },
  create: async (data: any) => {
    const res = await fetchClient.post('/projects/milestones/', data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await fetchClient.patch(`/projects/milestones/${id}/`, data);
    return res.data;
  },
  delete: async (id: number) => {
    await fetchClient.delete(`/projects/milestones/${id}/`);
  },
};

// ── EVALUATIONS ───────────────────────────────────────────────────────────────

export const evaluationsApi = {
  getAll: async () => {
    const res = await fetchClient.get('/projects/evaluations/');
    return res.data;
  },
  getById: async (id: number) => {
    const res = await fetchClient.get(`/projects/evaluations/${id}/`);
    return res.data;
  },
  create: async (data: any) => {
    const res = await fetchClient.post('/projects/evaluations/', data);
    return res.data;
  },
  update: async (id: number, data: any) => {
    const res = await fetchClient.patch(`/projects/evaluations/${id}/`, data);
    return res.data;
  },
  submitSupervisor: async (id: number, data: { score: number; comment?: string; criteria?: any }) => {
    const res = await fetchClient.post(`/projects/evaluations/${id}/submit_supervisor/`, data);
    return res.data;
  },
  submitJury: async (id: number, data: { score: number; comment?: string; criteria?: any }) => {
    const res = await fetchClient.post(`/projects/evaluations/${id}/submit_jury/`, data);
    return res.data;
  },
  publish: async (id: number) => {
    const res = await fetchClient.post(`/projects/evaluations/${id}/publish/`, {});
    return res.data;
  },
  updateWeights: async (id: number, data: { supervisor_weight: number; jury_weight: number }) => {
    const res = await fetchClient.post(`/projects/evaluations/${id}/update_weights/`, data);
    return res.data;
  },
};

// ── FEEDBACKS ─────────────────────────────────────────────────────────────────

export const feedbacksApi = {
  getAll: async () => {
    const res = await fetchClient.get('/projects/feedbacks/');
    return res.data;
  },
  create: async (data: { project: number; title: string; comment: string }) => {
    const res = await fetchClient.post('/projects/feedbacks/', data);
    return res.data;
  },
  delete: async (id: number) => {
    await fetchClient.delete(`/projects/feedbacks/${id}/`);
  },
};

// ── JURY ASSIGNMENTS ──────────────────────────────────────────────────────────

export const juryAssignmentsApi = {
  getAll: async () => {
    const res = await fetchClient.get('/projects/jury-assignments/');
    return res.data;
  },
  create: async (data: { project: number; jury_member: number; role?: string }) => {
    const res = await fetchClient.post('/projects/jury-assignments/', data);
    return res.data;
  },
  delete: async (id: number) => {
    await fetchClient.delete(`/projects/jury-assignments/${id}/`);
  },
};
