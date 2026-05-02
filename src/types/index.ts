// ==================== AUTENTICACIÓN ====================
export interface Usuario {
  id_usuario: number;
  nombre_usuario: string;
  email_usuario: string;
  area: string;
  id_perfil: number;
  id_cliente: number;
  fecha_ingreso: string;
  mca_habilitada: string;
  password?: string;
}

export interface Perfil {
  id_perfil: number;
  nombre_perfil: string;
  descripcion: string;
  mca_habilitada: string;
}

export interface Cliente {
  id_cliente: number;
  nombre_cliente: string;
  mca_habilitado: number;
}

export interface AuthUser extends Usuario {
  perfil?: Perfil;
  cliente?: Cliente;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
  exp: number;
}

// ==================== EQUIPOS ====================
export interface Equipo {
  id_equipo: number;
  nombre_equipo: string;
  descripcion?: string;
  mca_habilitada: string;
}

export interface TipoPlanta {
  id_tipo_planta: number;
  tipo_planta: string;
}

export interface UbicacionEquipo {
  idubicacion_equipo: number;
  ubicacion_equipo: string;
}

export interface ComponentePiezaEquipo {
  id_componente_pieza_equipo: number;
  id_equipo: number;
  idubicacion_equipo: number;
  nombre_componente: string;
  fecha_creacion: string;
  cantidad_piezas: number;
}

// ==================== CONFIGURACIÓN MANTENIMIENTO ====================
export interface ConfigEquipoMantencion {
  id_configequipo_mantencion: number;
  id_equipo: number;
  id_componente_pieza_equipo: number;
  id_mantencion: number;
  nombre_pieza_fictisia: string;
  cantidad_piezas_desmontar: number;
  cantidad_piezas_montar: number;
}

export interface ConfigTurnoMantencion {
  idconfig_turno_Mantencion: number;
  id_mantencion: number;
  Id_turno: number;
  cantidad_movimientos_porturno: number;
}

// ==================== MANTENIMIENTO ====================
export interface MantencionFaena {
  id_mantencion: number;
  id_equipo: number;
  id_usuario: number;
  id_estado: number;
  id_tipo_planta: number;
  id_faena: number;
  nombre_mantencion: string;
  hora_mantencion_inicial: number;
  fecha_inicio: string;
  hora_inicio: string;
  fecha_termino: string;
  hora_termino: string;
  fecha_termino_proyeccion: string;
  hora_termino_proyeccion: string;
  habilitado: number;
  // Relaciones cargadas
  equipo?: Equipo;
  usuario?: Usuario;
  estado?: Estado;
  tipo_planta?: TipoPlanta;
  faena?: Faena;
  config_equipos?: ConfigEquipoMantencion[];
  config_turnos?: ConfigTurnoMantencion[];
}

export interface Estado {
  id_estado: number;
  nombre_estado: string;
  descripcion_estado: string;
  mca_habilitada: string;
}

export interface Faena {
  id_faena: number;
  nombre_faena: string;
}

export interface Turno {
  id_turno: number;
  nombre_turno: string;
  cantidad_equipo: number;
}

// ==================== BITÁCORA ====================
export interface BitacoraMantencion {
  id_folio: number;
  id_configequipo_mantencion: number;
  id_responsable: number;
  id_actividad: number;
  idconfig_turno_mantencion: number;
  id_usuario: number;
  fecha_proceso: string;
  fecha_trabajo: string;
  hora_trabajo: string;
  hora_fin: string;
  comentario_trabajo: string;
  cantidad_piezas_desmontar_real: number;
  cantidad_piezas_montar_real: number;
  id_categoria: number;
  id_mantencion: number;
  // Relaciones
  actividad?: Actividad;
  categoria?: Categoria;
  responsable?: Responsable;
  usuario?: Usuario;
}

export interface Actividad {
  id_actividad: number;
  nombre_actividad: string;
}

export interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

export interface Responsable {
  id_responsable: number;
  nombre_responsable: string;
}

// ==================== FILTROS ====================
export interface MaintenanceFilters {
  estado?: number;
  usuario?: number;
  tipo_planta?: number;
  faena?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface DashboardKPIs {
  total_mantenimientos: number;
  planificados: number;
  en_proceso: number;
  atrasados: number;
  desviados: number;
  completados: number;
  tasa_completitud: number; // porcentaje
  equipos_activos: number;
  usuarios_activos: number;
  horas_total_mantenimiento: number;
}

// ==================== RESPUESTAS API ====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
