import React from 'react';
import { Film, Feather, Compass, Heart, Check, Sparkles, CheckCircle2, Sliders } from '../Common/Icons';
import Badge from '../Common/Badge';
import './PersonaCard.css';

/**
 * Enhanced PersonaCard for Phase 3 Persona Selection & Configuration
 * @param {Object} props
 * @param {Object} props.persona
 * @param {boolean} [props.isSelected=true]
 * @param {Function} [props.onToggleSelect]
 * @param {boolean} [props.isLastSelected=false]
 */
export default function PersonaCard({
  persona,
  isSelected = true,
  onToggleSelect,
  isLastSelected = false
}) {
  const getPersonaIcon = (iconName) => {
    switch (iconName) {
      case 'Film': return <Film size={20} />;
      case 'Feather': return <Feather size={20} />;
      case 'Compass': return <Compass size={20} />;
      case 'Heart': return <Heart size={20} />;
      default: return <Sparkles size={20} />;
    }
  };

  const handleCardClick = () => {
    if (onToggleSelect) {
      onToggleSelect(persona.id);
    }
  };

  return (
    <div 
      className={`persona-card persona-${persona.colorKey} glass-panel ${isSelected ? 'selected' : 'unselected'}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-pressed={isSelected}
      title={isLastSelected && isSelected ? "At least one persona must remain active" : isSelected ? "Click to exclude persona" : "Click to include persona"}
    >
      {/* Top Header Row with Icon, Title, and Selection Checkbox/Badge */}
      <div className="persona-card-header">
        <div className="persona-avatar-wrapper">
          <div className="persona-avatar-icon">
            {getPersonaIcon(persona.icon)}
          </div>
          <div className="persona-identity">
            <h3 className="persona-name">{persona.name}</h3>
            <span className="persona-archetype">{persona.archetype}</span>
          </div>
        </div>

        {/* Interactive Selection Pill / Checkbox */}
        <div className={`persona-selection-toggle ${isSelected ? 'active' : 'inactive'}`}>
          <div className="toggle-checkbox">
            {isSelected && <Check size={12} strokeWidth={3} />}
          </div>
          <span className="toggle-label">
            {isSelected ? 'Active' : 'Excluded'}
          </span>
        </div>
      </div>

      {/* Short Description */}
      <div className="persona-card-summary">
        <p>{persona.description}</p>
      </div>

      {/* Personality & Evaluation Mindset */}
      <div className="persona-card-perspective-box">
        <span className="persona-perspective-label">Persona Evaluation Mindset:</span>
        <p className="persona-perspective-text">{persona.personalityDescription}</p>
      </div>

      {/* Focus Areas List */}
      <div className="persona-card-questions">
        <span className="persona-section-title">Core Evaluation Focus:</span>
        <ul className="persona-questions-list">
          {persona.focusAreas && persona.focusAreas.map((area, idx) => (
            <li key={idx} className="persona-question-item">
              <span className="persona-question-bullet">•</span>
              <span>{area}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Meta & Sensitivity */}
      <div className="persona-card-footer">
        <div className="persona-tuning-row">
          <Sliders size={12} />
          <span>{persona.defaultSensitivity || 'Default Sensitivity'}</span>
        </div>
        <span className="persona-click-hint">
          {isSelected ? 'Click to disable' : 'Click to enable'}
        </span>
      </div>
    </div>
  );
}
