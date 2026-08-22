import React, { useState } from 'react';
import { Sparkles, Check, AlertCircle, Eye, ArrowUpRight } from './Icons';
import Button from './Button';
import { apiKeyService } from '../../services/apiKeyService';
import './ApiKeyModal.css';

/**
 * ApiKeyModal for configuring Gemini API credentials
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} [props.onKeySaved]
 */
export default function ApiKeyModal({
  isOpen,
  onClose,
  onKeySaved
}) {
  const [keyInput, setKeyInput] = useState(apiKeyService.getKey());
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setError('Please enter a valid Gemini API Key.');
      return;
    }
    if (trimmed.length < 10) {
      setError('The API key seems too short. Please verify your Google AI Studio key.');
      return;
    }

    apiKeyService.setKey(trimmed);
    setError(null);
    setSavedSuccess(true);
    if (onKeySaved) onKeySaved(trimmed);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="api-modal-backdrop" onClick={onClose}>
      <div className="api-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="api-modal-header">
          <div className="api-modal-icon-glow">
            <Sparkles size={24} className="text-amber" />
          </div>
          <div>
            <h3 className="api-modal-title">Configure Gemini API Key</h3>
            <p className="api-modal-subtitle">
              AudienceAI utilizes Google Gemini to simulate independent fictional audience reactions.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="api-modal-form">
          <div className="api-input-group">
            <div className="api-label-row">
              <label className="api-field-label">Gemini API Key</label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="api-get-key-link"
              >
                <span>Get key from Google AI Studio</span>
                <ArrowUpRight size={12} />
              </a>
            </div>

            <div className="api-input-wrapper">
              <input
                type={showKey ? 'text' : 'password'}
                className={`api-key-input ${error ? 'input-error' : ''}`}
                value={keyInput}
                onChange={(e) => {
                  setKeyInput(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="AIzaSy..."
                autoFocus
              />
              <button
                type="button"
                className="api-toggle-visibility"
                onClick={() => setShowKey(!showKey)}
                title={showKey ? 'Hide key' : 'Show key'}
              >
                <Eye size={15} />
              </button>
            </div>

            {error && (
              <div className="api-error-msg">
                <AlertCircle size={13} />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="api-notice-box">
            <span className="api-notice-title">Security & Storage:</span>
            <p className="api-notice-text">
              Your API key is stored securely in your local browser's storage and directly communicates with 
              Google Gemini without intermediary tracking.
            </p>
          </div>

          <div className="api-modal-actions">
            <Button
              variant="secondary"
              size="md"
              type="button"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              type="submit"
              icon={savedSuccess ? <Check size={16} /> : <Sparkles size={16} />}
            >
              {savedSuccess ? 'Key Saved!' : 'Save & Connect'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
