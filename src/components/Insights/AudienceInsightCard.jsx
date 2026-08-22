import React, { useState } from 'react';
import { 
  AlertCircle, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Info,
  ArrowRight
} from '../Common/Icons';
import Badge from '../Common/Badge';
import Button from '../Common/Button';
import './AudienceInsightCard.css';

/**
 * Clean headline helper to prevent raw quotes from rendering in titles
 */
function formatPrimaryHeadline(category, summary, craftSummary) {
  if (craftSummary && !craftSummary.includes(':"') && !craftSummary.includes(': "')) {
    return craftSummary;
  }
  if (!summary) return `${category || 'Narrative'} Refinement Recommended`;
  
  if (summary.includes(':"') || summary.includes(': "')) {
    return summary.split(/:\s*"/)[0];
  }
  return summary;
}

/**
 * Decluttered, elegant AudienceInsightCard
 * @param {Object} props
 * @param {Object} props.diagnosis
 * @param {Function} [props.onImproveScene]
 * @param {Function} [props.onKeepScene]
 * @param {Function} [props.onReSimulate]
 */
export default function AudienceInsightCard({
  diagnosis,
  onImproveScene,
  onKeepScene,
  onReSimulate
}) {
  const [sceneKept, setSceneKept] = useState(false);

  if (!diagnosis || !diagnosis.hasData) return null;

  const handleKeepScene = () => {
    setSceneKept(true);
    if (onKeepScene) onKeepScene();
  };

  const headline = formatPrimaryHeadline(
    diagnosis.primaryCategory, 
    diagnosis.primaryIssueSummary, 
    diagnosis.craftSummary
  );

  return (
    <div className="audience-insight-card glass-panel">
      {/* Top Header Row */}
      <div className="insight-card-top">
        <div className="insight-header-badges">
          <Badge variant="rose" size="sm" icon={<AlertCircle size={12} />}>
            Primary Craft Issue
          </Badge>
          <span className="insight-category-pill">{diagnosis.primaryCategory}</span>
        </div>

        {sceneKept && (
          <span className="scene-approved-badge">
            <ShieldCheck size={12} /> Approved
          </span>
        )}
      </div>

      {/* Primary Issue Content */}
      <div className="insight-primary-issue-block">
        <h3 className="primary-issue-heading">
          {headline}
        </h3>

        {diagnosis.whyItMatters && (
          <p className="why-it-matters-text">
            {diagnosis.whyItMatters}
          </p>
        )}
      </div>

      {/* AI Recommendation Box */}
      {diagnosis.suggestedImprovement && (
        <div className="insight-recommendation-box">
          <div className="recommendation-header">
            <Sparkles size={12} className="text-amber" />
            <span>Recommended Action</span>
          </div>
          <p className="recommendation-text">
            {diagnosis.suggestedImprovement}
          </p>
        </div>
      )}

      {/* Flagged Viewpoints (Clean Compact Strip) */}
      {diagnosis.noticingPersonas && diagnosis.noticingPersonas.length > 0 && (
        <div className="noticing-personas-strip">
          <span className="noticing-strip-label">Flagged by:</span>
          <div className="noticing-pills-row">
            {diagnosis.noticingPersonas.map((p, idx) => (
              <span key={p.personaId || idx} className={`noticing-persona-badge badge-${p.colorKey || 'casual'}`}>
                <span className="dot" /> {p.personaName}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="insight-card-actions">
        <Button
          variant="secondary"
          size="sm"
          icon={<ShieldCheck size={13} />}
          onClick={handleKeepScene}
          disabled={sceneKept}
        >
          {sceneKept ? 'Scene Accepted' : 'Keep Scene'}
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={<Sparkles size={13} />}
          onClick={onImproveScene}
          className="remix-cta-btn"
        >
          AI Scene Remix
        </Button>
      </div>
    </div>
  );
}
