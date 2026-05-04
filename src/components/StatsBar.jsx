// src/components/StatsBar.jsx
import React from 'react';

const CARDS = [
  { key: 'en_ejecucion', label: 'En Ejecución', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', icon: '▶' },
  { key: 'atrasados',    label: 'Atrasados',    color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   icon: '⚠' },
  { key: 'desviados',    label: 'Desviados',    color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: '↗' },
  { key: 'planificados', label: 'Planificados', color: '#22c55e', bg: 'rgba(34,197,94,0.08)',  icon: '◷' },
];

export default function StatsBar({ data }) {
  return (
    <div style={styles.bar}>
      {CARDS.map(card => (
        <div key={card.key} style={{ ...styles.card, background: card.bg, borderColor: card.color }}>
          <div style={{ ...styles.icon, color: card.color }}>{card.icon}</div>
          <div>
            <div style={{ ...styles.count, color: card.color }}>
              {data[card.key]?.length ?? 0}
            </div>
            <div style={styles.label}>{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  bar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginBottom: 24,
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '18px 20px',
    borderRadius: 10,
    border: '1px solid',
    transition: 'transform 0.15s',
  },
  icon: { fontSize: 28, lineHeight: 1, flexShrink: 0 },
  count: { fontSize: 32, fontWeight: 700, lineHeight: 1, fontFamily: 'monospace' },
  label: { fontSize: 12, color: '#94a3b8', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' },
};
