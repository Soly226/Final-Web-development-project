/**
 * Shared Axios instance for all API calls.
 *
 * Key configuration:
 *  - `withCredentials: true`  → Browser automatically sends/receives the
 *    httpOnly JWT cookie on every request. Without this flag, cookies are
 *    silently stripped on cross-origin requests.
 *  - `baseURL`                → Single source of truth for the API origin.
 *    Change this one line when deploying instead of hunting down hardcoded URLs.
 */
import axios from 'axios';

// Helper to extract a cookie value by name on the client side
const getCookie = (name) => {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : '';
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:5000',
  withCredentials: true, // Required for httpOnly cookie transport
});

// Auto-attach X-CSRF-Token header on write/mutation requests
apiClient.interceptors.request.use((config) => {
  const token = getCookie('csrf-token');
  if (token && ['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
    config.headers['X-CSRF-Token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getFileUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  const baseUrl = apiClient.defaults.baseURL || 'https://localhost:5000';
  return `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

export default apiClient;
