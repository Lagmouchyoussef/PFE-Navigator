/**
 * API client for Communications: Messages, Notifications, Administrative Notes, Resources
 */
import fetchClient from './client';

// ── MESSAGES ──────────────────────────────────────────────────────────────────

export const messagesApi = {
  getAll: async () => {
    const res = await fetchClient.get('/messages/');
    return res.data;
  },
  getInbox: async () => {
    const res = await fetchClient.get('/messages/');
    return res.data;
  },
  getSent: async () => {
    const res = await fetchClient.get('/messages/');
    return res.data;
  },
  send: async (data: { recipient: number; subject?: string; content: string; parent?: number }) => {
    const res = await fetchClient.post('/messages/', data);
    return res.data;
  },
  markRead: async (id: number) => {
    const res = await fetchClient.post(`/messages/${id}/read/`, {});
    return res.data;
  },
  markAllRead: async () => {
    const res = await fetchClient.post('/messages/mark_all_read/', {});
    return res.data;
  },
  delete: async (id: number) => {
    await fetchClient.delete(`/messages/${id}/`);
  },
  getContactableUsers: async () => {
    const res = await fetchClient.get('/auth/users-list/');
    return res.data;
  },
};

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────

export const notificationsApi = {
  getAll: async () => {
    const res = await fetchClient.get('/notifications/');
    return res.data;
  },
  getUnreadCount: async () => {
    const res = await fetchClient.get('/notifications/');
    const notifications = Array.isArray(res.data) ? res.data : [];
    const count = notifications.filter((n: any) => !n.is_read).length;
    return count;
  },
  markRead: async (id: number) => {
    const res = await fetchClient.post(`/notifications/${id}/read/`, {});
    return res.data;
  },
  markAllRead: async () => {
    const res = await fetchClient.post('/notifications/read-all/', {});
    return res.data;
  },
  delete: async (id: number) => {
    await fetchClient.delete(`/notifications/${id}/`);
  },
  send: async (data: {
    title: string;
    message: string;
    type?: string;
    link?: string;
    recipients?: number[];
    audience?: string;
  }) => {
    const res = await fetchClient.post('/notifications/', data);
    return res.data;
  },
};

// ── ADMINISTRATIVE NOTES ──────────────────────────────────────────────────────

export const adminNotesApi = {
  getAll: async () => {
    const res = await fetchClient.get('/admin/notes/');
    return res.data;
  },
  create: async (data: { title: string; content: string; audience: string; is_pinned?: boolean }) => {
    const res = await fetchClient.post('/admin/notes/', data);
    return res.data;
  },
  update: async (id: number, data: Partial<{ title: string; content: string; audience: string; is_pinned: boolean }>) => {
    const res = await fetchClient.patch(`/admin/notes/${id}/`, data);
    return res.data;
  },
  delete: async (id: number) => {
    await fetchClient.delete(`/admin/notes/${id}/`);
  },
};

// ── RESOURCES ─────────────────────────────────────────────────────────────────

export const resourcesApi = {
  getAll: async () => {
    const res = await fetchClient.get('/admin/resources/');
    return res.data;
  },
  upload: async (formData: FormData) => {
    const token = localStorage.getItem('pfe_access_token');
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/admin/resources/`,
      {
        method: 'POST',
        headers: token ? { Authorization: `Token ${token}` } : {},
        body: formData,
      }
    );
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || 'Upload failed');
    }
    return response.json();
  },
  delete: async (id: number) => {
    await fetchClient.delete(`/admin/resources/${id}/`);
  },
};
