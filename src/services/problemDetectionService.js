/**
 * AI Problem Detection & Story Diagnostics Engine
 * Identifies primary narrative friction, explains why it matters,
 * maps noticing personas, generates surgical suggestions, and balances with strengths.
 */

export const problemDetectionService = {
  /**
   * Diagnoses the primary issue and generates structured insights from simulated audience reactions
   * @param {Array<Object>} reactions
   * @param {Object} [metrics]
   * @param {Object} [scene]
   * @returns {Object}
   */
  diagnoseScene(reactions, metrics = {}, scene = null) {
    if (!reactions || reactions.length === 0) {
      return {
        hasData: false,
        primaryCategory: 'Pacing',
        primaryIssueTitle: 'Pacing & Transition Flow',
        primaryIssueSummary: 'No audience simulation data available yet to detect issues.',
        whyItMatters: 'Scenes require audience simulation to identify narrative blindspots and pacing dips.',
        noticingPersonas: [],
        suggestedImprovement: 'Run a simulation to generate AI audience diagnostics.',
        topStrengths: ['Original concept and character setup.'],
        severity: 'Minor Polish'
      };
    }

    const totalPersonas = reactions.length;

    // Categories definition
    const categories = [
      {
        key: 'Pacing',
        dim: 'pacingScore',
        regex: /pacing|slow|drag|rush|momentum|lull|lag|tempo|rushed/i,
        whyItMatters: 'Rushed or sluggish pacing disconnects audience engagement, causing critical dramatic beats to feel either unearned or drawn out.',
        suggestionTemplate: 'Adjust the scene rhythm by introducing a subtle transition beat or letting the pivotal moment breathe before the climax.'
      },
      {
        key: 'Character Motivation',
        dim: 'emotionalImpactScore',
        regex: /motivation|motive|agency|unearned|believable|psycholog|why did|reasoning/i,
        whyItMatters: 'When character choices feel dictated by the plot rather than internal psychological stakes, the audience loses emotional investment.',
        suggestionTemplate: 'Give the protagonist a clear personal hesitation or explicit reason that justifies their sudden decision.'
      },
      {
        key: 'Continuity',
        dim: 'consistencyScore',
        regex: /continuity|canon|timeline|previous|contradict|history|backstory/i,
        whyItMatters: 'Inconsistencies in world rules or character lore shatter narrative suspension of disbelief for detail-oriented fans.',
        suggestionTemplate: 'Ensure dialogue aligns with established world lore and previous character decisions without contradicting prior beats.'
      },
      {
        key: 'Clarity',
        dim: 'clarityScore',
        regex: /clarity|confus|unclear|where|spatial|muddled|vague|ambiguous/i,
        whyItMatters: 'Spatial or situational confusion forces the reader to pause and decode the scene mechanics rather than experiencing the drama.',
        suggestionTemplate: 'Clarify the spatial layout and immediate physical positioning of the characters in the opening action lines.'
      },
      {
        key: 'Logic',
        dim: 'consistencyScore',
        regex: /logic|illogical|makes no sense|convenient|contrived|plot hole/i,
        whyItMatters: 'Contrived plot conveniences undermine tension because the audience senses the author manipulating outcomes rather than natural consequences.',
        suggestionTemplate: 'Establish the physical or tactical constraints earlier so the outcome feels like an inevitable consequence rather than coincidence.'
      },
      {
        key: 'Emotional Payoff',
        dim: 'emotionalImpactScore',
        regex: /emotional payoff|catharsis|flat|hollow|underwhelming|care|resonan/i,
        whyItMatters: 'Without genuine emotional payoff, dramatic reveals fail to leave a lasting resonance with the audience.',
        suggestionTemplate: 'Deepen the interpersonal vulnerability between characters right before the key revelation.'
      },
      {
        key: 'Tone',
        dim: 'tensionScore',
        regex: /tone|jarring|shift|whiplash|melodrama|mood/i,
        whyItMatters: 'Jarring tonal shifts can make serious stakes feel melodramatic or unintentionally comedic.',
        suggestionTemplate: 'Harmonize the atmospheric descriptions and dialogue subtext to maintain consistent tonal gravity.'
      },
      {
        key: 'Consistency',
        dim: 'consistencyScore',
        regex: /consistent|rule|system|power|behavior/i,
        whyItMatters: 'Internal consistency is the foundation of world-building and character credibility.',
        suggestionTemplate: 'Reinforce the established ground rules before introducing high-stakes narrative complications.'
      },
      {
        key: 'Humor',
        dim: 'humorScore',
        regex: /humor|joke|wit|levity|banter/i,
        whyItMatters: 'Misplaced humor can defuse essential tension, while natural subtextual banter grounds relatable character bonds.',
        suggestionTemplate: 'Ensure dialogue banter serves character dynamics rather than puncturing dramatic tension.'
      }
    ];

    // Score and rank each category based on actual persona feedback
    const scoredCategories = categories.map(cat => {
      const noticing = [];
      
      reactions.forEach(r => {
        let matched = false;
        let matchedQuote = '';

        // Check persona issues
        if (Array.isArray(r.issues)) {
          r.issues.forEach(iss => {
            const text = typeof iss === 'string' ? iss : iss.description || '';
            if (cat.regex.test(text)) {
              matched = true;
              matchedQuote = text;
            }
          });
        }

        // Check persona general reaction quote
        if (!matched && cat.regex.test(r.reaction || '')) {
          matched = true;
          matchedQuote = r.reaction;
        }

        if (matched) {
          noticing.push({
            personaId: r.personaId,
            personaName: r.personaName,
            icon: r.icon,
            colorKey: r.colorKey,
            quote: matchedQuote || r.reaction
          });
        }
      });

      // Calculate score weight: more noticing personas + lower dimension score = higher priority issue
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

    // Sort to pick primary problem
    scoredCategories.sort((a, b) => b.severityScore - a.severityScore);
    const topCategory = scoredCategories[0];

    // Fallback if no specific category matched
    const primaryCategory = (topCategory && topCategory.count > 0) ? topCategory.key : 'Pacing';
    const noticingPersonas = (topCategory && topCategory.count > 0) ? topCategory.noticing : reactions.slice(0, 2).map(r => ({
      personaId: r.personaId,
      personaName: r.personaName,
      icon: r.icon,
      colorKey: r.colorKey,
      quote: r.reaction
    }));

    const count = noticingPersonas.length;

    // Generate concise summary
    let primaryIssueSummary = '';
    if (topCategory && topCategory.noticing.length > 0) {
      const topQuote = topCategory.noticing[0].quote;
      primaryIssueSummary = `${count} of ${totalPersonas} audience personas flagged ${topCategory.key.toLowerCase()} concerns: "${topQuote.length > 100 ? topQuote.slice(0, 97) + '...' : topQuote}"`;
    } else {
      primaryIssueSummary = `${count} of ${totalPersonas} audience personas recommended refining narrative pacing and dramatic transitions.`;
    }

    // Build specific surgical suggestion based on scene characters if available
    let suggestedImprovement = topCategory.suggestionTemplate;
    if (scene?.characters && scene.characters.length > 0) {
      const charName = scene.characters[0];
      if (primaryCategory === 'Character Motivation') {
        suggestedImprovement = `Add a subtle indication of ${charName}'s internal dilemma earlier in the scene, such as a suspicious hesitation or unresolved gesture.`;
      } else if (primaryCategory === 'Pacing') {
        suggestedImprovement = `Allow ${charName}'s reaction to register for a beat before the next dramatic escalation to heighten audience anticipation.`;
      }
    }

    // Collect top validated strengths across personas
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

    // If strengths are scarce, add high metric highlights
    if (allStrengths.length === 0) {
      if ((metrics.tension?.score || 80) >= 75) allStrengths.push('High narrative tension and dramatic stakes throughout the scene.');
      if ((metrics.impact?.score || 80) >= 75) allStrengths.push('Strong visceral emotional impact on audience personas.');
      if ((metrics.consistency?.score || 85) >= 80) allStrengths.push('Rock-solid world logic and atmospheric setting consistency.');
    }

    const severity = count >= Math.ceil(totalPersonas * 0.75) ? 'Critical' : count >= 2 ? 'Moderate' : 'Minor Polish';

    return {
      hasData: true,
      primaryCategory,
      primaryIssueTitle: `${primaryCategory} Friction`,
      primaryIssueSummary,
      whyItMatters: topCategory.whyItMatters,
      noticingPersonas,
      noticingCount: count,
      totalPersonas,
      suggestedImprovement,
      topStrengths: allStrengths.slice(0, 4),
      severity
    };
  }
};
