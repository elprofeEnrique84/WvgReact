import axios, { AxiosInstance, AxiosError } from 'axios';
import { LoginCredentials, LoginResponse, ApiResponse } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token en cada request
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<any>) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await this.api.post<any>('/auth/login', credentials);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login failed');
      }
      // New API returns: { success: true, token, user: { id, email, nombre } }
      return {
        token: response.data.token,
        user: response.data.user,
        exp: 0,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || error.message || 'Login failed'
      );
    }
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      // Ignorar errores en logout
    }
  }

  async refreshToken(): Promise<string> {
    try {
      const response = await this.api.post('/auth/refresh');
      if (!response.data.success || !response.data.token) {
        throw new Error('Token refresh failed');
      }
      const token = response.data.token;
      localStorage.setItem('auth_token', token);
      return token;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  async getCurrentUser() {
    try {
      const response = await this.api.get('/auth/me');
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  }
}

export const authService = new AuthService();
