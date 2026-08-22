import React from 'react';
import './Button.css';

/**
 * Reusable Button component
 * @param {Object} props
 * @param {'primary'|'secondary'|'ghost'|'amber'|'danger'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {React.ReactNode} [props.icon]
 * @param {React.ReactNode} [props.iconRight]
 * @param {boolean} [props.fullWidth]
 * @param {boolean} [props.disabled]
 * @param {Function} [props.onClick]
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  className = '',
  ...rest
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {icon && <span className="btn-icon-left">{icon}</span>}
      {children && <span className="btn-label">{children}</span>}
      {iconRight && <span className="btn-icon-right">{iconRight}</span>}
    </button>
  );
}
