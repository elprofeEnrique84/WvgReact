import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

const mapStatus = (estado_id, estado_nombre) => {
  // Prioridad: usar estado_id (coincide con UI/maintenanceStore)
  switch (Number(estado_id)) {
    case 1:
      return 'normal';
    case 2:
      return 'alerta';
    case 3:
      return 'critico';
    case 4:
      return 'inactivo';
    case 5:
      return 'alerta';
    default:
      break;
  }

  // Fallback por nombre
  const name = String(estado_nombre || '').toLowerCase();
  if (name.includes('crit') || name.includes('rojo')) return 'critico';
  if (name.includes('alert') || name.includes('amar')) return 'alerta';
  if (name.includes('inact') || name.includes('off')) return 'inactivo';
  return 'normal';
};

router.get('/monitoreo/molinos', async (req, res) => {
  try {
    // Tomamos los mantenimientos más recientes para generar segmentos
    // Nota: torque/temp/tornillos dependen del esquema de bitácora; si no existen, se devuelven como null.
    const query = `
      SELECT 
        mf.id,
        mf.equipo_id,
        mf.fecha as ultima_revision,
        mf.estado_id,
        e.nombre as equipo_nombre,
        est.nombre as estado_nombre,
        mf.descripcion
      FROM mantencion_faena mf
      LEFT JOIN equipo e ON mf.equipo_id = e.id
      LEFT JOIN estado est ON mf.estado_id = est.id_estado
      ORDER BY mf.fecha DESC
      LIMIT 60
    `;

    const [rows] = await pool.query(query);

    const ringMeta = ['Interior', 'Medio', 'Exterior'];

    const segments = rows.map((r, idx) => {
      const ring = Number(r.equipo_id) % 3; // determinístico 0..2
      const status = mapStatus(r.estado_id, r.estado_nombre);

      return {
        id: r.id,
        ring,
        label: `${ringMeta[ring]} ${idx + 1}`,
        status,
        torque: null,
        temp: null,
        ultima_revision: r.ultima_revision ? String(r.ultima_revision) : null,
        tornillos: null,
      };
    });

    res.json({ success: true, data: segments });
  } catch (error) {
    console.error('digitalTwin monitoreo error:', error);
    res.status(500).json({ success: false, message: 'Error al obtener monitoreo' });
  }
});

router.post('/ai/analisis-monitoreo', async (req, res) => {
  try {
    const selectedIds = Array.isArray(req.body?.selectedIds)
      ? req.body.selectedIds
      : [];

    // Para análisis simple basado en estado: recalcamos con DB
    const ids = selectedIds.length ? selectedIds : null;

    const query = `
      SELECT mf.id, mf.estado_id
      FROM mantencion_faena mf
      ${ids ? 'WHERE mf.id IN (?)' : ''}
    `;

    const [rows] = await pool.query(query, ids ? [ids] : []);

    const statusCounts = {
      normal: 0,
      alerta: 0,
      critico: 0,
      inactivo: 0,
    };

    rows.forEach((r) => {
      const status = mapStatus(r.estado_id, null);
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const total = rows.length || 0;

    const result = {
      success: true,
      summary: {
        total,
        selected: ids ? true : false,
        counts: statusCounts,
        recommendations: [
          statusCounts.critico > 0
            ? 'Atender prioritariamente los segmentos en estado crítico para evitar fallas mayores.'
            : 'No se detectan segmentos críticos en el período consultado.',
          statusCounts.alerta > 0
            ? 'Revisar los segmentos en alerta y programar inspecciones preventivas.'
            : 'No se detectan alertas relevantes.',
        ],
      },
    };

    res.json(result);
  } catch (error) {
    console.error('AI analisis error:', error);
    res.status(500).json({ success: false, message: 'Error en análisis' });
  }
});

export default router;
