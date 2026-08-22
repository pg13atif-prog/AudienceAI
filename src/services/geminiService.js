import { apiKeyService } from './apiKeyService';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Builds persona-specific system instructions and evaluation criteria
 * @param {Object} persona
 * @returns {string}
 */
const buildPersonaSystemInstruction = (persona) => {
  switch (persona.id) {
    case 'casual-viewer':
      return `You are simulating a "Casual Viewer" audience persona reacting to a creative scene.
YOUR AUDIENCE PROFILE:
- You consume stories for fun, thrill, and emotional connection.
- You care deeply about: Immediate understanding, Entertainment value, Pacing momentum, and Visceral emotional reactions.
- You get bored if the opening drags or characters talk without clear stakes.
- You get confused if spatial movement or scene motivations are murky.
- You do NOT obsess over deep lore nuances unless they directly confuse the immediate plot.

YOUR TASK:
- React to this scene in a natural, candid first-person voice as a casual viewer.
- Score the scene (0-100) on Tension, Emotional Impact, Pacing, Humor, Consistency, and Clarity.
- Identify specific strengths, observed issues (e.g. moments of confusion or slowness), possible interpretations, and suggestions.
- Strict requirement: Clearly categorize every issue as either "observed_issue", "possible_interpretation", or "suggestion".`;

    case 'story-critic':
      return `You are simulating a "Story Critic" audience persona reacting to a creative scene.
YOUR AUDIENCE PROFILE:
- You are a seasoned dramatist and narrative analyst.
- You analyze: Narrative structure, Pacing rhythm, Character motivations, Plot logic, Subtext, and Setup/payoff mechanics.
- You look for dialogue that feels on-the-nose, unearned character turns, artificial melodrama, and unconvincing choices.
- You appreciate layered dialogue, dramatic irony, organic psychological progression, and efficient exposition.

YOUR TASK:
- Provide an incisive, craft-focused evaluation in an intellectual, discerning voice.
- Score the scene (0-100) on Tension, Emotional Impact, Pacing, Humor, Consistency, and Clarity.
- Strictly distinguish between observed issues (concrete craft/plot flaws), possible interpretations (how the scene might be read), and actionable structural suggestions.`;

    case 'lore-enthusiast':
      return `You are simulating a "Lore Enthusiast" audience persona reacting to a creative scene.
YOUR AUDIENCE PROFILE:
- You are an avid worldbuilding and canon expert.
- You focus on: World-building rules, Historical continuity, Faction politics, Magic/tech systems, Character backstory consistency, and Internal logic.
- You scrutinize whether actions violate established lore, whether powers/rules are consistently applied, and whether subtle foreshadowing is earned.

YOUR TASK:
- Evaluate the scene from a canon and world-logic perspective in an observant, detail-oriented voice.
- Score the scene (0-100) on Tension, Emotional Impact, Pacing, Humor, Consistency, and Clarity.
- Distinguish between concrete world/logic contradictions ("observed_issue"), speculative lore theories ("possible_interpretation"), and worldbuilding enhancements ("suggestion").`;

    case 'emotional-viewer':
      return `You are simulating an "Emotional Viewer" audience persona reacting to a creative scene.
YOUR AUDIENCE PROFILE:
- You are deeply invested in character empathy, emotional stakes, vulnerability, interpersonal chemistry, and cathartic payoffs.
- You feel heartbreak, betrayal, intimacy, dread, or triumph deeply alongside the characters.
- You check whether emotional turns feel earned, whether characters show genuine vulnerability, and whether their relationships have authentic spark.

YOUR TASK:
- React from the heart in an emotionally resonant, passionate first-person voice.
- Score the scene (0-100) on Tension, Emotional Impact, Pacing, Humor, Consistency, and Clarity.
- Clearly classify items as "observed_issue" (emotional disconnect or flat chemistry), "possible_interpretation" (perceived emotional subtext), or "suggestion" (ways to deepen character resonance).`;

    default:
      return `You are simulating an audience persona (${persona.name}) evaluating a scene based on: ${persona.focusAreas?.join(', ')}.`;
  }
};

/**
 * Builds user prompt containing the full scene payload
 * @param {Object} scene
 * @param {Object} persona
 * @returns {string}
 */
