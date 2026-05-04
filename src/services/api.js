// ─────────────────────────────────────────────────────────────────
// src/services/api.js
// Capa de comunicación con el backend CodeIgniter
// Cambiar BASE_URL por la URL de tu servidor
// ─────────────────────────────────────────────────────────────────
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost/tu_proyecto/index.php';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // importante: envía las cookies de sesión de CI
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: maneja errores de sesión vencida globalmente
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      window.location.href = '/Auth/login';
    }
    return Promise.reject(err);
  }
);
const BASE = import.meta.env.VITE_API_URL;
// ── ENDPOINTS ──────────────────────────────────────────────────
export const getDashboard = () =>
  api.get('/api_dashboard/mantencion').then(r => r.data);

export const getDashboardPage = (page = 0) =>
  api.get(`/api_dashboard/mantencion?per_page=${page}`).then(r => r.data);
