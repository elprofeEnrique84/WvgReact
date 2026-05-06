import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DigitalTwinPage = () => {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);

  // Data
  const [data, setData] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [activeRings, setActiveRings] = useState(new Set([0, 1, 2]));
  const [activeFilters, setActiveFilters] = useState(new Set());
  const [lastClicked, setLastClicked] = useState(null);

  // AI
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // Generate data on mount
  useEffect(() => {
    const rndStatus = () => {
      const r = Math.random();
      if (r < 0.70) return 'normal';
      if (r < 0.85) return 'alerta';
      if (r < 0.94) return 'critico';
      return 'inactivo';
    };
    const rndTorque = () => (Math.random() * 300 + 700).toFixed(0);
    const rndTemp = () => (Math.random() * 40 + 35).toFixed(1);
    const rndDate = () => {
      const d = new Date(Date.now() - Math.random() * 30 * 86400000);
      return d.toLocaleDateString('es-CL');
    };

    const ringMeta = [
      { name: 'Interior', color: '#0d9488', hiColor: '#14b8a6', r: 0 },
      { name: 'Medio', color: '#1d4ed8', hiColor: '#60a5fa', r: 1 },
      { name: 'Exterior', color: '#b45309', hiColor: '#fbbf24', r: 2 },
    ];
    const ringSegs = [12, 20, 30];

    const newData = [];
    ringSegs.forEach((count, ring) => {
      for (let i = 0; i < count; i++) {
        newData.push({
          id: `A${ring + 1}-${String(i + 1).padStart(2, '0')}`,
          value: 1,
          ring,
          label: `${ringMeta[ring].name} ${i + 1}`,
          status: rndStatus(),
          torque: rndTorque() + ' Nm',
          temp: rndTemp() + ' °C',
          ultima_revision: rndDate(),
          tornillos: Math.floor(Math.random() * 4) + 6,
        });
      }
    });

    // Override a few for demo
    newData[5].status = 'critico';
    newData[14].status = 'critico';
    newData[2].status = 'alerta';
    newData[9].status = 'alerta';
    newData[25].status = 'inactivo';

    setData(newData);
  }, []);

  // D3 setup
  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const W = 560, H = 560;
    const R = Math.min(W, H) / 2;
    const innerR = R * 0.18;

    const ringCfg = [
      { inner: innerR + R * 0.03, outer: R * 0.38 },
      { inner: R * 0.43, outer: R * 0.63 },
      { inner: R * 0.68, outer: R * 0.96 },
    ];

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous

    const g = svg.append('g').attr('transform', `translate(${W / 2},${H / 2})`);

    // Glow defs
    const defs = g.append('defs');
    const glow = defs.append('filter').attr('id', 'glow');
    glow.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const merge = glow.append('feMerge');
    merge.append('feMergeNode').attr('in', 'coloredBlur');
    merge.append('feMergeNode').attr('in', 'SourceGraphic');

    const pie = d3.pie().value(d => d.value).sort(null).padAngle(0.018);

    const statusColors = {
      normal: '#22c55e',
      alerta: '#f59e0b',
      critico: '#ef4444',
      inactivo: '#4a5568',
    };

    const segFill = (d) => {
      if (selectedIds.has(d.data.id)) return '#f59e0b';
      return statusColors[d.data.status] || statusColors.normal;
    };

    const visibleSegments = () => {
      return data.filter(d =>
        activeRings.has(d.ring) &&
        (activeFilters.size === 0 || activeFilters.has(d.status))
      );
    };

    const byRing = d3.group(visibleSegments(), d => d.ring);

    byRing.forEach((segs, ring) => {
      const cfg = ringCfg[ring];
      const arcGen = d3.arc()
        .innerRadius(cfg.inner)
        .outerRadius(cfg.outer)
        .padAngle(0.018)
        .cornerRadius(4);

      const arcHover = d3.arc()
        .innerRadius(cfg.inner - 3)
        .outerRadius(cfg.outer + 8)
        .padAngle(0.018)
        .cornerRadius(4);

      const pieData = pie(segs);
      const ringG = g.append('g').attr('class', 'ring-group');

      ringG.selectAll('.arc-segment')
        .data(pieData)
        .join('path')
        .attr('class', d => `arc-segment ${selectedIds.has(d.data.id) ? 'arc-selected' : ''}`)
        .attr('d', arcGen)
        .attr('fill', segFill)
        .attr('stroke', '#080c14')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0)
        .on('mouseover', function (event, d) {
          if (!selectedIds.has(d.data.id)) {
            d3.select(this).attr('d', arcHover);
          }
          showTooltip(event, d);
        })
        .on('mousemove', showTooltip)
        .on('mouseout', function (event, d) {
          if (!selectedIds.has(d.data.id)) {
            d3.select(this).attr('d', arcGen);
          }
          if (tooltipRef.current) tooltipRef.current.style.opacity = 0;
        })
        .on('click', function (event, d) {
          handleClick(d.data, d3.select(this), arcGen, arcHover);
        })
        .transition()
        .duration(500)
        .delay((_, i) => ring * 80 + i * 18)
        .ease(d3.easeCubicOut)
        .attr('opacity', 1);
    });

    // Center circle
    g.append('circle')
      .attr('r', innerR)
      .attr('fill', '#111928')
      .attr('stroke', 'rgba(255,255,255,0.16)')
      .attr('stroke-width', 1);

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -8)
      .attr('fill', '#7d8fa9')
      .attr('font-size', '10px')
      .attr('font-family', 'Share Tech Mono, monospace')
      .attr('letter-spacing', '0.06em')
      .text('MOLINO');

    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 10)
      .attr('fill', '#f59e0b')
      .attr('font-size', '18px')
      .attr('font-family', 'Share Tech Mono, monospace')
      .attr('font-weight', '700')
      .text('SAG#1');

  }, [data, selectedIds, activeRings, activeFilters]);

  const showTooltip = (event, d) => {
    const seg = d.data;
    const statusLabel = { normal: 'Normal', alerta: 'Alerta', critico: 'Crítico', inactivo: 'Inactivo' };
    if (tooltipRef.current) {
      tooltipRef.current.innerHTML = `
        <div style="font-family: 'Share Tech Mono', monospace; font-size: 16px; font-weight: 700; margin-bottom: 4px;">${seg.id}</div>
        <div style="display: flex; justify-content: space-between; gap: 12px; padding: 2px 0;">
          <span style="color: #4a5568; font-size: 11px;">Anillo</span>
          <span style="font-family: 'Share Tech Mono', monospace; font-size: 12px;">${['Interior', 'Medio', 'Exterior'][seg.ring]}</span>
        </div>
        <div style="display: flex; justify-content: space-between; gap: 12px; padding: 2px 0;">
          <span style="color: #4a5568; font-size: 11px;">Estado</span>
          <span style="font-family: 'Share Tech Mono', monospace; font-size: 12px; color: ${
            seg.status === 'normal' ? '#22c55e' :
            seg.status === 'alerta' ? '#f59e0b' :
            seg.status === 'critico' ? '#ef4444' : '#4a5568'
          }">${statusLabel[seg.status]}</span>
        </div>
        <div style="display: flex; justify-content: space-between; gap: 12px; padding: 2px 0;">
          <span style="color: #4a5568; font-size: 11px;">Torque</span>
          <span style="font-family: 'Share Tech Mono', monospace; font-size: 12px;">${seg.torque}</span>
        </div>
        <div style="display: flex; justify-content: space-between; gap: 12px; padding: 2px 0;">
          <span style="color: #4a5568; font-size: 11px;">Temp.</span>
          <span style="font-family: 'Share Tech Mono', monospace; font-size: 12px;">${seg.temp}</span>
        </div>
      `;
      tooltipRef.current.style.left = (event.clientX + 16) + 'px';
      tooltipRef.current.style.top = (event.clientY - 10) + 'px';
      tooltipRef.current.style.opacity = '1';
    }
  };

  const handleClick = (seg, el, arcGen, arcHover) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(seg.id)) {
        newSet.delete(seg.id);
        el.classed('arc-selected', false).attr('d', arcGen).attr('fill', segFill({ data: seg }));
      } else {
        newSet.add(seg.id);
        el.classed('arc-selected', true).attr('fill', '#f59e0b').attr('d', arcHover).attr('filter', 'url(#glow)');
      }
      return newSet;
    });
    setLastClicked(seg);
  };

  const segFill = (d) => {
    if (selectedIds.has(d.data.id)) return '#f59e0b';
    return {
      normal: '#22c55e',
      alerta: '#f59e0b',
      critico: '#ef4444',
      inactivo: '#4a5568'
    }[d.data.status] || '#22c55e';
  };

  const toggleRing = (ring) => {
    setActiveRings(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ring)) newSet.delete(ring);
      else newSet.add(ring);
      return newSet;
    });
  };

  const filterStatus = (status) => {
    setActiveFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(status)) newSet.delete(status);
      else newSet.add(status);
      return newSet;
    });
  };

  const clearFilter = () => {
    setActiveFilters(new Set());
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
    setLastClicked(null);
  };

  const exportSelection = () => {
    if (selectedIds.size === 0) {
      alert('No hay segmentos seleccionados.');
      return;
    }
    const rows = ['ID,Anillo,Estado,Torque,Temperatura,Tornillos,Ultima Revisión'];
    selectedIds.forEach(id => {
      const s = data.find(d => d.id === id);
      rows.push(`${s.id},${['Interior', 'Medio', 'Exterior'][s.ring]},${s.status},${s.torque},${s.temp},${s.tornillos},${s.ultima_revision}`);
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seleccion_tapa.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // AI analysis
  const runAiAnalysis = async () => {
    try {
      setAiLoading(true);
      setAiResult(null);

      const visibleSegmentIds = data
        .filter((d) => activeRings.has(d.ring))
        .filter((d) => activeFilters.size === 0 || activeFilters.has(d.status))
        .map((d) => d.id);

      const idsToAnalyze = selectedIds.size > 0 ? [...selectedIds] : visibleSegmentIds;

      const token = localStorage.getItem('auth_token');

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      const resp = await fetch(`${API_BASE_URL}/digital-twin/ai/analisis-monitoreo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ selectedIds: idsToAnalyze }),
      });

      const json = await resp.json();
      setAiResult(json);
    } catch (e) {
      console.error('AI analysis error:', e);
      setAiResult({ success: false, summary: { message: 'Error al ejecutar análisis' } });
    } finally {
      setAiLoading(false);
    }
  };

  const downloadExcelFromAi = () => {
    if (!aiResult?.summary) return;

    const total = aiResult.summary.total ?? '';
    const counts = aiResult.summary.counts ?? {};
    const recommendations = Array.isArray(aiResult.summary.recommendations)
      ? aiResult.summary.recommendations
      : [];

    const header = ['total', 'normal', 'alerta', 'critico', 'inactivo', 'recomendacion_1', 'recomendacion_2'];
    const row = [
      total,
      counts.normal ?? 0,
      counts.alerta ?? 0,
      counts.critico ?? 0,
      counts.inactivo ?? 0,
      recommendations[0] ?? '',
      recommendations[1] ?? '',
    ].map((v) => String(v).replaceAll('"', '""'));

    const csv = `${header.join(',')}\n${row
      .map((v) => (v.includes(',') || v.includes('\n') ? `"${v}"` : v))
      .join(',')}`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analisis_ai_digital_twin.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPdfFromAi = () => {
    if (!aiResult?.summary) return;

    const counts = aiResult.summary.counts ?? {};
    const recommendations = Array.isArray(aiResult.summary.recommendations)
      ? aiResult.summary.recommendations
      : [];

    const html = `
      <html>
        <head>
          <title>AI Analysis - Digital Twin</title>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { margin: 0 0 8px; font-size: 18px; }
            .meta { color: #555; margin-bottom: 18px; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; text-align: left; }
            .rec { margin-top: 10px; }
            .rec li { margin: 6px 0; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Resumen Ejecutivo - Análisis AI</h1>
          <div class="meta">Total segmentos: <b>${aiResult.summary.total ?? 0}</b> · Generado desde Digital Twin</div>

          <table>
            <thead>
              <tr>
                <th>Estado</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Normal</td><td>${counts.normal ?? 0}</td></tr>
              <tr><td>Alerta</td><td>${counts.alerta ?? 0}</td></tr>
              <tr><td>Crítico</td><td>${counts.critico ?? 0}</td></tr>
              <tr><td>Inactivo</td><td>${counts.inactivo ?? 0}</td></tr>
            </tbody>
          </table>

          <div class="rec">
            <b>Recomendaciones</b>
            <ul>
              <li>${recommendations[0] ?? '—'}</li>
              <li>${recommendations[1] ?? '—'}</li>
            </ul>
          </div>
        </body>
      </html>
    `;

    const w = window.open('', '_blank');
    if (!w) return;

    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  const total = data.length;
  const alertas = data.filter(d => d.status === 'alerta').length;
  const crits = data.filter(d => d.status === 'critico').length;
  const normals = data.filter(d => d.status === 'normal').length;

  return (
    <div style={{ fontFamily: 'Rajdhani, sans-serif', background: '#080c14', color: '#e2e8f0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ background: '#0e1420', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(245,158,11,0.15)', border: '1px solid #f59e0b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚙</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', fontWeight: '700', letterSpacing: '0.06em', color: '#e2e8f0', textTransform: 'uppercase' }}>Tapa de Alimentación Modular</span>
            <span style={{ fontSize: '12px', color: '#7d8fa9', letterSpacing: '0.04em', fontFamily: 'Share Tech Mono, monospace' }}>SISTEMA DE TRÁFICO · MOLINO SAG #1 · LÍNEA A · PLANTA NORTE</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Share Tech Mono, monospace', background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' }}>● En línea</span>
          <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Share Tech Mono, monospace', background: '#1a2236', color: '#7d8fa9', border: '1px solid rgba(255,255,255,0.08)' }}>Rev. 2.4.1</span>
          <span style={{ padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Share Tech Mono, monospace', background: '#1a2236', color: '#7d8fa9', border: '1px solid rgba(255,255,255,0.08)' }} id="clock">00:00:00</span>
        </div>
      </header>

      {/* Stats Bar */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#0e1420' }}>
        <div style={{ flex: 1, padding: '10px 20px', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', color: '#4a5568', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Total Segmentos</span>
          <span style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'Share Tech Mono, monospace', color: '#e2e8f0' }} id="stat-total">{total}</span>
        </div>
        <div style={{ flex: 1, padding: '10px 20px', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', color: '#4a5568', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Seleccionados</span>
          <span style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'Share Tech Mono, monospace', color: '#f59e0b' }} id="stat-sel">{selectedIds.size}</span>
        </div>
        <div style={{ flex: 1, padding: '10px 20px', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', color: '#4a5568', letterSpacing: '0.08em', textTransform: 'uppercase' }}>En Alerta</span>
          <span style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'Share Tech Mono, monospace', color: '#f59e0b' }} id="stat-alerta">{alertas}</span>
        </div>
        <div style={{ flex: 1, padding: '10px 20px', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', color: '#4a5568', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Críticos</span>
          <span style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'Share Tech Mono, monospace', color: '#ef4444' }} id="stat-crit">{crits}</span>
        </div>
        <div style={{ flex: 1, padding: '10px 20px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '10px', color: '#4a5568', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Normales</span>
          <span style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'Share Tech Mono, monospace', color: '#22c55e' }} id="stat-normal">{normals}</span>
        </div>
      </div>

      {/* Main Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <aside style={{ width: '200px', minWidth: '200px', background: '#0e1420', borderRight: '1px solid rgba(255,255,255,0.08)', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#4a5568', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Anillos</div>
            {[0, 1, 2].map(r => (
              <button
                key={r}
                className={`ring-btn ${activeRings.has(r) ? 'active' : ''}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#7d8fa9', cursor: 'pointer', width: '100%', fontFamily: 'Rajdhani, sans-serif', fontSize: '13px', fontWeight: '500', transition: 'all 0.2s', marginBottom: '6px'
                }}
                onClick={() => toggleRing(r)}
              >
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0, background: ['#14b8a6', '#60a5fa', '#fbbf24'][r] }}></span>
                {['Interior', 'Medio', 'Exterior'][r]}
                <span style={{ marginLeft: 'auto', fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', color: '#4a5568' }}>{[12, 20, 30][r]}</span>
              </button>
            ))}
          </div>

          <div>
            <div style={{ fontSize: '10px', color: '#4a5568', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Estado</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { status: 'normal', color: '#22c55e', label: 'Normal' },
                { status: 'alerta', color: '#f59e0b', label: 'Alerta' },
                { status: 'critico', color: '#ef4444', label: 'Crítico' },
                { status: 'inactivo', color: '#4a5568', label: 'Inactivo' }
              ].map(item => (
                <div key={item.status} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#7d8fa9' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: item.color }}></span>
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10px', color: '#4a5568', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Filtrar por estado</div>
            {['normal', 'alerta', 'critico', 'inactivo'].map(status => (
              <button
                key={status}
                style={{
                  padding: '7px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#7d8fa9', cursor: 'pointer', width: '100%', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'all 0.2s', marginBottom: '4px'
                }}
                className={activeFilters.has(status) ? 'active-filter' : ''}
                onClick={() => filterStatus(status)}
              >
                {status === 'normal' ? 'Normal' : status === 'alerta' ? 'Alerta' : status === 'critico' ? 'Crítico' : 'Inactivo'}
              </button>
            ))}
            <button
              style={{
                padding: '7px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#7d8fa9', cursor: 'pointer', width: '100%', fontFamily: 'Rajdhani, sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase', transition: 'all 0.2s', marginTop: '6px'
              }}
              onClick={clearFilter}
            >
              ↺ Todos
            </button>
          </div>
        </aside>

        {/* Chart */}
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', position: 'relative', overflow: 'hidden' }}>
          <svg ref={svgRef} width="560" height="560"></svg>
          <div ref={tooltipRef} style={{
            position: 'fixed', pointerEvents: 'none', opacity: 0, background: '#1a2236', border: '1px solid rgba(255,255,255,0.16)', borderRadius: '8px', padding: '10px 14px', fontFamily: 'Rajdhani, sans-serif', fontSize: '13px', color: '#e2e8f0', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', transition: 'opacity 0.15s', minWidth: '160px', zIndex: 1000
          }}></div>
        </main>

        {/* Info Panel */}
        <aside style={{ width: '260px', minWidth: '260px', background: '#0e1420', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4a5568' }}>
            Detalle del Segmento
          </div>

          {/* AI Panel */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '10px', color: '#4a5568', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Análisis AI
            </div>

            <button
              type="button"
              onClick={runAiAnalysis}
              disabled={aiLoading}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: aiLoading ? 'rgba(245,158,11,0.12)' : 'transparent',
                color: aiLoading ? '#f59e0b' : '#f59e0b',
                cursor: aiLoading ? 'not-allowed' : 'pointer',
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 700,
                fontSize: '12px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {aiLoading ? 'Analizando...' : 'Ejecutar Análisis'}
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', opacity: aiLoading ? 0.6 : 1 }} />
            </button>

            <div style={{ marginTop: '10px' }}>
              {aiResult ? (
                <div style={{ background: '#111928', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '10px 12px' }}>
                  <div style={{ fontSize: '10px', color: '#7d8fa9', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Resultado
                  </div>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', color: '#e2e8f0', fontSize: '12px', lineHeight: 1.35 }}>
                    {aiResult?.summary?.message || aiResult?.summary?.resumen || 'OK'}
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                    <div style={{ color: '#7d8fa9' }}>
                      Total: <span style={{ color: '#e2e8f0', fontFamily: 'Share Tech Mono, monospace' }}>{aiResult?.summary?.total ?? '-'}</span>
                    </div>
                    <div style={{ color: '#7d8fa9' }}>
                      Montada: <span style={{ color: '#22c55e', fontFamily: 'Share Tech Mono, monospace' }}>{aiResult?.summary?.montada ?? '-'}</span>
                    </div>
                    <div style={{ color: '#7d8fa9' }}>
                      Botada: <span style={{ color: '#ef4444', fontFamily: 'Share Tech Mono, monospace' }}>{aiResult?.summary?.botada ?? '-'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '11px', color: '#7d8fa9', lineHeight: 1.35 }}>
                  Selecciona segmentos (opcional) y ejecuta el análisis.
                </div>
              )}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }} id="panel-body">
            {lastClicked ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', animation: 'fadeSlide 0.2s ease' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '22px', fontWeight: '700', color: '#e2e8f0', letterSpacing: '0.02em' }}>{lastClicked.id}</div>
                  <div style={{
                    padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Share Tech Mono, monospace', marginTop: '4px',
                    background: lastClicked.status === 'normal' ? 'rgba(34,197,94,0.15)' : lastClicked.status === 'alerta' ? 'rgba(245,158,11,0.15)' : lastClicked.status === 'critico' ? 'rgba(239,68,68,0.15)' : 'rgba(74,85,104,0.15)',
                    color: lastClicked.status === 'normal' ? '#22c55e' : lastClicked.status === 'alerta' ? '#f59e0b' : lastClicked.status === 'critico' ? '#ef4444' : '#4a5568',
                    border: `1px solid ${lastClicked.status === 'normal' ? 'rgba(34,197,94,0.3)' : lastClicked.status === 'alerta' ? 'rgba(245,158,11,0.3)' : lastClicked.status === 'critico' ? 'rgba(239,68,68,0.3)' : 'rgba(74,85,104,0.3)'}`
                  }}>
                    {lastClicked.status === 'normal' ? 'Normal' : lastClicked.status === 'alerta' ? 'Alerta' : lastClicked.status === 'critico' ? 'Crítico' : 'Inactivo'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: ['#14b8a6', '#60a5fa', '#fbbf24'][lastClicked.ring], display: 'inline-block', flexShrink: 0 }}></span>
                  <span style={{ fontSize: '13px', color: '#7d8fa9' }}>Anillo {['Interior', 'Medio', 'Exterior'][lastClicked.ring]}</span>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Etiqueta</span>
                    <span style={{ fontSize: '13px', color: '#e2e8f0', fontFamily: 'Share Tech Mono, monospace', textAlign: 'right' }}>{lastClicked.label}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Torque reg.</span>
                    <span style={{ fontSize: '13px', color: '#e2e8f0', fontFamily: 'Share Tech Mono, monospace', textAlign: 'right' }}>{lastClicked.torque}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Temperatura</span>
                    <span style={{ fontSize: '13px', color: '#e2e8f0', fontFamily: 'Share Tech Mono, monospace', textAlign: 'right' }}>{lastClicked.temp}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tornillos</span>
                    <span style={{ fontSize: '13px', color: '#e2e8f0', fontFamily: 'Share Tech Mono, monospace', textAlign: 'right' }}>{lastClicked.tornillos} uds.</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.08)', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Última rev.</span>
                    <span style={{ fontSize: '13px', color: '#e2e8f0', fontFamily: 'Share Tech Mono, monospace', textAlign: 'right' }}>{lastClicked.ultima_revision}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', gap: '8px' }}>
                    <span style={{ fontSize: '11px', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Seleccionado</span>
                    <span style={{ fontSize: '13px', color: selectedIds.has(lastClicked.id) ? '#f59e0b' : '#4a5568', fontFamily: 'Share Tech Mono, monospace', textAlign: 'right' }}>
                      {selectedIds.has(lastClicked.id) ? '✓ Sí' : '—'}
                    </span>
                  </div>
                </div>

                {selectedIds.size > 1 && (
                  <div>
                    <div style={{ fontSize: '10px', color: '#4a5568', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Todos los seleccionados ({selectedIds.size})</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {[...selectedIds].map(id => {
                        const s = data.find(d => d.id === id);
                        return (
                          <div key={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', borderRadius: '4px', background: '#1a2236', border: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', fontFamily: 'Share Tech Mono, monospace' }}>
                            <span style={{ color: '#f59e0b' }}>{id}</span>
                            <span style={{ fontSize: '9px', letterSpacing: '0.06em', color: {
                              normal: '#22c55e',
                              alerta: '#f59e0b',
                              critico: '#ef4444',
                              inactivo: '#4a5568'
                            }[s.status] }}>{s.status.toUpperCase()}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.4 }}>
                <div style={{ fontSize: '36px' }}>◎</div>
                <div style={{ fontSize: '12px', color: '#7d8fa9', textAlign: 'center', lineHeight: '1.4' }}>Haga clic en un segmento<br />para ver sus detalles</div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Bottom Bar */}
      <div style={{ background: '#0e1420', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
        <div style={{ color: '#7d8fa9', display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
          <span>Selección:</span>
          <span style={{ color: '#f59e0b', fontFamily: 'Share Tech Mono, monospace', fontSize: '11px' }} id="sel-ids">
            {selectedIds.size === 0 ? '—' : [...selectedIds].slice(0, 6).join(' · ') + (selectedIds.size > 6 ? ` +${selectedIds.size - 6} más` : '')}
          </span>
        </div>
        <button style={{ padding: '6px 14px', borderRadius: '5px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', transition: 'all 0.2s' }} onClick={clearSelection}>✕ Limpiar</button>
        <button style={{ padding: '6px 14px', borderRadius: '5px', fontSize: '11px', fontWeight: '600', letterSpacing: '0.06em', textTransform: 'uppercase', border: '1px solid rgba(245,158,11,0.3)', background: 'transparent', color: '#f59e0b', cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', transition: 'all 0.2s' }} onClick={exportSelection}>↓ Exportar</button>
      </div>
    </div>
  );
};

export default DigitalTwinPage;