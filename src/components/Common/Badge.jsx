import React from 'react';
import './Badge.css';

/**
 * Reusable Badge component
 * @param {Object} props
 * @param {'amber'|'indigo'|'emerald'|'rose'|'cyan'|'muted'} [props.variant='muted']
 * @param {'sm'|'md'} [props.size='md']
 * @param {React.ReactNode} [props.icon]
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export default function Badge({
  variant = 'muted',
  size = 'md',
  icon,
  children,
  className = ''
}) {
  return (
    <span className={`badge-pill badge-${variant} badge-size-${size} ${className}`}>
      {icon && <span className="badge-icon">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
