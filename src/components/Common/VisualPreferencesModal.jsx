import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './VisualPreferencesModal.css';

export default function VisualPreferencesModal({ isOpen, onClose }) {
  const { glassSettings, updateGlassSettings, resetGlassSettings, DEFAULT_GLASS } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="vp-overlay" onClick={onClose}>
      <div className="vp-modal glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="vp-header">
          <h2 className="vp-title">Visual Preferences</h2>
          <button type="button" className="vp-close" onClick={onClose}>✕</button>
        </div>

        {/* Live Preview */}
        <div className="vp-preview-container">
          <div
            className="vp-preview-card"
            style={{
              backdropFilter: `blur(${glassSettings.backdropBlur}px)`,
              WebkitBackdropFilter: `blur(${glassSettings.backdropBlur}px)`,
              background: `rgba(14, 17, 34, ${glassSettings.surfaceOpacity / 100})`,
            }}
          >
            <span className="vp-preview-label">Live Preview</span>
          </div>
        </div>

        {/* Controls */}
        <div className="vp-controls-section">
          <h3 className="vp-controls-title">Glass Intensity Customization Settings</h3>

          {/* Backdrop Blur */}
          <div className="vp-control-row">
            <div className="vp-control-icon vp-control-icon--blur">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10" strokeDasharray="4 4" />
              </svg>
            </div>
            <div className="vp-control-body">
              <div className="vp-control-label-row">
                <span className="vp-control-name">Backdrop Blur</span>
                <span className="vp-control-value-badge">{glassSettings.backdropBlur}px</span>
              </div>
              <input
                type="range"
                className="vp-slider"
                min="0"
                max="64"
                value={glassSettings.backdropBlur}
                onChange={(e) => updateGlassSettings({ backdropBlur: Number(e.target.value) })}
              />
              <div className="vp-slider-labels">
                <span>0px</span>
                <span>64px</span>
              </div>
            </div>
          </div>

          {/* Surface Opacity */}
          <div className="vp-control-row">
            <div className="vp-control-icon vp-control-icon--opacity">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
              </svg>
            </div>
            <div className="vp-control-body">
              <div className="vp-control-label-row">
                <span className="vp-control-name">Surface Opacity</span>
                <span className="vp-control-value-badge">{glassSettings.surfaceOpacity}%</span>
              </div>
              <input
                type="range"
                className="vp-slider"
                min="5"
                max="40"
                value={glassSettings.surfaceOpacity}
                onChange={(e) => updateGlassSettings({ surfaceOpacity: Number(e.target.value) })}
              />
              <div className="vp-slider-labels">
                <span>5%</span>
                <span>40%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="vp-footer">
          <button type="button" className="vp-btn vp-btn--ghost" onClick={resetGlassSettings}>
            Reset to Default
          </button>
          <button type="button" className="vp-btn vp-btn--primary" onClick={onClose}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
