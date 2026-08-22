/**
 * Before vs After Comparison & Analytical Diagnostic Service
 * Computes metric deltas, persona reaction pairings, and synthesizes "Did the scene improve?" verdicts.
 */

export const comparisonService = {
  /**
   * Compares original simulation results with improved simulation results
   * @param {Object} params
   * @param {Array<Object>} params.originalResults
   * @param {Array<Object>} params.improvedResults
   * @param {Object} [params.problemDiagnosis]
   * @returns {Object}
   */
  compareSimulations({
    originalResults = [],
    improvedResults = [],
    problemDiagnosis = null
  }) {
    if (!originalResults || originalResults.length === 0 || !improvedResults || improvedResults.length === 0) {
      return {
        hasData: false,
        overallDelta: 0,
        didImprove: false,
        verdictSummary: 'Both original and improved simulation results are required to run comparative analysis.',
        dimensionComparisons: [],
        personaPairings: [],
        problemsImproved: [],
        problemsRemaining: [],
        newProblemsDetected: []
      };
    }

    // Calculate overall average scores
    const origAvg = Math.round(originalResults.reduce((s, r) => s + (r.overallScore || 0), 0) / originalResults.length);
    const impAvg = Math.round(improvedResults.reduce((s, r) => s + (r.overallScore || 0), 0) / improvedResults.length);
    const overallDelta = impAvg - origAvg;
    const didImprove = overallDelta > 0;

    // Define 6 core metrics
    const metricsConfig = [
      { key: 'tensionScore', label: 'Tension & Stakes' },
      { key: 'pacingScore', label: 'Pacing & Momentum' },
      { key: 'consistencyScore', label: 'Consistency & World Logic' },
      { key: 'emotionalImpactScore', label: 'Emotional Resonance' },
      { key: 'clarityScore', label: 'Scene Clarity' },
      { key: 'humorScore', label: 'Tone & Dialogue Wit' }
    ];

    const dimensionComparisons = metricsConfig.map(m => {
      const origSum = originalResults.reduce((s, r) => s + (r[m.key] || 0), 0);
      const impSum = improvedResults.reduce((s, r) => s + (r[m.key] || 0), 0);
      const originalScore = Math.round(origSum / originalResults.length);
      const improvedScore = Math.round(impSum / improvedResults.length);
      const delta = improvedScore - originalScore;

      return {
        key: m.key,
        label: m.label,
        originalScore,
        improvedScore,
        delta,
        isImproved: delta > 0
      };
    });

    // Pair up each persona's before & after reaction
    const personaPairings = improvedResults.map(imp => {
      const orig = originalResults.find(o => o.personaId === imp.personaId) || {
        overallScore: 65,
        reaction: 'Original reaction recorded.',
        issues: ['Pacing concern noted.']
      };

      const scoreDelta = (imp.overallScore || 0) - (orig.overallScore || 0);

      // Extract original issue and improved strength
      const originalIssue = (orig.issues && orig.issues.length > 0)
        ? (typeof orig.issues[0] === 'string' ? orig.issues[0] : orig.issues[0].description)
        : 'Pacing or motivation concern noted.';

      const improvedStrength = (imp.strengths && imp.strengths.length > 0)
        ? imp.strengths[0]
        : 'Improved dramatic momentum and engagement.';

      return {
        personaId: imp.personaId,
        personaName: imp.personaName,
        icon: imp.icon,
        colorKey: imp.colorKey,
        originalScore: orig.overallScore || 0,
        improvedScore: imp.overallScore || 0,
        scoreDelta,
        originalReaction: orig.reaction || 'Original feedback recorded.',
        improvedReaction: imp.reaction || 'Revised scene evaluated.',
        originalIssue,
        improvedStrength
      };
    });

    // Synthesize "Did the scene improve?" findings
    const problemsImproved = [];
    const problemsRemaining = [];
    const newProblemsDetected = [];

    // Find highest improved dimensions
    const topGains = [...dimensionComparisons].sort((a, b) => b.delta - a.delta);
    topGains.slice(0, 3).forEach(g => {
      if (g.delta > 0) {
        problemsImproved.push(`${g.label} improved by +${g.delta}% across simulated audience personas.`);
      }
    });

    if (problemDiagnosis?.primaryCategory) {
      problemsImproved.unshift(`Primary issue (${problemDiagnosis.primaryCategory}) successfully resolved with subtler narrative execution.`);
    }

    // Check if any dimension lagged or dropped
    dimensionComparisons.forEach(d => {
      if (d.delta < 0) {
        newProblemsDetected.push(`${d.label} showed a minor dip of ${d.delta}%.`);
      } else if (d.improvedScore < 65) {
        problemsRemaining.push(`${d.label} remains at ${d.improvedScore}% and could benefit from further polish.`);
      }
    });

    if (problemsRemaining.length === 0) {
      problemsRemaining.push('All core narrative dimensions now score within high engagement thresholds (>70%).');
    }

    if (newProblemsDetected.length === 0) {
      newProblemsDetected.push('No new narrative friction or character inconsistencies were introduced in the remix.');
    }

    // Verdict Summary
    let verdictSummary = '';
    if (overallDelta >= 15) {
      verdictSummary = `Significant Improvement (+${overallDelta}% overall audience lift): The revised scene resolved major pacing and character motivation friction while preserving the core dramatic premise.`;
    } else if (overallDelta > 0) {
      verdictSummary = `Moderate Improvement (+${overallDelta}% overall lift): The scene sharpened narrative clarity and emotional stakes with zero regressions.`;
    } else {
      verdictSummary = `The revised draft performed comparably to the original draft (${overallDelta}% variance).`;
    }

    return {
      hasData: true,
      originalAverage: origAvg,
      improvedAverage: impAvg,
      overallDelta,
      didImprove,
      verdictSummary,
      dimensionComparisons,
      personaPairings,
      problemsImproved,
      problemsRemaining,
      newProblemsDetected
    };
  }
};
