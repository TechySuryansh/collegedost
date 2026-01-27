import axios from 'axios';

// Create a configured axios instance
// Logic: Determine backend URL based on the current browser URL (window.location)
// This ensures that if you are on the deployed site, you usage the deployed backend.
// If you are on localhost, you use the local backend.

const getCurrentBackendUrl = () => {
    const hostname = window.location.hostname;
    
    // 1. If running locally (dev or preview)
    // We trust localhost env vars or default to 5001
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return import.meta.env.VITE_API_BASE_URL 
            ? `${import.meta.env.VITE_API_BASE_URL}/api`
            : 'http://localhost:5001/api';
    }
    
    // 2. If running on Vercel (Production)
    // We prefer the Env Var if it exists and is NOT localhost (prevent bad config)
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    if (envUrl && !envUrl.includes('localhost')) {
         return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
    }
    
    // 3. Fallback for Production (if Env Var is missing or points to localhost)
    // Hardcoded production backend to guarantee connectivity
    return 'https://collegedost-929n.onrender.com/api/colleges';
};

const api = axios.create({
    baseURL: getCurrentBackendUrl(),
    withCredentials: true 
});

// Logs for debugging (will show in browser console)
console.log('API Base URL:', getCurrentBackendUrl());
if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    console.error('Missing VITE_GOOGLE_CLIENT_ID in Environment Variables! Google Login will fail.');
}

// Add a request interceptor to attach auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally 
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors here, like 401 Unauthorized
        if (error.response && error.response.status === 401) {
            // Optional: Auto-logout or redirect to login
            // window.location.href = '/login'; // Use with caution
        }
        return Promise.reject(error);
    }
);

export default api;
