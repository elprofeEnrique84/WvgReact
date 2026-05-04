// src/components/MantencionTable.jsx
import React, { useState } from 'react';

const STATUS_COLOR = {
  'En Ejecución': '#3b82f6',
  'Atrasado':     '#ef4444',
  'Desviado':     '#f59e0b',
  'Planificado':  '#22c55e',
};

export default function MantencionTable({
  title,
  rows = [],
  accentColor = '#3b82f6',
  showActions = false,
  perfil = 3,
  maxRows,
}) {
  const [search, setSearch] = useState('');

  const filtered = rows.filter(m =>
    !search ||
    m.nombre_mantencion?.toLowerCase().includes(search.toLowerCase()) ||
    m.id_faena?.toLowerCase().includes(search.toLowerCase()) ||
    String(m.id_mantencion).includes(search)
  );

  const visible = maxRows ? filtered.slice(0, maxRows) : filtered;

  return (
    <div style={{ ...styles.card, borderTop: `3px solid ${accentColor}` }}>
      {/* Header */}
      <div style={styles.cardHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ ...styles.dot, background: accentColor }} />
          <span style={styles.title}>{title}</span>
          <span style={{ ...styles.badge, background: `${accentColor}22`, color: accentColor }}>
            {rows.length}
          </span>
        </div>
        {rows.length > 4 && (
          <input
            type="text"
            placeholder="Buscar…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.search}
          />
        )}
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Usuario</Th>
              <Th>Faena</Th>
              <Th>Nombre Mantención</Th>
              {showActions && <Th>Acciones</Th>}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={showActions ? 5 : 4} style={styles.empty}>
                  {search ? 'Sin resultados' : 'Sin registros'}
                </td>
              </tr>
            ) : (
              visible.map((m, i) => (
                <tr
                  key={m.id_mantencion}
                  style={{
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                    transition: 'background 0.15s',
                  }}
                >
                  <Td mono accent={accentColor}>#{m.id_mantencion}</Td>
                  <Td>{m.id_usuario}</Td>
                  <Td>{m.id_faena}</Td>
                  <Td>{m.nombre_mantencion}</Td>
                  {showActions && (
                    <Td>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <ActionBtn
                          href={`/resumen_mantencion/view/${m.id_mantencion}`}
                          color="#3b82f6"
                        >
                          Ver avance
                        </ActionBtn>
                        {(perfil === 1 || perfil === 2) && (
                          <ActionBtn
                            href={`/bitacora_mantencion/registro/${m.id_mantencion}`}
                            color="#22c55e"
                          >
                            Registrar
                          </ActionBtn>
                        )}
                        <ActionBtn
                          href={`/resumen_mantencion/extract_files_mantenciones/${m.id_mantencion}`}
                          color="#64748b"
                        >
                          ↓ Excel
                        </ActionBtn>
                      </div>
                    </Td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer si hay más filas de las que se muestran */}
      {maxRows && rows.length > maxRows && (
        <div style={styles.footer}>
          Mostrando {Math.min(maxRows, rows.length)} de {rows.length} registros
        </div>
      )}
    </div>
  );
}

// ── Sub-componentes ──────────────────────────────────────────────
function Th({ children }) {
  return <th style={styles.th}>{children}</th>;
}

function Td({ children, mono, accent }) {
  return (
    <td style={{
      ...styles.td,
      fontFamily: mono ? 'monospace' : 'inherit',
      color: mono && accent ? accent : '#cbd5e1',
      fontWeight: mono ? 600 : 400,
    }}>
      {children}
    </td>
  );
}

function ActionBtn({ href, color, children }) {
  return (
    <a
      href={href}
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        textDecoration: 'none',
        letterSpacing: '0.04em',
        background: `${color}18`,
        color,
        border: `1px solid ${color}44`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </a>
  );
}

// ── Styles ───────────────────────────────────────────────────────
const styles = {
  card: {
    background: '#0e1420',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.07)',
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 18px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    gap: 12,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 13,
    fontWeight: 700,
    color: '#e2e8f0',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  dot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  badge: {
    fontSize: 11,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 10,
    fontFamily: 'monospace',
  },
  search: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6,
    padding: '5px 10px',
    color: '#e2e8f0',
    fontSize: 12,
    outline: 'none',
    width: 180,
  },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: {
    padding: '9px 16px',
    textAlign: 'left',
    fontSize: 10,
    fontWeight: 700,
    color: '#64748b',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    background: 'rgba(255,255,255,0.02)',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '10px 16px',
    color: '#cbd5e1',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    fontSize: 13,
  },
  empty: {
    padding: 32,
    textAlign: 'center',
    color: '#475569',
    fontSize: 13,
  },
  footer: {
    padding: '8px 18px',
    fontSize: 11,
    color: '#475569',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    textAlign: 'right',
  },
};
