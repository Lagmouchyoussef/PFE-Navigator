/**
 * Custom Fetch Client for Production
 * Mimics Axios behavior for consistent API handling
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiError extends Error {
  status: number;
  data: any;
  constructor(status: number, data: any) {
    super(`API Error: ${status}`);
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint: string, options: any = {}) {
  const token = localStorage.getItem('pfe_access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  
  if (response.status === 401 && !options._retry) {
    // Handle Refresh Token Logic here if needed
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return { data, status: response.status };
}

export const fetchClient = {
  get: (url: string, options?: any) => request(url, { ...options, method: 'GET' }),
  post: (url: string, body: any, options?: any) => request(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  patch: (url: string, body: any, options?: any) => request(url, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: (url: string, options?: any) => request(url, { ...options, method: 'DELETE' }),
};

export default fetchClient;
