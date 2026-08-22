import React from 'react';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle2, Users, Layers } from '../Common/Icons';
import Badge from '../Common/Badge';
import './ConsensusBanner.css';

/**
 * Top-level Audience Consensus & Pattern Insight Banner
 * @param {Object} props
 * @param {Object} props.consensusData
 */
export default function ConsensusBanner({ consensusData }) {
  if (!consensusData || !consensusData.hasData) return null;

  return (
    <div className="consensus-banner glass-panel">
      <div className="consensus-banner-header">
        <div className="consensus-title-group">
          <div className="consensus-badge-row">
            <Badge variant="amber" size="sm" icon={<Sparkles size={12} />}>
              Audience Consensus Analysis
            </Badge>
            <span className="consensus-disclaimer-pill">Simulated Audience</span>
          </div>

          <h2 className="consensus-main-headline">
            {consensusData.consensusSummary}
          </h2>
        </div>

        <div className="consensus-score-box">
          <span className="consensus-score-label">Simulated Consensus</span>
          <div className="consensus-score-digits">
            <span className="consensus-big-score">{consensusData.overallAverage}</span>
            <span className="consensus-denom">/100</span>
          </div>
        </div>
      </div>

      <div className="consensus-insights-grid">
        {/* Top Pattern Agreement */}
        {consensusData.patterns && consensusData.patterns.length > 0 && (
          <div className="consensus-insight-card">
            <div className="insight-card-label text-amber">
              <Users size={14} />
              <span>Cross-Persona Pattern</span>
            </div>
            <p className="insight-card-text">
              {consensusData.patterns[0].statement}
            </p>
            <span className="insight-personas-involved">
              Flagged by: {consensusData.patterns[0].personas.join(', ')}
            </span>
          </div>
        )}

        {/* Viewpoint Divergence */}
        {consensusData.divergenceSummary && (
          <div className="consensus-insight-card">
            <div className="insight-card-label text-indigo">
              <TrendingUp size={14} />
              <span>Viewpoint Divergence</span>
            </div>
            <p className="insight-card-text">
              {consensusData.divergenceSummary}
            </p>
            <span className="insight-personas-involved">
              High: {consensusData.highestPersona?.name} ({consensusData.highestPersona?.score}) • Low: {consensusData.lowestPersona?.name} ({consensusData.lowestPersona?.score})
            </span>
          </div>
        )}

        {/* Universal Strengths */}
        {consensusData.sampleStrengths && consensusData.sampleStrengths.length > 0 && (
          <div className="consensus-insight-card">
            <div className="insight-card-label text-emerald">
              <CheckCircle2 size={14} />
              <span>Universal Story Strength</span>
            </div>
            <p className="insight-card-text">
              "{consensusData.sampleStrengths[0].text}"
            </p>
            <span className="insight-personas-involved">
              Noticed by: {consensusData.sampleStrengths[0].persona}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
