import axios from 'axios';

// =======================
// BACKEND URL RESOLVER
// =======================
const getCurrentBackendUrl = () => {
  // Get the API URL from environment variable
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL environment variable is not set');
  }
  
  // Ensure the URL ends with /api
  return apiUrl.endsWith('/api') ? apiUrl : `${apiUrl}/api`;
};

// =======================
// AXIOS INSTANCE
// =======================
const api = axios.create({
  baseURL: getCurrentBackendUrl(),
  timeout: 8000
});

// Add error interceptor
api.interceptors.response.use(
  response => response,
  error => {
    // Log error but don't break app
    if (typeof window !== 'undefined') {
      console.warn('API Error:', {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
    }
    return Promise.reject(error);
  }
);

// Debug log (Client only)
if (typeof window !== 'undefined') {
    console.log('API Base URL:', getCurrentBackendUrl());
}

// Google login env check
if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
  console.error(
    'Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID in Environment Variables! Google Login will fail.'
  );
}

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// RESPONSE INTERCEPTOR
// =======================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: logout logic here
    }
    return Promise.reject(error);
  }
);

export default api;
