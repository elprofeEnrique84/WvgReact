import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// GET /api/mantenimientos - List all
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT mf.*, e.nombre as equipo_nombre, t.fecha as turno_fecha
      FROM mantencion_faena mf
      LEFT JOIN equipo e ON mf.equipo_id = e.id
      LEFT JOIN turno t ON mf.turno_id = t.id
      ORDER BY mf.fecha DESC
      LIMIT 100
    `;
    const [rows] = await pool.query(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching mantenimientos:', error);
    res.status(500).json({ success: false, message: 'Error al obtener mantenimientos' });
  }
});

// GET /api/mantenimientos/:id - Get single
router.get('/:id', async (req, res) => {
  try {
    const query = `
      SELECT mf.*, bm.*, e.nombre as equipo_nombre
      FROM mantencion_faena mf
      LEFT JOIN bitacora_mantencion bm ON mf.id = bm.mantencion_id
      LEFT JOIN equipo e ON mf.equipo_id = e.id
      WHERE mf.id = ?
    `;
    const [rows] = await pool.query(query, [req.params.id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

// POST /api/mantenimientos - Create
router.post('/', async (req, res) => {
  try {
    const { equipo_id, turno_id, fecha, descripcion, estado_id } = req.body;
    const query = `
      INSERT INTO mantencion_faena (equipo_id, turno_id, fecha, descripcion, estado_id, usuario_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      equipo_id,
      turno_id,
      fecha,
      descripcion,
      estado_id || 1,
      req.user.id
    ]);

    res.json({
      success: true,
      message: 'Mantenimiento creado',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ success: false, message: 'Error al crear' });
  }
});

// PUT /api/mantenimientos/:id - Update
router.put('/:id', async (req, res) => {
  try {
    const { equipo_id, turno_id, fecha, descripcion, estado_id } = req.body;
    const query = `
      UPDATE mantencion_faena
      SET equipo_id = ?, turno_id = ?, fecha = ?, descripcion = ?, estado_id = ?
      WHERE id = ?
    `;
    await pool.query(query, [
      equipo_id,
      turno_id,
      fecha,
      descripcion,
      estado_id,
      req.params.id
    ]);

    res.json({ success: true, message: 'Mantenimiento actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar' });
  }
});

// DELETE /api/mantenimientos/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM mantencion_faena WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Mantenimiento eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar' });
  }
});

// GET /api/mantenimientos/:id/bitacora - Get bitácora entries
router.get('/:id/bitacora', async (req, res) => {
  try {
    const query = `
      SELECT * FROM bitacora_mantencion
      WHERE mantencion_id = ?
      ORDER BY fecha DESC
    `;
    const [rows] = await pool.query(query, [req.params.id]);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error' });
  }
});

export default router;
