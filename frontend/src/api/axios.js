// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // La URL de tu contenedor de Django
});

// Este interceptor pega el Token en cada petición si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    
    // Solo añadir el header si el token existe de verdad
    if (token && token !== 'undefined' && token !== 'null') {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        // MUY IMPORTANTE: Eliminar el header si no hay token
        delete config.headers.Authorization;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
export default api;