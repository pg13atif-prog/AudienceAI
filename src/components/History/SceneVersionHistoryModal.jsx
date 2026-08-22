import React, { useState } from 'react';
import { 
  Clock, 
  Sparkles, 
  FileText, 
  Check, 
  X, 
  RotateCcw, 
  ArrowRight, 
  FileEdit,
  Layers,
  History as HistoryIcon
} from '../Common/Icons';
import Badge from '../Common/Badge';
import Button from '../Common/Button';
import { historyService } from '../../services/historyService';
import './SceneVersionHistoryModal.css';

/**
 * SceneVersionHistoryModal
 * Allows comparing Original vs Previous Remix vs Latest Version
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Object} props.scene
 * @param {Function} props.onRestoreVersion - (versionContent) => void
 */
export default function SceneVersionHistoryModal({
  isOpen,
  onClose,
  scene,
  onRestoreVersion
}) {
  const versions = historyService.getSceneVersions(scene);
  const [selectedVersionIdx, setSelectedVersionIdx] = useState(versions.length - 1);
  const [compareVersionIdx, setCompareVersionIdx] = useState(0);
  const [viewMode, setViewMode] = useState('split'); // 'split' | 'single'

  if (!isOpen || !scene) return null;

  const currentVersion = versions[selectedVersionIdx] || versions[0];
  const compareVersion = versions[compareVersionIdx] || versions[0];

  return (
    <div className="version-modal-backdrop" onClick={onClose}>
      <div className="version-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="version-modal-header">
          <div className="version-header-left">
            <div className="version-icon-box">
              <HistoryIcon size={20} className="text-amber" />
            </div>
            <div>
              <div className="version-badge-row">
                <Badge variant="amber" size="sm">Scene Version History</Badge>
                <span className="version-scene-subtitle">{scene.subtitle || 'Act I • Scene 1'}</span>
              </div>
              <h2 className="version-modal-title">{scene.title || 'Untitled Scene'} — Version Archives</h2>
            </div>
          </div>

          <div className="version-header-right">
            <div className="version-view-mode-selector">
              <button
                type="button"
                className={`version-mode-tab ${viewMode === 'split' ? 'active' : ''}`}
                onClick={() => setViewMode('split')}
              >
                Compare 2 Versions
              </button>
              <button
                type="button"
                className={`version-mode-tab ${viewMode === 'single' ? 'active' : ''}`}
                onClick={() => setViewMode('single')}
              >
                Single Version View
              </button>
            </div>

            <button type="button" className="version-modal-close" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Timeline Version Selector Strip */}
        <div className="version-timeline-strip glass-panel">
          <span className="timeline-label">Select Versions to Compare:</span>
          <div className="timeline-versions-list">
            {versions.map((ver, idx) => {
              const isSelected = idx === selectedVersionIdx;
              const isCompare = idx === compareVersionIdx && viewMode === 'split';

              return (
                <div
                  key={idx}
                  className={`version-timeline-chip ${isSelected ? 'selected' : ''} ${isCompare ? 'comparing' : ''}`}
                  onClick={() => {
                    if (viewMode === 'split') {
                      if (selectedVersionIdx !== idx) {
                        setSelectedVersionIdx(idx);
                      }
                    } else {
                      setSelectedVersionIdx(idx);
                    }
                  }}
                >
                  <div className="version-chip-top">
                    <span className="version-chip-name">{ver.label}</span>
                    <Badge variant={ver.badge === 'Active Draft' ? 'emerald' : 'muted'} size="sm">
                      {ver.badge}
                    </Badge>
                  </div>
                  <div className="version-chip-meta">
                    <span>{ver.wordCount} words</span>
                    <span>•</span>
                    <span>{ver.formattedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison Body */}
        <div className={`version-comparison-body ${viewMode}`}>
          {/* Left Pane (Base or Original Version) */}
          {viewMode === 'split' && (
            <div className="version-script-pane glass-panel">
              <div className="pane-header">
                <div className="pane-title-group">
                  <FileText size={15} className="text-muted" />
                  <span className="pane-name">{compareVersion.label}</span>
                  <Badge variant="muted" size="sm">{compareVersion.badge}</Badge>
                </div>
                <span className="pane-meta">{compareVersion.wordCount} words</span>
              </div>
              <div className="pane-script-content">
                <pre className="script-code">{compareVersion.content}</pre>
              </div>
            </div>
          )}

          {/* Right / Main Pane (Selected / Latest Version) */}
          <div className="version-script-pane highlight-pane glass-panel">
            <div className="pane-header">
              <div className="pane-title-group">
                <Sparkles size={15} className="text-amber" />
                <span className="pane-name text-amber">{currentVersion.label}</span>
                <Badge variant={currentVersion.badge === 'Active Draft' ? 'emerald' : 'amber'} size="sm">
                  {currentVersion.badge}
                </Badge>
              </div>
              <span className="pane-meta">{currentVersion.wordCount} words</span>
            </div>
            <div className="pane-script-content">
              <pre className="script-code">{currentVersion.content}</pre>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="version-modal-footer">
          <div className="version-footer-left">
            <span className="footer-status-text">
              Viewing <strong>{currentVersion.label}</strong> ({currentVersion.wordCount} words)
            </span>
          </div>

          <div className="version-footer-right">
            <Button
              variant="secondary"
              size="md"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={<RotateCcw size={14} />}
              onClick={() => {
                if (onRestoreVersion && currentVersion.content) {
                  onRestoreVersion(currentVersion.content);
                  onClose();
                }
              }}
            >
              Restore this Version
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
