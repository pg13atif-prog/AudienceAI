import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  CheckCircle2, 
  X, 
  RotateCcw, 
  FileEdit, 
  Play, 
  Columns, 
  FileText, 
  AlertCircle,
  Layers,
  ArrowRight
} from '../Common/Icons';
import Badge from '../Common/Badge';
import Button from '../Common/Button';
import { remixService } from '../../services/remixService';
import './SceneRemixModal.css';

/**
 * AI Scene Remix Modal & Comparison Suite
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Object} props.scene
 * @param {Array<Object>} [props.reactions]
 * @param {Object} [props.metrics]
 * @param {Object} [props.problemDiagnosis]
 * @param {Function} props.onApplyImprovedScene - (newContent) => void
 * @param {Function} props.onEditImprovedScene - (newContent) => void
 * @param {Function} props.onSimulateImprovedScene - (newContent) => void
 */
export default function SceneRemixModal({
  isOpen,
  onClose,
  scene,
  reactions = [],
  metrics = {},
  problemDiagnosis = null,
  onApplyImprovedScene,
  onEditImprovedScene,
  onSimulateImprovedScene
}) {
  const [customInstruction, setCustomInstruction] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [remixResult, setRemixResult] = useState(null);
  const [error, setError] = useState(null);
  const [viewTab, setViewTab] = useState('split'); // 'split' | 'original' | 'improved'

  const originalContent = scene?.content || scene?.scriptContent || '';

  // Trigger remix generation
  const handleGenerateRemix = async (instructionOverride = null) => {
    setIsGenerating(true);
    setError(null);

    const instructionToUse = instructionOverride !== null ? instructionOverride : customInstruction;

    try {
      const result = await remixService.generateRemix({
        scene,
        reactions,
        metrics,
        problemDiagnosis,
        customInstruction: instructionToUse
      });
      setRemixResult(result);
    } catch (err) {
      console.error('Remix generation failed:', err);
      setError(err.message || 'Failed to generate remix. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-generate remix on open if not already generated
  useEffect(() => {
    if (isOpen && !remixResult && !isGenerating) {
      handleGenerateRemix();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const originalWordCount = originalContent.trim().split(/\s+/).filter(Boolean).length;
  const improvedWordCount = remixResult?.improvedContent 
    ? remixResult.improvedContent.trim().split(/\s+/).filter(Boolean).length 
    : 0;

  // Preset quick instructions
  const quickPresets = [
    'Make the betrayal feel more subtle',
    'Heighten emotional vulnerability',
    'Tighten dialogue and cut exposition',
    'Clarify character motivation'
  ];

  return (
    <div className="remix-modal-backdrop" onClick={onClose}>
      <div className="remix-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="remix-modal-header">
          <div className="remix-header-left">
            <div className="remix-icon-badge">
              <Sparkles size={20} className="text-amber" />
            </div>
            <div>
              <div className="remix-badge-row">
                <Badge variant="amber" size="sm">AI Scene Remix Suite</Badge>
                <span className="remix-scene-tag">{scene?.subtitle || 'Act I • Scene 1'}</span>
              </div>
              <h2 className="remix-modal-title">Improve Scene: {scene?.title || 'Untitled Scene'}</h2>
            </div>
          </div>

          <div className="remix-header-right">
            {/* View Mode Switcher */}
            <div className="remix-view-switcher">
              <button
                type="button"
                className={`view-tab-btn ${viewTab === 'split' ? 'active' : ''}`}
                onClick={() => setViewTab('split')}
              >
                Side-by-Side Split
              </button>
              <button
                type="button"
                className={`view-tab-btn ${viewTab === 'original' ? 'active' : ''}`}
                onClick={() => setViewTab('original')}
              >
                Original Only
              </button>
              <button
                type="button"
                className={`view-tab-btn ${viewTab === 'improved' ? 'active' : ''}`}
                onClick={() => setViewTab('improved')}
              >
                AI-Improved Only
              </button>
            </div>

            <button type="button" className="remix-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Custom Instruction Input Bar & Presets */}
        <div className="remix-instruction-bar glass-panel">
          <div className="instruction-input-wrap">
            <input
              type="text"
              className="custom-instruction-input"
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="Add optional creator instruction (e.g., 'Make the betrayal feel more subtle')..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleGenerateRemix();
                }
              }}
            />
            <Button
              variant="amber"
              size="md"
              icon={<Sparkles size={15} />}
              onClick={() => handleGenerateRemix()}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating Remix...' : remixResult ? 'Regenerate Remix' : 'Generate Remix'}
            </Button>
          </div>

          {/* Quick Presets */}
          <div className="instruction-presets-row">
            <span className="presets-label">Quick Directives:</span>
            {quickPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                className="preset-pill-btn"
                onClick={() => {
                  setCustomInstruction(preset);
                  handleGenerateRemix(preset);
                }}
              >
                + {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="remix-error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
            <Button variant="secondary" size="sm" onClick={() => handleGenerateRemix()}>
              Retry
            </Button>
          </div>
        )}

        {/* Loading Visualizer if generating */}
        {isGenerating && (
          <div className="remix-loading-state glass-panel">
            <div className="remix-loading-glow">
              <Sparkles size={32} className="spin-slow text-amber" />
            </div>
            <h3 className="remix-loading-title">Refining Screenplay with Audience Feedback</h3>
            <p className="remix-loading-sub">
              Preserving core story events, characters, and setting while surgically fixing narrative friction...
            </p>
          </div>
        )}

        {/* Comparison Workspace */}
        {!isGenerating && (
          <div className={`remix-comparison-workspace ${viewTab}`}>
            {/* Left Pane: Original Scene */}
            {(viewTab === 'split' || viewTab === 'original') && (
              <div className="comparison-pane original-pane glass-panel">
                <div className="pane-header">
                  <div className="pane-title-wrap">
                    <FileText size={16} className="text-muted" />
                    <span className="pane-title">Original Scene</span>
                  </div>
                  <span className="pane-wordcount">{originalWordCount} words</span>
                </div>
                <div className="pane-content-screenplay">
                  <pre className="screenplay-text">{originalContent}</pre>
                </div>
              </div>
            )}

            {/* Right Pane: AI-Improved Scene */}
            {(viewTab === 'split' || viewTab === 'improved') && (
              <div className="comparison-pane improved-pane glass-panel">
                <div className="pane-header">
                  <div className="pane-title-wrap">
                    <Sparkles size={16} className="text-amber" />
                    <span className="pane-title text-amber">AI-Improved Scene</span>
                    <Badge variant="emerald" size="sm">Audience Calibrated</Badge>
                  </div>
                  <span className="pane-wordcount">{improvedWordCount} words</span>
                </div>
                <div className="pane-content-screenplay">
                  <pre className="screenplay-text highlight-script">
                    {remixResult?.improvedContent || 'Generating improved screenplay...'}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Change Summary Card */}
        {remixResult && !isGenerating && (
          <div className="remix-change-summary-card glass-panel">
            <div className="summary-section-col">
              <span className="summary-col-title text-emerald">
                ✓ Changes Made to Scene:
              </span>
              <ul className="summary-bullets-list">
                {remixResult.changesMade && remixResult.changesMade.map((chg, idx) => (
                  <li key={idx} className="summary-bullet-item">
                    <Check size={13} className="text-emerald check-bullet" />
                    <span>{chg}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="summary-section-col">
              <span className="summary-col-title text-indigo">
                🎯 Audience Problems Addressed:
              </span>
              <ul className="summary-bullets-list">
                {remixResult.problemsAddressed && remixResult.problemsAddressed.map((prob, idx) => (
                  <li key={idx} className="summary-bullet-item">
                    <span className="target-bullet">•</span>
                    <span>{prob}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer Creator Action Toolbar */}
        <div className="remix-modal-footer">
          <div className="remix-footer-left">
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
            >
              Keep Original
            </Button>
          </div>

          <div className="remix-footer-right">
            <Button
              variant="secondary"
              size="md"
              icon={<FileEdit size={14} />}
              onClick={() => {
                if (remixResult?.improvedContent) {
                  onEditImprovedScene(remixResult.improvedContent);
                  onClose();
                }
              }}
              disabled={!remixResult?.improvedContent || isGenerating}
            >
              Edit Improved Version
            </Button>

            <Button
              variant="amber"
              size="md"
              icon={<Check size={15} />}
              onClick={() => {
                if (remixResult?.improvedContent) {
                  onApplyImprovedScene(remixResult.improvedContent);
                  onClose();
                }
              }}
              disabled={!remixResult?.improvedContent || isGenerating}
            >
              Use Improved Version
            </Button>

            <Button
              variant="primary"
              size="md"
              icon={<Play size={15} />}
              onClick={() => {
                if (remixResult?.improvedContent) {
                  onSimulateImprovedScene(remixResult.improvedContent);
                  onClose();
                }
              }}
              disabled={!remixResult?.improvedContent || isGenerating}
              className="simulate-improved-cta"
            >
              Simulate Improved Version
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
