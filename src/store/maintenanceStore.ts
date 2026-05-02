import { create } from 'zustand';
import {
  MantencionFaena,
  MaintenanceFilters,
  BitacoraMantencion,
} from '../types';
import { maintenanceService } from '../services/maintenanceService';

interface MaintenanceStore {
  // Estado
  mantenimientos: MantencionFaena[];
  selectedMantenimiento: MantencionFaena | null;
  bitacora: BitacoraMantencion[];
  filters: MaintenanceFilters;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;

  // Acciones
  fetchMantenimientos: (filters?: MaintenanceFilters) => Promise<void>;
  fetchMantenimientoById: (id: number) => Promise<void>;
  fetchBitacora: (id_mantencion: number) => Promise<void>;
  createMantenimiento: (data: Partial<MantencionFaena>) => Promise<void>;
  updateMantenimiento: (
    id: number,
    data: Partial<MantencionFaena>
  ) => Promise<void>;
  deleteMantenimiento: (id: number) => Promise<void>;
  setFilters: (filters: Partial<MaintenanceFilters>) => void;
  setSelectedMantenimiento: (mantenimiento: MantencionFaena | null) => void;
  clearError: () => void;
  setPage: (page: number) => void;
}

export const useMaintenanceStore = create<MaintenanceStore>((set, get) => ({
  mantenimientos: [],
  selectedMantenimiento: null,
  bitacora: [],
  filters: { limit: 10, page: 0 },
  loading: false,
  error: null,
  total: 0,
  page: 0,
  limit: 10,

  fetchMantenimientos: async (filters?: MaintenanceFilters) => {
    set({ loading: true, error: null });
    try {
      const currentFilters = filters || get().filters;
      const response =
        await maintenanceService.getMantenimientos(currentFilters);
      set({
        mantenimientos: response.data,
        total: response.total,
        page: response.page,
        limit: response.limit,
        filters: currentFilters,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Error al cargar mantenimientos',
        loading: false,
      });
    }
  },

  fetchMantenimientoById: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const data = await maintenanceService.getMantenimientoById(id);
      set({
        selectedMantenimiento: data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Error al cargar mantenimiento',
        loading: false,
      });
    }
  },

  fetchBitacora: async (id_mantencion: number) => {
    set({ loading: true, error: null });
    try {
      const data = await maintenanceService.getBitacora(id_mantencion);
      set({
        bitacora: data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Error al cargar bitácora',
        loading: false,
      });
    }
  },

  createMantenimiento: async (data: Partial<MantencionFaena>) => {
    set({ loading: true, error: null });
    try {
      await maintenanceService.createMantenimiento(data);
      // Recargar lista
      await get().fetchMantenimientos();
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Error al crear mantenimiento',
        loading: false,
      });
    }
  },

  updateMantenimiento: async (id: number, data: Partial<MantencionFaena>) => {
    set({ loading: true, error: null });
    try {
      await maintenanceService.updateMantenimiento(id, data);
      // Recargar detalle y lista
      await get().fetchMantenimientoById(id);
      await get().fetchMantenimientos();
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Error al actualizar mantenimiento',
        loading: false,
      });
    }
  },

  deleteMantenimiento: async (id: number) => {
    set({ loading: true, error: null });
    try {
      await maintenanceService.deleteMantenimiento(id);
      // Recargar lista
      await get().fetchMantenimientos();
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Error al eliminar mantenimiento',
        loading: false,
      });
    }
  },

  setFilters: (filters: Partial<MaintenanceFilters>) => {
    const currentFilters = get().filters;
    set({
      filters: { ...currentFilters, ...filters, page: 0 },
    });
  },

  setSelectedMantenimiento: (mantenimiento: MantencionFaena | null) => {
    set({ selectedMantenimiento: mantenimiento });
  },

  clearError: () => {
    set({ error: null });
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchMantenimientos({ ...get().filters, page });
  },
}));
