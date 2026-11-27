import { apiRequest } from './apiClient.js';

export async function getCurrentUser() {
  const { user } = await apiRequest('/auth/me');
  return user;
}

export async function login(credentials) {
  const { user } = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return user;
}

export function logout() {
  return apiRequest('/auth/logout', { method: 'POST' });
}
