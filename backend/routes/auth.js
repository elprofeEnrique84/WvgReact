import express from 'express';
import crypto from 'crypto';
import { pool } from '../db.js';
import { generateToken, authMiddleware } from '../auth.js';

const router = express.Router();

// MD5 helper (match original PHP behavior)
const md5 = (str) => crypto.createHash('md5').update(str).digest('hex');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos',
      });
    }

    const query =
      'SELECT id_usuario, email_usuario, nombre_usuario, password, mca_habilitada FROM usuario WHERE email_usuario = ?';
    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    const user = rows[0];
    const passwordHash = md5(password);

    if (user.password !== passwordHash || user.mca_habilitada !== 'S') {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    const token = generateToken(user.id_usuario, user.email_usuario);

    res.json({
      success: true,
      token,
      user: {
        id: user.id_usuario,
        email: user.email_usuario,
        nombre: user.nombre_usuario,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en login',
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Sesión cerrada',
  });
});

// POST /api/auth/refresh
router.post('/refresh', authMiddleware, (req, res) => {
  const { id, email } = req.user || {};
  if (!id || !email) {
    return res.status(401).json({ success: false, message: 'Token inválido' });
  }
  const token = generateToken(id, email);
  res.json({ success: true, token });
});

// GET /api/auth/me (verify token)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'No autenticado' });
    }

    const query = 'SELECT id_usuario AS id, email_usuario AS email, nombre_usuario AS nombre FROM usuario WHERE id_usuario = ?';
    const [rows] = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      user: rows[0],
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, message: 'Error' });
  }
});

export default router;
