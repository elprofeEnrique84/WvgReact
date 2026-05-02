import express from 'express';
import crypto from 'crypto';
import { pool } from '../db.js';
import { generateToken } from '../auth.js';

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
        message: 'Email y contraseña son requeridos'
      });
    }

    // Query usuario table
    const query = 'SELECT id, email, nombre, contrasena FROM usuario WHERE email = ?';
    const [rows] = await pool.query(query, [email]);

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const user = rows[0];
    const passwordHash = md5(password);

    // Compare with stored hash (original system uses MD5)
    if (user.contrasena !== passwordHash) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error en login'
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // JWT logout just requires client to discard token
  res.json({
    success: true,
    message: 'Sesión cerrada'
  });
});

// GET /api/auth/me (verify token)
router.get('/me', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'No autenticado' });
    }

    const query = 'SELECT id, email, nombre FROM usuario WHERE id = ?';
    const [rows] = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({
      success: true,
      user: rows[0]
    });

  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ success: false, message: 'Error' });
  }
});

export default router;
