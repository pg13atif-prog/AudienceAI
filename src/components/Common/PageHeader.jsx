import React from 'react';
import './PageHeader.css';

/**
 * Reusable PageHeader with title, subtitle, breadcrumb/tag, and action buttons
 */
export default function PageHeader({
  title,
  subtitle,
  badge,
  actions,
  tagline,
  className = ''
}) {
  return (
    <div className={`page-header ${className}`}>
      <div className="page-header-content">
        <div className="page-header-title-row">
          <h1 className="page-header-title">{title}</h1>
          {badge && <div className="page-header-badge">{badge}</div>}
        </div>
        {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
        {tagline && <span className="page-header-tagline">{tagline}</span>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}
