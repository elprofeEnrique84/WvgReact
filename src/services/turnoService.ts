import axios from 'axios';

export interface Turno {
  id_turno: number;
  nombre_turno: string;
  cantidad_equipo: number;
}

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost/tu_proyecto/index.php';

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export interface Turno {
  id_turno: number;
  nombre_turno: string;
  cantidad_equipo: number;
}

export const turnoService = {
  // Listado con paginación (igual que PHP index())
  getAllTurnos: (page = 1, limit = 10) =>
    apiClient.get(`/turnos?page=${page}&limit=${limit}`).then(r => ({
      data: r.data.data || r.data,
      total: r.data.total || r.data.length
    })),

  // Obtener turno por ID (igual que PHP edit())
  getTurno: (id) =>
    apiClient.get(`/turnos/${id}`).then(r => r.data),

  // Crear nuevo turno (igual que PHP add())
  createTurno: (data) =>
    apiClient.post('/turnos', data).then(r => r.data),

  // Actualizar turno (igual que PHP edit())
  updateTurno: (id, data) =>
    apiClient.put(`/turnos/${id}`, data).then(r => r.data),

  // Eliminar turno (igual que PHP remove())
  deleteTurno: (id) =>
    apiClient.delete(`/turnos/${id}`).then(r => r.data),
};
