import React from 'react';
import { Film, Feather, Compass, Heart, Sparkles, Check, AlertCircle, X } from '../Common/Icons';
import './PersonaDetailModal.css';

/**
 * Detailed Viewpoint Inspection Modal
 * @param {Object} props
 * @param {Object} props.reaction
 * @param {Function} props.onClose
 */
export default function PersonaDetailModal({
  reaction,
  onClose
}) {
  if (!reaction) return null;

  const getPersonaIcon = (iconName) => {
    switch (iconName) {
      case 'Film': return <Film size={24} />;
      case 'Feather': return <Feather size={24} />;
      case 'Compass': return <Compass size={24} />;
      case 'Heart': return <Heart size={24} />;
      default: return <Sparkles size={24} />;
    }
  };

  const getIssueBadge = (type) => {
    switch (type) {
      case 'observed_issue':
        return <span className="issue-badge badge-observed">Observed Issue</span>;
      case 'possible_interpretation':
        return <span className="issue-badge badge-interpretation">Possible Interpretation</span>;
      case 'suggestion':
        return <span className="issue-badge badge-suggestion">Suggestion</span>;
      default:
        return <span className="issue-badge badge-observed">Note</span>;
    }
  };

  return (
    <div className="persona-detail-backdrop" onClick={onClose}>
      <div className="persona-detail-card glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="detail-modal-header">
          <div className="detail-modal-identity">
            <div className={`detail-modal-avatar avatar-${reaction.colorKey || 'casual'}`}>
              {getPersonaIcon(reaction.icon)}
            </div>
            <div>
              <div className="detail-modal-name-row">
                <h3 className="detail-modal-name">{reaction.personaName}</h3>
                <span className="detail-modal-disclaimer">Simulated Audience Viewpoint</span>
              </div>
              <span className="detail-modal-archetype">In-Depth Reaction & Narrative Diagnostic</span>
            </div>
          </div>

          <div className="detail-modal-header-right">
            <div className="detail-modal-score">
              <span className="detail-score-num">{reaction.overallScore}</span>
              <span className="detail-score-denom">/100</span>
            </div>
            <button type="button" className="detail-modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Candid Viewpoint Commentary */}
        <div className="detail-quote-box">
          <span className="detail-quote-label">First-Person Reaction:</span>
          <p className="detail-quote-text">"{reaction.reaction}"</p>
        </div>

        {/* 6-Dimension Score Matrix */}
        <div className="detail-metrics-matrix">
          <div className="detail-metric-col">
            <span className="metric-label">Tension</span>
            <span className="metric-score">{reaction.tensionScore}%</span>
            <div className="metric-track"><div className="metric-fill" style={{ width: `${reaction.tensionScore}%` }} /></div>
          </div>
          <div className="detail-metric-col">
            <span className="metric-label">Emotional Impact</span>
            <span className="metric-score">{reaction.emotionalImpactScore}%</span>
            <div className="metric-track"><div className="metric-fill" style={{ width: `${reaction.emotionalImpactScore}%` }} /></div>
          </div>
          <div className="detail-metric-col">
            <span className="metric-label">Pacing</span>
            <span className="metric-score">{reaction.pacingScore}%</span>
            <div className="metric-track"><div className="metric-fill" style={{ width: `${reaction.pacingScore}%` }} /></div>
          </div>
          <div className="detail-metric-col">
            <span className="metric-label">Consistency</span>
            <span className="metric-score">{reaction.consistencyScore}%</span>
            <div className="metric-track"><div className="metric-fill" style={{ width: `${reaction.consistencyScore}%` }} /></div>
          </div>
          <div className="detail-metric-col">
            <span className="metric-label">Clarity</span>
            <span className="metric-score">{reaction.clarityScore}%</span>
            <div className="metric-track"><div className="metric-fill" style={{ width: `${reaction.clarityScore}%` }} /></div>
          </div>
          <div className="detail-metric-col">
            <span className="metric-label">Humor</span>
            <span className="metric-score">{reaction.humorScore}%</span>
            <div className="metric-track"><div className="metric-fill" style={{ width: `${reaction.humorScore}%` }} /></div>
          </div>
        </div>

        {/* Strengths & Observations */}
        <div className="detail-sections-grid">
          {/* Strengths */}
          <div className="detail-section-box">
            <span className="detail-section-title text-emerald">✓ Strengths Noticed</span>
            <ul className="detail-list">
              {reaction.strengths && reaction.strengths.map((str, idx) => (
                <li key={idx}>{str}</li>
              ))}
            </ul>
          </div>

          {/* Actionable Suggestions */}
          <div className="detail-section-box">
            <span className="detail-section-title text-indigo">💡 Creative Suggestions</span>
            <ul className="detail-list">
              {reaction.suggestions && reaction.suggestions.map((sug, idx) => (
                <li key={idx}>{sug}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Categorized Issues */}
        {reaction.issues && reaction.issues.length > 0 && (
          <div className="detail-issues-section">
            <span className="detail-section-title text-amber">Observed Issues & Interpretations</span>
            <div className="detail-issues-list">
              {reaction.issues.map((issue, idx) => (
                <div key={idx} className="detail-issue-item">
                  <div className="detail-issue-badge-row">
                    {getIssueBadge(issue.type)}
                  </div>
                  <p className="detail-issue-desc">{issue.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
