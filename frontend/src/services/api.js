import axios from 'axios';

// Create an instance of axios
export const api = axios.create({
    baseURL: 'http://localhost:3001/api/v1', // Your backend URL
});

// Request interceptor to add the auth token to every request
api.interceptors.request.use(
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