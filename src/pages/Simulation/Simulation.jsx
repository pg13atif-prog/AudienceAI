import React, { useState, useEffect } from 'react';
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
  Eye,
  Film,
  Feather,
  Compass,
  Heart
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
import SimpleAnalysisView from '../../components/Simulation/SimpleAnalysisView';
import SceneRemixModal from '../../components/Remix/SceneRemixModal';
import ApiKeyModal from '../../components/Common/ApiKeyModal';
import { AUDIENCE_PERSONAS, getDefaultPersonaIds } from '../../data/personas';
import { geminiService } from '../../services/geminiService';
import { Zap } from '../../components/Common/Icons';
import { apiKeyService } from '../../services/apiKeyService';
import { consensusService } from '../../services/consensusService';
import { problemDetectionService } from '../../services/problemDetectionService';
import { historyService } from '../../services/historyService';
import './Simulation.css';

/**
 * Live Audience Persona Simulation & Visualization Screen (Refined Tabbed Layout)
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

  // Tabbed view state for results (minimal scrolling)
  const [resultsTab, setResultsTab] = useState('overview'); // 'overview' | 'personas' | 'feed'
  const [selectedPersonaTabId, setSelectedPersonaTabId] = useState(null);

  // Results analysis mode (Simple vs Detailed)
  const [analysisMode, setAnalysisMode] = useState('simple'); // 'simple' | 'detailed'

  // Modals & UI states
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [validationWarning, setValidationWarning] = useState(null);
  const [viewMode, setViewMode] = useState(activeScene?.simulationResults ? 'results' : 'setup'); // 'setup' | 'results'

  // Update simResults when activeScene changes
  useEffect(() => {
    if (activeScene?.simulationResults) {
      setSimResults(activeScene.simulationResults);
      setViewMode('results');
    }
  }, [activeScene]);

  const selectedCount = selectedPersonaIds.length;
  const isReadyToStart = selectedCount > 0;
  const activePersonas = personas.filter(p => selectedPersonaIds.includes(p.id));
  const wordCount = activeScene?.wordCount || (activeScene?.content ? activeScene.content.trim().split(/\s+/).filter(Boolean).length : 0);

  // Dynamic consensus and problem diagnostics calculated purely from actual results
  const consensusData = simResults ? consensusService.generateConsensus(simResults) : null;
  const problemDiagnosis = simResults 
    ? problemDetectionService.diagnoseScene(simResults, activeScene?.metrics || {}, activeScene)
    : null;

  // Active persona reaction in persona tab
  const currentPersonaReaction = simResults
    ? (simResults.find(r => r.personaId === selectedPersonaTabId) || simResults[0])
    : null;

  const getPersonaIcon = (iconName) => {
    switch (iconName) {
      case 'Film': return <Film size={15} />;
      case 'Feather': return <Feather size={15} />;
      case 'Compass': return <Compass size={15} />;
      case 'Heart': return <Heart size={15} />;
      default: return <Sparkles size={15} />;
    }
  };

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

      // Update scene with real results
      const updatedScene = {
        ...activeScene,
        simulationResults: reactions,
        metrics: aggregatedMetrics,
        problemDiagnosis: diagnosis,
        status: 'Simulated',
        lastSimulatedAt: new Date().toISOString()
      };

      setSimResults(reactions);
      setViewMode('results');
      setResultsTab('overview');

      if (onUpdateScene) {
        await onUpdateScene(updatedScene);
      }

      // Add to simulation history
      historyService.addEntry(updatedScene, reactions, aggregatedMetrics);
    } catch (err) {
      console.error('Simulation execution failed:', err);
      setSimError(err.message || 'Simulation encountered an unexpected error. Please check your Gemini API key and try again.');
    } finally {
      setIsSimulating(false);
      setSimProgress(null);
    }
  };

  return (
    <div className="simulation-page">
      {/* Top Scene Context Banner */}
      <div className="sim-header-banner glass-panel">
        <div className="sim-header-left">
          <div className="sim-header-badge-row">
            <Badge variant="amber" size="sm" icon={<Sparkles size={12} />}>
              Gemini Audience Simulator
            </Badge>
            <span className="sim-scene-tag">{activeScene?.subtitle || 'Act I • Scene 1'}</span>
          </div>

          <h1 className="sim-scene-title">{activeScene?.title || 'The Betrayal'}</h1>
          <p className="sim-scene-summary">
            {activeScene?.context || 'Simulate realistic multi-perspective audience reception and uncover blindspots across diverse demographic and critical archetypes.'}
          </p>
        </div>

        <div className="sim-header-right">
          <div className="sim-status-box">
            <span className="sim-status-label">Engine Status</span>
            <div className="sim-status-indicator">
              <span className={`sim-pulse-dot ${apiKeyService.hasKey() ? 'ready' : 'warning'}`} />
              <span className="sim-status-text">
                {apiKeyService.hasKey() ? 'Gemini 2.5 Active' : 'API Key Required'}
              </span>
            </div>
          </div>

          <div className="sim-action-row">
            {viewMode === 'results' && (
              <Button
                variant="secondary"
                size="md"
                icon={<Sliders size={14} />}
                onClick={() => setViewMode('setup')}
              >
                Configure Personas
              </Button>
            )}

            <Button
              variant="primary"
              size="md"
              icon={<Play size={14} />}
              onClick={handleStartSimulation}
              disabled={isSimulating || !isReadyToStart}
              className="start-sim-primary-btn"
            >
              {isSimulating ? 'Simulating...' : (viewMode === 'results' ? 'Re-Simulate Scene' : 'Run Simulation')}
            </Button>
          </div>
        </div>
      </div>

      {/* Validation Warning Alert */}
      {validationWarning && (
        <div className="sim-warning-banner">
          <AlertCircle size={16} />
          <span>{validationWarning}</span>
        </div>
      )}

      {/* Simulation Error Alert */}
      {simError && (
        <div className="sim-error-banner">
          <div className="sim-error-content">
            <AlertCircle size={18} className="sim-error-icon" />
            <div>
              <h4 className="sim-error-title">Simulation Error</h4>
              <p className="sim-error-desc">{simError}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsApiKeyModalOpen(true)}
          >
            Update API Key
          </Button>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 1: PERSONA SETUP & PRE-FLIGHT
          ========================================================================= */}
      {viewMode === 'setup' && (
        <>
          {/* Persona Selection Header */}
          <div className="persona-selection-header">
            <div>
              <h2 className="section-title">Select Audience Personas ({selectedCount} of {personas.length} Active)</h2>
              <p className="section-subtitle">
                Choose the lens through which you want your scene evaluated. Each persona possesses unique taste profiles, patience thresholds, and expectations.
              </p>
            </div>

            <div className="persona-selection-actions">
              <Button
                variant="ghost"
                size="sm"
                icon={<CheckCircle2 size={14} />}
                onClick={handleSelectAll}
              >
                Select All
              </Button>
            </div>
          </div>

          {/* Persona Selection Grid */}
          <div className="personas-selection-grid">
            {personas.map((persona) => {
              const isSelected = selectedPersonaIds.includes(persona.id);
              return (
                <PersonaCard
                  key={persona.id}
                  persona={persona}
                  isSelected={isSelected}
                  onToggleSelect={() => handleTogglePersona(persona.id)}
                  onInspect={() => {
                    // Inspect default persona spec
                    const match = simResults?.find(r => r.personaId === persona.id);
                    setInspectedReaction(match || {
                      personaId: persona.id,
                      personaName: persona.name,
                      icon: persona.icon,
                      colorKey: persona.colorKey,
                      role: persona.role,
                      avatarDesc: persona.avatarDesc,
                      demographics: persona.demographics,
                      overallScore: 75,
                      reaction: `Configured to evaluate scene through the ${persona.name} lens.`,
                      strengths: ['Archetypal viewpoint initialized.'],
                      observedIssues: [],
                      suggestions: []
                    });
                  }}
                />
              );
            })}
          </div>

          {/* Pre-flight Execution Summary Card */}
          <section className="preflight-summary-card glass-panel">
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
          VIEW MODE 2: LIVE RESULTS (COMPACT MINIMAL-SCROLL TABBED LAYOUT)
          ========================================================================= */}
      {viewMode === 'results' && (
        <div className="sim-results-container">
          {/* Results Navigation Bar */}
          <div className="sim-results-nav glass-panel">
            <div className="results-tab-group">
              <button
                type="button"
                className={`results-tab-btn ${resultsTab === 'overview' ? 'active' : ''}`}
                onClick={() => setResultsTab('overview')}
              >
                <Sparkles size={14} />
                <span>Overview</span>
              </button>

              <button
                type="button"
                className={`results-tab-btn ${resultsTab === 'personas' ? 'active' : ''}`}
                onClick={() => {
                  setResultsTab('personas');
                  if (!selectedPersonaTabId && simResults?.length > 0) {
                    setSelectedPersonaTabId(simResults[0].personaId);
                  }
                }}
              >
                <Users size={14} />
                <span>Persona Critiques ({simResults?.length || 0})</span>
              </button>

              <button
                type="button"
                className={`results-tab-btn ${resultsTab === 'feed' ? 'active' : ''}`}
                onClick={() => setResultsTab('feed')}
              >
                <Clock size={14} />
                <span>Live Feed</span>
              </button>
            </div>

            <div className="results-nav-actions">
              {resultsTab === 'overview' && (
                <div className="analysis-mode-segmented-toggle">
                  <button
                    type="button"
                    className={`mode-segment-btn ${analysisMode === 'simple' ? 'active' : ''}`}
                    onClick={() => setAnalysisMode('simple')}
                    title="Executive simple view"
                  >
                    <Zap size={12} />
                    <span>Simple</span>
                  </button>
                  <button
                    type="button"
                    className={`mode-segment-btn ${analysisMode === 'detailed' ? 'active' : ''}`}
                    onClick={() => setAnalysisMode('detailed')}
                    title="In-depth detailed diagnostic view"
                  >
                    <Sliders size={12} />
                    <span>Detailed</span>
                  </button>
                </div>
              )}

              <Button
                variant="primary"
                size="sm"
                icon={<Sparkles size={13} />}
                onClick={() => setIsRemixModalOpen(true)}
                className="nav-remix-btn"
              >
                AI Remix
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={<RotateCcw size={13} />}
                onClick={handleStartSimulation}
              >
                Re-Simulate
              </Button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & DIAGNOSTICS */}
          {resultsTab === 'overview' && (
            <div className="sim-tab-overview-container">
              {analysisMode === 'simple' ? (
                /* Symmetrical Simple Analysis View */
                <SimpleAnalysisView
                  consensusData={consensusData}
                  problemDiagnosis={problemDiagnosis}
                  simResults={simResults}
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
                  onSelectPersona={(personaId) => {
                    setSelectedPersonaTabId(personaId);
                    setResultsTab('personas');
                  }}
                />
              ) : (
                /* Detailed Surgical Diagnostic View */
                <>
                  {/* 1. Full-Width Top Consensus Banner */}
                  {consensusData && (
                    <ConsensusBanner consensusData={consensusData} />
                  )}

                  {/* 2. Side-by-Side Balanced Split Grid */}
                  <div className="sim-overview-split-grid">
                    {/* Left Column: Problem Diagnosis Card */}
                    <div className="overview-diag-col">
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
                    </div>

                    {/* Right Column: Persona Viewpoint Breakdown */}
                    <div className="overview-breakdown-col">
                      <PersonaBreakdown
                        personaRankings={consensusData?.personaRankings || []}
                        selectedPersonaId={selectedPersonaTabId}
                        onSelectPersona={(personaId) => {
                          setSelectedPersonaTabId(personaId);
                          setResultsTab('personas');
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: PERSONA DEEP DIVES */}
          {resultsTab === 'personas' && (
            <div className="sim-tab-personas-view">
              {/* Persona Selector Pill Strip */}
              <div className="persona-pills-strip glass-panel">
                <span className="pills-strip-label">Select Persona Lens:</span>
                <div className="persona-pills-list">
                  {simResults && simResults.map((reaction) => {
                    const isSelected = (selectedPersonaTabId || simResults[0]?.personaId) === reaction.personaId;
                    return (
                      <button
                        key={reaction.personaId}
                        type="button"
                        className={`persona-pill-tab pill-${reaction.colorKey || 'casual'} ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedPersonaTabId(reaction.personaId)}
                      >
                        <span className="persona-pill-tab-icon">{getPersonaIcon(reaction.icon)}</span>
                        <span className="persona-pill-tab-name">{reaction.personaName}</span>
                        <span className="persona-pill-tab-score">{reaction.overallScore}/100</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Persona Reaction Card */}
              {currentPersonaReaction && (
                <div className="persona-single-card-wrap">
                  <ReactionCard reaction={currentPersonaReaction} />
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LIVE FEED & FULL COMPARISON */}
          {resultsTab === 'feed' && (
            <div className="sim-tab-feed-grid">
              <div className="feed-col-left">
                <LiveReactionFeed 
                  reactions={simResults || []}
                  onSelectReaction={(reaction) => {
                    setSelectedPersonaTabId(reaction.personaId);
                    setResultsTab('personas');
                  }}
                />
              </div>
              <div className="feed-col-right">
                <div className="feed-all-cards-grid">
                  {simResults && simResults.map((reaction, idx) => (
                    <ReactionCard key={reaction.personaId || idx} reaction={reaction} />
                  ))}
                </div>
              </div>
            </div>
          )}
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
