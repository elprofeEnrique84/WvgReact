import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// GET /api/catalogos/equipos
router.get('/equipos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM equipo ORDER BY nombre');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// GET /api/catalogos/estados
router.get('/estados', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM estado ORDER BY nombre');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// GET /api/catalogos/turnos
router.get('/turnos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM turno ORDER BY fecha DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// GET /api/catalogos/faenas
router.get('/faenas', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM faena ORDER BY nombre');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// GET /api/catalogos/responsables
router.get('/responsables', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM responsable ORDER BY nombre');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// GET /api/catalogos/categorias
router.get('/categorias', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categoria ORDER BY nombre');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

export default router;
