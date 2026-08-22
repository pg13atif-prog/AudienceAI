/**
 * Audience Consensus & Multi-Viewpoint Synthesis Service
 * Aggregates independent persona feedback into unified patterns, universal strengths, and viewpoint divergence.
 */

export const consensusService = {
  /**
   * Generates cross-persona consensus metrics and pattern insights
   * @param {Array<Object>} reactions
   * @returns {Object}
   */
  generateConsensus(reactions = []) {
    if (!reactions || reactions.length === 0) {
      return {
        hasData: false,
        overallAverage: 0,
        consensusSummary: 'No simulation data available.',
        patterns: [],
        divergenceSummary: null,
        highestPersona: null,
        lowestPersona: null,
        personaRankings: [],
        dimensionAverages: {}
      };
    }

    const totalPersonas = reactions.length;

    // 1. Calculate overall score average
    const totalScore = reactions.reduce((sum, r) => sum + (r.overallScore || 0), 0);
    const overallAverage = Math.round(totalScore / totalPersonas);

    // 2. Calculate 6-dimension averages
    const dimensions = ['tension', 'impact', 'pacing', 'consistency', 'clarity', 'humor'];
    const dimensionAverages = {};

    dimensions.forEach(dim => {
      const scoreKey = `${dim}Score`;
      const sum = reactions.reduce((acc, r) => acc + (r[scoreKey] !== undefined ? r[scoreKey] : (r[dim] || 70)), 0);
      dimensionAverages[dim] = Math.round(sum / totalPersonas);
    });

    // 3. Extract common issue themes across personas
    const issueThemes = {
      'Pacing': { count: 0, personas: [], statement: 'Pacing momentum and transition tempo' },
      'Character Motivation': { count: 0, personas: [], statement: 'Character motivation and psychological justification' },
      'Worldbuilding Logic': { count: 0, personas: [], statement: 'Worldbuilding rules and technology continuity' },
      'Clarity': { count: 0, personas: [], statement: 'Spatial blocking and staging clarity' },
      'Emotional Connection': { count: 0, personas: [], statement: 'Emotional resonance and character vulnerability' },
      'Tone & Levity': { count: 0, personas: [], statement: 'Tonal calibration and dialogue gravity' }
    };

    const allIssues = [];

    reactions.forEach(r => {
      const text = [
        r.reaction || '',
        Array.isArray(r.issues) ? r.issues.map(i => typeof i === 'string' ? i : (i.description || '')).join(' ') : '',
        Array.isArray(r.suggestions) ? r.suggestions.join(' ') : ''
      ].join(' ').toLowerCase();

      if (text.includes('fast') || text.includes('slow') || text.includes('pacing') || text.includes('rushed') || text.includes('abrupt') || (r.pacingScore || 70) <= 68) {
        issueThemes['Pacing'].count++;
        issueThemes['Pacing'].personas.push(r.personaName);
      }
      if (text.includes('why') || text.includes('motivation') || text.includes('reason') || text.includes('unearned') || text.includes('betrayal') || (r.emotionalImpactScore || 70) <= 68) {
        issueThemes['Character Motivation'].count++;
        issueThemes['Character Motivation'].personas.push(r.personaName);
      }
      if (text.includes('world') || text.includes('umbrella') || text.includes('logic') || text.includes('rule') || text.includes('lore') || text.includes('technology') || (r.consistencyScore || 75) <= 70) {
        issueThemes['Worldbuilding Logic'].count++;
        issueThemes['Worldbuilding Logic'].personas.push(r.personaName);
      }
      if (text.includes('confused') || text.includes('unclear') || text.includes('where') || text.includes('position') || (r.clarityScore || 75) <= 70) {
        issueThemes['Clarity'].count++;
        issueThemes['Clarity'].personas.push(r.personaName);
      }
      if (text.includes('detached') || text.includes('cold') || text.includes('stakes') || text.includes('emotional') || text.includes('feel')) {
        issueThemes['Emotional Connection'].count++;
        issueThemes['Emotional Connection'].personas.push(r.personaName);
      }
      if (text.includes('humor') || text.includes('joke') || text.includes('tone') || text.includes('levity')) {
        issueThemes['Tone & Levity'].count++;
        issueThemes['Tone & Levity'].personas.push(r.personaName);
      }

      if (Array.isArray(r.issues)) {
        r.issues.forEach(iss => {
          const desc = typeof iss === 'string' ? iss : iss.description;
          if (desc) allIssues.push({ persona: r.personaName, text: desc });
        });
      }
    });

    const detectedPatterns = [];
    Object.keys(issueThemes).forEach(themeKey => {
      const theme = issueThemes[themeKey];
      if (theme.count >= 2) {
        detectedPatterns.push({
          theme: themeKey,
          count: theme.count,
          personas: theme.personas,
          statement: `${theme.count} of ${totalPersonas} personas identified ${theme.statement.toLowerCase()} as an area for refinement.`
        });
      }
    });

    detectedPatterns.sort((a, b) => b.count - a.count);

    // Persona rankings
    const personaRankings = [...reactions]
      .map(r => ({
        id: r.personaId,
        name: r.personaName,
        icon: r.icon,
        colorKey: r.colorKey,
        score: r.overallScore,
        keyIssue: this.extractKeyIssue(r),
        reaction: r.reaction
      }))
      .sort((a, b) => b.score - a.score);

    // Persona divergence analysis
    const highest = personaRankings[0];
    const lowest = personaRankings[personaRankings.length - 1];
    const scoreSpread = (highest?.score || 75) - (lowest?.score || 75);

    let divergenceSummary = null;
    if (scoreSpread >= 15 && totalPersonas > 1) {
      divergenceSummary = `Significant divergence (${scoreSpread}pt spread across viewpoints).`;
    } else if (totalPersonas > 1) {
      divergenceSummary = `Strong consensus (narrow ${scoreSpread}pt variance across viewpoints).`;
    }

    // Top consensus headline
    let consensusHeadline = '';
    if (detectedPatterns.length > 0) {
      consensusHeadline = detectedPatterns[0].statement;
    } else if (overallAverage >= 80) {
      consensusHeadline = `Strong positive consensus across all ${totalPersonas} simulated audience viewpoints.`;
    } else {
      consensusHeadline = `Audience consensus indicates balanced engagement with room for structural polish.`;
    }

    // Strengths summary
    const allStrengths = [];
    reactions.forEach(r => {
      if (Array.isArray(r.strengths)) {
        r.strengths.forEach(s => allStrengths.push({ persona: r.personaName, text: s }));
      }
    });

    return {
      hasData: true,
      overallAverage,
      consensusSummary: consensusHeadline,
      patterns: detectedPatterns,
      divergenceSummary,
      scoreSpread,
      highestPersona: highest,
      lowestPersona: lowest,
      personaRankings,
      dimensionAverages,
      totalStrengthsCount: allStrengths.length,
      sampleStrengths: allStrengths.slice(0, 3),
      allIssuesCount: allIssues.length
    };
  },

  /**
   * Extracts the most prominent single issue from a persona reaction for quick display
   * @param {Object} reaction
   * @returns {string}
   */
  extractKeyIssue(reaction) {
    if (Array.isArray(reaction.issues) && reaction.issues.length > 0) {
      const observed = reaction.issues.find(i => typeof i === 'object' && i.type === 'observed_issue');
      if (observed && observed.description) {
        const d = observed.description.trim();
        return d.length > 115 ? d.slice(0, 112) + '...' : d;
      }
      const first = reaction.issues[0];
      const desc = (typeof first === 'string' ? first : first.description || 'Pacing and dialogue refinement noted.').trim();
      return desc.length > 115 ? desc.slice(0, 112) + '...' : desc;
    }
    if (Array.isArray(reaction.suggestions) && reaction.suggestions.length > 0) {
      const sug = reaction.suggestions[0].trim();
      return sug.length > 115 ? sug.slice(0, 112) + '...' : sug;
    }
    if (reaction.reaction) {
      const r = reaction.reaction.trim();
      return r.length > 115 ? r.slice(0, 112) + '...' : r;
    }
    return 'Candid viewpoint feedback provided.';
  }
};
