/**
 * Multi-Provider AI Key & Provider Management Service
 * Manages Groq, OpenRouter, and Google Gemini API keys with automatic fallback support
 */

const STORAGE_GROQ_KEY = 'audienceai_groq_api_key';
const STORAGE_OPENROUTER_KEY = 'audienceai_openrouter_api_key';
const STORAGE_GEMINI_KEY = 'audienceai_gemini_api_key';
const STORAGE_PRIMARY_PROVIDER = 'audienceai_primary_ai_provider';

export const apiKeyService = {
  /**
   * Get Groq API key
   * @returns {string}
   */
  getGroqKey() {
    const fromStorage = localStorage.getItem(STORAGE_GROQ_KEY);
    if (fromStorage && fromStorage.trim()) return fromStorage.trim();
    return import.meta.env.VITE_GROQ_API_KEY || '';
  },

  /**
   * Get OpenRouter API key
   * @returns {string}
   */
  getOpenRouterKey() {
    const fromStorage = localStorage.getItem(STORAGE_OPENROUTER_KEY);
    if (fromStorage && fromStorage.trim()) return fromStorage.trim();
    return import.meta.env.VITE_OPENROUTER_API_KEY || '';
  },

  /**
   * Get Gemini direct API key
   * @returns {string}
   */
  getGeminiKey() {
    const fromStorage = localStorage.getItem(STORAGE_GEMINI_KEY);
    if (fromStorage && fromStorage.trim()) return fromStorage.trim();
    return import.meta.env.VITE_GEMINI_API_KEY || '';
  },

  /**
   * Get primary/active API key
   * @returns {string}
   */
  getKey() {
    const groq = this.getGroqKey();
    if (groq) return groq;
    const openrouter = this.getOpenRouterKey();
    if (openrouter) return openrouter;
    return this.getGeminiKey();
  },

  /**
   * Determine provider of a given key
   * @param {string} [key]
   * @returns {'groq' | 'openrouter' | 'gemini'}
   */
  getProvider(key = null) {
    const activeKey = key || this.getKey();
    if (activeKey.startsWith('gsk_')) {
      return 'groq';
    }
    if (activeKey.startsWith('sk-or-') || activeKey.startsWith('sk-')) {
      return 'openrouter';
    }
    return 'gemini';
  },

  /**
   * Get ordered fallback cascade list of available providers
   * @returns {Array<{ provider: 'groq' | 'openrouter' | 'gemini', key: string, name: string }>}
   */
  getProviderCascade() {
    const providers = [];

    const groqKey = this.getGroqKey();
    if (groqKey) {
      providers.push({ provider: 'groq', key: groqKey, name: 'Groq (Llama 3.3 70B - Ultra Fast)' });
    }

    const orKey = this.getOpenRouterKey();
    if (orKey) {
      providers.push({ provider: 'openrouter', key: orKey, name: 'OpenRouter (Gemini 2.5 Flash)' });
    }

    const gemKey = this.getGeminiKey();
    if (gemKey && !gemKey.startsWith('sk-') && !gemKey.startsWith('gsk_')) {
      providers.push({ provider: 'gemini', key: gemKey, name: 'Google Gemini Direct' });
    }

    return providers;
  },

  /**
   * Set custom key for a specific provider
   * @param {'groq' | 'openrouter' | 'gemini'} provider
   * @param {string} key
   */
  setProviderKey(provider, key) {
    const trimmed = key ? key.trim() : '';
    if (provider === 'groq') {
      if (trimmed) localStorage.setItem(STORAGE_GROQ_KEY, trimmed);
      else localStorage.removeItem(STORAGE_GROQ_KEY);
    } else if (provider === 'openrouter') {
      if (trimmed) localStorage.setItem(STORAGE_OPENROUTER_KEY, trimmed);
      else localStorage.removeItem(STORAGE_OPENROUTER_KEY);
    } else if (provider === 'gemini') {
      if (trimmed) localStorage.setItem(STORAGE_GEMINI_KEY, trimmed);
      else localStorage.removeItem(STORAGE_GEMINI_KEY);
    }
  },

  /**
   * Check if any valid key is configured
   * @returns {boolean}
   */
  hasKey() {
    return Boolean(this.getGroqKey() || this.getOpenRouterKey() || this.getGeminiKey());
  }
};
