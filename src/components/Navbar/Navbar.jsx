import React, { useState } from 'react';
import { 
  Film, 
  ChevronRight, 
  Menu, 
  Sparkles, 
  Play, 
  FileEdit, 
  BarChart3, 
  Sliders, 
  Check,
  Zap,
  RotateCcw
} from '../Common/Icons';
import Badge from '../Common/Badge';
import Button from '../Common/Button';
import './Navbar.css';

/**
 * Top Navbar with Workflow Breadcrumb & Demo Mode Controls
 * @param {Object} props
 * @param {string} props.activeRoute
 * @param {Function} props.onNavigate
 * @param {Object} props.activeScene
 * @param {Array} props.allScenes
 * @param {Function} props.onSelectScene
 * @param {Function} props.onToggleMobileMenu
 * @param {boolean} props.isDemoMode
 * @param {Function} props.onToggleDemoMode
 */
export default function Navbar({
  activeRoute,
  onNavigate,
  activeScene,
  allScenes = [],
  onSelectScene,
  onToggleMobileMenu,
  isDemoMode = false,
  onToggleDemoMode
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Determine current workflow stage number and title
  const getWorkflowStage = () => {
    switch (activeRoute) {
      case 'dashboard': return { step: 1, label: 'Workspace Overview' };
      case 'editor': return { step: 2, label: 'Step 1 of 5 • Scene Authoring' };
      case 'simulation': return { step: 3, label: 'Step 2 of 5 • Audience Setup & Simulation' };
      case 'insights': return { step: 4, label: 'Step 3 of 5 • Story Analytics & Problem Detection' };
      case 'history': return { step: 5, label: 'Step 4 of 5 • Version Archives & Audit Log' };
      case 'settings': return { step: 6, label: 'Workspace Settings' };
      default: return { step: 1, label: 'Creative Suite' };
    }
  };

  const workflow = getWorkflowStage();

  return (
    <header className="app-navbar glass-panel">
      <div className="navbar-left">
        {/* Mobile Hamburger */}
        <button 
          type="button" 
          className="mobile-menu-trigger"
          onClick={onToggleMobileMenu}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Workflow Breadcrumb Navigation */}
        <div className="navbar-breadcrumb">
          <span 
            className="breadcrumb-root"
            onClick={() => onNavigate('dashboard')}
          >
            AudienceAI
          </span>
          <ChevronRight size={14} className="breadcrumb-arrow" />

          {/* Scene Dropdown Selector */}
          <div className="breadcrumb-scene-picker">
            <button
              type="button"
              className="scene-picker-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="scene-current-name">
                {activeScene?.title || 'Select a Scene'}
              </span>
              <span className="scene-picker-caret">▾</span>
            </button>

            {dropdownOpen && (
              <div className="scene-dropdown-menu glass-panel">
                <div className="dropdown-header">
                  <span>Switch Active Story Scene</span>
                </div>
                <div className="dropdown-items">
                  {allScenes.map((scene) => (
                    <button
                      key={scene.id}
                      type="button"
                      className={`dropdown-item ${activeScene?.id === scene.id ? 'active' : ''}`}
                      onClick={() => {
                        onSelectScene(scene);
                        setDropdownOpen(false);
                      }}
                    >
                      <div className="dropdown-item-info">
                        <span className="item-title">{scene.title}</span>
                        <span className="item-sub">{scene.subtitle || scene.genre}</span>
                      </div>
                      {activeScene?.id === scene.id && <Check size={14} className="text-amber" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="navbar-right">
        {/* Workflow Stage Pill */}
        <div className="navbar-stage-pill">
          <span className="stage-pulse-dot" />
          <span className="stage-text">{workflow.label}</span>
        </div>

        {/* Demo Mode Toggle Switch */}
        <button
          type="button"
          className={`demo-mode-toggle ${isDemoMode ? 'active' : ''}`}
          onClick={onToggleDemoMode}
          title="Toggle Demo Mode with preloaded scene 'The Betrayal'"
        >
          <Zap size={13} className={isDemoMode ? 'text-amber' : 'text-muted'} />
          <span>{isDemoMode ? '⚡ Demo Mode (Active)' : 'Load Demo Scene'}</span>
        </button>

        {/* Quick Action Navigation Buttons */}
        <div className="navbar-nav-shortcuts">
          <button
            type="button"
            className={`nav-shortcut-btn ${activeRoute === 'editor' ? 'active' : ''}`}
            onClick={() => onNavigate('editor')}
            title="Scene Editor"
          >
            <FileEdit size={14} />
            <span>Editor</span>
          </button>
          <button
            type="button"
            className={`nav-shortcut-btn ${activeRoute === 'simulation' ? 'active' : ''}`}
            onClick={() => onNavigate('simulation')}
            title="Audience Simulation"
          >
            <Play size={14} />
            <span>Simulate</span>
          </button>
          <button
            type="button"
            className={`nav-shortcut-btn ${activeRoute === 'insights' ? 'active' : ''}`}
            onClick={() => onNavigate('insights')}
            title="Audience Insights & Diagnostics"
          >
            <BarChart3 size={14} />
            <span>Insights</span>
          </button>
        </div>
      </div>
    </header>
  );
}
