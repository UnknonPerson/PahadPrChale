import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request: don't override Content-Type for FormData (let browser set boundary)
api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Response: unwrap .data from our standard { success, message, data } shape
api.interceptors.response.use(
  (response) => response.data ?? response,
  (error) => {
    if (error.response?.status === 401) {
      // Avoid redirect loop — only redirect if not already on auth pages
      const path = window.location.pathname;
      if (!path.includes('/login') && !path.includes('/register') && !path.includes('/verify')) {
        // Don't force redirect here — let the auth context handle it
      }
    }
    return Promise.reject(error);
  }
);

export default api;
