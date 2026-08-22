import React from 'react';
import './StatWidget.css';

export default function StatWidget({ icon, title, value, color = 'cyan' }) {
  return (
    <div className={`aai-stat-card glass-panel aai-stat-card--${color}`}>
      <div className={`aai-stat-icon aai-stat-icon--${color}`}>
        {icon}
      </div>
      <div className="aai-stat-body">
        <span className="aai-stat-title">{title}</span>
        <span className={`aai-stat-value aai-stat-value--${color}`}>{value}</span>
      </div>
    </div>
  );
}
