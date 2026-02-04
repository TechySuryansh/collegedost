import axios from 'axios';

// =======================
// BACKEND URL RESOLVER
// =======================
const getCurrentBackendUrl = () => {
  // SSR Guard
  if (typeof window === 'undefined') {
      return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://collegedost-929n.onrender.com/api';
  }

  const hostname = window.location.hostname;

  // 1. Strict Localhost Check
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return process.env.NEXT_PUBLIC_API_BASE_URL 
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`
          : 'http://localhost:5001/api';
  }

  // 2. Production Fallback
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (envUrl && !envUrl.includes('localhost') && envUrl.startsWith('http')) {
       return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  
  // 3. Absolute Fallback
  return 'https://collegedost-929n.onrender.com/api';
};

// =======================
// AXIOS INSTANCE
// =======================
const api = axios.create({
  baseURL: getCurrentBackendUrl()
});

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
