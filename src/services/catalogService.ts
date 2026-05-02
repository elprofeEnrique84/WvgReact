import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class CatalogService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config: AxiosRequestConfig) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async getEquipos(): Promise<Equipo[]> {
    const response = await this.api.get<ApiResponse<Equipo[]>>('/equipos');
    return response.data.data || [];
  }

  async getTiposPlanta(): Promise<TipoPlanta[]> {
    const response = await this.api.get<ApiResponse<TipoPlanta[]>>('/tipos-planta');
    return response.data.data || [];
  }

  async getUbicaciones(): Promise<UbicacionEquipo[]> {
    const response = await this.api.get<ApiResponse<UbicacionEquipo[]>>('/ubicaciones');
    return response.data.data || [];
  }

  async getComponentes(id_equipo?: number): Promise<ComponentePiezaEquipo[]> {
    const url = id_equipo ? `/componentes?id_equipo=${id_equipo}` : '/componentes';
    const response = await this.api.get<ApiResponse<ComponentePiezaEquipo[]>>(url);
    return response.data.data || [];
  }

  async getConfigEquipos(id_mantencion?: number): Promise<ConfigEquipoMantencion[]> {
    const url = id_mantencion
      ? `/config-equipos?id_mantencion=${id_mantencion}`
      : '/config-equipos';
    const response = await this.api.get<ApiResponse<ConfigEquipoMantencion[]>>(url);
    return response.data.data || [];
  }

  async getTurnos(): Promise<Turno[]> {
    const response = await this.api.get<ApiResponse<Turno[]>>('/turnos');
    return response.data.data || [];
  }

  async getEstados(): Promise<Estado[]> {
    const response = await this.api.get<ApiResponse<Estado[]>>('/estados');
    return response.data.data || [];
  }

  async getFaenas(): Promise<Faena[]> {
    const response = await this.api.get<ApiResponse<Faena[]>>('/faenas');
    return response.data.data || [];
  }

  async getResponsables(): Promise<Responsable[]> {
    const response = await this.api.get<ApiResponse<Responsable[]>>('/responsables');
    return response.data.data || [];
  }

  async getActividades(): Promise<Actividad[]> {
    const response = await this.api.get<ApiResponse<Actividad[]>>('/actividades');
    return response.data.data || [];
  }

  async getCategorias(): Promise<Categoria[]> {
    const response = await this.api.get<ApiResponse<Categoria[]>>('/categorias');
    return response.data.data || [];
  }

  async getPerfiles(): Promise<Perfil[]> {
    const response = await this.api.get<ApiResponse<Perfil[]>>('/perfiles');
    return response.data.data || [];
  }

  async getClientes(): Promise<Cliente[]> {
    const response = await this.api.get<ApiResponse<Cliente[]>>('/clientes');
    return response.data.data || [];
  }
}

export const catalogService = new CatalogService();
