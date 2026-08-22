import React from 'react';
import { Flame, Zap, Gauge, Sparkles, ShieldCheck, Eye, TrendingUp } from '../Common/Icons';
import './MetricCard.css';

/**
 * Reusable MetricCard for Insights & Analytics
 * @param {Object} props
 * @param {string} props.title - Tension, Emotional Impact, Pacing, Humor, Consistency, Clarity
 * @param {string} props.metricKey
 * @param {number} props.score - e.g. 88
 * @param {string} props.label - e.g. "High Stakes"
 * @param {string} props.description
 * @param {string} props.color
 * @param {string} props.gradient
 */
export default function MetricCard({
  title,
  metricKey,
  score = 0,
  label = '',
  description = '',
  color = 'var(--accent-amber)',
  gradient
}) {
  const getMetricIcon = (key) => {
    switch (key) {
      case 'tension': return <Flame size={20} />;
      case 'impact': return <Zap size={20} />;
      case 'pacing': return <Gauge size={20} />;
      case 'humor': return <Sparkles size={20} />;
      case 'consistency': return <ShieldCheck size={20} />;
      case 'clarity': return <Eye size={20} />;
      default: return <TrendingUp size={20} />;
    }
  };

  return (
    <div className="metric-card glass-panel" style={{ '--metric-color': color }}>
      <div className="metric-card-header">
        <div className="metric-card-title-group">
          <div className="metric-icon-box" style={{ background: gradient || 'rgba(255,255,255,0.05)', color: color }}>
            {getMetricIcon(metricKey)}
          </div>
          <div>
            <h4 className="metric-title">{title}</h4>
            {label && <span className="metric-label">{label}</span>}
          </div>
        </div>

        <div className="metric-score-badge">
          <span className="metric-score-value">{score}</span>
          <span className="metric-score-unit">/100</span>
        </div>
      </div>

      <div className="metric-progress-wrapper">
        <div className="metric-progress-bar">
          <div
            className="metric-progress-fill"
            style={{
              width: `${Math.min(100, Math.max(0, score))}%`,
              backgroundColor: color,
              boxShadow: `0 0 12px ${color}66`
            }}
          />
        </div>
      </div>

      <div className="metric-card-body">
        <p className="metric-description">{description}</p>
      </div>

      <div className="metric-card-footer">
        <span className="metric-status-indicator">
          <span className="metric-dot" style={{ backgroundColor: color }} />
          Simulated Persona Consensus
        </span>
      </div>
    </div>
  );
}
