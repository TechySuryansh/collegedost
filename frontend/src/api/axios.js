import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL 
        ? `${import.meta.env.VITE_API_BASE_URL}/api`
        : import.meta.env.MODE === 'production' 
            ? 'https://collegedost-backend.vercel.app/api' // Try a likely default or hold instructions.
            : 'http://localhost:5001/api', 
    withCredentials: true 
});

// Fallback: If we contain 'undefined' or fail, we log.
if (!import.meta.env.VITE_API_BASE_URL && import.meta.env.MODE === 'production') {
    console.warn("⚠️ VITE_API_BASE_URL is missing! Defaulting to presumed backend URL. If this fails, set the variable in Vercel.");
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
