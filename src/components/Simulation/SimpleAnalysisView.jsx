import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  RotateCcw, 
  Film, 
  Feather, 
  Compass, 
  Heart, 
  ArrowRight,
  Zap,
  Info
} from '../Common/Icons';
import Badge from '../Common/Badge';
import Button from '../Common/Button';
import './SimpleAnalysisView.css';

/**
 * Symmetrical, executive-level Simple Analysis view
 * @param {Object} props
 * @param {Object} props.consensusData
 * @param {Object} props.problemDiagnosis
 * @param {Array<Object>} props.simResults
 * @param {Function} props.onImproveScene
 * @param {Function} props.onKeepScene
 * @param {Function} props.onReSimulate
 * @param {Function} props.onSelectPersona
 */
export default function SimpleAnalysisView({
  consensusData,
  problemDiagnosis,
  simResults = [],
  onImproveScene,
  onKeepScene,
  onReSimulate,
  onSelectPersona
}) {
  const [sceneKept, setSceneKept] = useState(false);

  const getPersonaIcon = (iconName) => {
    switch (iconName) {
      case 'Film': return <Film size={16} />;
      case 'Feather': return <Feather size={16} />;
      case 'Compass': return <Compass size={16} />;
      case 'Heart': return <Heart size={16} />;
      default: return <Sparkles size={16} />;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--persona-lore)';
    if (score >= 65) return 'var(--accent-amber)';
    return '#f87171';
  };

  const handleKeepScene = () => {
    setSceneKept(true);
    if (onKeepScene) onKeepScene();
  };

  const overallAvg = consensusData?.overallAverage || 80;
  const primaryCategory = problemDiagnosis?.primaryCategory || 'Pacing';

  return (
    <div className="simple-analysis-view">
      {/* ── TOP ROW: 2 Symmetrical Hero Cards (50% / 50%) ─────────────────── */}
      <div className="simple-hero-grid">
        {/* Left Hero Card: Overall Verdict & Consensus */}
        <div className="simple-hero-card glass-panel card-verdict">
          <div className="simple-card-header">
            <div className="simple-badge-wrap">
              <Badge variant="amber" size="sm" icon={<Sparkles size={12} />}>
                Audience Verdict
              </Badge>
              <span className="simple-sub-badge">Simulated Consensus</span>
            </div>
            <div className="simple-score-pill">
              <span className="simple-score-num">{overallAvg}</span>
              <span className="simple-score-denom">/100</span>
            </div>
          </div>

          <div className="simple-card-body">
            <h3 className="simple-hero-title">
              {consensusData?.consensusSummary || 'Strong audience engagement with targeted areas for refinement.'}
            </h3>
            <p className="simple-hero-desc">
              Evaluated across {simResults.length || 4} diverse audience lenses. The majority of viewers engaged deeply with the scene's emotional stakes.
            </p>
          </div>

          <div className="simple-card-footer">
            <div className="simple-sentiment-pills">
              <span className="sentiment-pill pill-pos">
                <CheckCircle2 size={12} className="text-emerald" />
                {consensusData?.highestPersona ? `Peak: ${consensusData.highestPersona.name} (${consensusData.highestPersona.score})` : 'High Immersion'}
              </span>
              <span className="sentiment-pill pill-neutral">
                <TrendingUp size={12} className="text-indigo" />
                {consensusData?.divergenceSummary ? 'Balanced Viewpoint Spread' : 'Cohesive Alignment'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Hero Card: Primary Narrative Recommendation */}
        <div className="simple-hero-card glass-panel card-recommendation">
          <div className="simple-card-header">
            <div className="simple-badge-wrap">
              <Badge variant="rose" size="sm" icon={<AlertCircle size={12} />}>
                Primary Focus Area
              </Badge>
              <span className="simple-sub-badge">{primaryCategory}</span>
            </div>
            {sceneKept && (
              <span className="simple-kept-badge">
                <ShieldCheck size={12} /> Approved
              </span>
            )}
          </div>

          <div className="simple-card-body">
            <h3 className="simple-hero-title">
              {problemDiagnosis?.craftSummary || `${primaryCategory} Calibration & Transition Tempo`}
            </h3>
            <p className="simple-hero-desc">
              {problemDiagnosis?.suggestedImprovement || 'Calibrate transition beats to give audience anticipation room to peak.'}
            </p>
          </div>

          <div className="simple-card-footer simple-action-footer">
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
              className="simple-remix-btn"
            >
              AI Scene Remix
            </Button>
          </div>
        </div>
      </div>

      {/* ── BOTTOM ROW: 4 Symmetrical Persona Scorecards ──────────────────── */}
      <div className="simple-personas-section">
        <div className="simple-section-header">
          <div className="simple-section-title-wrap">
            <h4 className="simple-section-title">Audience Viewpoint Reception</h4>
            <span className="simple-section-subtitle">Click any persona scorecard to inspect full critique</span>
          </div>
          <span className="simple-section-pill">4 Viewpoints Synthesized</span>
        </div>

        <div className="simple-personas-grid">
          {(consensusData?.personaRankings || simResults).map((p) => {
            const scoreColor = getScoreColor(p.score || p.overallScore || 75);
            const score = p.score || p.overallScore || 75;
            const quote = p.keyIssue || (p.reaction ? (p.reaction.length > 90 ? p.reaction.slice(0, 87) + '...' : p.reaction) : 'Viewpoint critique recorded.');

            return (
              <div
                key={p.id || p.personaId}
                className={`simple-persona-card glass-panel card-border-${p.colorKey || 'casual'}`}
                onClick={() => onSelectPersona?.(p.id || p.personaId)}
                role="button"
                tabIndex={0}
                title={`Inspect ${p.name || p.personaName}'s deep-dive critique`}
              >
                <div className="persona-card-top">
                  <div className={`persona-card-avatar avatar-${p.colorKey || 'casual'}`}>
                    {getPersonaIcon(p.icon)}
                  </div>
                  <div className="persona-card-meta">
                    <span className="persona-card-name">{p.name || p.personaName}</span>
                    <span className="persona-card-role">Simulated Lens</span>
                  </div>
                  <div className="persona-card-score" style={{ color: scoreColor }}>
                    {score}
                  </div>
                </div>

                <div className="persona-card-meter">
                  <div 
                    className="persona-meter-fill" 
                    style={{ width: `${score}%`, background: scoreColor }}
                  />
                </div>

                <p className="persona-card-quote">
                  "{quote}"
                </p>

                <div className="persona-card-bottom">
                  <span className="inspect-link">
                    Deep Dive <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
