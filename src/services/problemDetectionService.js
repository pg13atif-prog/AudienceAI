/**
 * AI Audience Problem Detection & Craft Diagnostic Service
 * Analyzes multi-persona simulation feedback and determines the primary narrative bottleneck,
 * why it matters for audience engagement, and provides actionable surgical recommendations.
 */

export const CRAFT_CATEGORIES = [
  {
    key: 'Pacing',
    label: 'Narrative Pacing',
    dim: 'pacing',
    keywords: ['fast', 'slow', 'drag', 'rushed', 'abrupt', 'sudden', 'too quickly', 'escalated', 'whiplash', 'pacing', 'tempo', 'stall'],
    whyItMatters: 'Uneven pacing breaks narrative immersion: scenes that move too fast prevent emotional resonance, while lagging moments cause audience disinterest.',
    suggestionTemplate: 'Calibrate the transition rhythm: allow key dramatic turns a breath before the next escalation to heighten audience anticipation.'
  },
  {
    key: 'Character Motivation',
    label: 'Character Motivation',
    dim: 'impact',
    keywords: ['why', 'motivation', 'unearned', 'out of character', 'abrupt turn', 'reason', 'justification', 'loyalty', 'betrayal', 'agency'],
    whyItMatters: 'Audiences disengage when character decisions feel unearned or dictated by plot convenience rather than authentic internal motivation.',
    suggestionTemplate: 'Plant subtle micro-behaviors or conflicting emotional cues earlier in the scene so the dramatic choice feels earned and psychologically grounded.'
  },
  {
    key: 'Worldbuilding Logic',
    label: 'World-Building Continuity',
    dim: 'consistency',
    keywords: ['world', 'logic', 'technology', 'magic', 'rule', 'contradict', 'umbrella', 'citadel', 'lore', 'canon', 'impossible', 'inconsistent'],
    whyItMatters: 'Inconsistent world rules or unexplained technology disrupt audience suspension of disbelief and weaken dramatic stakes.',
    suggestionTemplate: 'Ground in-universe technology or faction protocols with a quick visual tell or established dialogue precedent.'
  },
  {
    key: 'Clarity',
    label: 'Spatial & Action Clarity',
    dim: 'clarity',
    keywords: ['confused', 'unclear', 'where', 'position', 'spatial', 'who is', 'muddled', 'hard to follow', 'staging', 'blocking'],
    whyItMatters: 'Ambiguous physical blocking or murky scene geography forces the audience to decode mechanics instead of feeling dramatic tension.',
    suggestionTemplate: 'Sharpen spatial markers and character blocking cues so physical orientation and line-of-sight remain instantly clear.'
  },
  {
    key: 'Emotional Payoff',
    label: 'Emotional Payoff & Stakes',
    dim: 'impact',
    keywords: ['detached', 'cold', 'stakes', 'care', 'feel', 'emotional', 'flat', 'melodrama', 'heart', 'vulnerable', 'connection'],
    whyItMatters: 'Without palpable emotional vulnerability and relatable interpersonal stakes, high-concept drama remains hollow to viewers.',
    suggestionTemplate: 'Deepen character vulnerability by highlighting the personal cost of the conflict beyond just external objectives.'
  },
  {
    key: 'Tone & Levity',
    label: 'Tonal Calibration',
    dim: 'tension',
    keywords: ['tone', 'humor', 'joke', 'levity', 'serious', 'jarring', 'gravity', 'mood', 'comedic', 'bathos'],
    whyItMatters: 'Misplaced humor defuses essential dramatic tension, while organic subtextual banter grounds relatable character bonds.',
    suggestionTemplate: 'Align dialogue tone with situational stakes: reserve lighter subtext for building rapport rather than deflating climactic tension.'
  },
  {
    key: 'Dialogue Subtext',
    label: 'Dialogue & Subtext',
    dim: 'clarity',
    keywords: ['on the nose', 'cliche', 'exposition', 'unnatural', 'stilted', 'dialogue', 'speech', 'monologue', 'report'],
    whyItMatters: 'Expository or overly direct dialogue robs scenes of dramatic subtext and reduces character authenticity.',
    suggestionTemplate: 'Layer dialogue so characters speak around their deeper intentions rather than stating their feelings or exposition directly.'
  }
];

