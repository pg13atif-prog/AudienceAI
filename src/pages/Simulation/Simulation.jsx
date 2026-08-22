import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Play, 
  BarChart3, 
  Sliders, 
  FileEdit, 
  Info, 
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  FileText,
  Check,
  TrendingUp,
  Settings as SettingsIcon,
  RotateCcw,
  Eye
} from '../../components/Common/Icons';
import PageHeader from '../../components/Common/PageHeader';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import PersonaCard from '../../components/Cards/PersonaCard';
import ReactionCard from '../../components/Cards/ReactionCard';
import SimulationProgress from '../../components/Simulation/SimulationProgress';
import ConsensusBanner from '../../components/Simulation/ConsensusBanner';
import LiveReactionFeed from '../../components/Simulation/LiveReactionFeed';
import PersonaBreakdown from '../../components/Simulation/PersonaBreakdown';
import PersonaDetailModal from '../../components/Simulation/PersonaDetailModal';
import AudienceInsightCard from '../../components/Insights/AudienceInsightCard';
import SceneRemixModal from '../../components/Remix/SceneRemixModal';
import ApiKeyModal from '../../components/Common/ApiKeyModal';
import { AUDIENCE_PERSONAS, getDefaultPersonaIds } from '../../data/personas';
import { geminiService } from '../../services/geminiService';
import { apiKeyService } from '../../services/apiKeyService';
import { consensusService } from '../../services/consensusService';
import { problemDetectionService } from '../../services/problemDetectionService';
import { historyService } from '../../services/historyService';
import './Simulation.css';

/**
 * Live Audience Persona Simulation & Visualization Screen
 * @param {Object} props
 * @param {Object} props.activeScene
 * @param {Function} props.onNavigate
 * @param {Function} props.onViewInsights
 * @param {Function} props.onUpdateScene
 */
