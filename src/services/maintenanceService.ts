import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  MantencionFaena,
  BitacoraMantencion,
  MaintenanceFilters,
  PaginatedResponse,
  ApiResponse,
} from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class MaintenanceService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers = config.headers || {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getMantenimientos(
    filters: MaintenanceFilters
  ): Promise<PaginatedResponse<MantencionFaena>> {
    try {
      const response = await this.api.get<
        ApiResponse<PaginatedResponse<MantencionFaena>>
      >('/mantenimientos', { params: filters });
      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error || 'Failed to fetch mantenimientos'
        );
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  async getMantenimientoById(id: number): Promise<MantencionFaena> {
    try {
      const response = await this.api.get<ApiResponse<MantencionFaena>>(
        `/mantenimientos/${id}`
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to fetch mantenimiento');
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  async getBitacora(id_mantencion: number): Promise<BitacoraMantencion[]> {
    try {
      const response = await this.api.get<ApiResponse<BitacoraMantencion[]>>(
        `/mantenimientos/${id_mantencion}/bitacora`
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to fetch bitacora');
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  async createMantenimiento(
    data: Partial<MantencionFaena>
  ): Promise<MantencionFaena> {
    try {
      const response = await this.api.post<ApiResponse<MantencionFaena>>(
        '/mantenimientos',
        data
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error || 'Failed to create mantenimiento'
        );
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  async updateMantenimiento(
    id: number,
    data: Partial<MantencionFaena>
  ): Promise<MantencionFaena> {
    try {
      const response = await this.api.put<ApiResponse<MantencionFaena>>(
        `/mantenimientos/${id}`,
        data
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(
          response.data.error || 'Failed to update mantenimiento'
        );
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  async deleteMantenimiento(id: number): Promise<void> {
    try {
      const response = await this.api.delete<ApiResponse<void>>(
        `/mantenimientos/${id}`
      );
      if (!response.data.success) {
        throw new Error(
          response.data.error || 'Failed to delete mantenimiento'
        );
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  async changeStatus(id: number, id_estado: number): Promise<MantencionFaena> {
    try {
      const response = await this.api.patch<ApiResponse<MantencionFaena>>(
        `/mantenimientos/${id}/status`,
        { id_estado }
      );
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.error || 'Failed to change status');
      }
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || error.message);
    }
  }
}

export const maintenanceService = new MaintenanceService();
