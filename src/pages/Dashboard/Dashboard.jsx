import React from 'react';
import EngagementChart from '../../components/Charts/EngagementChart';
import PredictionGauge from '../../components/Charts/PredictionGauge';
import StatWidget from '../../components/Cards/StatWidget';
import './Dashboard.css';

export default function Dashboard({ scenes = [], activeScene, onSelectScene, onNewSimulation, onSimulate, onViewInsights, onLoadDemo }) {
  return (
    <div className="aai-dashboard-exact">
      {/* â”€â”€ Top Area: Hero + Personas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="aai-dashboard-top-row">
        
        <div className="aai-hero-card glass-panel">
          <div className="aai-hero-header">
            <div className="aai-hero-logo-icon">A</div>
            <span>AUDIENCEAI SIMULATOR</span>
          </div>
          
          <h1 className="aai-hero-title">Ready to test your next scene?</h1>
          <p className="aai-hero-tagline">SEE YOUR STORY THROUGH THEIR EYES.</p>
          <p className="aai-hero-subtext">
            Enter your context file, dialogue, and character motivation to simulate
            experience and even: See your story through their eyes.
          </p>
          
          <div className="aai-hero-actions">
            <button className="aai-btn-gradient" onClick={onNewSimulation}>New Simulation</button>
            <button className="aai-btn-outline" onClick={() => scenes.length > 0 ? onSelectScene?.(scenes[0]) : onNewSimulation?.()}>Open Active Scene</button>
          </div>
        </div>

        <div className="aai-personas-grid">
          {/* Persona 1 */}
          <div className="aai-persona-item">
            <div className="aai-persona-icon" style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}>
              <img src="/personas/casual_viewer.jpg" alt="Casual Viewer" />
            </div>
            <div className="aai-persona-text">
              <h4>Casual Viewer</h4>
              <p>Casual viewer and new story enthusiasts.</p>
            </div>
          </div>

          {/* Persona 2 */}
          <div className="aai-persona-item">
            <div className="aai-persona-icon" style={{ boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)' }}>
              <img src="/personas/story_critic.jpg" alt="Story Critic" />
            </div>
            <div className="aai-persona-text">
              <h4>Story Critic</h4>
              <p>Create a powerful story narrative arc.</p>
            </div>
          </div>

          {/* Persona 3 */}
          <div className="aai-persona-item">
            <div className="aai-persona-icon" style={{ boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>
              <img src="/personas/lore_enthusiast.jpg" alt="Lore Enthusiast" />
            </div>
            <div className="aai-persona-text">
              <h4>Lore Enthusiast</h4>
              <p>Enthusiastic about lore and world logic.</p>
            </div>
          </div>

          {/* Persona 4 */}
          <div className="aai-persona-item">
            <div className="aai-persona-icon" style={{ boxShadow: '0 0 20px rgba(244, 63, 94, 0.4)' }}>
              <img src="/personas/emotional_fan.jpg" alt="Emotional Fan" />
            </div>
            <div className="aai-persona-text">
              <h4>Emotional Fan</h4>
              <p>Drawn to empathy and character arcs.</p>
            </div>
          </div>
        </div>
      </div>

      {/* â”€â”€ Middle Area: Chart + Stats â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="aai-dashboard-middle-row">
        <div className="aai-chart-wrapper">
          <EngagementChart />
        </div>
        <div className="aai-stats-col">
          <StatWidget 
            icon={(<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>)} 
            title="Laughter Peaks:" 
            value="5" 
            color="cyan" 
          />
          <StatWidget 
            icon={(<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>)} 
            title="Emotional Resonance:" 
            value="High" 
            color="green" 
          />
        </div>
      </div>

      {/* â”€â”€ Bottom Area: Insights â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="aai-dashboard-bottom-row">
        <div className="aai-insight-card glass-panel" style={{ borderColor: 'rgba(168, 85, 247, 0.4)', boxShadow: '0 0 16px rgba(168, 85, 247, 0.1)' }}>
          <h4 className="aai-insight-title">Script Analysis (Act 1)</h4>
          <p className="aai-insight-text">
            <strong>Scene 4: Dialogue - </strong><br />
            Tension Rating: High.<br />
            Subtext Detected.
          </p>
          <p className="aai-insight-subtext">
            Scene 4: Dialogue - Tension creates a climax while pushing the antagonist, creating suspense.
          </p>
        </div>

        <div className="aai-insight-card glass-panel" style={{ borderColor: 'rgba(0, 224, 255, 0.4)', boxShadow: '0 0 16px rgba(0, 224, 255, 0.1)' }}>
          <h4 className="aai-insight-title">Feedback Summary</h4>
          <ul className="aai-insight-list">
            <li>â€¢ Strong Emotional Connection to Protagonist</li>
            <li>â€¢ Pacing in Act 3 Needs Adjustment</li>
            <li>â€¢ Recommended: Deepen Antagonist's Motivation</li>
          </ul>
        </div>

        <PredictionGauge value={85} size={150} />
      </div>

    </div>
  );
}
