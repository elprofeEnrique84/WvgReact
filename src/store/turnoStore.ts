import { create } from 'zustand';
import { Turno } from '../services/turnoService';
import { turnoService } from '../services/turnoService';

interface TurnoFilters {
  page: number;
  limit: number;
}

interface TurnoStore {
  // Estado
  turnos: Turno[];
  selectedTurno: Turno | null
