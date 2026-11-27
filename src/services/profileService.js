import { apiRequest } from './apiClient.js';

export function registerProfile({ role, profile, password }) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ role, profile, password }),
  });
}
