import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { useMaintenanceStore } from '../store/maintenanceStore';
import { useCatalogStore } from '../store/catalogStore';

export const MantenimientosPage = () => {
  const navigate = useNavigate();
  const { mantenimientos, fetchMantenimientos, setFilters, filters } = useMaintenanceStore();
  const { estados, equipos, fetchEstados, fetchEquipos } = useCatalogStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMantenimientos();
    fetchEstados();
    fetchEquipos();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const getStatusColor = (estado_id) => {
    const colors = {
      1: 'bg-yellow-100 text-yellow-800',
      2: 'bg-blue-100 text-blue-800',
      3: 'bg-red-100 text-red-800',
      4: 'bg-pink-100 text-pink-800',
      5: 'bg-green-100 text-green-800',
    };
    return colors[estado_id] || 'bg-gray-100 text-gray-800';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mantenimientos</h1>
            <p className="text-gray-600 mt-1">Gestión de mantenciones preventivas y correctivas</p>
          </div>
          <button
            onClick={() => navigate('/mantenimientos/nuevo')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            + Nuevo Mantenimiento
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            />
            <select
              onChange={(e) => handleFilterChange({ estado: e.target.value ? parseInt(e.target.value) : undefined })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="">Todos los estados</option>
              {estados.map((est) => (
                <option key={est.id_estado} value={est.id_estado}>
                  {est.nombre_estado}
                </option>
              ))}
            </select>
            <select
              onChange={(e) => handleFilterChange({ equipo: e.target.value ? parseInt(e.target.value) : undefined })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="">Todos los equipos</option>
              {equipos.map((eq) => (
                <option key={eq.id_equipo} value={eq.id_equipo}>
                  {eq.nombre_equipo}
                </option>
              ))}
            </select>
            <button
              onClick={() => setFilters({})}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Equipo</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha Inicio</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Fecha Término (Proy.)</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mantenimientos.map((mant) => (
                  <tr key={mant.id_mantencion} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-gray-600">{mant.id_mantencion}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{mant.nombre_mantencion}</td>
                    <td className="py-3 px-4 text-gray-600">{mant.equipo?.nombre_equipo || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(mant.id_estado)}`}>
                        {mant.estado?.nombre_estado || 'Desconocido'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{mant.fecha_inicio}</td>
                    <td className="py-3 px-4 text-gray-600">{mant.fecha_termino_proyeccion}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => navigate(`/mantenimientos/${mant.id_mantencion}`)}
                        className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => navigate(`/mantenimientos/${mant.id_mantencion}/editar`)}
                        className="text-orange-600 hover:text-orange-800 font-medium"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
