/**
 * Predefined Demo Scene: "The Betrayal"
 * Allows creators and judges to instantly test and demonstrate the entire AudienceAI workflow
 * without having to manually type out a long screenplay scene.
 */

export const DEMO_SCENE = {
  id: 'scene-demo-the-betrayal',
  title: 'The Betrayal',
  subtitle: 'Act II • Scene 4',
  genre: 'Sci-Fi / Political Thriller',
  characters: ['Alex', 'Sarah', 'Marcus'],
  context: 'Alex and Sarah have spent three months infiltrating the high-security Obsidian Citadel to secure the Aegis Cipher. Marcus, their trusted handler, has just arrived at the rooftop extraction point, but his comms channel shows an active encryption bypass from the Citadel Security Council.',
  content: `EXT. OBSIDIAN CITADEL - ROOFTOP - NIGHT

Freezing rain lashes against the reinforced glass parapet. Neon reflections from the lower districts bleed into the dense smog.

SARAH (30s, tactical harness drenched) huddles over a holographic console, decrypting the Aegis Cipher. Her hands tremble from hypothermia.

ALEX (30s, combat-worn trench coat) scans the stormy horizon, plasma sidearm unholstered.

SARAH
(whispering, breathless)
Ninety-four percent. If Marcus isn't at the beacon in two minutes, the grid lockdown will incinerate our exit vector.

ALEX
He'll be here. Marcus never misses a drop.

A heavy hydraulic door slides open behind them. 

MARCUS (50s, grey-templed, immaculate council overcoat) steps into the rain. He is completely dry beneath an invisible atmospheric umbrella. 

He holds a suppressed kinetic pistol—pointed directly at Sarah's spine.

MARCUS
Shut it down, Sarah. Back away from the console.

Alex spins around, raising his sidearm, shock freezing his expression.

ALEX
Marcus? What are you doing? The extraction ship—

MARCUS
There is no ship, Alex. You were never meant to leave this roof with the cipher. The Council bought my retirement three years before you two even joined the syndicate.

SARAH
(eyes wide, furious)
You sent us into the reactor core. You let Kaelen die in the lower tunnels!

MARCUS
Kaelen was careless. You two were efficient. And now your efficiency has delivered the cipher directly to my superiors. Hand over the drive, Alex. Don't make me leave two more bodies on this roof.

Alex's grip on his weapon tightens. Rain cascades down his face. A tense, suffocating silence falls over the rooftop as lightning illuminates the skyline.`,
  wordCount: 268,
  readTime: '2 min read',
  status: 'Completed',
  lastSimulated: 'Ready to Simulate',
  isDemo: true,
  createdAt: new Date(Date.now() - 3600000).toISOString(),
  updatedAt: new Date().toISOString(),
  metrics: {
    tension: { score: 88, label: 'High Stakes Standoff', description: 'Immediate life-or-death confrontation on the rooftop.' },
    impact: { score: 82, label: 'Sharp Emotional Hook', description: 'Visceral shock of Marcus turning on his operatives.' },
    pacing: { score: 62, label: 'Abrupt Reveal', description: 'The betrayal turn happens very suddenly with minimal foreshadowing.' },
    consistency: { score: 84, label: 'World Logic Intact', description: 'Obsidian Citadel technology and security rules are consistent.' },
    clarity: { score: 90, label: 'Crystal Clear', description: 'Rooftop spatial layout and standoff positions are immediately obvious.' },
    humor: { score: 20, label: 'Grim & Tense', description: 'High dramatic gravity with zero comedic levity.' }
  }
};

export const DEMO_SCENES = [DEMO_SCENE];
