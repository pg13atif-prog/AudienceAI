import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

const DEFAULT_GLASS = { backdropBlur: 32, surfaceOpacity: 20 };

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('aai-theme') || 'dark'; } catch { return 'dark'; }
  });

  const [glassSettings, setGlassSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('aai-glass');
      return stored ? JSON.parse(stored) : DEFAULT_GLASS;
    } catch { return DEFAULT_GLASS; }
  });

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'deepsea' : 'dark');
  }, []);

  const updateGlassSettings = useCallback((settings) => {
    setGlassSettings(prev => ({ ...prev, ...settings }));
  }, []);

  const resetGlassSettings = useCallback(() => {
    setGlassSettings(DEFAULT_GLASS);
  }, []);

  // Persist
  useEffect(() => {
    try { localStorage.setItem('aai-theme', theme); } catch {}
  }, [theme]);

  useEffect(() => {
    try { localStorage.setItem('aai-glass', JSON.stringify(glassSettings)); } catch {}
  }, [glassSettings]);

  const value = {
    theme,
    setTheme,
    toggleTheme,
    glassSettings,
    updateGlassSettings,
    resetGlassSettings,
    DEFAULT_GLASS
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export default ThemeContext;
