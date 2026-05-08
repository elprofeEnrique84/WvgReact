import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

const safeQuery = async (query, params = []) => {
  const [rows] = await pool.query(query, params);
  return rows;
};

const sendError = (res, error) => {
  console.error(error);
  res.status(500).json({ success: false, message: 'Error en el servidor' });
};

router.get('/equipos', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM equipo ORDER BY nombre');
    res.json({ success: true, data: rows });
  } catch (error) {
    sendError(res, error);
  }
});

// POST /api/catalogos/equipos - Create equipo
router.post('/equipos', async (req, res) => {
  try {
    const { nombre, categoria_id, ubicacion_id, faena_id } = req.body;
    const query = `
      INSERT INTO equipo (nombre, categoria_id, ubicacion_id, faena_id, usuario_id) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [nombre, categoria_id || null, ubicacion_id || null, faena_id || null, req.user?.id || 1]);
    res.json({
      success: true,
      message: 'Equipo creado',
      data: { id_equipo: result.insertId }
    });
  } catch (error) {
    sendError(res, error);
  }
});

// PUT /api/catalogos/equipos/:id - Update equipo
router.put('/equipos/:id', async (req, res) => {
  try {
    const { nombre, categoria_id, ubicacion_id, faena_id } = req.body;
    const query = `
      UPDATE equipo 
      SET nombre = ?, categoria_id = ?, ubicacion_id = ?, faena_id = ? 
      WHERE id_equipo = ?
    `;
    const [result] = await pool.query(query, [nombre, categoria_id || null, ubicacion_id || null, faena_id || null, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Equipo no encontrado' });
    }
    res.json({
      success: true,
      message: 'Equipo actualizado'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// DELETE /api/catalogos/equipos/:id
router.delete('/equipos/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM equipo WHERE id_equipo = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Equipo no encontrado' });
    }
    res.json({
      success: true,
      message: 'Equipo eliminado'
    });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/tipos-planta', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM tipo_planta ORDER BY nombre');
    res.json({ success: true, data: rows });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/ubicaciones', async (req, res) => {
  try {
    const rows = await safeQuery(
      'SELECT * FROM ubicacion_equipo ORDER BY nombre'
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/componentes', async (req, res) => {
  try {
    let sql = 'SELECT * FROM componente_piezaequipo';
    const params = [];
    if (req.query.id_equipo) {
      sql += ' WHERE equipo_id = ?';
      params.push(req.query.id_equipo);
    }
    sql += ' ORDER BY nombre';
    const rows = await safeQuery(sql, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/config-equipos', async (req, res) => {
  try {
    let sql = 'SELECT * FROM config_equipo_mantencion';
    const params = [];
    if (req.query.id_mantencion) {
      sql += ' WHERE mantencion_id = ?';
      params.push(req.query.id_mantencion);
    }
    sql += ' ORDER BY id';
    const rows = await safeQuery(sql, params);
    res.json({ success: true, data: rows });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/turnos', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM turno ORDER BY fecha DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/estados', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM estado ORDER BY nombre');
    res.json({ success: true, data: rows });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/faenas', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM faena ORDER BY nombre');
    res.json({ success: true, data: rows });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/responsables', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM responsable ORDER BY nombre');
    res.json({ success: true, data: rows });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/actividades', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM actividad ORDER BY nombre');
    res.json({ success: true, data: rows });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/categorias', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM categoria ORDER BY nombre');
    res.json({ success: true, data: rows });
  } catch (error) {
    sendError(res, error);
  }
});

// POST /api/catalogos/categorias - Create categoria
router.post('/categorias', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const query = `
      INSERT INTO categoria (nombre, descripcion) 
      VALUES (?, ?)
    `;
    const [result] = await pool.query(query, [nombre, descripcion || null]);
    res.json({
      success: true,
      message: 'Categoría creada',
      data: { id_categoria: result.insertId }
    });
  } catch (error) {
    sendError(res, error);
  }
});

// PUT /api/catalogos/categorias/:id - Update categoria
router.put('/categorias/:id', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const query = `
      UPDATE categoria 
      SET nombre = ?, descripcion = ? 
      WHERE id_categoria = ?
    `;
    const [result] = await pool.query(query, [nombre, descripcion || null, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }
    res.json({
      success: true,
      message: 'Categoría actualizada'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// DELETE /api/catalogos/categorias/:id
router.delete('/categorias/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM categoria WHERE id_categoria = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }
    res.json({
      success: true,
      message: 'Categoría eliminada'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// POST /api/catalogos/turnos - Create turno
router.post('/turnos', async (req, res) => {
  try {
    const { nombre, fecha } = req.body;
    const query = `
      INSERT INTO turno (nombre, fecha) 
      VALUES (?, ?)
    `;
    const [result] = await pool.query(query, [nombre, fecha]);
    res.json({
      success: true,
      message: 'Turno creado',
      data: { id_turno: result.insertId }
    });
  } catch (error) {
    sendError(res, error);
  }
});

// PUT /api/catalogos/turnos/:id - Update turno
router.put('/turnos/:id', async (req, res) => {
  try {
    const { nombre, fecha } = req.body;
    const query = `
      UPDATE turno 
      SET nombre = ?, fecha = ? 
      WHERE id_turno = ?
    `;
    const [result] = await pool.query(query, [nombre, fecha, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Turno no encontrado' });
    }
    res.json({
      success: true,
      message: 'Turno actualizado'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// DELETE /api/catalogos/turnos/:id
router.delete('/turnos/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM turno WHERE id_turno = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Turno no encontrado' });
    }
    res.json({
      success: true,
      message: 'Turno eliminado'
    });
  } catch (error) {
    sendError(res, error);
  }
});

// POST /api/catalogos/estados - Create estado
router.post('/estados', async (req, res) => {
  try {
    const { nombre } = req.body;
    const query = `
      INSERT INTO estado (nombre) 
      VALUES (?)
    `;
    const [result] = await pool.query(query, [nombre]);
    res.json({
      success: true,
      message: 'Estado creado',
      data: { id_estado: result.insertId }
    });
  } catch (error) {
    sendError(res, error);
  }
});

// PUT /api/catalogos/estados/:id - Update estado
router.put('/estados/:id', async (req, res) => {
  try {
    const { nombre } = req.body;
    const query = `
      UPDATE estado 
      SET nombre = ? 
      WHERE id_estado = ?
    `;
    const [result] = await pool.query(query, [nombre, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Estado no encontrado' });
    }
    res.json({ success: true, message: 'Estado actualizado' });
  } catch (error) {
    sendError(res, error);
  }
});

router.get('/clientes', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM cliente ORDER BY nombre');
    res.json({ success: true, data: rows });
  } catch (error) {
    sendError(res, error);
  }
});

export default router;
