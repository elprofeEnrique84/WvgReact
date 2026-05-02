import axios, { AxiosInstance } from 'axios';

interface Mantenimiento {
  id?: number;
  equipo_id: number;
  turno_id: number;
  fecha: string;
  descripcion: string;
  estado_id: number;
  usuario_id?: number;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class MantenimientosService {
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

  async getAll(limit = 100): Promise<Mantenimiento[]> {
    try {
      const response = await this.api.get(`/mantenimientos?limit=${limit}`);
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error fetching mantenimientos'
      );
    }
  }

  async getById(id: number): Promise<Mantenimiento> {
    try {
      const response = await this.api.get(`/mantenimientos/${id}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error fetching mantenimiento'
      );
    }
  }

  async create(data: Partial<Mantenimiento>): Promise<number> {
    try {
      const response = await this.api.post('/mantenimientos', data);
      return response.data.id;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error creating mantenimiento'
      );
    }
  }

  async update(id: number, data: Partial<Mantenimiento>): Promise<void> {
    try {
      await this.api.put(`/mantenimientos/${id}`, data);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error updating mantenimiento'
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.api.delete(`/mantenimientos/${id}`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error deleting mantenimiento'
      );
    }
  }

  async getBitacora(mantenimientoId: number): Promise<any[]> {
    try {
      const response = await this.api.get(
        `/mantenimientos/${mantenimientoId}/bitacora`
      );
      return response.data.data || [];
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Error fetching bitacora'
      );
    }
  }
}

export const mantenimientosService = new MantenimientosService();
