/**
 * Dedicated Audience Persona Configuration Module
 * Defines the core 4 audience viewpoints for story evaluation
 */

export const AUDIENCE_PERSONAS = [
  {
    id: 'casual-viewer',
    name: 'Casual Viewer',
    icon: 'Film',
    colorKey: 'casual',
    archetype: 'Entertainment & Engagement',
    description: 'Focuses on entertainment value, instant narrative clarity, and visceral excitement without getting bogged down by intricate lore.',
    personalityDescription: 'Watches for enjoyment and emotional thrill. Wants scenes to start with a strong hook, move at an engaging pace, and clearly communicate stakes and character actions.',
    focusAreas: [
      'Entertainment',
      'Clarity',
      'Engagement',
      'General emotional reaction'
    ],
    defaultSensitivity: 'High Pace Sensitivity',
    sampleReactionTone: 'Expressive, spontaneous, focuses on whether the scene kept their attention.'
  },
  {
    id: 'story-critic',
    name: 'Story Critic',
    icon: 'Feather',
    colorKey: 'critic',
    archetype: 'Structure, Craft & Arcs',
    description: 'Scrutinizes narrative architecture, pacing momentum, authentic character motivations, and dialogue subtext.',
    personalityDescription: 'Analyzes the craft behind the scene. Flags unearned dramatic shifts, on-the-nose exposition, illogical plot choices, and evaluates character psychological depth.',
    focusAreas: [
      'Narrative structure',
      'Pacing',
      'Character motivation',
      'Plot logic'
    ],
    defaultSensitivity: 'High Subtext Sensitivity',
    sampleReactionTone: 'Analytical, discerning, evaluates storytelling mechanics and emotional payoff.'
  },
  {
    id: 'lore-enthusiast',
    name: 'Lore Enthusiast',
    icon: 'Compass',
    colorKey: 'lore',
    archetype: 'World Logic & Canon',
    description: 'Tracks world-building systems, established canon consistency, historical backstory, and internal logic integrity.',
    personalityDescription: 'Invested in the mythology, magic rules, political factions, and timeline continuity. Checks that characters act according to their established history and constraints.',
    focusAreas: [
      'Continuity',
      'World-building',
      'Character history',
      'Internal consistency'
    ],
    defaultSensitivity: 'High Continuity Sensitivity',
    sampleReactionTone: 'Detail-oriented, encyclopedic, validates fictional world rules and foreshadowing.'
  },
  {
    id: 'emotional-viewer',
    name: 'Emotional Viewer',
    icon: 'Heart',
    colorKey: 'emotional',
    archetype: 'Empathy, Stakes & Catharsis',
    description: 'Deeply attuned to emotional resonance, interpersonal chemistry, vulnerability, heartbreak, and dramatic payoff.',
    personalityDescription: 'Connects deeply with character feelings and moral dilemmas. Wants to feel the weight of betrayal, romantic tension, grief, or triumphant catharsis.',
    focusAreas: [
      'Emotional impact',
      'Character relationships',
      'Emotional payoff',
      'Empathy'
    ],
    defaultSensitivity: 'High Chemistry Sensitivity',
    sampleReactionTone: 'Empathetic, heartfelt, focuses on character bond dynamics and vulnerability.'
  }
];

/**
 * Helper to get persona by ID
 * @param {string} id
 * @returns {Object|null}
 */
export const getPersonaById = (id) => {
  return AUDIENCE_PERSONAS.find(p => p.id === id) || null;
};

/**
 * Helper to get all default selected persona IDs
 * @returns {Array<string>}
 */
export const getDefaultPersonaIds = () => {
  return AUDIENCE_PERSONAS.map(p => p.id);
};
