import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

// GET /api/mantenimientos - List all with pagination
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
    const offset = (page - 1) * limit;

    const countQuery = 'SELECT COUNT(*) as total FROM mantencion_faena';
    const [countRows] = await pool.query(countQuery);
    const total = countRows[0]?.total || 0;

    const query = `
      SELECT mf.*, e.nombre as equipo_nombre, t.fecha as turno_fecha
      FROM mantencion_faena mf
      LEFT JOIN equipo e ON mf.equipo_id = e.id
      LEFT JOIN turno t ON mf.turno_id = t.id
      ORDER BY mf.fecha DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(query, [limit, offset]);

    res.json({
      success: true,
      data: rows,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching mantenimientos:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error al obtener mantenimientos' });
  }
});

// GET /api/mantenimientos/:id - Get single
router.get('/:id', async (req, res) => {
  try {
    const query = `
      SELECT mf.*, e.nombre as equipo_nombre
      FROM mantencion_faena mf
      LEFT JOIN equipo e ON mf.equipo_id = e.id
      WHERE mf.id = ?
    `;
    const [rows] = await pool.query(query, [req.params.id]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Mantenimiento no encontrado' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Get mantenimiento error:', error);
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
      req.user.id,
    ]);

    res.json({
      success: true,
      message: 'Mantenimiento creado',
      data: { id: result.insertId },
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
      req.params.id,
    ]);

    res.json({
      success: true,
      message: 'Mantenimiento actualizado',
      data: { id: req.params.id },
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar' });
  }
});

// DELETE /api/mantenimientos/:id
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM mantencion_faena WHERE id = ?', [
      req.params.id,
    ]);
    res.json({
      success: true,
      message: 'Mantenimiento eliminado',
    });
  } catch (error) {
    console.error('Delete error:', error);
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
    console.error('Bitacora error:', error);
    res.status(500).json({ success: false, message: 'Error' });
  }
});

export default router;
