import React from 'react';
import { Clock, Play, FileText, ArrowUpRight, BarChart3 } from '../Common/Icons';
import Badge from '../Common/Badge';
import Button from '../Common/Button';
import './SceneCard.css';

/**
 * SceneCard component for Dashboard and History lists
 * @param {Object} props
 * @param {Object} props.scene
 * @param {Function} props.onSelectScene
 * @param {Function} props.onSimulate
 * @param {Function} props.onViewInsights
 */
export default function SceneCard({
  scene,
  onSelectScene,
  onSimulate,
  onViewInsights
}) {
  const getBadgeVariant = (status) => {
    switch (status) {
      case 'Completed': return 'emerald';
      case 'Needs Review': return 'amber';
      case 'Draft': return 'indigo';
      default: return 'muted';
    }
  };

  return (
    <div className="scene-card glass-panel-interactive">
      <div className="scene-card-header">
        <div className="scene-card-title-group">
          <div className="scene-card-badge-row">
            <Badge variant={getBadgeVariant(scene.status)} size="sm">
              {scene.status}
            </Badge>
            {scene.genre && (
              <span className="scene-card-genre">{scene.genre}</span>
            )}
          </div>
          <h3 className="scene-card-title" onClick={() => onSelectScene?.(scene)}>
            {scene.title}
          </h3>
          <p className="scene-card-subtitle">{scene.subtitle}</p>
        </div>
      </div>

      <div className="scene-card-body" onClick={() => onSelectScene?.(scene)}>
        <p className="scene-card-context-preview">
          {scene.context}
        </p>
      </div>

      <div className="scene-card-footer">
        <div className="scene-card-meta">
          <span className="scene-card-meta-item">
            <Clock size={13} />
            <span>{scene.lastSimulated}</span>
          </span>
          <span className="scene-card-meta-item">
            <FileText size={13} />
            <span>{scene.wordCount} words</span>
          </span>
        </div>

        <div className="scene-card-actions">
          <Button
            variant="ghost"
            size="sm"
            icon={<BarChart3 size={14} />}
            onClick={() => onViewInsights?.(scene)}
            title="View Insights"
          >
            Insights
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Play size={13} />}
            onClick={() => onSimulate?.(scene)}
            title="Simulate Scene"
          >
            Simulate
          </Button>
        </div>
      </div>
    </div>
  );
}
