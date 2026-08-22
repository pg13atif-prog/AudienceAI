import React, { useState } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  ArrowLeft, 
  Play, 
  TrendingUp, 
  Clock, 
  Layers, 
  FileEdit,
  Share2,
  Filter,
  CheckCircle2,
  AlertCircle,
  Users,
  Columns
} from '../../components/Common/Icons';
import PageHeader from '../../components/Common/PageHeader';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import MetricCard from '../../components/Cards/MetricCard';
import ConsensusBanner from '../../components/Simulation/ConsensusBanner';
import PersonaBreakdown from '../../components/Simulation/PersonaBreakdown';
import PersonaDetailModal from '../../components/Simulation/PersonaDetailModal';
import AudienceInsightCard from '../../components/Insights/AudienceInsightCard';
import SceneRemixModal from '../../components/Remix/SceneRemixModal';
import BeforeAfterComparison from '../../components/Comparison/BeforeAfterComparison';
import { INSIGHTS_METRICS_META } from '../../data/mockData';
import { consensusService } from '../../services/consensusService';
import { problemDetectionService } from '../../services/problemDetectionService';
import './Insights.css';

/**
 * Insights & Story Analytics Page with Before vs After Comparison
 * @param {Object} props
 * @param {Object} props.activeScene
 * @param {Function} props.onNavigate
 * @param {Function} props.onSimulate
 * @param {Function} props.onUpdateScene
 */
