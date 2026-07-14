import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('antigravity_user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Wipes token & redirects to /login on 401 / 403, and triggers toasts for failures
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Auto-logout and redirect
      if (status === 401) {
        localStorage.removeItem('antigravity_user_token');
        localStorage.removeItem('antigravity_user');
        
        window.dispatchEvent(new CustomEvent('antigravity-toast', {
          detail: { message: 'Authentication has expired. Please sign in again.', type: 'warning' }
        }));
        window.location.href = '/login';
      } else {
        // Trap validation arrays or exceptional conflict text messages
        let errorMsg = 'An error occurred';
        if (data) {
          if (data.message) {
            errorMsg = data.message;
          } else if (Array.isArray(data.errors)) {
            errorMsg = data.errors.join(', ');
          } else if (typeof data === 'string') {
            errorMsg = data;
          }
        }
        window.dispatchEvent(new CustomEvent('antigravity-toast', {
          detail: { message: errorMsg, type: 'error' }
        }));
      }
    } else {
      window.dispatchEvent(new CustomEvent('antigravity-toast', {
        detail: { message: error.message || 'Failed to establish network connection', type: 'error' }
      }));
    }
    return Promise.reject(error);
  }
);

export default api;
