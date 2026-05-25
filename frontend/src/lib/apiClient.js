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

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'https://localhost:5443' : 'http://localhost:5000'),
  withCredentials: true, // Required for httpOnly cookie transport
});

export default apiClient;
