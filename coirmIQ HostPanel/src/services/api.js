import axios from 'axios';
import { handleMockRequest } from './mockData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom adapter to switch between mock data and real backend requests
api.defaults.adapter = async (config) => {
  // Use mock by default unless explicitly disabled
  const useMock = import.meta.env.VITE_USE_MOCK !== 'false';

  if (useMock || config.url.includes('api.cloudinary.com')) {
    try {
      const response = await handleMockRequest(config);
      return {
        data: response.data,
        status: response.status,
        statusText: 'OK',
        headers: {},
        config,
        request: {},
      };
    } catch (error) {
      return Promise.reject({
        config,
        response: error.response || {
          status: 500,
          data: { success: false, message: error.message || 'Mock Adapter internal failure' },
        },
      });
    }
  }

  // Live adapter lookup
  const standardAdapter = axios.getAdapter(axios.defaults.adapter);
  return standardAdapter(config);
};

// Track token from context state if provided, fallback to localStorage
let contextToken = null;

export const setContextToken = (token) => {
  contextToken = token;
};

export const getAuthToken = () => {
  return contextToken || localStorage.getItem('antigravity_host_token');
};

// Request Interceptor: Inject JWT token from localStorage or context state
api.interceptors.request.use(
  (config) => {
    if (config.url && config.url.includes('api.cloudinary.com')) {
      return config;
    }
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      if (typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Wipes token & redirects to /login on 401 / 403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401 || status === 403) {
        localStorage.removeItem('antigravity_host_token');
        localStorage.removeItem('antigravity_host_user');
        setContextToken(null);
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