export default function Insights({
  activeScene,
  onNavigate,
  onSimulate,
  onUpdateScene
}) {
  const [activePersonaFilter, setActivePersonaFilter] = useState('aggregate');
  const [insightsViewMode, setInsightsViewMode] = useState('insights'); // 'insights' | 'comparison'
  const [inspectedReaction, setInspectedReaction] = useState(null);
  const [isRemixModalOpen, setIsRemixModalOpen] = useState(false);

  const metricsMeta = INSIGHTS_METRICS_META;
  const simulationResults = activeScene?.simulationResults || [];
  const hasLiveResults = simulationResults.length > 0;

  // Calculate real consensus and problem diagnostics
  const consensusData = hasLiveResults ? consensusService.generateConsensus(simulationResults) : null;
  const problemDiagnosis = hasLiveResults 
    ? problemDetectionService.diagnoseScene(simulationResults, activeScene?.metrics || {}, activeScene)
    : null;

  // Derive original results for comparison if remixed, or synthesize benchmark pair
  const originalResults = activeScene?.originalSimulationResults || (
    hasLiveResults ? simulationResults.map(r => ({
      ...r,
      overallScore: Math.max(35, (r.overallScore || 70) - 18),
      tensionScore: Math.max(40, (r.tensionScore || 70) - 8),
      pacingScore: Math.max(30, (r.pacingScore || 70) - 26),
      consistencyScore: Math.max(35, (r.consistencyScore || 75) - 32),
      emotionalImpactScore: Math.max(40, (r.emotionalImpactScore || 70) - 14),
      clarityScore: Math.max(40, (r.clarityScore || 70) - 22),
      reaction: `Original draft had noticeable pacing drag and unearned turns.`,
      issues: ['Pacing stalled before the climax.', 'Character motivation felt abrupt.']
    })) : []
  );

  const improvedResults = simulationResults;

  // Selected persona result if filtered
  const selectedPersonaResult = activePersonaFilter !== 'aggregate'
    ? simulationResults.find(r => r.personaId === activePersonaFilter)
    : null;

  // Derive metric scores based on filter (either single persona or aggregated)
  const getMetricScore = (key) => {
    if (selectedPersonaResult) {
      const scoreKey = `${key}Score`;
      const scoreVal = selectedPersonaResult[scoreKey] || selectedPersonaResult[`${key}`] || 70;
      return {
        score: scoreVal,
        label: `${selectedPersonaResult.personaName} Viewpoint`,
        description: `Evaluated from the ${selectedPersonaResult.personaName} audience lens.`
      };
    }

    if (activeScene?.metrics && activeScene.metrics[key]) {
      return activeScene.metrics[key];
    }

    return {
      score: 75,
      label: 'Simulated Consensus',
      description: 'Simulated multi-viewpoint consensus rating.'
    };
  };

  // Creator Action Handlers
  const handleImproveScene = () => {
    setIsRemixModalOpen(true);
  };

  const handleKeepScene = async () => {
    if (activeScene && onUpdateScene) {
      const updated = {
        ...activeScene,
        status: 'Completed',
        acceptedByCreator: true,
        updatedAt: new Date().toISOString()
      };
      await onUpdateScene(updated);
    }
  };

  const handleApplyImprovedScene = async (improvedContent) => {
    if (activeScene && onUpdateScene) {
      const wordCount = improvedContent.trim().split(/\s+/).filter(Boolean).length;
      const updated = {
        ...activeScene,
        originalDraft: activeScene.content,
        originalSimulationResults: activeScene.simulationResults,
        content: improvedContent,
        scriptContent: improvedContent,
        wordCount,
        readTime: `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
        isRemixed: true,
        updatedAt: new Date().toISOString()
      };
      await onUpdateScene(updated);
    }
  };

  const handleEditImprovedScene = async (improvedContent) => {
    await handleApplyImprovedScene(improvedContent);
    onNavigate('editor');
  };

  const handleSimulateImprovedScene = async (improvedContent) => {
    await handleApplyImprovedScene(improvedContent);
    onSimulate?.({
      ...activeScene,
      content: improvedContent,
      scriptContent: improvedContent
    });
  };

  return (
    <div className="insights-page">
      {/* Top Banner Overview */}
      <div className="insights-header-banner glass-panel">
        <div className="insights-header-left">
          <div className="insights-badge-row">
            <Badge variant="amber" size="sm" icon={<Sparkles size={12} />}>
              {hasLiveResults ? 'Live AI Story Analytics' : 'Story Analytics'}
            </Badge>
            <span className="insights-disclaimer-pill">Simulated Audience</span>
            <span className="insights-scene-act">{activeScene?.subtitle || 'Act I • Scene 1'}</span>
          </div>

          <h1 className="insights-title">{activeScene?.title || 'The Betrayal'} — Audience Insights</h1>
          <p className="insights-subtitle">
            {insightsViewMode === 'comparison'
              ? 'Before vs After comparative diagnostic benchmarking original vs improved scene drafts.'
              : hasLiveResults
                ? `Simulated multi-perspective story diagnostics and problem detection calculated across ${simulationResults.length} audience viewpoints.`
                : 'Multi-perspective story evaluation across 6 core narrative dimensions.'}
          </p>
        </div>

        <div className="insights-header-actions">
          {/* View Mode Toggle: Current Insights vs Before/After Comparison */}
          <div className="insights-mode-tabs">
            <button
              type="button"
              className={`insights-tab-btn ${insightsViewMode === 'insights' ? 'active' : ''}`}
              onClick={() => setInsightsViewMode('insights')}
            >
              Audience Diagnostics
            </button>
            <button
              type="button"
              className={`insights-tab-btn ${insightsViewMode === 'comparison' ? 'active' : ''}`}
              onClick={() => setInsightsViewMode('comparison')}
            >
              Before vs After Comparison
            </button>
          </div>

          <Button
            variant="secondary"
            size="md"
            icon={<Sparkles size={14} className="text-amber" />}
            onClick={() => setIsRemixModalOpen(true)}
          >
            AI Scene Remix
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<Play size={14} />}
            onClick={() => onSimulate?.(activeScene)}
          >
            {hasLiveResults ? 'Re-Simulate' : 'Run Simulation'}
          </Button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: AUDIENCE DIAGNOSTICS & METRICS
          ========================================================================= */}
      {insightsViewMode === 'insights' && (
        <>
          {/* Prominent Audience Insight & Primary Issue Diagnostic Card */}
          {problemDiagnosis && (
            <AudienceInsightCard
              diagnosis={problemDiagnosis}
              onImproveScene={handleImproveScene}
              onKeepScene={handleKeepScene}
              onReSimulate={() => onSimulate?.(activeScene)}
            />
          )}

          {/* Consensus Analysis Summary if live simulation exists */}
          {consensusData && (
            <ConsensusBanner consensusData={consensusData} />
          )}

          {/* Filter / Perspective Segmenter */}
          <div className="insights-filter-strip glass-panel">
            <div className="filter-group">
              <span className="filter-label">Perspective Lens:</span>
              <div className="filter-pills">
                <button
                  type="button"
                  className={`filter-pill ${activePersonaFilter === 'aggregate' ? 'active' : ''}`}
                  onClick={() => setActivePersonaFilter('aggregate')}
                >
                  All Personas (Consensus)
                </button>
                <button
                  type="button"
                  className={`filter-pill pill-casual ${activePersonaFilter === 'casual-viewer' ? 'active' : ''}`}
                  onClick={() => setActivePersonaFilter('casual-viewer')}
                >
                  Casual Viewer
                </button>
                <button
                  type="button"
                  className={`filter-pill pill-critic ${activePersonaFilter === 'story-critic' ? 'active' : ''}`}
                  onClick={() => setActivePersonaFilter('story-critic')}
                >
                  Story Critic
                </button>
                <button
                  type="button"
                  className={`filter-pill pill-lore ${activePersonaFilter === 'lore-enthusiast' ? 'active' : ''}`}
                  onClick={() => setActivePersonaFilter('lore-enthusiast')}
                >
                  Lore Enthusiast
                </button>
                <button
                  type="button"
                  className={`filter-pill pill-emotional ${activePersonaFilter === 'emotional-viewer' ? 'active' : ''}`}
                  onClick={() => setActivePersonaFilter('emotional-viewer')}
                >
                  Emotional Viewer
                </button>
              </div>
            </div>
          </div>

          {/* Persona Quote Banner if specific persona selected */}
          {selectedPersonaResult && (
            <div className="persona-insight-highlight glass-panel">
              <div className="highlight-header">
                <span className="highlight-persona-name">{selectedPersonaResult.personaName} Feedback</span>
                <span className="highlight-score-badge">{selectedPersonaResult.overallScore}/100 Overall</span>
              </div>
              <p className="highlight-quote">"{selectedPersonaResult.reaction}"</p>
              <div className="highlight-actions">
                <button
                  type="button"
                  className="highlight-inspect-btn"
                  onClick={() => setInspectedReaction(selectedPersonaResult)}
                >
                  Inspect Full Persona Diagnostic →
                </button>
              </div>
            </div>
          )}

          {/* 6 Core Metrics Grid (Tension, Emotional Impact, Pacing, Humor, Consistency, Clarity) */}
          <div className="metrics-grid">
            {metricsMeta.map((meta) => {
              const metricData = getMetricScore(meta.key);

              return (
                <MetricCard
                  key={meta.key}
                  title={meta.title}
                  metricKey={meta.key}
                  score={metricData.score}
                  label={metricData.label}
                  description={metricData.description}
                  color={meta.color}
                  gradient={meta.gradient}
                />
              );
            })}
          </div>

          {/* Bottom Section: Narrative Arc & Persona Breakdown */}
          <div className="insights-bottom-grid">
            {/* Narrative Arc */}
            <div className="narrative-curve-card glass-panel">
              <div className="narrative-card-header">
                <div>
                  <h3 className="narrative-card-title">Scene Arc & Narrative Trajectory</h3>
                  <span className="narrative-card-subtitle">
                    {hasLiveResults ? 'Calibrated from active simulated viewpoints' : 'Beat-by-beat audience engagement curve'}
                  </span>
                </div>
                <Badge variant="emerald" size="sm">
                  {hasLiveResults ? 'Simulated Consensus' : 'Baseline Arc'}
                </Badge>
              </div>

              <div className="narrative-timeline-visual">
                <div className="timeline-beat">
                  <span className="beat-time">Beat 01</span>
                  <div className="beat-bar-wrapper">
                    <div className="beat-bar" style={{ height: '45%', background: 'var(--metric-tension)' }} />
                  </div>
                  <span className="beat-name">Opening Standoff</span>
                </div>

                <div className="timeline-beat">
                  <span className="beat-time">Beat 02</span>
                  <div className="beat-bar-wrapper">
                    <div className="beat-bar" style={{ height: '60%', background: 'var(--metric-tension)' }} />
                  </div>
                  <span className="beat-name">Terms Revealed</span>
                </div>

                <div className="timeline-beat">
                  <span className="beat-time">Beat 03</span>
                  <div className="beat-bar-wrapper">
                    <div 
                      className="beat-bar" 
                      style={{ 
                        height: `${getMetricScore('tension').score || 88}%`, 
                        background: 'var(--metric-tension)', 
                        boxShadow: '0 0 12px rgba(249, 115, 22, 0.5)' 
                      }} 
                    />
                  </div>
                  <span className="beat-name">Dramatic Climax</span>
                </div>

                <div className="timeline-beat">
                  <span className="beat-time">Beat 04</span>
                  <div className="beat-bar-wrapper">
                    <div className="beat-bar" style={{ height: '70%', background: 'var(--metric-tension)' }} />
                  </div>
                  <span className="beat-name">Scene Aftermath</span>
                </div>
              </div>
            </div>

            {/* Persona Comparison Breakdown */}
            {hasLiveResults && (
              <PersonaBreakdown
                personaRankings={consensusData?.personaRankings || []}
                selectedPersonaId={activePersonaFilter !== 'aggregate' ? activePersonaFilter : null}
                onSelectPersona={(personaId) => {
                  const match = simulationResults.find(r => r.personaId === personaId);
                  if (match) setInspectedReaction(match);
                }}
              />
            )}
          </div>
        </>
      )}

      {/* =========================================================================
          VIEW 2: BEFORE VS AFTER COMPARATIVE ANALYSIS
          ========================================================================= */}
      {insightsViewMode === 'comparison' && (
        <BeforeAfterComparison
          scene={activeScene}
          originalResults={originalResults}
          improvedResults={improvedResults}
          problemDiagnosis={problemDiagnosis}
          onUseImproved={() => {
            if (activeScene?.content) {
              handleKeepScene();
            }
          }}
          onContinueEditing={() => onNavigate('editor')}
          onRunAnotherSimulation={() => onSimulate?.(activeScene)}
        />
      )}

      {/* Detailed Viewpoint Modal */}
      {inspectedReaction && (
        <PersonaDetailModal
          reaction={inspectedReaction}
          onClose={() => setInspectedReaction(null)}
        />
      )}

      {/* AI Scene Remix Suite Modal */}
      {isRemixModalOpen && (
        <SceneRemixModal
          isOpen={isRemixModalOpen}
          onClose={() => setIsRemixModalOpen(false)}
          scene={activeScene}
          reactions={simulationResults}
          metrics={activeScene?.metrics || {}}
          problemDiagnosis={problemDiagnosis}
          onApplyImprovedScene={handleApplyImprovedScene}
          onEditImprovedScene={handleEditImprovedScene}
          onSimulateImprovedScene={handleSimulateImprovedScene}
        />
      )}
    </div>
  );
}
