import React from 'react';
import { 
  LayoutDashboard, 
  FileEdit, 
  PlayCircle, 
  BarChart3, 
  History, 
  Settings, 
  Plus, 
  Sparkles,
  Users,
  ChevronLeft,
  ChevronRight
} from '../Common/Icons';
import Button from '../Common/Button';
import './Sidebar.css';

/**
 * Sidebar navigation for AudienceAI
 * @param {Object} props
 * @param {string} props.activeRoute - 'dashboard' | 'editor' | 'simulation' | 'insights' | 'history' | 'settings'
 * @param {Function} props.onNavigate - (route: string) => void
 * @param {Function} props.onNewSimulation - () => void
 * @param {boolean} props.collapsed
 * @param {Function} props.onToggleCollapse
 * @param {boolean} props.mobileOpen
 * @param {Function} props.onCloseMobile
 */
export default function Sidebar({
  activeRoute,
  onNavigate,
  onNewSimulation,
  collapsed = false,
  onToggleCollapse,
  mobileOpen = false,
  onCloseMobile
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'editor', label: 'Scene Editor', icon: <FileEdit size={18} /> },
    { id: 'simulation', label: 'Audience Simulation', icon: <Users size={18} /> },
    { id: 'insights', label: 'Insights', icon: <BarChart3 size={18} /> },
    { id: 'history', label: 'History', icon: <History size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> }
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={onCloseMobile} />
      )}

      <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand" onClick={() => handleNavClick('dashboard')}>
          <div className="brand-logo-glow">
            <div className="brand-logo-inner">
              <Sparkles size={18} className="brand-logo-icon" />
            </div>
          </div>
          {!collapsed && (
            <div className="brand-info">
              <span className="brand-name">Audience<span className="brand-ai">AI</span></span>
              <span className="brand-tagline">Story Reaction Simulator</span>
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <div className="sidebar-cta-wrapper">
          <Button
            variant="primary"
            size={collapsed ? 'sm' : 'md'}
            icon={<Plus size={16} />}
            fullWidth={!collapsed}
            onClick={onNewSimulation}
            className="sidebar-new-simulation-btn"
            title="Create New Simulation"
          >
            {!collapsed && 'New Simulation'}
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <div className="sidebar-nav-section-title">
            {!collapsed && <span>Workspace</span>}
          </div>
          <ul className="sidebar-nav-list">
            {navItems.map((item) => {
              const isActive = activeRoute === item.id;
              return (
                <li key={item.id} className="sidebar-nav-item">
                  <button
                    className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="sidebar-nav-icon">{item.icon}</span>
                    {!collapsed && <span className="sidebar-nav-label">{item.label}</span>}
                    {isActive && <span className="sidebar-active-indicator" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer Info */}
        {!collapsed && (
          <div className="sidebar-footer">
            <div className="sidebar-persona-preview-box">
              <div className="sidebar-persona-dot-row">
                <span className="persona-dot dot-casual" title="Casual Viewer" />
                <span className="persona-dot dot-critic" title="Story Critic" />
                <span className="persona-dot dot-lore" title="Lore Enthusiast" />
                <span className="persona-dot dot-emotional" title="Emotional Viewer" />
              </div>
              <span className="sidebar-persona-text">4 Simulated Personas</span>
            </div>

            <div className="sidebar-version">
              <span>AudienceAI • Production Release</span>
            </div>
          </div>
        )}

        {/* Toggle Collapse Button on Desktop */}
        <button
          className="sidebar-collapse-toggle"
          onClick={onToggleCollapse}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </aside>
    </>
  );
}
