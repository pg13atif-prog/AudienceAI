import { apiKeyService } from './apiKeyService';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

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

Return your analysis strictly as JSON matching the requested schema.`;
};

/**
 * Gemini Response Schema for Structured Output
 */
const RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    personaId: { type: 'STRING' },
    personaName: { type: 'STRING' },
    reaction: { 
      type: 'STRING', 
      description: 'First-person viewpoint commentary from the persona speaking directly about their experience reading the scene.' 
    },
    overallScore: { type: 'INTEGER', description: 'Overall rating from 0 to 100' },
    tensionScore: { type: 'INTEGER', description: 'Rating of narrative friction, suspense, or stakes from 0 to 100' },
    emotionalImpactScore: { type: 'INTEGER', description: 'Rating of emotional resonance and audience connection from 0 to 100' },
    pacingScore: { type: 'INTEGER', description: 'Rating of flow and rhythm from 0 to 100' },
    humorScore: { type: 'INTEGER', description: 'Rating of comedic timing or intentional ironic tone from 0 to 100' },
    consistencyScore: { type: 'INTEGER', description: 'Rating of world logic and character consistency from 0 to 100' },
    clarityScore: { type: 'INTEGER', description: 'Rating of audience comprehension and spatial clarity from 0 to 100' },
    issues: {
      type: 'ARRAY',
      description: 'List of observed issues, interpretations, and suggestions strictly categorized.',
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
      items: { type: 'STRING' },
      description: 'Key positive aspects of the scene noticed by this persona.'
    },
    suggestions: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Actionable creative ideas from this persona.'
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
 * Validates and normalizes Gemini reaction output
 * @param {Object} raw
 * @param {Object} persona
 * @returns {Object}
 */
const validateAndNormalizeReaction = (raw, persona) => {
  const clamp = (num, def = 70) => typeof num === 'number' ? Math.min(100, Math.max(0, Math.round(num))) : def;

  // Normalize issues array to ensure objects with type & description
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
    return { type: 'observed_issue', description: 'Unspecified issue noted.' };
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
    strengths: Array.isArray(raw.strengths) ? raw.strengths : ['Engaging scene concept.'],
    suggestions: Array.isArray(raw.suggestions) ? raw.suggestions : ['Continue developing character dynamics.']
  };
};

/**
 * Main Gemini Simulation Service
 */
export const geminiService = {
  /**
   * Run audience simulation for a single persona
   * @param {Object} scene
   * @param {Object} persona
   * @param {string} [apiKey]
   * @returns {Promise<Object>}
   */
  async simulateSinglePersona(scene, persona, apiKey = null) {
    const key = apiKey || apiKeyService.getKey();
    if (!key) {
      const err = new Error('Missing API Key. Please provide an API key in Settings or the Simulation window.');
      err.code = 'MISSING_API_KEY';
      throw err;
    }

    const provider = apiKeyService.getProvider(key);
    const systemInstruction = buildPersonaSystemInstruction(persona);
    const userPrompt = buildScenePrompt(scene, persona);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

    try {
      let rawJsonText = '';

      if (provider === 'openrouter') {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
          let errorMsg = `OpenRouter API error (Status ${response.status})`;
          try {
            const errorData = await response.json();
            if (errorData.error && errorData.error.message) {
              errorMsg = errorData.error.message;
            }
          } catch (e) {}

          const err = new Error(errorMsg);
          err.status = response.status;
          throw err;
        }

        const data = await response.json();
        rawJsonText = data?.choices?.[0]?.message?.content || '';
      } else {
        // Direct Google Gemini API
        const requestBody = {
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: userPrompt }]
            }
          ],
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
          let errorMsg = `Gemini API error (Status ${response.status})`;
          try {
            const errorData = await response.json();
            if (errorData.error && errorData.error.message) {
              errorMsg = errorData.error.message;
            }
          } catch (e) {}

          if (response.status === 400 && errorMsg.toLowerCase().includes('api key')) {
            const err = new Error('Invalid Gemini API Key. Please verify your key in Settings.');
            err.code = 'INVALID_API_KEY';
            throw err;
          }
          if (response.status === 429) {
            const err = new Error('Gemini API rate limit exceeded. Please wait a few seconds and try again.');
            err.code = 'RATE_LIMIT';
            throw err;
          }

          const err = new Error(errorMsg);
          err.status = response.status;
          throw err;
        }

        const result = await response.json();
        rawJsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      }

      if (!rawJsonText) {
        throw new Error('AI returned an empty response.');
      }

      // Clean markdown code blocks if wrapped
      const cleanJson = rawJsonText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(cleanJson);
      return validateAndNormalizeReaction(parsed, persona);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        const timeoutErr = new Error(`Simulation timed out for ${persona.name}. The server took too long to respond.`);
        timeoutErr.code = 'TIMEOUT';
        throw timeoutErr;
      }
      throw err;
    }
  },

  /**
   * Run full simulation across all active personas with progress callbacks
   * @param {Object} scene
   * @param {Array<Object>} personas
   * @param {Function} [onProgress] - (statusObj: { currentPersona, completedCount, totalCount, personaStatuses }) => void
   * @returns {Promise<Array<Object>>}
   */
  async simulateScene(scene, personas, onProgress) {
    if (!personas || personas.length === 0) {
      throw new Error('At least one audience persona must be selected.');
    }

    const key = apiKeyService.getKey();
    if (!key) {
      const err = new Error('Gemini API Key is required to run live simulation.');
      err.code = 'MISSING_API_KEY';
      throw err;
    }

    const results = [];
    const personaStatuses = {};

    personas.forEach(p => {
      personaStatuses[p.id] = { id: p.id, name: p.name, icon: p.icon, status: 'pending' };
    });

    for (let i = 0; i < personas.length; i++) {
      const persona = personas[i];
      
      // Update status to analyzing
      personaStatuses[persona.id].status = 'analyzing';
      if (onProgress) {
        onProgress({
          currentPersona: persona,
          completedCount: results.length,
          totalCount: personas.length,
          personaStatuses: { ...personaStatuses }
        });
      }

      try {
        const reaction = await this.simulateSinglePersona(scene, persona, key);
        results.push(reaction);
        personaStatuses[persona.id].status = 'completed';
      } catch (err) {
        personaStatuses[persona.id].status = 'error';
        personaStatuses[persona.id].error = err.message;
        if (onProgress) {
          onProgress({
            currentPersona: persona,
            completedCount: results.length,
            totalCount: personas.length,
            personaStatuses: { ...personaStatuses }
          });
        }
        throw err;
      }

      if (onProgress) {
        onProgress({
          currentPersona: persona,
          completedCount: results.length,
          totalCount: personas.length,
          personaStatuses: { ...personaStatuses }
        });
      }
    }

    return results;
  },

  /**
   * Calculates aggregated metrics from persona reactions
   * @param {Array<Object>} reactions
   * @returns {Object}
   */
  calculateAggregatedMetrics(reactions) {
    if (!reactions || reactions.length === 0) return {};

    const avg = (key) => Math.round(reactions.reduce((sum, r) => sum + (r[key] || 0), 0) / reactions.length);

    const tensionAvg = avg('tensionScore');
    const impactAvg = avg('emotionalImpactScore');
    const pacingAvg = avg('pacingScore');
    const humorAvg = avg('humorScore');
    const consistencyAvg = avg('consistencyScore');
    const clarityAvg = avg('clarityScore');

    return {
      tension: {
        score: tensionAvg,
        label: tensionAvg >= 80 ? 'High Stakes' : tensionAvg >= 60 ? 'Moderate Tension' : 'Low Narrative Stakes',
        description: `Average audience tension score: ${tensionAvg}/100 across ${reactions.length} viewpoints.`
      },
      impact: {
        score: impactAvg,
        label: impactAvg >= 80 ? 'Profound Impact' : impactAvg >= 60 ? 'Engaging Resonance' : 'Muted Impact',
        description: `Audience emotional resonance evaluated at ${impactAvg}/100.`
      },
      pacing: {
        score: pacingAvg,
        label: pacingAvg >= 80 ? 'Brisk & Dynamic' : pacingAvg >= 60 ? 'Steady Rhythm' : 'Pacing Stalls Detected',
        description: `Narrative momentum and dialogue flow rated at ${pacingAvg}/100.`
      },
      humor: {
        score: humorAvg,
        label: humorAvg >= 50 ? 'Strong Comedic Wit' : humorAvg >= 25 ? 'Subtle Levity' : 'Dramatic / Serious',
        description: `Tone assessment and comedic relief score: ${humorAvg}/100.`
      },
      consistency: {
        score: consistencyAvg,
        label: consistencyAvg >= 80 ? 'Rock Solid Continuity' : consistencyAvg >= 60 ? 'Minor Logic Gaps' : 'Continuity Flagged',
        description: `World logic and character motive alignment: ${consistencyAvg}/100.`
      },
      clarity: {
        score: clarityAvg,
        label: clarityAvg >= 80 ? 'Crystal Clear' : clarityAvg >= 60 ? 'Understandable' : 'Potential Confusion',
        description: `Audience scene comprehension rating: ${clarityAvg}/100.`
      }
    };
  }
};
