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

router.get('/perfiles', async (req, res) => {
  try {
    const rows = await safeQuery('SELECT * FROM perfil ORDER BY nombre');
    res.json({ success: true, data: rows });
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
