import axios from 'axios';
import { handleMockRequest } from './mockData';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Custom adapter to switch between mock data and real backend requests
api.defaults.adapter = async (config) => {
  // Mock mode is active unless explicitly set to false via env (forced to false to disable mock adapter)
  const useMock = false;

  if (useMock) {
    try {
      const response = await handleMockRequest(config);
      return {
        data: response.data,
        status: response.status,
        statusText: response.status === 200 || response.status === 201 ? 'OK' : 'Error',
        headers: {},
        config,
        request: {},
      };
    } catch (error) {
      return Promise.reject({
        config,
        response: {
          status: 500,
          data: { success: false, message: error.message || 'Mock Adapter internal failure' },
        },
      });
    }
  }

  // Fallback to standard network request if mock mode disabled
  // Axios v1 utilizes HTTP/XHR adapter lookup
  const standardAdapter = axios.getAdapter(axios.defaults.adapter);
  return standardAdapter(config);
};

// Track token from context state if provided, fallback to localStorage
let contextToken = null;

export const setContextToken = (token) => {
  contextToken = token;
};

export const getAuthToken = () => {
  return contextToken || localStorage.getItem('antigravity_token');
};

// Request Interceptor: Automatically inject Authorization token if present
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Wipe storage and redirect on 401 Unauthorized or 403 Forbidden
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401 || status === 403) {
        localStorage.removeItem('antigravity_token');
        localStorage.removeItem('antigravity_admin_user');
        setContextToken(null);
        
        // Prevent infinite loop if already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
