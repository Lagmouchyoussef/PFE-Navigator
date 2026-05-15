/**
 * API service for communicating with the Django REST API.
 */

import API_ENDPOINTS from '../../config/endpoints';

/**
 * Fetch data from the API.
 * @param endpoint - API endpoint URL
 * @param options - Fetch options
 * @returns Response JSON
 */
export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Login to the application.
 * @param email - User email
 * @param password - User password
 * @returns Login response with user data
 */
export async function login(email: string, password: string) {
  return fetchAPI(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Logout from the application.
 */
export async function logout() {
  return fetchAPI(API_ENDPOINTS.AUTH.LOGOUT, {
    method: 'POST',
  });
}

/**
 * Get health status of the API.
 */
export async function getHealthStatus() {
  return fetchAPI(API_ENDPOINTS.HEALTH);
}
