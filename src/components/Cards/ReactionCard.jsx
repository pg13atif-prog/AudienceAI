import React from 'react';
import { Film, Feather, Compass, Heart, Sparkles, AlertCircle, CheckCircle2, Sliders, TrendingUp } from '../Common/Icons';
import Badge from '../Common/Badge';
import './ReactionCard.css';

/**
 * ReactionCard to display structured AI-generated audience viewpoint feedback
 * @param {Object} props
 * @param {Object} props.reaction
 */
export default function ReactionCard({ reaction }) {
  const getPersonaIcon = (iconName) => {
    switch (iconName) {
      case 'Film': return <Film size={20} />;
      case 'Feather': return <Feather size={20} />;
      case 'Compass': return <Compass size={20} />;
      case 'Heart': return <Heart size={20} />;
      default: return <Sparkles size={20} />;
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
    <div className={`reaction-card reaction-${reaction.colorKey || 'casual'} glass-panel`}>
      {/* Header with Persona Avatar and Overall Score */}
      <div className="reaction-card-header">
        <div className="reaction-persona-info">
          <div className="reaction-avatar-box">
            {getPersonaIcon(reaction.icon)}
          </div>
          <div>
            <h3 className="reaction-persona-name">{reaction.personaName}</h3>
            <span className="reaction-persona-viewpoint">Audience Viewpoint</span>
          </div>
        </div>

        <div className="reaction-score-badge">
          <span className="reaction-score-num">{reaction.overallScore}</span>
          <span className="reaction-score-denom">/100</span>
        </div>
      </div>

      {/* Persona Candid Reaction */}
      <div className="reaction-quote-box">
        <p className="reaction-quote-text">"{reaction.reaction}"</p>
      </div>

      {/* 6-Dimension Mini Metric Grid */}
      <div className="reaction-metrics-mini-grid">
        <div className="mini-metric">
          <span className="mini-metric-label">Tension</span>
          <span className="mini-metric-val">{reaction.tensionScore}%</span>
        </div>
        <div className="mini-metric">
          <span className="mini-metric-label">Impact</span>
          <span className="mini-metric-val">{reaction.emotionalImpactScore}%</span>
        </div>
        <div className="mini-metric">
          <span className="mini-metric-label">Pacing</span>
          <span className="mini-metric-val">{reaction.pacingScore}%</span>
        </div>
        <div className="mini-metric">
          <span className="mini-metric-label">Consistency</span>
          <span className="mini-metric-val">{reaction.consistencyScore}%</span>
        </div>
        <div className="mini-metric">
          <span className="mini-metric-label">Clarity</span>
          <span className="mini-metric-val">{reaction.clarityScore}%</span>
        </div>
        <div className="mini-metric">
          <span className="mini-metric-label">Humor</span>
          <span className="mini-metric-val">{reaction.humorScore}%</span>
        </div>
      </div>

      {/* Strengths */}
      {reaction.strengths && reaction.strengths.length > 0 && (
        <div className="reaction-feedback-section">
          <span className="feedback-section-title text-emerald">✓ Strengths Noticed:</span>
          <ul className="feedback-list">
            {reaction.strengths.map((str, idx) => (
              <li key={idx} className="feedback-item">{str}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Categorized Issues */}
      {reaction.issues && reaction.issues.length > 0 && (
        <div className="reaction-feedback-section">
          <span className="feedback-section-title text-amber">Critique & Observations:</span>
          <div className="issues-list">
            {reaction.issues.map((issue, idx) => (
              <div key={idx} className="issue-item">
                <div className="issue-badge-row">
                  {getIssueBadge(issue.type)}
                </div>
                <p className="issue-desc">{issue.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {reaction.suggestions && reaction.suggestions.length > 0 && (
        <div className="reaction-feedback-section">
          <span className="feedback-section-title text-indigo">💡 Persona Suggestions:</span>
          <ul className="feedback-list">
            {reaction.suggestions.map((sug, idx) => (
              <li key={idx} className="feedback-item">{sug}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
