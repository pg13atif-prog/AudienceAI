import React from 'react';
import './PredictionGauge.css';

export default function PredictionGauge({ value = 85, size = 110 }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const center = size / 2;

  return (
    <div className="aai-prediction-card glass-panel">
      <div className="aai-prediction-header">
        Overall Prediction:
      </div>
      
      <div className="aai-prediction-gauge" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth={strokeWidth}
          />
          <defs>
            <linearGradient id="pgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00e0ff" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
          </defs>
          <circle
            cx={center} cy={center} r={radius}
            fill="none" stroke="url(#pgGrad)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${center} ${center})`}
            style={{ filter: 'drop-shadow(0 0 8px rgba(0, 224, 255, 0.4))' }}
          />
        </svg>
        <div className="aai-prediction-value">
          <span className="aai-prediction-number">{value}%</span>
          <span className="aai-prediction-label">Success<br/>Probability</span>
        </div>
      </div>
    </div>
  );
}
