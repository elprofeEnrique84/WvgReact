import { create } from 'zustand';
import axios from 'axios';

// En WvgReact/src/store/authStore.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user_session')) || null,
  token: localStorage.getItem('auth_token') || null,
  isAuthenticated:
    !!localStorage.getItem('user_session') || !!localStorage.getItem('auth_token'),
  isLoggedIn:
    !!localStorage.getItem('user_session') || !!localStorage.getItem('auth_token'),
  loading: false,

  // 2. FUNCIÓN DE LOGIN
  login: async ({ email, password }) => {
    set({ loading: true });
    try {
      const response = await api.post('/login', { email, password });

      const userData = response.data.user;
      const token = response.data.token;

      set({
        user: userData,
        token,
        isAuthenticated: true,
        isLoggedIn: true,
        loading: false,
      });

      localStorage.setItem('user_session', JSON.stringify(userData));
      localStorage.setItem('auth_token', token);

      return userData;
    } catch (error) {
      set({ loading: false });

      const errorMsg = error.response?.data?.message || 'Error de conexión con el servidor';
      console.error('Detalle del error en AuthStore:', errorMsg);
      throw new Error(errorMsg);
    }
  },

  // 3. FUNCIÓN DE LOGOUT
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false, isLoggedIn: false });
    localStorage.removeItem('user_session');
    localStorage.removeItem('auth_token');
    // Opcional: limpiar cualquier otra cookie o dato local
  }
}));