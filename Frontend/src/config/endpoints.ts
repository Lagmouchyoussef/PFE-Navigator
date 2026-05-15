/**
 * API endpoint configuration.
 * 
 * Centralized management of all API endpoints used in the application.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login/`,
    LOGOUT: `${API_BASE_URL}/auth/logout/`,
    REFRESH: `${API_BASE_URL}/auth/refresh/`,
  },

  // Users
  USERS: {
    LIST: `${API_BASE_URL}/users/`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/users/${id}/`,
    PROFILE: `${API_BASE_URL}/users/profile/`,
  },

  // Students
  STUDENTS: {
    LIST: `${API_BASE_URL}/students/`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/students/${id}/`,
    PROJECTS: (id: string | number) => `${API_BASE_URL}/students/${id}/projects/`,
  },

  // Supervisors
  SUPERVISORS: {
    LIST: `${API_BASE_URL}/supervisors/`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/supervisors/${id}/`,
    ASSIGNED_STUDENTS: (id: string | number) => `${API_BASE_URL}/supervisors/${id}/students/`,
  },

  // Juries
  JURIES: {
    LIST: `${API_BASE_URL}/juries/`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/juries/${id}/`,
    EVALUATIONS: (id: string | number) => `${API_BASE_URL}/juries/${id}/evaluations/`,
  },

  // Projects
  PROJECTS: {
    LIST: `${API_BASE_URL}/projects/`,
    DETAIL: (id: string | number) => `${API_BASE_URL}/projects/${id}/`,
    SUBMIT: (id: string | number) => `${API_BASE_URL}/projects/${id}/submit/`,
    EVALUATE: (id: string | number) => `${API_BASE_URL}/projects/${id}/evaluate/`,
  },

  // Health check
  HEALTH: `${API_BASE_URL}/core/health/`,
};

export default API_ENDPOINTS;
