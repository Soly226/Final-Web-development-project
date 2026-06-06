import axios from 'axios';

// Helper to extract a cookie value by name on the client side
const getCookie = (name) => {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : '';
};

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'https://localhost:5443' : 'http://localhost:5000'),
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
  const baseUrl = apiClient.defaults.baseURL || (typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'https://localhost:5443' : 'http://localhost:5000');
  return `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
};

export default apiClient;
