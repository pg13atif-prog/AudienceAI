/**
 * Audience Consensus & Pattern Analysis Engine
 * Calculates real pattern agreements, divergence points, and consensus takeaways
 * from simulated persona outputs without hardcoding.
 */

export const consensusService = {
  /**
   * Generates comprehensive consensus insights from an array of persona reactions
   * @param {Array<Object>} reactions
   * @returns {Object}
   */
  generateConsensus(reactions) {
    if (!reactions || reactions.length === 0) {
      return {
        hasData: false,
        overallAverage: 0,
        consensusSummary: 'No simulated audience data available.',
        topConcern: null,
        topStrength: null,
        divergenceSummary: null,
        personaRankings: [],
        dimensionAverages: {},
        patterns: []
      };
    }

    const totalPersonas = reactions.length;
    const overallSum = reactions.reduce((sum, r) => sum + (r.overallScore || 0), 0);
    const overallAverage = Math.round(overallSum / totalPersonas);

    // Dimension averages
    const dimensions = ['tensionScore', 'emotionalImpactScore', 'pacingScore', 'humorScore', 'consistencyScore', 'clarityScore'];
    const dimNames = {
      tensionScore: 'Tension',
      emotionalImpactScore: 'Emotional Impact',
      pacingScore: 'Pacing',
      humorScore: 'Humor',
      consistencyScore: 'Consistency',
      clarityScore: 'Clarity'
    };

    const dimensionAverages = {};
    dimensions.forEach(dim => {
      const sum = reactions.reduce((s, r) => s + (r[dim] || 0), 0);
      dimensionAverages[dim] = Math.round(sum / totalPersonas);
    });

    // Extract all issues and identify recurring keywords
    const allIssues = [];
    reactions.forEach(r => {
      if (Array.isArray(r.issues)) {
        r.issues.forEach(issue => {
          const desc = typeof issue === 'string' ? issue : issue.description || '';
          const type = typeof issue === 'object' ? issue.type : 'observed_issue';
          allIssues.push({
            personaId: r.personaId,
            personaName: r.personaName,
            type,
            text: desc,
            lower: desc.toLowerCase()
          });
        });
      }
    });

    // Detect keyword patterns across personas
    const topics = [
      { key: 'pacing', label: 'pacing rhythm', regex: /pacing|slow|drag|rush|momentum|lull|lag/i },
      { key: 'exposition', label: 'dialogue exposition', regex: /exposition|on-the-nose|tell not show|info-dump|unnatural|dialogue/i },
      { key: 'stakes', label: 'narrative stakes', regex: /stakes|tension|danger|consequence|threat|suspense/i },
      { key: 'character', label: 'character motivation', regex: /motivation|motive|agency|unearned|believable|psycholog/i },
      { key: 'lore', label: 'world-building logic', regex: /lore|rule|world|magic|logic|continuity|canon|timeline/i },
      { key: 'emotion', label: 'emotional connection', regex: /emotion|empathy|heart|feel|chemistry|vulnerab|care/i },
      { key: 'clarity', label: 'scene clarity', regex: /clarity|confus|unclear|where|who|spatial|orient/i }
    ];

    const detectedPatterns = [];
    topics.forEach(topic => {
      const matchingPersonas = new Set();
      allIssues.forEach(iss => {
        if (topic.regex.test(iss.text)) {
          matchingPersonas.add(iss.personaName);
        }
      });

      if (matchingPersonas.size > 0) {
        const count = matchingPersonas.size;
        const ratio = count / totalPersonas;
        detectedPatterns.push({
          topic: topic.key,
          label: topic.label,
          count,
          total: totalPersonas,
          personas: Array.from(matchingPersonas),
          isMajority: ratio >= 0.5,
          statement: `${count} of ${totalPersonas} personas identified ${topic.label} as an area for refinement.`
        });
      }
    });

    // Sort patterns by frequency
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
    const scoreSpread = highest.score - lowest.score;

    let divergenceSummary = null;
    if (scoreSpread >= 20 && totalPersonas > 1) {
      divergenceSummary = `Significant divergence (${scoreSpread}pt spread): ${highest.name} rated highest (${highest.score}/100), while ${lowest.name} was most critical (${lowest.score}/100).`;
    } else if (totalPersonas > 1) {
      divergenceSummary = `Strong audience consensus across personas (narrow ${scoreSpread}pt variance between viewpoints).`;
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
   * Extracts the most prominent single issue from a persona reaction for quick feed display
   * @param {Object} reaction
   * @returns {string}
   */
  extractKeyIssue(reaction) {
    if (Array.isArray(reaction.issues) && reaction.issues.length > 0) {
      const observed = reaction.issues.find(i => typeof i === 'object' && i.type === 'observed_issue');
      if (observed) {
        return observed.description;
      }
      const first = reaction.issues[0];
      return typeof first === 'string' ? first : first.description || 'Pacing/structure refinement noted.';
    }
    if (Array.isArray(reaction.suggestions) && reaction.suggestions.length > 0) {
      return reaction.suggestions[0];
    }
    return 'General feedback provided.';
  }
};
