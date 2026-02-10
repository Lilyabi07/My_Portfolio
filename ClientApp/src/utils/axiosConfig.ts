import axios from 'axios';

// Configure axios to use the correct backend URL
// During development, the backend runs on a different port
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:58272';

axios.defaults.baseURL = API_BASE_URL;

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
