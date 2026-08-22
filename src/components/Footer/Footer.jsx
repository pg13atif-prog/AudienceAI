import React from 'react';
import { Film, Sparkles } from '../Common/Icons';
import './Footer.css';

export default function Footer({ onNavigate }) {
  return (
    <footer className="audienceai-footer">
      <div className="footer-inner">
        <div className="footer-brand-col">
          <div className="footer-logo">
            <Film size={18} className="text-amber" />
            <span className="footer-brand-text">
              Audience<span className="footer-brand-ai">AI</span>
            </span>
          </div>
          <p className="footer-tagline">
            "See Your Story Through Their Eyes." Real-time multi-persona audience simulation engine for screenwriters and creators.
          </p>
        </div>

        <div className="footer-links-col">
          <span className="footer-col-heading">WORKSPACE</span>
          <div className="footer-nav-links">
            <button type="button" className="footer-nav-btn" onClick={() => onNavigate?.('dashboard')}>Dashboard</button>
            <button type="button" className="footer-nav-btn" onClick={() => onNavigate?.('editor')}>Scene Editor</button>
            <button type="button" className="footer-nav-btn" onClick={() => onNavigate?.('simulation')}>Simulate</button>
            <button type="button" className="footer-nav-btn" onClick={() => onNavigate?.('insights')}>Insights & Diagnostics</button>
            <button type="button" className="footer-nav-btn" onClick={() => onNavigate?.('history')}>Version Archive</button>
          </div>
        </div>

        <div className="footer-status-col">
          <span className="footer-col-heading">SYSTEM STATUS</span>
          <div className="footer-status-card">
            <div className="status-indicator-row">
              <span className="status-live-dot" />
              <span className="status-live-label">Multi-Agent Engine Active</span>
            </div>
            <p className="status-meta-text">
              Gemini 2.5 Flash • Groq Llama 3.3 • OpenRouter Gateway
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <span className="footer-copy">
          © {new Date().getFullYear()} AudienceAI • Advanced Cinematic Narrative Simulation
        </span>
        <div className="footer-bottom-tags">
          <span className="footer-tag">v2.4.0 High-Fidelity</span>
          <span className="footer-tag">Firebase Cloud Sync</span>
        </div>
      </div>
    </footer>
  );
}
