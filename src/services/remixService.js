import { apiKeyService } from './apiKeyService';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/**
 * Gemini Response Schema for Structured Scene Remix
 */
const REMIX_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    improvedContent: {
      type: 'STRING',
      description: 'The complete revised screenplay text of the scene in standard script format with scene headings, character dialogue, and action beats. Must fix identified audience problems while preserving core events, setting, and characters.'
    },
    changesMade: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'Bullet list of specific structural, dialogue, or pacing changes made to the scene.'
    },
    problemsAddressed: {
      type: 'ARRAY',
      items: { type: 'STRING' },
      description: 'List of specific audience feedback concerns and friction points resolved in this remix.'
    },
    summaryOfImprovements: {
      type: 'STRING',
      description: 'A concise 2-sentence summary explaining how the revisions improve audience engagement and narrative stakes.'
    }
  },
  required: [
    'improvedContent',
    'changesMade',
    'problemsAddressed',
    'summaryOfImprovements'
  ]
};

export const remixService = {
  /**
   * Generates an improved scene remix using Gemini based on audience feedback and creator instructions
   * @param {Object} params
   * @param {Object} params.scene
   * @param {Array<Object>} [params.reactions]
   * @param {Object} [params.metrics]
   * @param {Object} [params.problemDiagnosis]
   * @param {string} [params.customInstruction]
   * @returns {Promise<Object>}
   */
  async generateRemix({
    scene,
    reactions = [],
    metrics = {},
    problemDiagnosis = null,
    customInstruction = ''
  }) {
    const key = apiKeyService.getKey();
    if (!key) {
      const err = new Error('Gemini API Key is required to remix scene.');
      err.code = 'MISSING_API_KEY';
      throw err;
    }

    const charactersList = Array.isArray(scene.characters) ? scene.characters.join(', ') : 'Characters in scene';
    const originalScript = scene.content || scene.scriptContent || '';

    // Summarize persona feedback
    const feedbackSummary = reactions.map(r => 
      `- ${r.personaName} (Overall ${r.overallScore}/100): "${r.reaction}"`
    ).join('\n');

    // Summarize specific issues
    const issuesSummary = [];
    reactions.forEach(r => {
      if (Array.isArray(r.issues)) {
        r.issues.forEach(i => {
          const desc = typeof i === 'string' ? i : i.description;
          if (desc) issuesSummary.push(`- [${r.personaName}] ${desc}`);
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

    const provider = apiKeyService.getProvider(key);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

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
                content: `${systemInstruction}\n\nIMPORTANT: You must return valid JSON matching this schema:\n${JSON.stringify(REMIX_RESPONSE_SCHEMA, null, 2)}`
              },
              { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
            max_tokens: 3500
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
            responseSchema: REMIX_RESPONSE_SCHEMA,
            temperature: 0.7,
            maxOutputTokens: 3500
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

      const cleanJson = rawJsonText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        improvedContent: parsed.improvedContent || originalScript,
        changesMade: Array.isArray(parsed.changesMade) && parsed.changesMade.length > 0 
          ? parsed.changesMade 
          : ['Added subtle foreshadowing beat.', 'Polished dialogue pacing.'],
        problemsAddressed: Array.isArray(parsed.problemsAddressed) && parsed.problemsAddressed.length > 0
          ? parsed.problemsAddressed
          : [problemDiagnosis?.primaryCategory ? `Resolved ${problemDiagnosis.primaryCategory} concerns.` : 'Refined pacing flow.'],
        summaryOfImprovements: parsed.summaryOfImprovements || 'The scene was refined to enhance dramatic momentum and character subtext.'
      };
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        const timeoutErr = new Error('Scene remix timed out. Please try again.');
        timeoutErr.code = 'TIMEOUT';
        throw timeoutErr;
      }
      throw err;
    }
  }
};
