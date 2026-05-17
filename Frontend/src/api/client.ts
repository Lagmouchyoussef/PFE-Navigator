const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, data: unknown) {
    super(`API Error: ${status}`);
    this.status = status;
    this.data = data;
  }
}

function clearSession() {
  localStorage.removeItem('pfe_access_token');
  localStorage.removeItem('pfe_refresh_token');
  // Redirect to login page without a full page reload loop
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login';
  }
}

async function request(endpoint: string, options: Record<string, unknown> = {}) {
  const token = localStorage.getItem('pfe_access_token');

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const config: RequestInit = {
    ...(options as RequestInit),
    headers,
  };

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, config);
  } catch {
    throw new ApiError(0, { detail: 'Network error. Please check your connection.' });
  }

  if (response.status === 401) {
    clearSession();
    throw new ApiError(401, { detail: 'Session expired. Please log in again.' });
  }

  const data: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return { data, status: response.status };
}

export const fetchClient = {
  get: (url: string, options?: Record<string, unknown>) =>
    request(url, { ...options, method: 'GET' }),
  post: (url: string, body: unknown, options?: Record<string, unknown>) =>
    request(url, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: (url: string, body: unknown, options?: Record<string, unknown>) =>
    request(url, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: (url: string, options?: Record<string, unknown>) =>
    request(url, { ...options, method: 'DELETE' }),
};

export default fetchClient;