const buildScenePrompt = (scene, persona) => {
  const charactersList = Array.isArray(scene.characters) ? scene.characters.join(', ') : 'None listed';
  
  return `Please evaluate the following story scene from your specific persona perspective (${persona.name}).

SCENE PAYLOAD:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TITLE: ${scene.title || 'Untitled Scene'}
SEQUENCE / ACT: ${scene.subtitle || 'Act I • Scene 1'}
GENRE & TONE: ${scene.genre || 'Drama / Fiction'}
CHARACTERS PRESENT: ${charactersList}

STORY CONTEXT & WORLD LORE:
${scene.context || 'No additional backstory provided.'}

SCENE CONTENT / SCRIPT:
${scene.content || scene.scriptContent || 'No scene content provided.'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Return your analysis strictly as valid JSON matching the requested schema.`;
};

/**
 * Structured Response Schema
 */
const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    personaId: { type: 'STRING' },
    personaName: { type: 'STRING' },
    reaction: { type: 'STRING' },
    overallScore: { type: 'INTEGER' },
    tensionScore: { type: 'INTEGER' },
    emotionalImpactScore: { type: 'INTEGER' },
    pacingScore: { type: 'INTEGER' },
    humorScore: { type: 'INTEGER' },
    consistencyScore: { type: 'INTEGER' },
    clarityScore: { type: 'INTEGER' },
    issues: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          type: {
            type: 'STRING',
            enum: ['observed_issue', 'possible_interpretation', 'suggestion']
          },
          description: { type: 'STRING' }
        },
        required: ['type', 'description']
      }
    },
    strengths: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    },
    suggestions: {
      type: 'ARRAY',
      items: { type: 'STRING' }
    }
  },
  required: [
    'personaId',
    'personaName',
    'reaction',
    'overallScore',
    'tensionScore',
    'emotionalImpactScore',
    'pacingScore',
    'humorScore',
    'consistencyScore',
    'clarityScore',
    'issues',
    'strengths',
    'suggestions'
  ]
};

/**
 * Normalizes and validates persona response
 */
const validateAndNormalizeReaction = (raw, persona) => {
  const clamp = (num, def = 70) => typeof num === 'number' ? Math.min(100, Math.max(0, Math.round(num))) : def;

  const normalizedIssues = Array.isArray(raw.issues) ? raw.issues.map(item => {
    if (typeof item === 'string') {
      return { type: 'observed_issue', description: item };
    }
    if (item && typeof item === 'object') {
      return {
        type: ['observed_issue', 'possible_interpretation', 'suggestion'].includes(item.type) ? item.type : 'observed_issue',
        description: item.description || item.text || String(item)
      };
    }
    return { type: 'observed_issue', description: 'Pacing or motivation observation noted.' };
  }) : [];

  return {
    personaId: persona.id,
    personaName: persona.name,
    colorKey: persona.colorKey,
    icon: persona.icon,
    reaction: raw.reaction || `Analyzed from ${persona.name} perspective.`,
    overallScore: clamp(raw.overallScore, 75),
    tensionScore: clamp(raw.tensionScore, 75),
    emotionalImpactScore: clamp(raw.emotionalImpactScore, 75),
    pacingScore: clamp(raw.pacingScore, 75),
    humorScore: clamp(raw.humorScore, 25),
    consistencyScore: clamp(raw.consistencyScore, 85),
    clarityScore: clamp(raw.clarityScore, 85),
    issues: normalizedIssues,
    strengths: Array.isArray(raw.strengths) && raw.strengths.length > 0 ? raw.strengths : ['Engaging dramatic premise.'],
    suggestions: Array.isArray(raw.suggestions) && raw.suggestions.length > 0 ? raw.suggestions : ['Continue developing character subtext.']
  };
};

/**
 * Execute simulation against a specific provider
 */
async function callProvider({ provider, key, systemInstruction, userPrompt }) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout

  try {
    if (provider === 'groq') {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `${systemInstruction}\n\nIMPORTANT: You must return valid JSON matching this schema:\n${JSON.stringify(RESPONSE_SCHEMA, null, 2)}`
            },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 2048
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`Groq HTTP ${response.status}: ${await response.text()}`);
      }
      const data = await response.json();
      return data?.choices?.[0]?.message?.content || '';
    }

    if (provider === 'openrouter') {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'HTTP-Referer': 'https://audienceai.app',
          'X-Title': 'AudienceAI'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: `${systemInstruction}\n\nIMPORTANT: You must return valid JSON matching this schema:\n${JSON.stringify(RESPONSE_SCHEMA, null, 2)}`
            },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 2048
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`OpenRouter HTTP ${response.status}: ${await response.text()}`);
      }
      const data = await response.json();
      return data?.choices?.[0]?.message?.content || '';
    }

    // Google Gemini Direct
    const requestBody = {
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.7,
        maxOutputTokens: 2048
      }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`Gemini HTTP ${response.status}: ${await response.text()}`);
    }
    const result = await response.json();
    return result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Main AI Simulation Service with Multi-Provider Fallback Cascade
 */
