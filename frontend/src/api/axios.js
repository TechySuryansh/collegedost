// src/services/axios.js

import axios from 'axios';

// =======================
// BACKEND URL RESOLVER
// =======================
const getCurrentBackendUrl = () => {
  const hostname = window.location.hostname;

  // Local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return import.meta.env.VITE_API_BASE_URL
      ? `${import.meta.env.VITE_API_BASE_URL}/api`
      : 'http://localhost:5001/api';
  }

  // Production (Vercel)
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }

  // Final fallback (Render backend)
  return 'https://collegedost-929n.onrender.com/api';
};

// =======================
// AXIOS INSTANCE
// =======================
const api = axios.create({
  baseURL: getCurrentBackendUrl()
});

// Debug log
console.log('API Base URL:', getCurrentBackendUrl());

// Google login env check
if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  console.error(
    'Missing VITE_GOOGLE_CLIENT_ID in Environment Variables! Google Login will fail.'
  );
}

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      // Optional: logout or redirect
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
