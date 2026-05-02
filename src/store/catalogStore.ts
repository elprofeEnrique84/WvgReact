import { create } from 'zustand';
import { Equipo, TipoPlanta, UbicacionEquipo, ComponentePiezaEquipo, ConfigEquipoMantencion, Turno, Estado, Faena, Responsable, Actividad, Categoria, Perfil, Cliente } from '../types';
import { catalogService } from '../services/catalogService';

interface CatalogStore {
  // Catálogos
  equipos: Equipo[];
  tiposPlanta: TipoPlanta[];
  ubicaciones: UbicacionEquipo[];
  componentes: ComponentePiezaEquipo[];
  configEquipos: ConfigEquipoMantencion[];
  turnos: Turno[];
  estados: Estado[];
  faenas: Faena[];
  responsables: Responsable[];
  actividades: Actividad[];
  categorias: Categoria[];
  perfiles: Perfil[];
  clientes: Cliente[];

  loading: boolean;
  error: string | null;

  // Acciones
  fetchEquipos: () => Promise<void>;
  fetchTiposPlanta: () => Promise<void>;
  fetchUbicaciones: () => Promise<void>;
  fetchComponentes: (id_equipo?: number) => Promise<void>;
  fetchConfigEquipos: (id_mantencion?: number) => Promise<void>;
  fetchTurnos: () => Promise<void>;
  fetchEstados: () => Promise<void>;
  fetchFaenas: () => Promise<void>;
  fetchResponsables: () => Promise<void>;
  fetchActividades: () => Promise<void>;
  fetchCategorias: () => Promise<void>;
  fetchPerfiles: () => Promise<void>;
  fetchClientes: () => Promise<void>;

  // Cargar todos los catálogos
  fetchAllCatalogs: () => Promise<void>;

  clearError: () => void;
}

export const useCatalogStore = create<CatalogStore>((set, get) => ({
  equipos: [],
  tiposPlanta: [],
  ubicaciones: [],
  componentes: [],
  configEquipos: [],
  turnos: [],
  estados: [],
  faenas: [],
  responsables: [],
  actividades: [],
  categorias: [],
  perfiles: [],
  clientes: [],
  loading: false,
  error: null,

  fetchEquipos: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getEquipos();
      set({ equipos: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTiposPlanta: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getTiposPlanta();
      set({ tiposPlanta: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchUbicaciones: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getUbicaciones();
      set({ ubicaciones: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchComponentes: async (id_equipo?: number) => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getComponentes(id_equipo);
      set({ componentes: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchConfigEquipos: async (id_mantencion?: number) => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getConfigEquipos(id_mantencion);
      set({ configEquipos: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchTurnos: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getTurnos();
      set({ turnos: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchEstados: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getEstados();
      set({ estados: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchFaenas: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getFaenas();
      set({ faenas: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchResponsables: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getResponsables();
      set({ responsables: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchActividades: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getActividades();
      set({ actividades: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchCategorias: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getCategorias();
      set({ categorias: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchPerfiles: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getPerfiles();
      set({ perfiles: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchClientes: async () => {
    set({ loading: true, error: null });
    try {
      const data = await catalogService.getClientes();
      set({ clientes: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchAllCatalogs: async () => {
    set({ loading: true, error: null });
    try {
      await Promise.all([
        get().fetchEquipos(),
        get().fetchTiposPlanta(),
        get().fetchUbicaciones(),
        get().fetchTurnos(),
        get().fetchEstados(),
        get().fetchFaenas(),
        get().fetchResponsables(),
        get().fetchActividades(),
        get().fetchCategorias(),
        get().fetchPerfiles(),
        get().fetchClientes(),
      ]);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
