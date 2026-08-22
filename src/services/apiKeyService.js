/**
 * AI Provider & API Key Service
 * Supports Google Gemini and OpenRouter (OpenAI-compatible) API keys
 */

const STORAGE_KEY = 'audienceai_api_key';
const LEGACY_KEY = 'audienceai_gemini_api_key';

export const apiKeyService = {
  /**
   * Get active API key from localStorage or environment variables
   * @returns {string}
   */
  getKey() {
    const fromStorage = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
    if (fromStorage && fromStorage.trim().length > 0) {
      return fromStorage.trim();
    }
    const fromEnv = import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
    if (fromEnv && fromEnv.trim().length > 0) {
      return fromEnv.trim();
    }
    return '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';
  },

  /**
   * Determine provider based on key format
   * @param {string} [key]
   * @returns {'openrouter' | 'gemini'}
   */
  getProvider(key = null) {
    const activeKey = key || this.getKey();
    if (activeKey.startsWith('sk-or-') || activeKey.startsWith('sk-')) {
      return 'openrouter';
    }
    return 'gemini';
  },

  /**
   * Save API key to localStorage
   * @param {string} key
   */
  setKey(key) {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
      localStorage.setItem(LEGACY_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_KEY);
    }
  },

  /**
   * Check if a valid API key exists
   * @returns {boolean}
   */
  hasKey() {
    const key = this.getKey();
    return Boolean(key && key.length > 5);
  },

  /**
   * Remove stored API key
   */
  clearKey() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_KEY);
  }
};
