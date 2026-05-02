import { create } from 'zustand';
import { authService } from '../services/authService';

const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
const storedUser = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null;

export const useAuthStore = create((set) => ({
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isLoggedIn: !!storedToken,

  login: async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      set({
        user: response.user,
        token: response.token,
        isLoggedIn: true,
      });
      return response.user;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    set({ user: null, token: null, isLoggedIn: false });
  }
}));