export const problemDetectionService = {
  /**
   * Diagnose scene issues from live persona reactions
   * @param {Array<Object>} reactions
   * @param {Object} [metrics]
   * @param {Object} [scene]
   * @returns {Object}
   */
  diagnoseScene(reactions = [], metrics = {}, scene = null) {
    if (!reactions || reactions.length === 0) {
      return null;
    }

    const totalPersonas = reactions.length;

    // Score craft categories against persona feedback
    const scoredCategories = CRAFT_CATEGORIES.map(cat => {
      const noticing = [];

      reactions.forEach(r => {
        const fullText = [
          r.reaction || '',
          Array.isArray(r.issues) ? r.issues.map(i => typeof i === 'string' ? i : (i.description || '')).join(' ') : '',
          Array.isArray(r.suggestions) ? r.suggestions.join(' ') : ''
        ].join(' ').toLowerCase();

        let matched = false;
        let matchedQuote = '';

        for (const kw of cat.keywords) {
          if (fullText.includes(kw.toLowerCase())) {
            matched = true;
            matchedQuote = r.reaction;
            break;
          }
        }

        // Check dimension score thresholds
        const dimVal = r[cat.dim] !== undefined ? r[cat.dim] : (r[`${cat.dim}Score`] || 70);
        if (dimVal <= 68 && !matched) {
          matched = true;
          matchedQuote = r.reaction;
        }

        if (matched) {
          // Extract a concise quote snippet (max ~95 chars) for clean display
          const rawQuote = matchedQuote || r.reaction || '';
          const cleanSnippet = rawQuote.length > 95 ? rawQuote.slice(0, 92).trim() + '...' : rawQuote;
          noticing.push({
            personaId: r.personaId,
            personaName: r.personaName,
            icon: r.icon,
            colorKey: r.colorKey,
            quote: cleanSnippet,
            fullQuote: rawQuote
          });
        }
      });

      const dimScore = metrics[cat.dim]?.score || (reactions.reduce((sum, r) => sum + (r[cat.dim] || 75), 0) / totalPersonas);
      const severityScore = (noticing.length * 35) + ((100 - dimScore) * 0.65);

      return {
        ...cat,
        noticing,
        count: noticing.length,
        dimScore: Math.round(dimScore),
        severityScore
      };
    });

    // Pick top problem category
    scoredCategories.sort((a, b) => b.severityScore - a.severityScore);
    const topCategory = scoredCategories[0];

    const primaryCategory = (topCategory && topCategory.count > 0) ? topCategory.key : 'Pacing';
    const noticingPersonas = (topCategory && topCategory.count > 0) ? topCategory.noticing : reactions.slice(0, 2).map(r => ({
      personaId: r.personaId,
      personaName: r.personaName,
      icon: r.icon,
      colorKey: r.colorKey,
      quote: (r.reaction || '').length > 95 ? (r.reaction || '').slice(0, 92).trim() + '...' : (r.reaction || ''),
      fullQuote: r.reaction || ''
    }));

    const count = noticingPersonas.length;

    // Standardized craft descriptions for clear headlines without raw quote clutter
    const craftDescriptions = {
      'Pacing': `${count} of ${totalPersonas} personas felt the dramatic reveal happens abruptly before tension peaks.`,
      'Character Motivation': `${count} of ${totalPersonas} personas found character loyalties and decisions needed deeper justification.`,
      'Worldbuilding Logic': `${count} of ${totalPersonas} personas noticed minor world rule or technology continuity friction.`,
      'Clarity': `${count} of ${totalPersonas} personas noted spatial blocking and character positioning could be clearer.`,
      'Emotional Payoff': `${count} of ${totalPersonas} personas felt emotional stakes were slightly detached and need deeper vulnerability.`,
      'Tone & Levity': `${count} of ${totalPersonas} personas felt dialogue tone and levity timing could better match scene gravity.`,
      'Dialogue Subtext': `${count} of ${totalPersonas} personas noted key dialogue lines would benefit from richer subtext.`
    };

    const craftSummary = craftDescriptions[primaryCategory] || `${count} of ${totalPersonas} audience personas identified ${primaryCategory.toLowerCase()} as the primary focus area.`;
    const primaryIssueSummary = `${count} of ${totalPersonas} personas identified ${primaryCategory.toLowerCase()} as an area for refinement.`;

    // Build specific surgical suggestion
    let suggestedImprovement = topCategory.suggestionTemplate;
    if (scene?.characters && scene.characters.length > 0) {
      const charName = scene.characters[0];
      if (primaryCategory === 'Character Motivation') {
        suggestedImprovement = `Add a subtle indication of ${charName}'s internal dilemma earlier in the scene, such as a suspicious hesitation or unresolved gesture.`;
      } else if (primaryCategory === 'Pacing') {
        suggestedImprovement = `Allow ${charName}'s reaction to register for a beat before the next dramatic escalation to heighten audience anticipation.`;
      }
    }

    // Collect validated strengths
    const allStrengths = [];
    reactions.forEach(r => {
      if (Array.isArray(r.strengths)) {
        r.strengths.forEach(s => {
          if (s && s.length > 5 && !allStrengths.includes(s)) {
            allStrengths.push(s);
          }
        });
      }
    });

    if (allStrengths.length === 0) {
      if ((metrics.tension?.score || 80) >= 75) allStrengths.push('High narrative tension and dramatic stakes throughout the scene.');
      if ((metrics.impact?.score || 80) >= 75) allStrengths.push('Strong visceral emotional impact on audience personas.');
      if ((metrics.consistency?.score || 85) >= 80) allStrengths.push('Rock-solid world logic and atmospheric setting consistency.');
      if ((metrics.clarity?.score || 85) >= 80) allStrengths.push('Unambiguous visual blocking and clean scene progression.');
    }

    // Calculate severity label
    let severity = 'Moderate';
    if (count >= Math.ceil(totalPersonas * 0.75) || (topCategory && topCategory.dimScore < 60)) {
      severity = 'Critical';
    } else if (count <= 1) {
      severity = 'Low';
    }

    return {
      hasData: true,
      primaryCategory,
      primaryIssueSummary,
      craftSummary,
      whyItMatters: topCategory.whyItMatters,
      suggestedImprovement,
      noticingPersonas,
      noticingCount: count,
      totalPersonas,
      severity,
      dimScore: topCategory ? topCategory.dimScore : 70,
      topStrengths: allStrengths.slice(0, 3)
    };
  }
};