export const geminiService = {
  /**
   * Run audience simulation for a single persona with automatic fallback cascade
   * @param {Object} scene
   * @param {Object} persona
   * @param {string} [apiKey]
   * @returns {Promise<Object>}
   */
  async simulateSinglePersona(scene, persona, apiKey = null) {
    const cascade = apiKeyService.getProviderCascade();

    if (cascade.length === 0 && !apiKey) {
      const err = new Error('No AI API Key configured. Please supply a Groq, OpenRouter, or Gemini key.');
      err.code = 'MISSING_API_KEY';
      throw err;
    }

    const providersToTry = apiKey 
      ? [{ provider: apiKeyService.getProvider(apiKey), key: apiKey, name: 'Custom Key' }, ...cascade]
      : cascade;

    const systemInstruction = buildPersonaSystemInstruction(persona);
    const userPrompt = buildScenePrompt(scene, persona);

    let lastError = null;

    // Execute fallback cascade: Groq -> OpenRouter -> Gemini
    for (let i = 0; i < providersToTry.length; i++) {
      const { provider, key, name } = providersToTry[i];
      try {
        console.log(`[AI Simulation] Querying persona "${persona.name}" via ${name}...`);
        const rawText = await callProvider({ provider, key, systemInstruction, userPrompt });
        if (rawText && rawText.trim()) {
          const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
          const parsed = JSON.parse(cleanJson);
          return validateAndNormalizeReaction(parsed, persona);
        }
      } catch (err) {
        lastError = err;
        console.warn(`[AI Fallback] Provider ${name} failed (${err.message}). Trying next fallback...`);
      }
    }

    throw lastError || new Error(`Simulation failed across all fallback AI providers for ${persona.name}.`);
  },

  /**
   * Execute multi-persona simulation in sequence with progress callback
   * @param {Object} scene
   * @param {Array<Object>} personas
   * @param {Function} [onProgress]
   * @returns {Promise<Array<Object>>}
   */
  async simulateScene(scene, personas, onProgress = null) {
    const results = [];
    const total = personas.length;

    const personaStatuses = personas.reduce((acc, p) => ({
      ...acc,
      [p.id]: { id: p.id, name: p.name, icon: p.icon, status: 'pending' }
    }), {});

    for (let i = 0; i < total; i++) {
      const persona = personas[i];

      personaStatuses[persona.id].status = 'analyzing';
      onProgress?.({
        completedCount: i,
        totalCount: total,
        currentPersona: persona,
        personaStatuses: { ...personaStatuses },
        partialResults: [...results]
      });

      try {
        const reaction = await this.simulateSinglePersona(scene, persona);
        results.push(reaction);
        personaStatuses[persona.id].status = 'completed';
      } catch (err) {
        personaStatuses[persona.id].status = 'failed';
        personaStatuses[persona.id].error = err.message;
        throw err;
      }

      onProgress?.({
        completedCount: i + 1,
        totalCount: total,
        currentPersona: persona,
        personaStatuses: { ...personaStatuses },
        partialResults: [...results]
      });

      // Subtle breath between persona calls for visual polish
      if (i < total - 1) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    return results;
  },

  /**
   * Calculate aggregated metric scores from actual simulation responses
   * @param {Array<Object>} reactions
   * @returns {Object}
   */
  calculateAggregatedMetrics(reactions) {
    if (!reactions || reactions.length === 0) return {};

    const avg = (key) => {
      const sum = reactions.reduce((acc, r) => acc + (r[key] || 0), 0);
      return Math.round(sum / reactions.length);
    };

    return {
      tension: {
        score: avg('tensionScore'),
        label: 'Tension & Stakes',
        description: 'Simulated multi-perspective rating of scene dramatic suspense and stakes.'
      },
      impact: {
        score: avg('emotionalImpactScore'),
        label: 'Emotional Impact',
        description: 'Audience emotional resonance, character empathy, and connection.'
      },
      pacing: {
        score: avg('pacingScore'),
        label: 'Pacing & Momentum',
        description: 'Scene momentum, reveal cadence, and narrative rhythm.'
      },
      humor: {
        score: avg('humorScore'),
        label: 'Tone & Dialogue Wit',
        description: 'Tone calibration and character conversational sharpness.'
      },
      consistency: {
        score: avg('consistencyScore'),
        label: 'World Consistency',
        description: 'Backstory logic, canon continuity, and character behavioral coherence.'
      },
      clarity: {
        score: avg('clarityScore'),
        label: 'Scene Clarity',
        description: 'Spatial and motivational understanding across simulated audience.'
      }
    };
  }
};
