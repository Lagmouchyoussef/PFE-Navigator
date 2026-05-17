/**
 * API client for Communications: Messages, Notifications, Administrative Notes, Resources
 */
import fetchClient from './client';

// ── MESSAGES ──────────────────────────────────────────────────────────────────

export const messagesApi = {
  getAll: async () => {
    const res = await fetchClient.get('/communications/messages/');
    return res.data;
  },
  getInbox: async () => {
    const res = await fetchClient.get('/communications/messages/inbox/');
    return res.data;
  },
  getSent: async () => {
    const res = await fetchClient.get('/communications/messages/sent/');
    return res.data;
  },
  send: async (data: { recipient: number; subject?: string; content: string; parent?: number }) => {
    const res = await fetchClient.post('/communications/messages/', data);
    return res.data;
  },
  markRead: async (id: number) => {
    const res = await fetchClient.post(`/communications/messages/${id}/mark_read/`, {});
    return res.data;
  },
  markAllRead: async () => {
    const res = await fetchClient.post('/communications/messages/mark_all_read/', {});
    return res.data;
  },
  delete: async (id: number) => {
    await fetchClient.delete(`/communications/messages/${id}/`);
  },
  getContactableUsers: async () => {
    const res = await fetchClient.get('/communications/contactable-users/');
    return res.data;
  },
};

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────

export const notificationsApi = {
  getAll: async () => {
    const res = await fetchClient.get('/communications/notifications/');
    return res.data;
  },
  getUnreadCount: async () => {
    const res = await fetchClient.get('/communications/notifications/unread_count/');
    return (res.data as any).count as number;
  },
  markRead: async (id: number) => {
    const res = await fetchClient.post(`/communications/notifications/${id}/mark_read/`, {});
    return res.data;
  },
  markAllRead: async () => {
    const res = await fetchClient.post('/communications/notifications/mark_all_read/', {});
    return res.data;
  },
  delete: async (id: number) => {
    await fetchClient.delete(`/communications/notifications/${id}/`);
  },
  send: async (data: {
    title: string;
    message: string;
    type?: string;
    link?: string;
    recipients?: number[];
    audience?: string;
  }) => {
    const res = await fetchClient.post('/communications/notifications/', data);
    return res.data;
  },
};

// ── ADMINISTRATIVE NOTES ──────────────────────────────────────────────────────

export const adminNotesApi = {
  getAll: async () => {
    const res = await fetchClient.get('/communications/admin-notes/');
    return res.data;
  },
  create: async (data: { title: string; content: string; audience: string; is_pinned?: boolean }) => {
    const res = await fetchClient.post('/communications/admin-notes/', data);
    return res.data;
  },
  update: async (id: number, data: Partial<{ title: string; content: string; audience: string; is_pinned: boolean }>) => {
    const res = await fetchClient.patch(`/communications/admin-notes/${id}/`, data);
    return res.data;
  },
  delete: async (id: number) => {
    await fetchClient.delete(`/communications/admin-notes/${id}/`);
  },
};

// ── RESOURCES ─────────────────────────────────────────────────────────────────

export const resourcesApi = {
  getAll: async () => {
    const res = await fetchClient.get('/communications/resources/');
    return res.data;
  },
  upload: async (formData: FormData) => {
    const token = localStorage.getItem('pfe_access_token');
    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/communications/resources/`,
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
    await fetchClient.delete(`/communications/resources/${id}/`);
  },
};
