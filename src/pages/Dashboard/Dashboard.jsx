import React from 'react';
import { 
  Plus, 
  Sparkles, 
  BookOpen, 
  Users, 
  ArrowRight, 
  Play, 
  Film, 
  Compass, 
  Flame, 
  BarChart3 
} from '../../components/Common/Icons';
import PageHeader from '../../components/Common/PageHeader';
import Button from '../../components/Common/Button';
import SceneCard from '../../components/Cards/SceneCard';
import Badge from '../../components/Common/Badge';
import './Dashboard.css';

/**
 * Dashboard Page
 * @param {Object} props
 * @param {Array} props.scenes
 * @param {Function} props.onSelectScene
 * @param {Function} props.onNewSimulation
 * @param {Function} props.onSimulate
 * @param {Function} props.onViewInsights
 */
export default function Dashboard({
  scenes = [],
  onSelectScene,
  onNewSimulation,
  onSimulate,
  onViewInsights
}) {
  return (
    <div className="dashboard-page">
      {/* Hero Welcome Section */}
      <section className="dashboard-hero glass-panel">
        <div className="hero-content">
          <div className="hero-badge-wrap">
            <Badge variant="amber" size="sm" icon={<Sparkles size={12} />}>
              AudienceAI Simulator
            </Badge>
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
              size="lg"
              icon={<Plus size={18} />}
              onClick={onNewSimulation}
              className="hero-primary-btn"
            >
              + New Simulation
            </Button>
            <Button
              variant="secondary"
              size="lg"
              icon={<BookOpen size={16} />}
              onClick={() => scenes.length > 0 ? onSelectScene(scenes[0]) : onNewSimulation()}
            >
              {scenes.length > 0 ? 'Open Active Scene' : 'Start First Scene'}
            </Button>
          </div>
        </div>

        {/* Hero Visual Feature Highlight */}
        <div className="hero-feature-preview">
          <div className="persona-mini-grid">
            <div className="persona-mini-card mini-casual">
              <span className="mini-icon">🍿</span>
              <span className="mini-title">Casual Viewer</span>
              <span className="mini-tag">Hook & Pacing</span>
            </div>
            <div className="persona-mini-card mini-critic">
              <span className="mini-icon">🪶</span>
              <span className="mini-title">Story Critic</span>
              <span className="mini-tag">Subtext & Arcs</span>
            </div>
            <div className="persona-mini-card mini-lore">
              <span className="mini-icon">🧭</span>
              <span className="mini-title">Lore Enthusiast</span>
              <span className="mini-tag">World Logic</span>
            </div>
            <div className="persona-mini-card mini-emotional">
              <span className="mini-icon">❤️</span>
              <span className="mini-title">Emotional Fan</span>
              <span className="mini-tag">Empathy & Stakes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Simulations Section */}
      <section className="dashboard-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Recent Simulations</h2>
            <p className="section-subtitle">Scenes and story segments ready for review and audience testing</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            iconRight={<ArrowRight size={14} />}
            onClick={onNewSimulation}
          >
            Create Scene
          </Button>
        </div>

        <div className="recent-scenes-grid">
          {scenes.map((scene) => (
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

      {/* Story Workflow Quick Overview */}
      <section className="workflow-overview-strip glass-panel">
        <div className="workflow-step">
          <div className="step-number">01</div>
          <div className="step-info">
            <h4>Draft Scene</h4>
            <p>Write dialogue, context, and character intentions in the Scene Editor.</p>
          </div>
        </div>
        <div className="workflow-divider" />
        <div className="workflow-step">
          <div className="step-number">02</div>
          <div className="step-info">
            <h4>Configure Personas</h4>
            <p>Select target audience archetypes from casual readers to critical theorists.</p>
          </div>
        </div>
        <div className="workflow-divider" />
        <div className="workflow-step">
          <div className="step-number">03</div>
          <div className="step-info">
            <h4>Review Insights</h4>
            <p>Evaluate tension, emotional resonance, pacing, and continuity scores.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
