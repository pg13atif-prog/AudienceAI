import React from 'react';
import { Film, Feather, Compass, Heart, Sparkles, Clock, AlertCircle, ArrowUpRight } from '../Common/Icons';
import Badge from '../Common/Badge';
import { consensusService } from '../../services/consensusService';
import './LiveReactionFeed.css';

/**
 * Live Reaction Feed Component
 * Chronologically streams incoming simulated audience reactions
 * @param {Object} props
 * @param {Array<Object>} props.reactions
 * @param {Function} [props.onSelectReaction]
 */
export default function LiveReactionFeed({
  reactions = [],
  onSelectReaction
}) {
  const getPersonaIcon = (iconName) => {
    switch (iconName) {
      case 'Film': return <Film size={18} />;
      case 'Feather': return <Feather size={18} />;
      case 'Compass': return <Compass size={18} />;
      case 'Heart': return <Heart size={18} />;
      default: return <Sparkles size={18} />;
    }
  };

  if (!reactions || reactions.length === 0) {
    return (
      <div className="reaction-feed-empty glass-panel">
        <Clock size={20} className="text-muted" />
        <p>Awaiting live simulated audience reactions...</p>
      </div>
    );
  }

  return (
    <div className="live-reaction-feed glass-panel">
      <div className="feed-header">
        <div className="feed-title-wrap">
          <span className="feed-live-dot" />
          <h3 className="feed-title">Live Reaction Feed</h3>
          <span className="feed-disclaimer">Simulated Audience</span>
        </div>
        <span className="feed-count-badge">
          {reactions.length} Viewpoints Generated
        </span>
      </div>

      <div className="feed-items-list">
        {reactions.map((reaction, index) => {
          const keyIssue = consensusService.extractKeyIssue(reaction);
          const sequenceNum = index + 1;

          return (
            <div 
              key={reaction.personaId || index} 
              className={`feed-item-card feed-${reaction.colorKey || 'casual'}`}
              onClick={() => onSelectReaction?.(reaction)}
              title="Click to inspect complete viewpoint reaction"
            >
              {/* Top Row: Sequence, Persona Name & Overall Score */}
              <div className="feed-item-top">
                <div className="feed-persona-identity">
                  <div className="feed-avatar-box">
                    {getPersonaIcon(reaction.icon)}
                  </div>
                  <div>
                    <div className="feed-persona-name-row">
                      <h4 className="feed-persona-name">{reaction.personaName}</h4>
                      <span className="feed-seq-tag">Reaction #{sequenceNum}</span>
                    </div>
                    <span className="feed-persona-archetype">Simulated Viewpoint</span>
                  </div>
                </div>

                <div className="feed-score-badge">
                  <span className="feed-score-num">{reaction.overallScore}</span>
                  <span className="feed-score-denom">/100</span>
                </div>
              </div>

              {/* Persona Reaction Quote */}
              <div className="feed-quote-wrap">
                <p className="feed-quote-text">"{reaction.reaction}"</p>
              </div>

              {/* Key Issue / Observation Pill */}
              {keyIssue && (
                <div className="feed-issue-highlight">
                  <span className="feed-issue-tag">Key Focus:</span>
                  <span className="feed-issue-text">{keyIssue}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
