import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './ThemeToggle.css';

export default function ThemeToggle({ compact = false }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`theme-toggle ${compact ? 'theme-toggle--compact' : ''}`}>
      <button
        type="button"
        className={`theme-toggle__btn ${theme === 'dark' ? 'theme-toggle__btn--active' : ''}`}
        onClick={() => setTheme('dark')}
      >
        <span className="theme-toggle__icon">🌙</span>
        {!compact && <span>Dark Mode</span>}
      </button>
      <button
        type="button"
        className={`theme-toggle__btn ${theme === 'deepsea' ? 'theme-toggle__btn--active' : ''}`}
        onClick={() => setTheme('deepsea')}
      >
        <span className="theme-toggle__icon">🌊</span>
        {!compact && <span>Deep Sea Mode</span>}
      </button>
    </div>
  );
}
