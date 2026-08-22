import React from 'react';
import { 
  Plus, 
  Sparkles, 
  BookOpen, 
  Users, 
  ArrowRight, 
  Play, 
  Film, 
  Feather,
  Compass, 
  Heart, 
  Zap,
  BarChart3,
  CheckCircle2
} from '../../components/Common/Icons';
import PageHeader from '../../components/Common/PageHeader';
import Button from '../../components/Common/Button';
import SceneCard from '../../components/Cards/SceneCard';
import Badge from '../../components/Common/Badge';
import './Dashboard.css';

/**
 * Viewport-optimized Dashboard Page
 * @param {Object} props
 * @param {Array} props.scenes
 * @param {Function} props.onSelectScene
 * @param {Function} props.onNewSimulation
 * @param {Function} props.onSimulate
 * @param {Function} props.onViewInsights
 * @param {Function} props.onLoadDemo
 */
export default function Dashboard({
  scenes = [],
  onSelectScene,
  onNewSimulation,
  onSimulate,
  onViewInsights,
  onLoadDemo
}) {
  return (
    <div className="dashboard-page">
      {/* ── 1. Hero Section ──────────────────────────────────────────────── */}
      <section className="dashboard-hero glass-panel">
        <div className="hero-content">
          <div className="hero-badge-wrap">
            <Badge variant="amber" size="sm" icon={<Sparkles size={12} />}>
              AudienceAI Simulation Engine
            </Badge>
            <span className="hero-pill-tag">v2.4 Active</span>
          </div>

          <h1 className="hero-heading">Ready to test your next scene?</h1>
          
          <p className="hero-tagline">
            "See Your Story Through Their Eyes."
          </p>
          
          <p className="hero-subtext">
            Simulate instant reactions across casual viewers, story critics, lore enthusiasts, 
            and emotional fans before you publish or produce.
          </p>

          <div className="hero-cta-group">
            <Button
              variant="primary"
              size="md"
              icon={<Plus size={16} />}
              onClick={onNewSimulation}
              className="hero-primary-btn"
            >
              New Simulation
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={<BookOpen size={15} />}
              onClick={() => scenes.length > 0 ? onSelectScene(scenes[0]) : onNewSimulation()}
            >
              {scenes.length > 0 ? 'Open Active Scene' : 'Start First Scene'}
            </Button>
          </div>
        </div>

        {/* Hero Persona Grid Preview */}
        <div className="hero-feature-preview">
          <div className="persona-mini-grid">
            <div className="persona-mini-card mini-casual">
              <div className="mini-card-head">
                <span className="mini-icon-avatar avatar-casual"><Film size={14} /></span>
                <span className="mini-title">Casual Viewer</span>
              </div>
              <span className="mini-tag">Hook & Pacing Lens</span>
            </div>

            <div className="persona-mini-card mini-critic">
              <div className="mini-card-head">
                <span className="mini-icon-avatar avatar-critic"><Feather size={14} /></span>
                <span className="mini-title">Story Critic</span>
              </div>
              <span className="mini-tag">Subtext & Arcs Lens</span>
            </div>

            <div className="persona-mini-card mini-lore">
              <div className="mini-card-head">
                <span className="mini-icon-avatar avatar-lore"><Compass size={14} /></span>
                <span className="mini-title">Lore Enthusiast</span>
              </div>
              <span className="mini-tag">World Logic Lens</span>
            </div>

            <div className="persona-mini-card mini-emotional">
              <div className="mini-card-head">
                <span className="mini-icon-avatar avatar-emotional"><Heart size={14} /></span>
                <span className="mini-title">Emotional Fan</span>
              </div>
              <span className="mini-tag">Empathy & Stakes Lens</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Recent Simulations Section ─────────────────────────────────── */}
      <section className="dashboard-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Recent Story Scenes</h2>
            <p className="section-subtitle">Scenes and narrative segments ready for audience testing</p>
          </div>

          <div className="section-actions-row">
            <Button
              variant="ghost"
              size="sm"
              iconRight={<ArrowRight size={13} />}
              onClick={onNewSimulation}
            >
              + Create Scene
            </Button>
          </div>
        </div>

        <div className="recent-scenes-grid">
          {scenes.slice(0, 4).map((scene) => (
            <SceneCard
              key={scene.id}
              scene={scene}
              onSelectScene={onSelectScene}
              onSimulate={onSimulate}
              onViewInsights={onViewInsights}
            />
          ))}
        </div>
      </section>

      {/* ── 3. Story Workflow Strip ───────────────────────────────────────── */}
      <section className="workflow-overview-strip glass-panel">
        <div className="workflow-step">
          <div className="step-number">01</div>
          <div className="step-info">
            <h4>Draft Scene</h4>
            <p>Write dialogue and character blocking in Scene Editor.</p>
          </div>
        </div>
        <div className="workflow-divider" />
        <div className="workflow-step">
          <div className="step-number">02</div>
          <div className="step-info">
            <h4>Simulate Personas</h4>
            <p>Test across casual, critic, lore, and emotional viewpoints.</p>
          </div>
        </div>
        <div className="workflow-divider" />
        <div className="workflow-step">
          <div className="step-number">03</div>
          <div className="step-info">
            <h4>Action Diagnostics</h4>
            <p>Review tension curves and apply surgical AI Scene Remixes.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
