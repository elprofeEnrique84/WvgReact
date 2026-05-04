import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MantenimientosPage } from './pages/MantenimientosPage';
import DigitalTwinPage from './pages/DigitalTwinPage';
import Dashboard from './pages/Dashboard';

// Componente protegido
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mantenimientos"
          element={
            <ProtectedRoute>
              <MantenimientosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/digital-twin"
          element={
            <ProtectedRoute>
              <DigitalTwinPage />
            </ProtectedRoute>
          }
        />

        {/* Redirecciones */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
