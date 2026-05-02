import React, { useEffect, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { useMaintenanceStore } from '../store/maintenanceStore';
import { useCatalogStore } from '../store/catalogStore';

export const DashboardPage = () => {
  const { mantenimientos, fetchMantenimientos } = useMaintenanceStore();
  const { estados, fetchEstados } = useCatalogStore();

  useEffect(() => {
    fetchMantenimientos();
    fetchEstados();
  }, []);

  // Calcular KPIs
  const kpis = {
    total: mantenimientos.length,
    planificados: mantenimientos.filter((m) => m.id_estado === 1).length,
    enProceso: mantenimientos.filter((m) => m.id_estado === 2).length,
    atrasados: mantenimientos.filter((m) => m.id_estado === 3).length,
    desviados: mantenimientos.filter((m) => m.id_estado === 4).length,
    completados: mantenimientos.filter((m) => m.id_estado === 5).length,
  };

  const completionRate =
    kpis.total > 0 ? ((kpis.completados / kpis.total) * 100).toFixed(1) : 0;

  const StatCard = ({ title, value, bgColor, icon }) => (
    <div className={`${bgColor} rounded-lg p-6 text-white shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Resumen del sistema de mantenimientos
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Mantenimientos"
            value={kpis.total}
            bgColor="bg-blue-600"
            icon="📊"
          />
          <StatCard
            title="Planificados"
            value={kpis.planificados}
            bgColor="bg-yellow-600"
            icon="📅"
          />
          <StatCard
            title="En Proceso"
            value={kpis.enProceso}
            bgColor="bg-orange-600"
            icon="⚙️"
          />
          <StatCard
            title="Completados"
            value={kpis.completados}
            bgColor="bg-green-600"
            icon="✓"
          />
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Atrasados"
            value={kpis.atrasados}
            bgColor="bg-red-600"
            icon="⚠️"
          />
          <StatCard
            title="Desviados"
            value={kpis.desviados}
            bgColor="bg-pink-600"
            icon="📍"
          />
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
            <div>
              <p className="text-sm opacity-90">Tasa de Completitud</p>
              <p className="text-3xl font-bold mt-2">{completionRate}%</p>
            </div>
          </div>
        </div>

        {/* Recent Maintenances */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Últimos Mantenimientos
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b-2 border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Nombre
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Equipo
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Fecha Inicio
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Usuario
                  </th>
                </tr>
              </thead>
              <tbody>
                {mantenimientos.slice(0, 5).map((mant) => (
                  <tr
                    key={mant.id_mantencion}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {mant.nombre_mantencion}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {mant.equipo?.nombre_equipo || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {mant.estado?.nombre_estado || 'Desconocido'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {mant.fecha_inicio}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {mant.usuario?.nombre_usuario || 'N/A'}
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
