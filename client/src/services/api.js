import axios from 'axios';

const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;
const backendPort = import.meta.env.VITE_BACKEND_PORT || 4001;

const API_BASE_URL = backendApiUrl
  ? backendApiUrl.endsWith('/api')
    ? backendApiUrl
    : backendApiUrl + '/api'
  : `http://localhost:${backendPort}/api`;

console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || 'An error occurred';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export const contactsApi = {
  getContacts: (params) => api.get('/contacts', { params }),
  createContact: (data) => api.post('/contacts', data),
  updateContact: (id, data) => api.put(`/contacts/${id}`, data),
  deleteContact: (id) => api.delete(`/contacts/${id}`),
};

export default api;
