import React, { useRef, useEffect, useState, useCallback } from 'react';
import './EngagementChart.css';

const DEFAULT_DATA = [
  { label: 'Intro', values: [38, 30] },
  { label: 'Setup', values: [62, 45] },
  { label: 'Midpoint', values: [62, 55] },
  { label: 'Climax', values: [20, 42] },
  { label: 'Falling Action', values: [52, 62] },
  { label: 'Resolution', values: [62, 70] },
  { label: 'End', values: [92, 80] },
];

const LINE_COLORS = [
  { stroke: '#ef4444', fill: 'rgba(239, 68, 68, 0.08)', name: 'Target Audience' },
  { stroke: '#ffffff', fill: 'rgba(255, 255, 255, 0.06)', name: 'Broad Audience' },
];

export default function EngagementChart({ data = DEFAULT_DATA, title = 'Audience Engagement Sentiment' }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Responsive sizing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      setDimensions({ width, height: Math.min(260, width * 0.42) });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Draw chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = dimensions.width;
    const h = dimensions.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const padding = { top: 30, right: 20, bottom: 36, left: 40 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH * i) / 4;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();
    }

    // Y-axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const val = 100 - i * 25;
      const y = padding.top + (chartH * i) / 4;
      ctx.fillText(val.toString(), padding.left - 8, y + 3);
    }

    // X-axis labels
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '10px Inter, sans-serif';
    data.forEach((point, i) => {
      const x = padding.left + (chartW * i) / (data.length - 1);
      ctx.fillText(point.label, x, h - 8);
    });

    // Helper: get point coordinates
    const getPoint = (index, valueIndex) => {
      const x = padding.left + (chartW * index) / (data.length - 1);
      const y = padding.top + chartH - (data[index].values[valueIndex] / 100) * chartH;
      return { x, y };
    };

    // Helper: draw smooth curve through points
    const drawSmoothLine = (valueIndex, color) => {
      const points = data.map((_, i) => getPoint(i, valueIndex));

      // Fill area
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpx = (prev.x + curr.x) / 2;
        ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
      }
      ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
      ctx.lineTo(points[0].x, padding.top + chartH);
      ctx.closePath();
      ctx.fillStyle = color.fill;
      ctx.fill();

      // Stroke line
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpx = (prev.x + curr.x) / 2;
        ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
      }
      ctx.strokeStyle = color.stroke;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Data points
      points.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#0a0a0a'; // Dark background
        ctx.fill();
        ctx.strokeStyle = color.stroke;
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    };

    // Draw lines (back to front)
    LINE_COLORS.forEach((color, i) => {
      if (data[0]?.values[i] !== undefined) {
        drawSmoothLine(i, color);
      }
    });

  }, [data, dimensions]);

  // Mouse hover for tooltip
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padding = { left: 40, right: 20 };
    const chartW = dimensions.width - padding.left - padding.right;

    if (x < padding.left || x > dimensions.width - padding.right) {
      setTooltip(null);
      return;
    }

    const ratio = (x - padding.left) / chartW;
    const idx = Math.round(ratio * (data.length - 1));
    const clamped = Math.max(0, Math.min(data.length - 1, idx));
    const point = data[clamped];

    const pointX = padding.left + (chartW * clamped) / (data.length - 1);

    setTooltip({
      x: pointX,
      y: e.clientY - rect.top - 10,
      label: point.label,
      values: point.values,
    });
  }, [data, dimensions]);

  return (
    <div className="engagement-chart glass-panel" ref={containerRef}>
      <div className="engagement-chart__header">
        <h3 className="engagement-chart__title">{title}</h3>
        <div className="engagement-chart__legend">
          {LINE_COLORS.map((color, i) => (
            <div key={i} className="engagement-chart__legend-item">
              <span className="engagement-chart__legend-dot" style={{ backgroundColor: color.stroke }}></span>
              {color.name}
            </div>
          ))}
        </div>
      </div>
      <div className="engagement-chart__canvas-wrap">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setTooltip(null)}
          className="engagement-chart__canvas"
        />
        {tooltip && (
          <div
            className="engagement-chart__tooltip glass-panel"
            style={{ left: tooltip.x, top: Math.max(10, tooltip.y - 40) }}
          >
            <div className="tooltip-label">{tooltip.label}</div>
            {LINE_COLORS.map((color, i) => (
              <div key={i} className="tooltip-value" style={{ color: color.stroke }}>
                {color.name}: {tooltip.values[i]}%
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
