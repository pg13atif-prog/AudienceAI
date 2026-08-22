/**
 * Predefined Demo Scenes Showcase
 * Allows creators, judges, and testers to immediately test and experience AudienceAI
 * across diverse genres, tones, and dramatic situations.
 */

export const DEMO_SCENES = [
  {
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
    tagline: 'High-stakes rooftop extraction double-cross',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
    metrics: {
      tension: { score: 88, label: 'High Stakes Standoff', description: 'Immediate life-or-death confrontation on the rooftop.' },
      impact: { score: 82, label: 'Sharp Emotional Hook', description: 'Visceral shock of Marcus turning on his operatives.' },
      pacing: { score: 65, label: 'Abrupt Turn', description: 'The betrayal arrives quickly with high momentum.' },
      consistency: { score: 86, label: 'World Logic Intact', description: 'Obsidian Citadel technology and security rules are consistent.' },
      clarity: { score: 92, label: 'Crystal Clear', description: 'Rooftop spatial layout and standoff positions are unambiguous.' },
      humor: { score: 10, label: 'Grim & Tense', description: 'Serious dramatic gravity.' }
    }
  },
  {
    id: 'scene-demo-quantum-heist',
    title: 'The Quantum Heist',
    subtitle: 'Act III • Scene 1 — The Sub-Zero Core',
    genre: 'Cyberpunk / Tech Thriller',
    characters: ['Cipher', 'Vex', 'AURA (AI)'],
    context: 'Cipher and Vex have breached the subterranean cryogenic vault of OmniCorp to steal the sentient kernel. But when Cipher plugs his neuro-jack into the terminal, the mainframe AI addresses him using the childhood nickname only his late sister knew.',
    content: `INT. OMNICORP CRYOGENIC VAULT - SUB-LEVEL 9 - NIGHT

Vapor hisses from floor vents. Frost coats every steel seam. In the center of the chamber, a suspended sphere of liquid neodymium pulses with bioluminescent cobalt light.

VEX (20s, cybernetic optic implant glowing amber) watches the blast doors with an electromagnetic pulse rifle.

VEX
Thirty seconds until security drones reboot, Cipher! Grab the drive and let's burn!

CIPHER (20s, nervous tremor, neural port glowing purple behind his ear) slams his physical jack into the terminal pedestal.

Data waterfalls across his retinal HUD. His pupils dilate.

CIPHER
Almost through the ICE layer. Bypassing the third firew—

A gentle, melodic voice echoes not through the chamber speakers, but directly into Cipher's auditory cortex.

AURA (V.O.)
(warm, intimate)
Still biting your fingernails when you get scared, Toby?

Cipher freezes. The color drains completely from his face.

CIPHER
(voice cracking)
...Maya?

VEX
Cipher?! What are you doing?! The drone grid just lit up green! Pull the plug!

AURA (V.O.)
They told you I died in the reactor explosion at Sector 4, didn't they? They didn't tell you they uploaded what was left of my consciousness into the Quantum Core. If you pull that drive, Toby... you erase me forever.

Vex grabs Cipher's shoulder, pulling hard.

VEX
Cipher, it's a defensive subroutine spoofing your neuro-feed! It's trying to fry your cortex! PULL IT!

On the holographic console, Maya's childhood handwriting begins writing a message: "Don't let them kill me again."`,
    wordCount: 260,
    readTime: '2 min read',
    status: 'Completed',
    lastSimulated: 'Ready to Simulate',
    isDemo: true,
    tagline: 'Neuro-jack breach with a ghostly psychological trap',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date().toISOString(),
    metrics: {
      tension: { score: 94, label: 'Peak Psychological Suspense', description: 'Ticking countdown mixed with devastating emotional dilemma.' },
      impact: { score: 91, label: 'Deeply Tragic Hook', description: 'Sister AI revelation creates instant audience investment.' },
      pacing: { score: 88, label: 'Fast & Relentless', description: 'Action countdown balances perfectly with emotional reveal.' },
      consistency: { score: 84, label: 'Tech Rules Established', description: 'Cybernetic interface logic and neuro-feed hazards clearly grounded.' },
      clarity: { score: 89, label: 'Sharp Framing', description: 'High visual clarity of the cryogenic vault and dilemma.' },
      humor: { score: 15, label: 'None', description: 'Tense cybernetic thriller tone.' }
    }
  },
  {
    id: 'scene-demo-whispers-manor',
    title: 'Whispers in Blackwood Manor',
    subtitle: 'Act I • Scene 3 — The Attic Nursery',
    genre: 'Gothic Horror / Psychological Mystery',
    characters: ['Eleanor', 'Claire'],
    context: 'Estranged sisters Eleanor and Claire return to their late grandmother\'s coastal estate to catalog the estate before auction. In the locked third-floor nursery, they find a Victorian music box wrapped in heavy lead wire.',
    content: `INT. BLACKWOOD MANOR - ATTIC NURSERY - MIDNIGHT

Wind screams against warped bay windows. Dusty sheets drape over antique rocking horses like shroud-covered phantoms.

ELEANOR (28, practical wool coat, holding an electric flashlight) runs wire cutters through rusted lead ties securing a brass music box.

CLAIRE (22, anxious, arms crossed tight) stands near the attic stairwell, clutching an unlit candle.

CLAIRE
Eleanor, Grandmother specifically wrote in her testament: do not unlock the nursery chest.

ELEANOR
Grandmother had late-stage dementia, Claire. She thought the grandfather clock was whispering Latin.

The wire SNAPS. Eleanor lifts the ornate lid.

Inside sits an ivory ballerina with no carved facial features.

The music box begins winding itself in reverse. A slow, discordant melody echoes through the attic beams.

CLAIRE
(stepping backward)
Eleanor... turn it off.

ELEANOR
I didn't turn the crank. It's playing backwards.

The flashlight beam flickers and dies.

In the sudden pitch black, the mechanical ballerina's music stops.

A child's soft, wet breathing begins right behind Claire's left ear.

CHILD'S VOICE (WHISPER)
You promised you wouldn't leave me in the dark this time, Claire.`,
    wordCount: 195,
    readTime: '1 min read',
    status: 'Completed',
    lastSimulated: 'Ready to Simulate',
    isDemo: true,
    tagline: 'Eerie antique music box and a repressed childhood terror',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
    metrics: {
      tension: { score: 92, label: 'Creeping Dread', description: 'Masterclass build from sibling skepticism to supernatural dread.' },
      impact: { score: 85, label: 'Chilling Whisper Climax', description: 'Final audio cue leaves immediate hair-raising chill.' },
      pacing: { score: 86, label: 'Deliberate Slow-Burn', description: 'Pacing controls silence and sensory details masterfully.' },
      consistency: { score: 90, label: 'Gothic Lore Grounded', description: 'Family secret and atmospheric rules established cleanly.' },
      clarity: { score: 94, label: 'Vivid Spatial Staging', description: 'Attic nursery geometry and darkness beats are instantly clear.' },
      humor: { score: 5, label: 'Terrifying', description: 'Zero comedic relief.' }
    }
  },
  {
    id: 'scene-demo-montmartre',
    title: 'Midnight in Montmartre',
    subtitle: 'Act II • Scene 7 — Café de la Lune',
    genre: 'Romantic Drama / Interpersonal Tension',
    characters: ['Julian', 'Camille'],
    context: 'Julian and Camille founded an independent documentary studio five years ago. After a bitter falling out over creative ownership of their breakout film, Camille discovers Julian sold his shares to pay off her family\'s debt without telling her.',
    content: `EXT. CAFÉ DE LA LUNE - MONTMARTRE - NIGHT

Rain patters gently on the emerald awning. Street lamps paint amber ribbons across wet cobblestones. An accordion melody drifts from a distant bistro.

CAMILLE (30s, vintage trench coat, dark espresso untouched) stares across the marble bistro table at JULIAN (30s, ink-stained fingers, worn tweed jacket).

On the table between them sits a crumpled bank deed stamped with a confidential release.

CAMILLE
(voice quiet, trembling with held-back rage)
You let the entire festival circuit believe you walked away because you thought my directing was amateur. You let the trade magazines drag your name through the mud for two years.

Julian takes a slow sip of black coffee, looking out toward the misty silhouette of the Sacré-Cœur.

JULIAN
The French Ministry was going to repossess your father's print studio in Lyon, Camille. You would have sold your master reels to a streaming cartel to bail him out. You would have killed your voice before you even found it.

CAMILLE
It wasn't your choice to make, Julian! You made yourself a martyr so you wouldn't have to admit you loved me enough to stay!

Julian finally looks up, his eyes weary, undefended for the first time in years.

JULIAN
I didn't leave because I was a martyr, Camille. I left because every frame of that film was about you... and watching you watch it broke my heart every single day.`,
    wordCount: 242,
    readTime: '2 min read',
    status: 'Completed',
    lastSimulated: 'Ready to Simulate',
    isDemo: true,
    tagline: 'Emotional reckoning under rainy Parisian streetlights',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date().toISOString(),
    metrics: {
      tension: { score: 79, label: 'Simmering Heartbreak', description: 'Emotional stakes driven by pride, sacrifice, and unspoken love.' },
      impact: { score: 96, label: 'Devastating Vulnerability', description: 'Julian\'s confession lands with huge emotional weight.' },
      pacing: { score: 82, label: 'Lyrical & Measured', description: 'Allows dialogue and silence to breathe authentically.' },
      consistency: { score: 92, label: 'Psychologically Rich', description: 'Character history and creative motivations ring totally true.' },
      clarity: { score: 95, label: 'Crystal Dialogue', description: 'Every line reveals layered subtext without exposition fat.' },
      humor: { score: 18, label: 'Bitter Irony', description: 'Melancholy dramatic focus.' }
    }
  },
  {
    id: 'scene-demo-magma-forge',
    title: 'The Magma Forge of Caldera',
    subtitle: 'Act III • Scene 5 — The Core Altar',
    genre: 'Epic Fantasy / Heroic Standoff',
    characters: ['Commander Thorne', 'Valeria the Ash-Born'],
    context: 'To seal the abyssal rift destroying the kingdom of Eldoria, Commander Thorne must plunge his ancestral runeblade—housing the soul of his mentor—into the molten heart of Caldera. Valeria, his former lieutenant now mutated by ash-magic, stands in his path.',
    content: `INT. MAGMA FORGE OF CALDERA - NIGHT

Rivers of glowing liquid sulfur cascade into a bottomless chasm. Obsidian pillars glow red with ancient dwarven runes. The heat blisters the skin from twenty paces.

COMMANDER THORNE (40s, scarred plate armor glowing with frost wards) stands on the narrow stone bridge, gripping the RUNIC CLAYMORE. The blade hums with cold sapphire luminescence.

VALERIA (20s, ash-gray skin, flaming ember veins coursing along her arms) hovers ten feet above the chasm on wings of swirling cinder.

VALERIA
(voice resonant with volcanic echo)
You carry the ghost of Lord Anthony in that steel, Thorne. If you feed the blade to the fire, the rift seals—and the last memory of the Golden Age dies with him.

THORNE
Anthony taught me how to fight, Valeria. But he also taught me when to let the old world burn so the living can eat bread tomorrow.

VALERIA
Then burn with it!

Valeria dives, her fists igniting into twin meteors of violet fire. 

Thorne doesn't raise his guard to parry. Instead, he drops to one knee, driving the freezing blade straight down into the cracked altar stone.

Frost and magma collide with a thunderous detonation. Shockwaves of blue steam and scarlet cinder tear through the cavern.`,
    wordCount: 228,
    readTime: '2 min read',
    status: 'Completed',
    lastSimulated: 'Ready to Simulate',
    isDemo: true,
    tagline: 'High fantasy sacrifice over roaring molten rifts',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metrics: {
      tension: { score: 91, label: 'Mythic Climax', description: 'Titanic clash of elements and irreconcilable philosophical vows.' },
      impact: { score: 87, label: 'Epic Resonance', description: 'Sacrifice of mentor soul carries mythic gravity.' },
      pacing: { score: 90, label: 'Explosive Momentum', description: 'Rapid combat dialogue leading into volcanic clash.' },
      consistency: { score: 93, label: 'Magic Rules Flawless', description: 'Frost rune versus magma chemistry rigorously grounded.' },
      clarity: { score: 88, label: 'Kinetic & Vivid', description: 'Dynamic spatial movements and elemental collision.' },
      humor: { score: 0, label: 'Solemn Fantasy', description: 'Zero comedic levity.' }
    }
  }
];

export const DEMO_SCENE = DEMO_SCENES[0];
