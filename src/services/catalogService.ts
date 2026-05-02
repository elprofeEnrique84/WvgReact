import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  Equipo,
  TipoPlanta,
  UbicacionEquipo,
  ComponentePiezaEquipo,
  ConfigEquipoMantencion,
  Turno,
  Estado,
  Faena,
  Responsable,
  Actividad,
  Categoria,
  Perfil,
  Cliente,
  ApiResponse,
} from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class CatalogService {
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

  async getEquipos(): Promise<Equipo[]> {
    const response = await this.api.get<ApiResponse<Equipo[]>>(
      '/catalogos/equipos'
    );
    return response.data.data || [];
  }

  async getTiposPlanta(): Promise<TipoPlanta[]> {
    const response = await this.api.get<ApiResponse<TipoPlanta[]>>(
      '/catalogos/tipos-planta'
    );
    return response.data.data || [];
  }

  async getUbicaciones(): Promise<UbicacionEquipo[]> {
    const response = await this.api.get<ApiResponse<UbicacionEquipo[]>>(
      '/catalogos/ubicaciones'
    );
    return response.data.data || [];
  }

  async getComponentes(id_equipo?: number): Promise<ComponentePiezaEquipo[]> {
    const url = id_equipo
      ? `/catalogos/componentes?id_equipo=${id_equipo}`
      : '/catalogos/componentes';
    const response = await this.api.get<ApiResponse<ComponentePiezaEquipo[]>>(url);
    return response.data.data || [];
  }

  async getConfigEquipos(
    id_mantencion?: number
  ): Promise<ConfigEquipoMantencion[]> {
    const url = id_mantencion
      ? `/catalogos/config-equipos?id_mantencion=${id_mantencion}`
      : '/catalogos/config-equipos';
    const response = await this.api.get<ApiResponse<ConfigEquipoMantencion[]>>(url);
    return response.data.data || [];
  }

  async getTurnos(): Promise<Turno[]> {
    const response = await this.api.get<ApiResponse<Turno[]>>(
      '/catalogos/turnos'
    );
    return response.data.data || [];
  }

  async getEstados(): Promise<Estado[]> {
    const response = await this.api.get<ApiResponse<Estado[]>>(
      '/catalogos/estados'
    );
    return response.data.data || [];
  }

  async getFaenas(): Promise<Faena[]> {
    const response = await this.api.get<ApiResponse<Faena[]>>(
      '/catalogos/faenas'
    );
    return response.data.data || [];
  }

  async getResponsables(): Promise<Responsable[]> {
    const response = await this.api.get<ApiResponse<Responsable[]>>(
      '/catalogos/responsables'
    );
    return response.data.data || [];
  }

  async getActividades(): Promise<Actividad[]> {
    const response = await this.api.get<ApiResponse<Actividad[]>>(
      '/catalogos/actividades'
    );
    return response.data.data || [];
  }

  async getCategorias(): Promise<Categoria[]> {
    const response = await this.api.get<ApiResponse<Categoria[]>>(
      '/catalogos/categorias'
    );
    return response.data.data || [];
  }

  async getPerfiles(): Promise<Perfil[]> {
    const response = await this.api.get<ApiResponse<Perfil[]>>(
      '/catalogos/perfiles'
    );
    return response.data.data || [];
  }

  async getClientes(): Promise<Cliente[]> {
    const response = await this.api.get<ApiResponse<Cliente[]>>(
      '/catalogos/clientes'
    );
    return response.data.data || [];
  }
}

export const catalogService = new CatalogService();
