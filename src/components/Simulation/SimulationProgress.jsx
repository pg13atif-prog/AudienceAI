import React from 'react';
import { Sparkles, Film, Feather, Compass, Heart, Check, AlertCircle } from '../Common/Icons';
import './SimulationProgress.css';

/**
 * Cinematic Simulation Progress Tracker
 * Displays persona-by-persona analysis progress with subtle animations
 * @param {Object} props
 * @param {Object} props.progress
 * @param {Object} props.scene
 */
export default function SimulationProgress({
  progress,
  scene
}) {
  const getPersonaIcon = (iconName) => {
    switch (iconName) {
      case 'Film': return <Film size={18} />;
      case 'Feather': return <Feather size={18} />;
      case 'Compass': return <Compass size={18} />;
      case 'Heart': return <Heart size={18} />;
      default: return <Sparkles size={18} />;
    }
  };

  const statuses = progress?.personaStatuses ? Object.values(progress.personaStatuses) : [];
  const completed = progress?.completedCount || 0;
  const total = progress?.totalCount || statuses.length || 4;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="sim-progress-overlay">
      <div className="sim-progress-card glass-panel">
        {/* Top Header */}
        <div className="sim-progress-header">
          <div className="progress-badge-row">
            <span className="sim-live-pulse-dot" />
            <span className="sim-live-tag">LIVE AUDIENCE SIMULATION</span>
          </div>

          <h2 className="sim-progress-title">Simulating Audience Viewpoints</h2>
          <p className="sim-progress-scene-name">
            Evaluating <strong>"{scene?.title || 'Target Scene'}"</strong> ({scene?.subtitle || 'Act I • Scene 1'})
          </p>
        </div>

        {/* Global Progress Bar */}
        <div className="sim-bar-wrapper">
          <div className="sim-bar-meta">
            <span>Overall Progress</span>
            <span className="sim-percent-text">{percent}%</span>
          </div>
          <div className="sim-bar-track">
            <div 
              className="sim-bar-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Persona-by-Persona Status List */}
        <div className="sim-persona-statuses-list">
          {statuses.map((item) => {
            const isAnalyzing = item.status === 'analyzing';
            const isCompleted = item.status === 'completed';
            const isPending = item.status === 'pending';
            const isError = item.status === 'error';

            return (
              <div 
                key={item.id} 
                className={`sim-persona-status-row ${item.status}`}
              >
                <div className="status-persona-identity">
                  <div className="status-avatar-icon">
                    {getPersonaIcon(item.icon)}
                  </div>
                  <div className="status-persona-info">
                    <span className="status-persona-name">{item.name}</span>
                    <span className="status-persona-sub">
                      {isAnalyzing && 'Analyzing scene from viewpoint...'}
                      {isCompleted && '✓ Reaction generated & calibrated'}
                      {isPending && 'Queued for evaluation'}
                      {isError && 'Analysis failed'}
                    </span>
                  </div>
                </div>

                <div className="status-indicator-badge">
                  {isAnalyzing && (
                    <div className="analyzing-pill">
                      <span className="spinner-dot" />
                      <span>Analyzing</span>
                    </div>
                  )}
                  {isCompleted && (
                    <div className="completed-pill">
                      <Check size={12} strokeWidth={3} />
                      <span>Done</span>
                    </div>
                  )}
                  {isPending && (
                    <div className="pending-pill">
                      <span>Waiting</span>
                    </div>
                  )}
                  {isError && (
                    <div className="error-pill">
                      <AlertCircle size={12} />
                      <span>Error</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Footer */}
        <div className="sim-progress-footer">
          <Sparkles size={14} className="text-amber" />
          <span>Gemini AI is independently evaluating pacing, tension, consistency, and emotional empathy.</span>
        </div>
      </div>
    </div>
  );
}