export default function Simulation({
  activeScene,
  onNavigate,
  onViewInsights,
  onUpdateScene
}) {
  const personas = AUDIENCE_PERSONAS;

  // Persona selections
  const [selectedPersonaIds, setSelectedPersonaIds] = useState(getDefaultPersonaIds());
  const [simulationDepth, setSimulationDepth] = useState('standard');

  // Simulation execution & streaming states
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(null);
  const [simResults, setSimResults] = useState(activeScene?.simulationResults || null);
  const [simError, setSimError] = useState(null);
  const [inspectedReaction, setInspectedReaction] = useState(null);
  const [isRemixModalOpen, setIsRemixModalOpen] = useState(false);

  // Modals & UI states
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [validationWarning, setValidationWarning] = useState(null);
  const [viewMode, setViewMode] = useState(activeScene?.simulationResults ? 'results' : 'setup'); // 'setup' | 'results'

  const selectedCount = selectedPersonaIds.length;
  const isReadyToStart = selectedCount > 0;
  const activePersonas = personas.filter(p => selectedPersonaIds.includes(p.id));
  const wordCount = activeScene?.wordCount || (activeScene?.content ? activeScene.content.trim().split(/\s+/).filter(Boolean).length : 0);

  // Dynamic consensus and problem diagnostics calculated purely from actual results
  const consensusData = simResults ? consensusService.generateConsensus(simResults) : null;
  const problemDiagnosis = simResults 
    ? problemDetectionService.diagnoseScene(simResults, activeScene?.metrics || {}, activeScene)
    : null;

  // Toggle Persona Selection
  const handleTogglePersona = (personaId) => {
    if (selectedPersonaIds.includes(personaId)) {
      if (selectedPersonaIds.length === 1) {
        setValidationWarning('At least one audience persona must remain selected for simulation.');
        setTimeout(() => setValidationWarning(null), 3500);
        return;
      }
      setSelectedPersonaIds(prev => prev.filter(id => id !== personaId));
    } else {
      setSelectedPersonaIds(prev => [...prev, personaId]);
    }
    setValidationWarning(null);
  };

  const handleSelectAll = () => {
    setSelectedPersonaIds(personas.map(p => p.id));
    setValidationWarning(null);
  };

  // Run Real Gemini Simulation with Live Sequential Streaming
  const handleStartSimulation = async () => {
    if (!isReadyToStart) {
      setValidationWarning('Please select at least one audience persona before starting simulation.');
      return;
    }

    if (!activeScene?.content || activeScene.content.trim().length === 0) {
      setValidationWarning('Scene content is empty. Please return to the Scene Editor to write your scene before simulating.');
      return;
    }

    // Check for API Key
    if (!apiKeyService.hasKey()) {
      setIsApiKeyModalOpen(true);
      return;
    }

    setSimError(null);
    setIsSimulating(true);
    setSimProgress({
      completedCount: 0,
      totalCount: activePersonas.length,
      personaStatuses: activePersonas.reduce((acc, p) => ({
        ...acc,
        [p.id]: { id: p.id, name: p.name, icon: p.icon, status: 'pending' }
      }), {})
    });

    try {
      const reactions = await geminiService.simulateScene(
        activeScene,
        activePersonas,
        (progressState) => {
          setSimProgress(progressState);
        }
      );

      // Calculate aggregated metrics from actual persona outputs
      const aggregatedMetrics = geminiService.calculateAggregatedMetrics(reactions);

      // Diagnose problems for audit history
      const diagnosis = problemDetectionService.diagnoseScene(reactions, aggregatedMetrics, activeScene);

      // Record in historical simulation log
      await historyService.recordSimulationSession({
        scene: activeScene,
        results: reactions,
        metrics: aggregatedMetrics,
        problemDiagnosis: diagnosis
      });

      // Update scene with results and save persistently
      const updatedScene = {
        ...activeScene,
        simulationResults: reactions,
        metrics: aggregatedMetrics,
        status: 'Completed',
        lastSimulated: 'Just now',
        updatedAt: new Date().toISOString()
      };

      if (onUpdateScene) {
        await onUpdateScene(updatedScene);
      }

      setSimResults(reactions);
      setViewMode('results');
    } catch (err) {
      console.error('Simulation failed:', err);
      if (err.code === 'MISSING_API_KEY' || err.code === 'INVALID_API_KEY') {
        setIsApiKeyModalOpen(true);
      }
      setSimError(err.message || 'Simulation encountered an error. Please try again.');
    } finally {
      setIsSimulating(false);
      setSimProgress(null);
    }
  };

  return (
    <div className="simulation-page">
      {/* Top Banner */}
      <div className="sim-header-banner glass-panel">
        <div className="sim-header-left">
          <div className="sim-header-badge-row">
            <Badge variant="amber" size="sm" icon={<Sparkles size={12} />}>
              {viewMode === 'results' ? 'Live Audience Simulation Results' : 'Simulation Setup & Pre-Flight'}
            </Badge>
            <span className="sim-disclaimer-pill">Simulated Audience</span>
            <span className="sim-scene-tag">{activeScene?.subtitle || 'Act I • Scene 1'}</span>
          </div>

          <h1 className="sim-scene-title">
            {activeScene?.title ? `Simulate: ${activeScene.title}` : 'Untitled Scene Simulation'}
          </h1>
          <p className="sim-scene-summary">
            {viewMode === 'results' 
              ? `Live simulated audience responses evaluated across ${simResults?.length || 0} viewpoints with calibrated narrative diagnostics.`
              : 'Configure simulated audience personas to independently evaluate scene pacing, narrative stakes, and emotional resonance.'}
          </p>
        </div>

        <div className="sim-header-right">
          <div className="sim-status-box">
            <span className="sim-status-label">Audience Status</span>
            <div className="sim-status-indicator">
              <span className={`sim-pulse-dot ${viewMode === 'results' ? 'ready' : isReadyToStart ? 'ready' : 'warning'}`} />
              <span className="sim-status-text">
                {viewMode === 'results' 
                  ? `${simResults?.length || 0} Simulated Viewpoints Ready`
                  : `${selectedCount} of ${personas.length} Personas Selected`}
              </span>
            </div>
          </div>

          <div className="sim-action-row">
            {viewMode === 'results' ? (
              <>
                <Button
                  variant="secondary"
                  size="md"
                  icon={<RotateCcw size={14} />}
                  onClick={() => setViewMode('setup')}
                >
                  Configure Setup
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={<BarChart3 size={15} />}
                  onClick={() => onViewInsights(activeScene)}
                >
                  View Story Analytics
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="md"
                  icon={<FileEdit size={14} />}
                  onClick={() => onNavigate('editor')}
                >
                  Edit Scene
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={<Play size={15} />}
                  onClick={handleStartSimulation}
                  disabled={!isReadyToStart || isSimulating}
                  className="start-sim-primary-btn"
                >
                  Start Simulation
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error Alert Banner */}
      {simError && (
        <div className="sim-error-banner">
          <div className="sim-error-content">
            <AlertCircle size={18} className="sim-error-icon" />
            <div>
              <h4 className="sim-error-title">Simulation Error</h4>
              <p className="sim-error-desc">{simError}</p>
            </div>
          </div>
          <div className="sim-error-actions">
            <Button
              variant="secondary"
              size="sm"
              icon={<SettingsIcon size={13} />}
              onClick={() => setIsApiKeyModalOpen(true)}
            >
              API Key Settings
            </Button>
            <Button
              variant="amber"
              size="sm"
              onClick={handleStartSimulation}
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Warning Alert Banner */}
      {validationWarning && (
        <div className="sim-warning-banner">
          <AlertCircle size={16} />
          <span>{validationWarning}</span>
          <button 
            type="button" 
            className="sim-warning-close" 
            onClick={() => setValidationWarning(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 1: SETUP & PERSONA SELECTION
          ========================================================================= */}
      {viewMode === 'setup' && (
        <>
          {/* Controls Bar */}
          <div className="sim-controls-bar glass-panel">
            <div className="sim-controls-left">
              <div className="sim-personas-count">
                <Users size={16} />
                <span>Audience Personas ({selectedCount}/{personas.length} Selected)</span>
              </div>

              <div className="sim-quick-select-btns">
                <button
                  type="button"
                  className="sim-text-btn"
                  onClick={handleSelectAll}
                  disabled={selectedCount === personas.length}
                >
                  Select All (4)
                </button>
              </div>
            </div>

            <div className="sim-tuning-options">
              <span className="tuning-label">Simulation Mode:</span>
              <div className="depth-selector">
                <button
                  type="button"
                  className={`depth-tab ${simulationDepth === 'standard' ? 'active' : ''}`}
                  onClick={() => setSimulationDepth('standard')}
                >
                  Standard Evaluation
                </button>
                <button
                  type="button"
                  className={`depth-tab ${simulationDepth === 'deep' ? 'active' : ''}`}
                  onClick={() => setSimulationDepth('deep')}
                >
                  Deep Subtext Probe
                </button>
              </div>
            </div>
          </div>

          {/* 4 Audience Persona Cards Grid */}
          <div className="persona-cards-grid">
            {personas.map((persona) => {
              const isSelected = selectedPersonaIds.includes(persona.id);
              const isLast = isSelected && selectedCount === 1;

              return (
                <PersonaCard
                  key={persona.id}
                  persona={persona}
                  isSelected={isSelected}
                  onToggleSelect={handleTogglePersona}
                  isLastSelected={isLast}
                />
              );
            })}
          </div>

          {/* Pre-Flight Summary Card */}
          <section className="sim-preflight-card glass-panel">
            <div className="preflight-header">
              <div className="preflight-header-left">
                <div className="preflight-icon-box">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="preflight-title">Simulation Pre-Flight Summary</h3>
                  <p className="preflight-subtitle">Review scene payload and active personas before execution</p>
                </div>
              </div>

              <Badge variant={isReadyToStart ? 'emerald' : 'rose'} size="md">
                {isReadyToStart ? 'Ready for Gemini Simulation' : 'Selection Incomplete'}
              </Badge>
            </div>

            <div className="preflight-details-grid">
              <div className="preflight-detail-item">
                <span className="detail-label">Target Scene</span>
                <span className="detail-value scene-highlight">
                  {activeScene?.title || 'Untitled Scene'}
                </span>
                <div className="detail-meta-row">
                  <span>{activeScene?.subtitle || 'Act I • Scene 1'}</span>
                  <span>•</span>
                  <span>{wordCount} words</span>
                  <span>•</span>
                  <span>{activeScene?.characters?.length || 0} characters</span>
                </div>
              </div>

              <div className="preflight-detail-item">
                <span className="detail-label">Active Audience Viewpoints</span>
                <div className="active-personas-badges">
                  {activePersonas.map((p) => (
                    <span key={p.id} className={`active-persona-pill pill-${p.colorKey}`}>
                      <span className="persona-active-dot" />
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="preflight-detail-item">
                <span className="detail-label">AI Engine</span>
                <span className="detail-value">Gemini 2.5 Flash</span>
                <span className="detail-subtext">Independent Multi-Persona Reasoning</span>
              </div>
            </div>

            <div className="preflight-footer">
              <div className="preflight-guidance-text">
                <Info size={14} />
                <span>
                  Clicking <strong>Start Simulation</strong> initiates independent evaluation across all {selectedCount} active persona perspectives.
                </span>
              </div>

              <div className="preflight-btn-group">
                <Button
                  variant="secondary"
                  size="md"
                  icon={<FileEdit size={14} />}
                  onClick={() => onNavigate('editor')}
                >
                  Modify Scene
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Play size={16} />}
                  onClick={handleStartSimulation}
                  disabled={!isReadyToStart || isSimulating}
                  className="preflight-start-cta"
                >
                  Start Simulation ({selectedCount} Personas)
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* =========================================================================
          VIEW MODE 2: LIVE AUDIENCE VISUALIZATION & CONSENSUS
          ========================================================================= */}
      {viewMode === 'results' && (
        <div className="sim-results-section">
          {/* 1. Prominent Audience Insight & Primary Problem Diagnostic Card */}
          {problemDiagnosis && (
            <AudienceInsightCard
              diagnosis={problemDiagnosis}
              onImproveScene={() => setIsRemixModalOpen(true)}
              onKeepScene={async () => {
                if (activeScene && onUpdateScene) {
                  const updated = {
                    ...activeScene,
                    status: 'Completed',
                    acceptedByCreator: true,
                    updatedAt: new Date().toISOString()
                  };
                  await onUpdateScene(updated);
                }
              }}
              onReSimulate={handleStartSimulation}
            />
          )}

          {/* 2. Top Consensus Insight Banner */}
          {consensusData && (
            <ConsensusBanner consensusData={consensusData} />
          )}

          {/* 2. Dual Column: Live Reaction Feed & Persona Breakdown */}
          <div className="sim-visualization-grid">
            {/* Left Column: Live Reaction Feed */}
            <div className="feed-column">
              <LiveReactionFeed 
                reactions={simResults || []}
                onSelectReaction={(reaction) => setInspectedReaction(reaction)}
              />
            </div>

            {/* Right Column: Persona Score Breakdown */}
            <div className="breakdown-column">
              <PersonaBreakdown
                personaRankings={consensusData?.personaRankings || []}
                onSelectPersona={(personaId) => {
                  const match = simResults?.find(r => r.personaId === personaId);
                  if (match) setInspectedReaction(match);
                }}
              />
            </div>
          </div>

          {/* 3. Full Detailed Persona Reaction Cards Grid */}
          <div className="results-subheading-row">
            <div>
              <h3 className="results-subheading-title">Detailed Audience Perspective Reactions</h3>
              <p className="results-subheading-desc">
                Candid viewpoint analysis, 6-metric gauges, observed issues vs interpretations, and creative suggestions.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<RotateCcw size={13} />}
              onClick={handleStartSimulation}
            >
              Re-Simulate Scene
            </Button>
          </div>

          <div className="reactions-grid">
            {simResults && simResults.map((reaction, idx) => (
              <ReactionCard key={reaction.personaId || idx} reaction={reaction} />
            ))}
          </div>
        </div>
      )}

      {/* Cinematic Simulation Progress Overlay */}
      {isSimulating && (
        <SimulationProgress
          progress={simProgress}
          scene={activeScene}
        />
      )}

      {/* Detailed Inspection Modal */}
      {inspectedReaction && (
        <PersonaDetailModal
          reaction={inspectedReaction}
          onClose={() => setInspectedReaction(null)}
        />
      )}

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={() => {
          if (!isSimulating && isReadyToStart) {
            handleStartSimulation();
          }
        }}
      />

      {/* AI Scene Remix Suite Modal */}
      {isRemixModalOpen && (
        <SceneRemixModal
          isOpen={isRemixModalOpen}
          onClose={() => setIsRemixModalOpen(false)}
          scene={activeScene}
          reactions={simResults || []}
          metrics={activeScene?.metrics || {}}
          problemDiagnosis={problemDiagnosis}
          onApplyImprovedScene={async (improvedContent) => {
            if (activeScene && onUpdateScene) {
              const wordCount = improvedContent.trim().split(/\s+/).filter(Boolean).length;
              const updated = {
                ...activeScene,
                content: improvedContent,
                scriptContent: improvedContent,
                wordCount,
                readTime: `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
                isRemixed: true,
                updatedAt: new Date().toISOString()
              };
              await onUpdateScene(updated);
            }
          }}
          onEditImprovedScene={async (improvedContent) => {
            if (activeScene && onUpdateScene) {
              const wordCount = improvedContent.trim().split(/\s+/).filter(Boolean).length;
              const updated = {
                ...activeScene,
                content: improvedContent,
                scriptContent: improvedContent,
                wordCount,
                readTime: `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
                isRemixed: true,
                updatedAt: new Date().toISOString()
              };
              await onUpdateScene(updated);
            }
            onNavigate('editor');
          }}
          onSimulateImprovedScene={async (improvedContent) => {
            if (activeScene && onUpdateScene) {
              const wordCount = improvedContent.trim().split(/\s+/).filter(Boolean).length;
              const updated = {
                ...activeScene,
                content: improvedContent,
                scriptContent: improvedContent,
                wordCount,
                readTime: `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
                isRemixed: true,
                updatedAt: new Date().toISOString()
              };
              await onUpdateScene(updated);
            }
            handleStartSimulation();
          }}
        />
      )}
    </div>
  );
}
