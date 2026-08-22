/**
 * Simulation History & Version Archive Service
 * Records simulation runs and manages multi-version scene snapshots
 */

const HISTORY_STORAGE_KEY = 'audienceai_simulation_history';

export const historyService = {
  /**
   * Add entry alias for compatibility with Simulation.jsx
   * Supports both (scene, results, metrics, problemDiagnosis) and ({ scene, results, metrics, problemDiagnosis })
   */
  async addEntry(sceneOrParams, results = [], metrics = {}, problemDiagnosis = null) {
    if (sceneOrParams && typeof sceneOrParams === 'object' && sceneOrParams.scene) {
      return this.recordSimulationSession(sceneOrParams);
    }
    return this.recordSimulationSession({
      scene: sceneOrParams,
      results: Array.isArray(results) ? results : [],
      metrics: metrics || {},
      problemDiagnosis
    });
  },

  /**
   * Record a completed simulation run to history
   * @param {Object} params
   * @param {Object} params.scene
   * @param {Array<Object>} params.results
   * @param {Object} [params.metrics]
   * @param {Object} [params.problemDiagnosis]
   * @returns {Promise<Object>}
   */
  async recordSimulationSession({
    scene,
    results = [],
    metrics = {},
    problemDiagnosis = null
  }) {
    const totalPersonas = results.length;
    const overallAvg = totalPersonas > 0 
      ? Math.round(results.reduce((s, r) => s + (r.overallScore || 0), 0) / totalPersonas) 
      : 75;

    const simulationEntry = {
      id: `sim-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      sceneId: scene?.id || 'untitled-scene',
      sceneTitle: scene?.title || 'Untitled Scene',
      sceneSubtitle: scene?.subtitle || 'Act I • Scene 1',
      genre: scene?.genre || 'Drama',
      timestamp: new Date().toISOString(),
      formattedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      audienceCount: totalPersonas,
      primaryIssue: problemDiagnosis?.primaryCategory || 'Pacing',
      primaryIssueSummary: problemDiagnosis?.primaryIssueSummary || 'Pacing and character motivation calibrated.',
      overallScore: overallAvg,
      status: overallAvg >= 75 ? 'Completed' : 'Needs Review',
      results: results.map(r => ({
        personaId: r.personaId,
        personaName: r.personaName,
        icon: r.icon,
        colorKey: r.colorKey,
        overallScore: r.overallScore,
        tensionScore: r.tensionScore,
        emotionalImpactScore: r.emotionalImpactScore,
        pacingScore: r.pacingScore,
        consistencyScore: r.consistencyScore,
        clarityScore: r.clarityScore,
        humorScore: r.humorScore,
        reaction: r.reaction,
        issues: r.issues,
        strengths: r.strengths,
        suggestions: r.suggestions
      })),
      metrics: { ...metrics }
    };

    try {
      const existing = this.getSimulationHistorySync();
      const updated = [simulationEntry, ...existing];
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save simulation history to localStorage:', e);
    }

    return simulationEntry;
  },

  /**
   * Get all simulation history records
   * @returns {Promise<Array<Object>>}
   */
  async getSimulationHistory() {
    return this.getSimulationHistorySync();
  },

  /**
   * Synchronous getter for simulation history
   * @returns {Array<Object>}
   */
  getSimulationHistorySync() {
    try {
      const data = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error parsing simulation history:', e);
    }

    // Default seeded history for initial showcase
    return [
      {
        id: 'sim-seed-1',
        sceneId: 'scene-1',
        sceneTitle: 'The Betrayal',
        sceneSubtitle: 'Act II • Scene 4',
        genre: 'Sci-Fi / Drama',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        formattedDate: 'Today, 10:45 AM',
        audienceCount: 4,
        primaryIssue: 'Pacing',
        primaryIssueSummary: '3 of 4 personas felt the reveal happened abruptly.',
        overallScore: 84,
        status: 'Completed',
        results: []
      },
      {
        id: 'sim-seed-2',
        sceneId: 'scene-2',
        sceneTitle: 'The Rooftop Confession',
        sceneSubtitle: 'Act I • Scene 2',
        genre: 'Romance / Drama',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        formattedDate: 'Yesterday, 3:15 PM',
        audienceCount: 3,
        primaryIssue: 'Character Motivation',
        primaryIssueSummary: 'Emotional stakes needed clearer justification.',
        overallScore: 78,
        status: 'Completed',
        results: []
      },
      {
        id: 'sim-seed-3',
        sceneId: 'scene-3',
        sceneTitle: 'The Heist Departure',
        sceneSubtitle: 'Act I • Scene 1',
        genre: 'Cyberpunk Thriller',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        formattedDate: '2 days ago',
        audienceCount: 4,
        primaryIssue: 'Clarity',
        primaryIssueSummary: 'Spatial layout in harbor docks was slightly unclear.',
        overallScore: 68,
        status: 'Needs Review',
        results: []
      }
    ];
  },

  /**
   * Delete a historical simulation entry
   * @param {string} id
   */
  async deleteSimulation(id) {
    const history = this.getSimulationHistorySync();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Retrieves all historical versions for a specific scene (Original, Previous Remix, Latest)
   * @param {Object} scene
   * @returns {Array<Object>}
   */
  getSceneVersions(scene) {
    if (!scene) return [];

    const versions = [];
    const currentContent = scene.content || scene.scriptContent || '';

    // Original Draft
    if (scene.originalDraft && scene.originalDraft !== currentContent) {
      versions.push({
        versionNumber: 1,
        label: 'Original Draft',
        badge: 'Baseline',
        content: scene.originalDraft,
        wordCount: scene.originalDraft.trim().split(/\s+/).filter(Boolean).length,
        timestamp: scene.createdAt || new Date(Date.now() - 7200000).toISOString(),
        formattedDate: 'Initial Draft'
      });
    } else {
      versions.push({
        versionNumber: 1,
        label: 'Original Draft',
        badge: 'Baseline',
        content: currentContent,
        wordCount: currentContent.trim().split(/\s+/).filter(Boolean).length,
        timestamp: scene.createdAt || new Date(Date.now() - 7200000).toISOString(),
        formattedDate: 'Initial Draft'
      });
    }

    // Previous Remix (v2) if available
    if (scene.previousRemixContent && scene.previousRemixContent !== currentContent) {
      versions.push({
        versionNumber: 2,
        label: 'Previous Remix (v2)',
        badge: 'AI Remix v2',
        content: scene.previousRemixContent,
        wordCount: scene.previousRemixContent.trim().split(/\s+/).filter(Boolean).length,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        formattedDate: 'Intermediate Revision'
      });
    }

    // Latest Version (v3 / Current)
    if (scene.isRemixed || scene.originalDraft) {
      versions.push({
        versionNumber: versions.length + 1,
        label: `Latest Version (v${versions.length + 1})`,
        badge: 'Active Draft',
        content: currentContent,
        wordCount: currentContent.trim().split(/\s+/).filter(Boolean).length,
        timestamp: scene.updatedAt || new Date().toISOString(),
        formattedDate: 'Current Active Script'
      });
    }

    return versions;
  }
};
