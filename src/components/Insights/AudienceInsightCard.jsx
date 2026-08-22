import React, { useState } from 'react';
import { 
  AlertCircle, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  RotateCcw, 
  FileEdit, 
  ShieldCheck, 
  Layers, 
  Info,
  ArrowRight,
  TrendingUp
} from '../Common/Icons';
import Badge from '../Common/Badge';
import Button from '../Common/Button';
import './AudienceInsightCard.css';

/**
 * AudienceInsightCard
 * Prominent diagnostic card displaying primary problem, why it matters,
 * noticing personas, actionable suggestions, strengths, and creator action triggers.
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

  const getSeverityBadgeVariant = (severity) => {
    switch (severity) {
      case 'Critical': return 'rose';
      case 'Moderate': return 'amber';
      default: return 'indigo';
    }
  };

  return (
    <div className="audience-insight-card glass-panel">
      {/* Top Header Row */}
      <div className="insight-card-top">
        <div className="insight-header-badges">
          <Badge variant="amber" size="sm" icon={<AlertCircle size={13} />}>
            Audience Insight & Problem Detection
          </Badge>
          <Badge variant={getSeverityBadgeVariant(diagnosis.severity)} size="sm">
            {diagnosis.severity} Priority
          </Badge>
          <span className="insight-disclaimer">Simulated Audience</span>
        </div>

        {sceneKept && (
          <div className="scene-approved-pill">
            <Check size={13} />
            <span>Scene Approved by Creator</span>
          </div>
        )}
      </div>

      {/* Primary Issue Section */}
      <div className="insight-primary-issue-block">
        <div className="primary-issue-title-row">
          <div className="issue-warning-icon-box">
            <AlertCircle size={20} className="text-amber" />
          </div>
          <div className="primary-issue-text-wrap">
            <span className="primary-issue-category-label">Primary Issue Detected:</span>
            <h2 className="primary-issue-heading">
              {diagnosis.primaryCategory} — {diagnosis.craftSummary || diagnosis.primaryIssueSummary}
            </h2>
          </div>
        </div>

        {/* Why It Matters Callout */}
        <div className="why-it-matters-box">
          <div className="why-it-matters-label">
            <Info size={13} className="text-indigo" />
            <span>Why it matters for audience engagement:</span>
          </div>
          <p className="why-it-matters-text">
            {diagnosis.whyItMatters}
          </p>
        </div>
      </div>

      {/* Noticing Personas Supporting Evidence (Compact Horizontal/2-Col Layout) */}
      {diagnosis.noticingPersonas && diagnosis.noticingPersonas.length > 0 && (
        <div className="noticing-personas-block">
          <span className="section-label">
            Which Audience Viewpoints Flagged This ({diagnosis.noticingCount} of {diagnosis.totalPersonas}):
          </span>
          <div className="noticing-personas-grid">
            {diagnosis.noticingPersonas.map((p, idx) => (
              <div key={p.personaId || idx} className={`noticing-persona-chip chip-${p.colorKey || 'casual'}`}>
                <div className="noticing-persona-head">
                  <span className="persona-chip-dot" />
                  <span className="noticing-persona-name">{p.personaName}</span>
                </div>
                <p className="noticing-persona-quote">"{p.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Actionable Improvement */}
      <div className="suggested-improvement-block">
        <div className="improvement-header">
          <Sparkles size={15} className="text-amber" />
          <span className="improvement-title">Suggested Improvement:</span>
          <span className="improvement-scope-tag">Targeted Revision</span>
        </div>
        <p className="improvement-text">
          {diagnosis.suggestedImprovement}
        </p>
      </div>

      {/* Validated Story Strengths */}
      {diagnosis.topStrengths && diagnosis.topStrengths.length > 0 && (
        <div className="insight-strengths-block">
          <span className="section-label text-emerald">
            ✓ What Worked in This Scene:
          </span>
          <div className="strengths-tags-row">
            {diagnosis.topStrengths.map((str, idx) => (
              <div key={idx} className="strength-pill">
                <CheckCircle2 size={12} className="text-emerald" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Creator Action Buttons Toolbar */}
      <div className="insight-actions-footer">
        <div className="footer-guidance">
          <span>Action this audience feedback:</span>
        </div>

        <div className="creator-action-buttons">
          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw size={13} />}
            onClick={onReSimulate}
            title="Re-run simulation across audience viewpoints"
          >
            Re-Simulate
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<ShieldCheck size={14} />}
            onClick={handleKeepScene}
            disabled={sceneKept}
          >
            {sceneKept ? 'Scene Accepted' : 'Keep Scene'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Sparkles size={14} />}
            onClick={onImproveScene}
            className="improve-scene-cta"
          >
            AI Scene Remix
          </Button>
        </div>
      </div>
    </div>
  );
}
