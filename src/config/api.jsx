// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
    INCIDENCIAS: `${API_BASE_URL}/api/Incidencias`,
    DEPENDENCIAS: `${API_BASE_URL}/api/Dependencias`,
    // Add other endpoints here as needed
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers, Authorization: `Bearer ${token}` };
  return fetch(url, { ...options, headers });
};

export default API_BASE_URL;