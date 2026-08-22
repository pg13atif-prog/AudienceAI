import { MOCK_SCENES } from '../data/mockData';

const STORAGE_KEY = 'audienceai_scenes_v1';

/**
 * Normalizes a scene object to ensure all required Phase 2 model properties exist
 * @param {Object} raw
 * @returns {Object}
 */
export const normalizeScene = (raw) => {
  const now = new Date().toISOString();
  return {
    id: raw.id || `scene-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    title: raw.title || '',
    context: raw.context || '',
    content: raw.content || raw.scriptContent || '',
    characters: Array.isArray(raw.characters) ? raw.characters : [],
    createdAt: raw.createdAt || now,
    updatedAt: raw.updatedAt || now,
    // Supporting metadata for UI presentation
    subtitle: raw.subtitle || 'Act I • Scene 1',
    genre: raw.genre || 'Drama / Fiction',
    status: raw.status || 'Draft',
    lastSimulated: raw.lastSimulated || 'Not yet simulated',
    metrics: raw.metrics || {
      tension: { score: 60, label: 'Pending', description: 'Simulate to calculate tension.' },
      impact: { score: 60, label: 'Pending', description: 'Simulate to calculate emotional impact.' },
      pacing: { score: 60, label: 'Pending', description: 'Simulate to evaluate scene pacing.' },
      humor: { score: 20, label: 'Neutral', description: 'Comedic evaluation pending.' },
      consistency: { score: 85, label: 'Baseline', description: 'Canon continuity pending analysis.' },
      clarity: { score: 85, label: 'Baseline', description: 'Scene clarity pending analysis.' }
    }
  };
};

/**
 * Scene Storage Service (Local persistence with Firestore-ready interface)
 */
export const sceneService = {
  /**
   * Fetch all scenes from local storage (or seed with defaults)
   * @returns {Promise<Array>}
   */
  async getScenes() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeScene);
        }
      }
    } catch (e) {
      console.warn('Failed to parse scenes from localStorage, using initial seed.', e);
    }

    // Seed initial mock scenes
    const initial = MOCK_SCENES.map(s => normalizeScene({
      ...s,
      content: s.scriptContent,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString()
    }));
    this.persist(initial);
    return initial;
  },

  /**
   * Get a single scene by ID
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getSceneById(id) {
    const scenes = await this.getScenes();
    return scenes.find(s => s.id === id) || null;
  },

  /**
   * Create a new blank or template scene
   * @param {Object} partialData
   * @returns {Promise<Object>}
   */
  async createScene(partialData = {}) {
    const now = new Date().toISOString();
    const newScene = normalizeScene({
      id: `scene-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: partialData.title || '',
      context: partialData.context || '',
      content: partialData.content || '',
      characters: partialData.characters || ['Protagonist'],
      createdAt: now,
      updatedAt: now,
      subtitle: partialData.subtitle || 'Act I • Scene 1',
      genre: partialData.genre || 'Drama / Fiction',
      status: 'Draft',
      lastSimulated: 'Not yet simulated'
    });

    const scenes = await this.getScenes();
    const updated = [newScene, ...scenes];
    this.persist(updated);
    return newScene;
  },

  /**
   * Save or update an existing scene
   * @param {Object} sceneData
   * @returns {Promise<Object>}
   */
  async saveScene(sceneData) {
    const scenes = await this.getScenes();
    const now = new Date().toISOString();
    const normalized = normalizeScene({
      ...sceneData,
      updatedAt: now
    });

    const index = scenes.findIndex(s => s.id === normalized.id);
    let updated;
    if (index >= 0) {
      updated = [...scenes];
      updated[index] = normalized;
    } else {
      updated = [normalized, ...scenes];
    }

    this.persist(updated);
    return normalized;
  },

  /**
   * Delete a scene by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteScene(id) {
    const scenes = await this.getScenes();
    const filtered = scenes.filter(s => s.id !== id);
    this.persist(filtered);
    return true;
  },

  /**
   * Helper to write to localStorage
   * @param {Array} scenes
   */
  persist(scenes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scenes));
    } catch (e) {
      console.error('Failed to write scenes to localStorage:', e);
    }
  }
};
