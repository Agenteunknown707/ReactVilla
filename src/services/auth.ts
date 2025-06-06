import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const login = async (correo: string, contraseña: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            correo,
            contraseña
        });
        
        // Guardar el token en localStorage
        localStorage.setItem('token', response.data.token);
        
        // Guardar la información del usuario
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
        
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const isAuthenticated = () => {
    return !!getToken();
};

// Configuración de axios para incluir el token en todas las peticiones
axios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            logout();
            // Redirigir al login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
); 