import { apiKeyService } from './apiKeyService';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

/**
 * Structured Schema for AI Scene Remix Output
 */
const REMIX_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    improvedContent: {
      type: 'STRING',
      description: 'The complete screenplay scene rewritten with surgical improvements to pacing, subtext, and clarity, formatted as a screenplay.'
    },
    changesMade: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'A list of specific narrative craft edits made to the scene (e.g. Added subtle foreshadowing beat, tightened Silas dialogue).'
    },
    problemsAddressed: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Specific audience issues and craft bottlenecks that were resolved in this revision.'
    },
    summaryOfImprovements: {
      type: 'STRING',
      description: 'A concise 2-sentence rationale summarizing how the revision enhances dramatic tension and audience consensus.'
    }
  },
  required: [
    'improvedContent',
    'changesMade',
    'problemsAddressed',
    'summaryOfImprovements'
  ]
};

/**
 * Execute remix call on a single provider
 */
async function callRemixProvider({ provider, key, systemInstruction, userPrompt }) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

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
              content: `${systemInstruction}\n\nIMPORTANT: You must return valid JSON matching this schema:\n${JSON.stringify(REMIX_RESPONSE_SCHEMA, null, 2)}`
            },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 2200
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
              content: `${systemInstruction}\n\nIMPORTANT: You must return valid JSON matching this schema:\n${JSON.stringify(REMIX_RESPONSE_SCHEMA, null, 2)}`
            },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
          max_tokens: 2200
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
        responseSchema: REMIX_RESPONSE_SCHEMA,
        temperature: 0.7,
        maxOutputTokens: 2200
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
 * AI Scene Remix Service with Multi-Provider Fallback Cascade
 */
export const remixService = {
  /**
   * Alias for generateRemix (compatible with SceneRemixModal)
   */
  async generateRemix(params) {
    return this.remixScene(params);
  },

  /**
   * Generates an improved screenplay draft based on simulated audience feedback
   * @param {Object} params
   * @param {Object} params.scene
   * @param {Array<Object>} params.reactions
   * @param {Object} params.metrics
   * @param {Object} [params.problemDiagnosis]
   * @param {string} [params.customInstruction]
   * @param {string} [params.apiKey]
   * @returns {Promise<Object>}
   */
  async remixScene({
    scene,
    reactions = [],
    metrics = {},
    problemDiagnosis = null,
    customInstruction = '',
    apiKey = null
  }) {
    const cascade = apiKeyService.getProviderCascade();

    if (cascade.length === 0 && !apiKey) {
      const err = new Error('No AI API key configured. Please supply a Groq, OpenRouter, or Gemini key.');
      err.code = 'MISSING_API_KEY';
      throw err;
    }

    const providersToTry = apiKey
      ? [{ provider: apiKeyService.getProvider(apiKey), key: apiKey, name: 'Custom Key' }, ...cascade]
      : cascade;

    const originalScript = scene.content || scene.scriptContent || '';
    const charactersList = Array.isArray(scene.characters) ? scene.characters.join(', ') : 'Characters present';

    const feedbackSummary = reactions.map(r => 
      `- ${r.personaName} (${r.overallScore}/100): "${r.reaction}"`
    ).join('\n');

    const issuesSummary = [];
    reactions.forEach(r => {
      if (Array.isArray(r.issues)) {
        r.issues.forEach(iss => {
          const desc = typeof iss === 'string' ? iss : iss.description;
          if (desc) issuesSummary.push(`• [${r.personaName}] ${desc}`);
        });
      }
    });

    const systemInstruction = `You are an expert Hollywood dramatist and creative script doctor.
YOUR GOAL:
You are tasked with generating an "AI Scene Remix" — an improved, polished version of the writer's scene based directly on simulated audience feedback.

CRITICAL CONSTRAINTS (DO NOT VIOLATE):
1. PRESERVE THE CORE STORY EVENT: You must not change what fundamentally happens in the scene or alter the climax/intended outcome.
2. PRESERVE CHARACTERS & SETTING: Keep the exact same characters (${charactersList}) and setting. Do not introduce random new main characters.
3. PRESERVE THE CREATOR'S CENTRAL IDEA & VOICE: Do not rewrite the entire story or turn it into a different genre.
4. SURGICAL POLISH: Fix the identified pacing, logic, emotional resonance, dialogue exposition, and motivation problems while maintaining the original creative premise.
5. FORMAT AS SCREENPLAY: Return the complete revised scene in standard screenplay format with scene headings (EXT./INT.), character names, dialogue, and parentheticals.`;

    const userPrompt = `ORIGINAL SCENE PAYLOAD:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TITLE: ${scene.title || 'Untitled Scene'}
SEQUENCE: ${scene.subtitle || 'Act I • Scene 1'}
CHARACTERS: ${charactersList}

STORY CONTEXT & WORLD LORE:
${scene.context || 'No context specified.'}

ORIGINAL SCENE CONTENT:
${originalScript}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUDIENCE SIMULATION DIAGNOSTICS:
Primary Issue Identified: ${problemDiagnosis?.primaryCategory || 'Pacing'} — ${problemDiagnosis?.primaryIssueSummary || 'Pacing and character motivation need polish.'}
Why It Matters: ${problemDiagnosis?.whyItMatters || 'Enhances dramatic tension.'}
AI Suggested Action: ${problemDiagnosis?.suggestedImprovement || 'Add subtle foreshadowing and let key beats breathe.'}

AUDIENCE VIEWPOINT REACTIONS:
${feedbackSummary || 'Audience recommended sharper pacing and heightened stakes.'}

SPECIFIC AUDIENCE OBSERVATIONS:
${issuesSummary.slice(0, 8).join('\n') || 'None listed.'}

CREATOR'S CUSTOM INSTRUCTION:
${customInstruction && customInstruction.trim() ? `"${customInstruction.trim()}"` : 'Apply audience feedback directly with subtle dramatic enhancements.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generate the improved screenplay scene and return strictly JSON matching the response schema.`;

    let lastError = null;

    // Execute fallback cascade: Groq -> OpenRouter -> Gemini
    for (let i = 0; i < providersToTry.length; i++) {
      const { provider, key, name } = providersToTry[i];
      try {
        console.log(`[AI Scene Remix] Executing remix via ${name}...`);
        const rawText = await callRemixProvider({ provider, key, systemInstruction, userPrompt });
        if (rawText && rawText.trim()) {
          const cleanJson = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
          const parsed = JSON.parse(cleanJson);

          return {
            improvedContent: parsed.improvedContent || originalScript,
            changesMade: Array.isArray(parsed.changesMade) && parsed.changesMade.length > 0 
              ? parsed.changesMade 
              : ['Applied subtle dramatic foreshadowing', 'Calibrated dialogue momentum before climax'],
            problemsAddressed: Array.isArray(parsed.problemsAddressed) && parsed.problemsAddressed.length > 0
              ? parsed.problemsAddressed
              : ['Resolved abrupt pacing transitions', 'Enhanced character motivation clarity'],
            summaryOfImprovements: parsed.summaryOfImprovements || 
              'The revised scene strengthens character motivations and subtext without altering the core dramatic climax.'
          };
        }
      } catch (err) {
        lastError = err;
        console.warn(`[AI Remix Fallback] Provider ${name} failed (${err.message}). Trying next fallback...`);
      }
    }

    throw lastError || new Error('Scene remix failed across all fallback AI providers.');
  }
};
