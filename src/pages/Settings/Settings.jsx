import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Sliders, 
  Moon, 
  Shield, 
  Sparkles, 
  Database, 
  Check,
  Eye,
  AlertCircle,
  ArrowUpRight
} from '../../components/Common/Icons';
import PageHeader from '../../components/Common/PageHeader';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import { apiKeyService } from '../../services/apiKeyService';
import './Settings.css';

/**
 * Settings Page with Gemini API Key Management
 */
export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [criticStrictness, setCriticStrictness] = useState('High');
  const [pacingSensitivity, setPacingSensitivity] = useState('Balanced');
  
  // API Key State
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [keySavedMessage, setKeySavedMessage] = useState(null);

  useEffect(() => {
    setApiKey(apiKeyService.getKey());
  }, []);

  const handleSaveApiKey = () => {
    apiKeyService.setKey(apiKey);
    setKeySavedMessage('API Key updated successfully!');
    setTimeout(() => setKeySavedMessage(null), 3000);
  };

  const handleSavePreferences = () => {
    apiKeyService.setKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="settings-page">
      <PageHeader
        title="Settings & Simulation Preferences"
        subtitle="Configure Gemini AI credentials, audience persona evaluation parameters, and creative workspace options."
        tagline="AudienceAI Suite"
        actions={
          <Button
            variant="primary"
            size="md"
            icon={saved ? <Check size={16} /> : <Sliders size={16} />}
            onClick={handleSavePreferences}
          >
            {saved ? 'Saved' : 'Save Preferences'}
          </Button>
        }
      />

      <div className="settings-grid">
        {/* Section 1: Gemini AI Credentials */}
        <div className="settings-card glass-panel">
          <div className="settings-card-header">
            <Sparkles size={18} className="settings-icon text-amber" />
            <div>
              <h3 className="settings-card-title">Google Gemini AI Credentials</h3>
              <span className="settings-card-subtitle">Powers live audience viewpoint simulation</span>
            </div>
          </div>

          <div className="settings-options-list">
            <div className="setting-item-vertical">
              <div className="api-setting-label-row">
                <span className="setting-name">Gemini API Key</span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="api-help-link"
                >
                  <span>Get Free Key (Google AI Studio)</span>
                  <ArrowUpRight size={12} />
                </a>
              </div>
              <p className="setting-desc">
                Enables live audience persona reactions and 6-dimension story analytics.
              </p>

              <div className="api-key-input-row">
                <div className="api-input-container">
                  <input
                    type={showKey ? 'text' : 'password'}
                    className="settings-api-input"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API key (AIzaSy...)"
                  />
                  <button
                    type="button"
                    className="settings-toggle-btn"
                    onClick={() => setShowKey(!showKey)}
                    title={showKey ? "Hide key" : "Show key"}
                  >
                    <Eye size={15} />
                  </button>
                </div>
                <Button
                  variant="secondary"
                  size="md"
                  icon={<Check size={14} />}
                  onClick={handleSaveApiKey}
                >
                  Update Key
                </Button>
              </div>

              {keySavedMessage && (
                <div className="api-success-tag">
                  <Check size={12} />
                  <span>{keySavedMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Audience Persona Evaluation Defaults */}
        <div className="settings-card glass-panel">
          <div className="settings-card-header">
            <Sliders size={18} className="settings-icon" />
            <div>
              <h3 className="settings-card-title">Audience Evaluation Defaults</h3>
              <span className="settings-card-subtitle">Persona sensitivity weighting</span>
            </div>
          </div>

          <div className="settings-options-list">
            <div className="setting-item">
              <div>
                <span className="setting-name">Story Critic Strictness</span>
                <p className="setting-desc">How aggressively the Critic flags exposition, pacing dips, and cliché tropes.</p>
              </div>
              <select
                className="setting-select"
                value={criticStrictness}
                onChange={(e) => setCriticStrictness(e.target.value)}
              >
                <option value="Moderate">Moderate</option>
                <option value="High">High (Recommended)</option>
                <option value="Brutal">Brutal / Festival Level</option>
              </select>
            </div>

            <div className="setting-item">
              <div>
                <span className="setting-name">Pacing Curve Sensitivity</span>
                <p className="setting-desc">Threshold for detecting dialogue stalls and scene lulls.</p>
              </div>
              <select
                className="setting-select"
                value={pacingSensitivity}
                onChange={(e) => setPacingSensitivity(e.target.value)}
              >
                <option value="Relaxed">Relaxed</option>
                <option value="Balanced">Balanced</option>
                <option value="Aggressive">Aggressive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Screenplay & Editor Display */}
        <div className="settings-card glass-panel">
          <div className="settings-card-header">
            <Moon size={18} className="settings-icon" />
            <div>
              <h3 className="settings-card-title">Editor Environment</h3>
              <span className="settings-card-subtitle">Script formatting & typography</span>
            </div>
          </div>

          <div className="settings-options-list">
            <div className="setting-item">
              <div>
                <span className="setting-name">Editor Typography</span>
                <p className="setting-desc">Screenplay monospace font style.</p>
              </div>
              <select className="setting-select" defaultValue="JetBrains Mono">
                <option value="JetBrains Mono">JetBrains Mono (Modern)</option>
                <option value="Courier New">Courier New (Classic Screenplay)</option>
              </select>
            </div>

            <div className="setting-item">
              <div>
                <span className="setting-name">Cinematic Dark Theme</span>
                <p className="setting-desc">Obsidian & Amber dark mode interface.</p>
              </div>
              <Badge variant="amber" size="sm">Active (Cinematic)</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
