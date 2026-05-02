import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './auth.js';
import authRoutes from './routes/auth.js';
import mantenimientosRoutes from './routes/mantenimientos.js';
import catalogosRoutes from './routes/catalogos.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5174',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes
app.use('/api/mantenimientos', authMiddleware, mantenimientosRoutes);
app.use('/api/catalogos', authMiddleware, catalogosRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor API ejecutándose en http://localhost:${PORT}`);
});
