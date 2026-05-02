import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuthStore();

  const isActive = (path) => location.pathname.startsWith(path);

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/mantenimientos', label: 'Mantenimientos', icon: '🔧' },
    { path: '/bitacora', label: 'Bitácora', icon: '📋' },
    { path: '/equipos', label: 'Equipos', icon: '⚙️' },
    { path: '/reportes', label: 'Reportes', icon: '📈' },
  ];

  // Mostrar items de administración solo si el usuario es admin
  if (user?.perfil?.nombre_perfil === 'admin' || user?.id_perfil === 1) {
    menuItems.push(
      { path: '/usuarios', label: 'Usuarios', icon: '👥' },
      { path: '/configuracion', label: 'Configuración', icon: '⚙️' }
    );
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-screen bg-gray-900 text-white shadow-xl transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0 md:w-64'
        } overflow-hidden md:overflow-visible z-20`}
      >
        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition mb-2 ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Toggle Button (Mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 md:hidden bg-blue-600 text-white p-3 rounded-full shadow-lg z-10"
      >
        ☰
      </button>

      {/* Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
