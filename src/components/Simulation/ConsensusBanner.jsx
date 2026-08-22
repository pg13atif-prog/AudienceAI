import React from 'react';
import { Sparkles, TrendingUp, CheckCircle2, Users } from '../Common/Icons';
import Badge from '../Common/Badge';
import './ConsensusBanner.css';

/**
 * Decluttered, sleek Audience Consensus Banner
 * @param {Object} props
 * @param {Object} props.consensusData
 */
export default function ConsensusBanner({ consensusData }) {
  if (!consensusData || !consensusData.hasData) return null;

  const topPattern = consensusData.patterns && consensusData.patterns[0];
  const primaryStrength = consensusData.sampleStrengths && consensusData.sampleStrengths[0];

  return (
    <div className="consensus-banner glass-panel">
      {/* Top Banner Row */}
      <div className="consensus-banner-header">
        <div className="consensus-title-group">
          <div className="consensus-badge-row">
            <Badge variant="amber" size="sm" icon={<Sparkles size={12} />}>
              Audience Consensus
            </Badge>
          </div>

          <h2 className="consensus-main-headline">
            {consensusData.consensusSummary || 'Audience viewpoints synthesized across narrative tension, pacing, and logic.'}
          </h2>
        </div>

        {consensusData.overallAverage !== undefined && (
          <div className="consensus-score-box">
            <span className="consensus-score-label">Consensus</span>
            <div className="consensus-score-digits">
              <span className="consensus-big-score">{consensusData.overallAverage}</span>
              <span className="consensus-denom">/100</span>
            </div>
          </div>
        )}
      </div>

      {/* 3 Symmetrical Metric Highlights */}
      <div className="consensus-insights-grid">
        {/* 1. Cross-Persona Pattern */}
        {topPattern && (
          <div className="consensus-insight-card card-pattern">
            <div className="insight-card-label text-amber">
              <Users size={13} />
              <span>Cross-Persona Pattern</span>
            </div>
            <div className="insight-card-body">
              <span className="insight-primary-highlight">
                {topPattern.category || 'Character Motivation & Subtext'}
              </span>
              <span className="insight-meta-sub">
                Flagged by: {topPattern.personas.join(', ')}
              </span>
            </div>
          </div>
        )}

        {/* 2. Viewpoint Divergence */}
        {consensusData.divergenceSummary && (
          <div className="consensus-insight-card card-divergence">
            <div className="insight-card-label text-indigo">
              <TrendingUp size={13} />
              <span>Viewpoint Divergence</span>
            </div>
            <div className="insight-card-body">
              {consensusData.highestPersona && consensusData.lowestPersona ? (
                <div className="divergence-range-row">
                  <span className="divergence-pill pill-high">
                    High: {consensusData.highestPersona.name} ({consensusData.highestPersona.score})
                  </span>
                  <span className="divergence-pill pill-low">
                    Low: {consensusData.lowestPersona.name} ({consensusData.lowestPersona.score})
                  </span>
                </div>
              ) : (
                <span className="insight-primary-highlight">{consensusData.divergenceSummary}</span>
              )}
            </div>
          </div>
        )}

        {/* 3. Story Strength */}
        {primaryStrength && (
          <div className="consensus-insight-card card-strength">
            <div className="insight-card-label text-emerald">
              <CheckCircle2 size={13} />
              <span>Story Strength</span>
            </div>
            <div className="insight-card-body">
              <p className="insight-card-quote">
                "{primaryStrength.text}"
              </p>
              <span className="insight-meta-sub">
                Noticed by: {primaryStrength.persona}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
