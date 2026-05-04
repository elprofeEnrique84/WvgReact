// src/pages/Dashboard.jsx
import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import StatsBar from '../components/StatsBar';
import MantencionTable from '../components/MantencionTable';

export default function Dashboard() {
  const { data, loading, error, refresh } = useDashboard();
  const perfil = React.useMemo(() => {
    const raw = sessionStorage.getItem('id_perfil');
    const parsed = Number.parseInt(raw ?? '3', 10);
    return Number.isNaN(parsed) ? 3 : parsed;
  }, []);

  const safeData = data ?? {
    en_ejecucion: [],
    atrasados: [],
    desviados: [],
    planificados: [],
  };

  return (
    <div style={styles.root}>
      {/* ── HEADER ─────────────────────────────────────────── */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>⚙</div>
          <div>
            <div style={styles.headerTitle}>Dashboard de Mantenciones</div>
            <div style={styles.headerSub}>Sistema de Tráfico · Molinos SAG</div>
          </div>
        </div>
        <div style={styles.headerRight}>
          <Clock />
          <button onClick={refresh} style={styles.refreshBtn} title="Recargar datos">
            ↺ Actualizar
          </button>
        </div>
      </header>

      {/* ── BODY ───────────────────────────────────────────── */}
      <div style={styles.body}>

        {/* Loading */}
        {loading && (
          <div style={styles.loadingWrap}>
            <div style={styles.spinner} />
            <span style={{ color: '#64748b', fontSize: 14 }}>Cargando datos…</span>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={styles.errorBox}>
            <span style={{ fontSize: 18 }}>⚠</span>
            <div>
              <strong style={{ color: '#ef4444' }}>Error al cargar el dashboard</strong>
              <p style={{ margin: '4px 0 12px', color: '#94a3b8', fontSize: 13 }}>{error}</p>
              <button onClick={refresh} style={styles.retryBtn}>Reintentar</button>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* KPI Cards */}
            <StatsBar data={safeData} />

            {/* 3 tablas en columnas */}
            <div style={styles.grid3}>
              <MantencionTable
                title="Proyectos Atrasados"
                rows={safeData.atrasados}
                accentColor="#ef4444"
                maxRows={5}
                perfil={perfil}
              />
              <MantencionTable
                title="Proyectos con Desviación"
                rows={data.desviados}
                accentColor="#f59e0b"
                maxRows={5}
                perfil={PERFIL}
              />
              <MantencionTable
                title="En Planificación"
                rows={safeData.planificados}
                accentColor="#22c55e"
                maxRows={5}
                perfil={perfil}
              />
            </div>

            {/* Tabla principal - En Ejecución */}
            <MantencionTable
              title="Proyectos en Ejecución"
              rows={safeData.en_ejecucion}
              accentColor="#3b82f6"
              showActions={true}
              perfil={perfil}
            />
          </>
        )}
      </div>
    </div>
  );
}

// ── Reloj ─────────────────────────────────────────────────────────
function Clock() {
  const [time, setTime] = React.useState(new Date());
  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ fontFamily: 'monospace', fontSize: 13, color: '#64748b' }}>
      {time.toLocaleTimeString('es-CL')}
    </span>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const styles = {
  root: {
    minHeight: '100vh',
    background: '#080c14',
    color: '#e2e8f0',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 28px',
    background: '#0e1420',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  headerIcon: {
    width: 40, height: 40,
    background: 'rgba(245,158,11,0.12)',
    border: '1px solid rgba(245,158,11,0.4)',
    borderRadius: 8,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20,
  },
  headerTitle: { fontSize: 16, fontWeight: 700, letterSpacing: '0.04em' },
  headerSub: { fontSize: 11, color: '#64748b', letterSpacing: '0.06em', marginTop: 2 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 16 },
  refreshBtn: {
    padding: '6px 14px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 6,
    color: '#94a3b8',
    fontSize: 12,
    cursor: 'pointer',
    fontWeight: 600,
    letterSpacing: '0.04em',
    transition: 'all 0.2s',
  },
  body: { padding: '28px' },
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginBottom: 0,
  },
  loadingWrap: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    minHeight: 300, gap: 16,
  },
  spinner: {
    width: 36, height: 36,
    border: '3px solid rgba(255,255,255,0.08)',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  errorBox: {
    display: 'flex', alignItems: 'flex-start', gap: 16,
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: 10, padding: 24,
  },
  retryBtn: {
    padding: '6px 16px',
    background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.4)',
    borderRadius: 6,
    color: '#ef4444',
    fontSize: 12, fontWeight: 600, cursor: 'pointer',
  },
};
