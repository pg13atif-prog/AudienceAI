import React from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw, 
  FileEdit, 
  Play, 
  ShieldCheck, 
  BarChart3,
  Film,
  Feather,
  Compass,
  Heart
} from '../Common/Icons';
import Badge from '../Common/Badge';
import Button from '../Common/Button';
import { comparisonService } from '../../services/comparisonService';
import './BeforeAfterComparison.css';

/**
 * Before vs After Comparative Analysis Component
 * @param {Object} props
 * @param {Object} props.scene
 * @param {Array<Object>} props.originalResults
 * @param {Array<Object>} props.improvedResults
 * @param {Object} [props.problemDiagnosis]
 * @param {Function} props.onUseImproved
 * @param {Function} props.onContinueEditing
 * @param {Function} props.onRunAnotherSimulation
 */
export default function BeforeAfterComparison({
  scene,
  originalResults = [],
  improvedResults = [],
  problemDiagnosis = null,
  onUseImproved,
  onContinueEditing,
  onRunAnotherSimulation
}) {
  const comparison = comparisonService.compareSimulations({
    originalResults,
    improvedResults,
    problemDiagnosis
  });

  const getPersonaIcon = (iconName) => {
    switch (iconName) {
      case 'Film': return <Film size={18} />;
      case 'Feather': return <Feather size={18} />;
      case 'Compass': return <Compass size={18} />;
      case 'Heart': return <Heart size={18} />;
      default: return <Sparkles size={18} />;
    }
  };

  if (!comparison.hasData) {
    return (
      <div className="comparison-empty-state glass-panel">
        <BarChart3 size={32} className="text-muted" />
        <h3>Before vs After Benchmarks Incomplete</h3>
        <p>Simulate both the original draft and the remixed draft to view comparative diagnostics.</p>
      </div>
    );
  }

  return (
    <div className="before-after-comparison-suite">
      {/* 1. TOP VERDICT BANNER: "Did the Scene Improve?" */}
      <section className="verdict-banner glass-panel">
        <div className="verdict-header">
          <div className="verdict-title-group">
            <div className="verdict-badge-row">
              <Badge variant="emerald" size="sm" icon={<CheckCircle2 size={13} />}>
                Comparative Benchmark Analysis
              </Badge>
              <span className="verdict-disclaimer">Simulated Audience Validation</span>
            </div>
            <h2 className="verdict-heading">
              Did the scene improve? — {comparison.didImprove ? 'Yes, Substantial Lift Detected' : 'Comparable Performance'}
            </h2>
            <p className="verdict-summary-text">
              {comparison.verdictSummary}
            </p>
          </div>

          <div className="verdict-score-delta-box">
            <span className="delta-box-label">Audience Score Lift</span>
            <div className="delta-digits-row">
              <span className="delta-sign">{comparison.overallDelta >= 0 ? '+' : ''}</span>
              <span className="delta-big-number">{comparison.overallDelta}%</span>
            </div>
            <span className="delta-subtext">
              {comparison.originalAverage} ➔ {comparison.improvedAverage} Overall
            </span>
          </div>
        </div>

        {/* 3-Pillar Resolution Diagnostics */}
        <div className="verdict-resolution-grid">
          {/* Pillar 1: Which Problems Improved */}
          <div className="resolution-card card-improved">
            <div className="resolution-card-title text-emerald">
              <CheckCircle2 size={15} />
              <span>Which Problems Improved</span>
            </div>
            <ul className="resolution-list">
              {comparison.problemsImproved.map((item, idx) => (
                <li key={idx} className="resolution-item">
                  <span className="check-bullet text-emerald">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pillar 2: Which Problems Remain */}
          <div className="resolution-card card-remaining">
            <div className="resolution-card-title text-amber">
              <AlertCircle size={15} />
              <span>Which Problems Remain</span>
            </div>
            <ul className="resolution-list">
              {comparison.problemsRemaining.map((item, idx) => (
                <li key={idx} className="resolution-item">
                  <span className="check-bullet text-amber">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pillar 3: New Problems Check */}
          <div className="resolution-card card-new-check">
            <div className="resolution-card-title text-indigo">
              <ShieldCheck size={15} />
              <span>Regression & Continuity Check</span>
            </div>
            <ul className="resolution-list">
              {comparison.newProblemsDetected.map((item, idx) => (
                <li key={idx} className="resolution-item">
                  <span className="check-bullet text-indigo">🛡️</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 2. METRIC COMPARISON TABLE & DUAL BEFORE/AFTER BARS */}
      <section className="metric-comparison-section glass-panel">
        <div className="section-header-row">
          <div>
            <h3 className="section-title">6-Dimension Metric Comparison</h3>
            <p className="section-subtitle">
              Direct calibrated comparison between Original Scene and Improved Scene.
            </p>
          </div>
          <div className="metric-legend">
            <div className="legend-item"><span className="legend-dot orig-dot" /><span>Original Draft</span></div>
            <div className="legend-item"><span className="legend-dot imp-dot" /><span>Improved Draft</span></div>
          </div>
        </div>

        <div className="metric-bars-grid">
          {comparison.dimensionComparisons.map((dim) => (
            <div key={dim.key} className="dimension-compare-card">
              <div className="dim-card-header">
                <span className="dim-name">{dim.label}</span>
                <span className={`dim-delta-badge ${dim.delta >= 0 ? 'positive' : 'negative'}`}>
                  {dim.delta >= 0 ? `+${dim.delta}%` : `${dim.delta}%`}
                </span>
              </div>

              {/* Dual Before / After Progress Bars */}
              <div className="dual-bars-container">
                {/* Original Bar */}
                <div className="bar-row">
                  <span className="bar-row-label">Original</span>
                  <div className="bar-track">
                    <div className="bar-fill original-fill" style={{ width: `${dim.originalScore}%` }} />
                  </div>
                  <span className="bar-score-label">{dim.originalScore}%</span>
                </div>

                {/* Improved Bar */}
                <div className="bar-row">
                  <span className="bar-row-label text-emerald">Improved</span>
                  <div className="bar-track">
                    <div className="bar-fill improved-fill" style={{ width: `${dim.improvedScore}%` }} />
                  </div>
                  <span className="bar-score-label text-emerald font-bold">{dim.improvedScore}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. AUDIENCE RESPONSE COMPARISON (PERSONA BY PERSONA) */}
      <section className="audience-reactions-compare-section">
        <div className="section-header-row">
          <div>
            <h3 className="section-title">Audience Viewpoint Transformation</h3>
            <p className="section-subtitle">
              How each simulated persona's feedback shifted between drafts.
            </p>
          </div>
        </div>

        <div className="persona-transformations-grid">
          {comparison.personaPairings.map((p) => (
            <div key={p.personaId} className={`persona-compare-card card-${p.colorKey || 'casual'} glass-panel`}>
              <div className="compare-card-top">
                <div className="compare-persona-identity">
                  <div className="compare-avatar-box">
                    {getPersonaIcon(p.icon)}
                  </div>
                  <div>
                    <h4 className="compare-persona-name">{p.personaName}</h4>
                    <span className="compare-viewpoint-tag">Simulated Audience</span>
                  </div>
                </div>

                <div className="compare-scores-shift">
                  <span className="score-orig">{p.originalScore}</span>
                  <ArrowRight size={13} className="shift-arrow" />
                  <span className="score-imp">{p.improvedScore}</span>
                  <span className="score-delta-pill">
                    {p.scoreDelta >= 0 ? `+${p.scoreDelta}` : p.scoreDelta}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Commentary Shift */}
              <div className="quotes-compare-split">
                <div className="quote-box original-quote">
                  <span className="quote-label">Original Feedback:</span>
                  <p className="quote-text">"{p.originalReaction}"</p>
                  <span className="quote-sub-issue text-muted">⚠️ Flagged: {p.originalIssue}</span>
                </div>

                <div className="quote-box improved-quote">
                  <span className="quote-label text-emerald">Improved Reaction:</span>
                  <p className="quote-text">"{p.improvedReaction}"</p>
                  <span className="quote-sub-strength text-emerald">✓ Praise: {p.improvedStrength}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CREATOR ACTION TOOLBAR */}
      <div className="comparison-cta-footer glass-panel">
        <div className="cta-guidance">
          <Sparkles size={16} className="text-amber" />
          <span>Next steps for your creative script:</span>
        </div>

        <div className="cta-btn-group">
          <Button
            variant="ghost"
            size="md"
            icon={<RotateCcw size={14} />}
            onClick={onRunAnotherSimulation}
          >
            Run Another Simulation
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={<FileEdit size={14} />}
            onClick={onContinueEditing}
          >
            Continue Editing
          </Button>

          <Button
            variant="primary"
            size="lg"
            icon={<Check size={16} />}
            onClick={onUseImproved}
            className="use-improved-primary-btn"
          >
            Use Improved Version
          </Button>
        </div>
      </div>
    </div>
  );
}
