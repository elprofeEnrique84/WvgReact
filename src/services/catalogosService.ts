import axios, { AxiosInstance } from 'axios';

interface CatalogoItem {
  id: number;
  nombre: string;
  [key: string]: any;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class CatalogosService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getEquipos(): Promise<CatalogoItem[]> {
    try {
      const response = await this.api.get('/catalogos/equipos');
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error fetching equipos'
      );
    }
  }

  async getEstados(): Promise<CatalogoItem[]> {
    try {
      const response = await this.api.get('/catalogos/estados');
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error fetching estados'
      );
    }
  }

  async getTurnos(): Promise<CatalogoItem[]> {
    try {
      const response = await this.api.get('/catalogos/turnos');
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error fetching turnos');
    }
  }

  async getFaenas(): Promise<CatalogoItem[]> {
    try {
      const response = await this.api.get('/catalogos/faenas');
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error fetching faenas');
    }
  }

  async getResponsables(): Promise<CatalogoItem[]> {
    try {
      const response = await this.api.get('/catalogos/responsables');
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error fetching responsables'
      );
    }
  }

  async getCategorias(): Promise<CatalogoItem[]> {
    try {
      const response = await this.api.get('/catalogos/categorias');
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error fetching categorias'
      );
    }
  }
}

export const catalogosService = new CatalogosService();
