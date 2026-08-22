import React from 'react';
import { Film, Feather, Compass, Heart, Sparkles, ChevronRight, Sliders } from '../Common/Icons';
import './PersonaBreakdown.css';

/**
 * Persona Score Breakdown List
 * Displays comparative ratings across personas and triggers detailed inspection
 * @param {Object} props
 * @param {Array<Object>} props.personaRankings
 * @param {string} [props.selectedPersonaId]
 * @param {Function} [props.onSelectPersona]
 */
export default function PersonaBreakdown({
  personaRankings = [],
  selectedPersonaId,
  onSelectPersona
}) {
  const getPersonaIcon = (iconName) => {
    switch (iconName) {
      case 'Film': return <Film size={15} />;
      case 'Feather': return <Feather size={15} />;
      case 'Compass': return <Compass size={15} />;
      case 'Heart': return <Heart size={15} />;
      default: return <Sparkles size={15} />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--persona-lore)';
    if (score >= 65) return 'var(--accent-amber)';
    return '#f87171';
  };

  return (
    <div className="persona-breakdown-card glass-panel">
      <div className="breakdown-header">
        <div>
          <h3 className="breakdown-title">Persona Viewpoint Breakdown</h3>
          <span className="breakdown-subtitle">Comparative audience reception</span>
        </div>
        <span className="breakdown-disclaimer">Simulated Audience</span>
      </div>

      <div className="breakdown-list">
        {personaRankings.map((p) => {
          const isSelected = selectedPersonaId === p.id;
          const scoreColor = getScoreColor(p.score);

          return (
            <div
              key={p.id}
              className={`breakdown-item ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectPersona?.(p.id)}
              role="button"
              tabIndex={0}
              title={`Click to inspect ${p.name}'s full deep-dive diagnostic`}
            >
              <div className="breakdown-item-left">
                <div className={`breakdown-avatar-box avatar-${p.colorKey || 'casual'}`}>
                  {getPersonaIcon(p.icon)}
                </div>
                <div className="breakdown-info">
                  <span className="breakdown-name">{p.name}</span>
                  {p.keyIssue && (
                    <span className="breakdown-preview">{p.keyIssue}</span>
                  )}
                </div>
              </div>

              <div className="breakdown-item-right">
                <div className="breakdown-gauge-wrapper">
                  <div className="breakdown-track">
                    <div 
                      className="breakdown-fill"
                      style={{ width: `${p.score}%`, background: scoreColor }}
                    />
                  </div>
                </div>
                <span className="breakdown-score" style={{ color: scoreColor }}>
                  {p.score}
                </span>
                <ChevronRight size={14} className="breakdown-arrow" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
