/*
 * Hand-curated builds recreated from player-made build screenshots,
 * credited via `author`. Shipped as static data (not localStorage) so
 * they show up in every visitor's Saved Builds list automatically — see
 * loadSavedBuilds in app.js, which merges this array in after the user's
 * own saved builds on every load. A build here uses the exact same shape
 * loadBuildFromLibrary already expects: {id, name, hero, author, savedAt,
 * sections}, where each section is {id, name, description, optional,
 * items, width, height} and each item is {category, file} (matching
 * SHOP_DATA in items-data.js).
 */

const CURATED_BUILDS = [
  {
    id: "curated-core-infernus-v2",
    name: "Core Infernus v2",
    hero: "infernus",
    author: "Crimson",
    savedAt: new Date("2026-08-30T00:00:00Z").getTime(),
    sections: [
      {
        id: "curated-infernus-v2-starters",
        name: "Starters",
        description: "",
        optional: false,
        width: 192,
        height: 190,
        items: [
          { category: "weapon", file: "Extended_Magazine.png" },
          { category: "spirit", file: "Extra_Spirit.png" }
        ]
      },
      {
        id: "curated-infernus-v2-lane",
        name: "Lane",
        description: "",
        optional: false,
        width: 612,
        height: 190,
        items: [
          { category: "vitality", file: "Enchanter's_Emblem.png" },
          { category: "spirit", file: "Improved_Spirit.png" },
          { category: "spirit", file: "Duration_Extender.png" },
          { category: "spirit", file: "Mystic_Vulnerability.png" },
          { category: "vitality", file: "Spirit_Lifesteal_(item).png" },
          { category: "weapon", file: "Rapid_Rounds.png" },
          { category: "weapon", file: "Toxic_Bullets.png" }
        ]
      },
      {
        id: "curated-infernus-v2-sustain",
        name: "",
        description: "",
        optional: true,
        width: 192,
        height: 190,
        items: [
          { category: "vitality", file: "Extra_Regen.png" },
          { category: "vitality", file: "Healing_Rite.png" }
        ]
      },
      {
        id: "curated-infernus-v2-core",
        name: "Core",
        description: "",
        optional: false,
        width: 360,
        height: 190,
        items: [
          { category: "weapon", file: "Spiritual_Overflow.png" },
          { category: "weapon", file: "Ricochet.png" },
          { category: "spirit", file: "Boundless_Spirit.png" },
          { category: "spirit", file: "Superior_Duration.png" }
        ]
      },
      {
        id: "curated-infernus-v2-green-options",
        name: "Green Options",
        description: "",
        optional: true,
        width: 612,
        height: 190,
        items: [
          { category: "vitality", file: "Grit.png" },
          { category: "vitality", file: "Weapon_Shielding.png" },
          { category: "vitality", file: "Spirit_Shielding.png" },
          { category: "vitality", file: "Enduring_Speed.png" },
          { category: "vitality", file: "Reactive_Barrier.png" },
          { category: "vitality", file: "Debuff_Reducer.png" },
          { category: "vitality", file: "Healbane.png" }
        ]
      },
      {
        id: "curated-infernus-v2-late-game",
        name: "Late Game",
        description: "",
        optional: false,
        width: 276,
        height: 190,
        items: [
          { category: "spirit", file: "Escalating_Exposure.png" },
          { category: "vitality", file: "Inhibitor.png" },
          { category: "vitality", file: "Indomitable.png" }
        ]
      },
      {
        id: "curated-infernus-v2-armors",
        name: "Armors",
        description: "At least 1 for Green Spike",
        optional: true,
        width: 528,
        height: 190,
        items: [
          { category: "vitality", file: "Spirit_Resilience.png" },
          { category: "vitality", file: "Bullet_Resilience.png" },
          { category: "vitality", file: "Metal_Skin.png" },
          { category: "vitality", file: "Dispel_Magic.png" },
          { category: "vitality", file: "Counterspell.png" },
          { category: "vitality", file: "Warp_Stone.png" }
        ]
      },
      {
        id: "curated-infernus-v2-situationals",
        name: "Situationals",
        description: "",
        optional: true,
        width: 948,
        height: 190,
        items: [
          { category: "weapon", file: "Titanic_Magazine.png" },
          { category: "weapon", file: "Swift_Striker.png" },
          { category: "weapon", file: "Burst_Fire.png" },
          { category: "weapon", file: "Escalating_Resilience.png" },
          { category: "weapon", file: "Silencer.png" },
          { category: "vitality", file: "Unstoppable.png" },
          { category: "vitality", file: "Spellbreaker.png" },
          { category: "vitality", file: "Plated_Armor.png" },
          { category: "vitality", file: "Juggernaut.png" },
          { category: "spirit", file: "Ethereal_Shift.png" },
          { category: "vitality", file: "Leech.png" }
        ]
      }
    ]
  },
  {
    id: "curated-pillow-fight-rem",
    name: "The World's Craziest Pillow Fight (L --> R)",
    hero: "rem",
    author: "bebungo",
    savedAt: new Date("2026-08-31T00:00:00Z").getTime(),
    sections: [
      {
        id: "curated-pillow-fight-rem-jammies",
        name: "Rem's Putting On His Jammies",
        description: "LANE PHASE: power, damage, & support",
        optional: false,
        width: 612,
        height: 190,
        items: [
          { category: "weapon", file: "Monster_Rounds.png" },
          { category: "spirit", file: "Extra_Spirit.png" },
          { category: "vitality", file: "Grit.png" },
          { category: "spirit", file: "Extra_Charge.png" },
          { category: "spirit", file: "Mystic_Expansion.png" },
          { category: "spirit", file: "Mystic_Burst.png" },
          { category: "spirit", file: "Improved_Spirit.png" }
        ]
      },
      {
        id: "curated-pillow-fight-rem-fluffing",
        name: "Rem's Fluffing Up His Pillows",
        description: "MID GAME: improve spirit & reduce cooldowns",
        optional: false,
        width: 612,
        height: 190,
        items: [
          { category: "vitality", file: "Guardian_Ward.png" },
          { category: "spirit", file: "Compress_Cooldown.png" },
          { category: "vitality", file: "Healing_Nova.png" },
          { category: "spirit", file: "Tankbuster.png" },
          { category: "spirit", file: "Torment_Pulse.png" },
          { category: "spirit", file: "Rapid_Recharge.png" },
          { category: "weapon", file: "Ballistic_Enchantment.png" }
        ]
      },
      {
        id: "curated-pillow-fight-rem-bricks",
        name: "Rem's Pillows Are Made of Bricks",
        description: "LATE GAME: healing & spirit power",
        optional: false,
        width: 612,
        height: 190,
        items: [
          { category: "spirit", file: "Surge_of_Power.png" },
          { category: "spirit", file: "Boundless_Spirit.png" },
          { category: "spirit", file: "Escalating_Exposure.png" },
          { category: "spirit", file: "Mystic_Reverb.png" },
          { category: "vitality", file: "Healing_Tempo.png" },
          { category: "spirit", file: "Lightning_Scroll.png" },
          { category: "spirit", file: "Spirit_Burn.png" }
        ]
      },
      {
        id: "curated-pillow-fight-rem-cantgetme",
        name: "HA, YOU CANT GET ME!",
        description: "",
        optional: true,
        width: 360,
        height: 190,
        items: [
          { category: "vitality", file: "Divine_Barrier.png" },
          { category: "vitality", file: "Cheat_Death.png" },
          { category: "spirit", file: "Cursed_Relic.png" },
          { category: "spirit", file: "Focus_Lens.png" }
        ]
      },
      {
        id: "curated-pillow-fight-rem-bullets",
        name: "BULLETS HURT? USE THESE.",
        description: "",
        optional: true,
        width: 276,
        height: 190,
        items: [
          { category: "vitality", file: "Bullet_Resilience.png" },
          { category: "vitality", file: "Metal_Skin.png" },
          { category: "spirit", file: "Disarming_Hex.png" }
        ]
      },
      {
        id: "curated-pillow-fight-rem-spiritdamage",
        name: "TOO MUCH SPIRIT DAMAGE? USE THESE.",
        description: "",
        optional: true,
        width: 360,
        height: 190,
        items: [
          { category: "vitality", file: "Dispel_Magic.png" },
          { category: "vitality", file: "Spirit_Resilience.png" },
          { category: "vitality", file: "Witchmail.png" },
          { category: "vitality", file: "Spellbreaker.png" }
        ]
      },
      {
        id: "curated-pillow-fight-rem-punches",
        name: "PUNCHES HURT? USE THESE.",
        description: "",
        optional: true,
        width: 192,
        height: 190,
        items: [
          { category: "vitality", file: "Juggernaut.png" },
          { category: "vitality", file: "Rebuttal.png" }
        ]
      },
      {
        id: "curated-pillow-fight-rem-enemyheals",
        name: "ENEMY HEALS? USE THESE.",
        description: "",
        optional: true,
        width: 192,
        height: 190,
        items: [
          { category: "vitality", file: "Healbane.png" },
          { category: "weapon", file: "Toxic_Bullets.png" }
        ]
      }
    ]
  },
  {
    id: "curated-piggy-support-rem",
    name: "Piggy's Support Rem (twitch.tv/piggyxdd)",
    hero: "rem",
    author: "Piggy",
    savedAt: new Date("2026-08-31T00:00:00Z").getTime(),
    sections: [
      {
        id: "curated-piggy-support-rem-early",
        name: "Early Game",
        description: "Max 3 or 4 after 2 depending on game",
        optional: false,
        width: 444,
        height: 190,
        items: [
          { category: "weapon", file: "High-Velocity_Rounds.png" },
          { category: "weapon", file: "Opening_Rounds.png" },
          { category: "spirit", file: "Extra_Charge.png" },
          { category: "vitality", file: "Trophy_Collector.png" },
          { category: "spirit", file: "Arcane_Surge.png" }
        ]
      },
      {
        id: "curated-piggy-support-rem-pick1",
        name: "Pick 1",
        description: "or 1 more",
        optional: false,
        width: 192,
        height: 190,
        items: [
          { category: "spirit", file: "Decay.png" },
          { category: "spirit", file: "Silence_Wave.png" }
        ]
      },
      {
        id: "curated-piggy-support-rem-miscearly",
        name: "Misc early",
        description: "",
        optional: true,
        width: 276,
        height: 190,
        items: [
          { category: "spirit", file: "Golden_Goose_Egg.png" },
          { category: "spirit", file: "Extra_Spirit.png" },
          { category: "vitality", file: "Healing_Rite.png" }
        ]
      },
      {
        id: "curated-piggy-support-rem-core",
        name: "CORE",
        description: "Buy actives!",
        optional: false,
        width: 276,
        height: 319,
        items: [
          { category: "vitality", file: "Healing_Booster.png" },
          { category: "vitality", file: "Restorative_Locket.png" },
          { category: "spirit", file: "Cursed_Relic.png" },
          { category: "spirit", file: "Duration_Extender.png" },
          { category: "spirit", file: "Superior_Duration.png" },
          { category: "spirit", file: "Improved_Spirit.png" }
        ]
      },
      {
        id: "curated-piggy-support-rem-actives",
        name: "Buy actives depending on games",
        description: "",
        optional: true,
        width: 444,
        height: 319,
        items: [
          { category: "weapon", file: "Heroic_Aura.png" },
          { category: "weapon", file: "Alchemical_Fire.png" },
          { category: "vitality", file: "Guardian_Ward.png" },
          { category: "vitality", file: "Healing_Nova.png" },
          { category: "vitality", file: "Rescue_Beam.png" },
          { category: "spirit", file: "Rusted_Barrel.png" },
          { category: "spirit", file: "Slowing_Hex.png" },
          { category: "spirit", file: "Cold_Front.png" },
          { category: "spirit", file: "Knockdown.png" },
          { category: "spirit", file: "Disarming_Hex.png" }
        ]
      },
      {
        id: "curated-piggy-support-rem-chonk",
        name: "chonk",
        description: "",
        optional: true,
        width: 276,
        height: 319,
        items: [
          { category: "vitality", file: "Grit.png" },
          { category: "vitality", file: "Spirit_Shielding.png" },
          { category: "vitality", file: "Reactive_Barrier.png" },
          { category: "vitality", file: "Weapon_Shielding.png" },
          { category: "vitality", file: "Healbane.png" },
          { category: "vitality", file: "Counterspell.png" }
        ]
      },
      {
        id: "curated-piggy-support-rem-late",
        name: "Late",
        description: "Buy depending on game (prio L-R)",
        optional: true,
        width: 528,
        height: 319,
        items: [
          { category: "spirit", file: "Scourge.png" },
          { category: "spirit", file: "Boundless_Spirit.png" },
          { category: "spirit", file: "Superior_Cooldown.png" },
          { category: "spirit", file: "Transcendent_Cooldown.png" },
          { category: "spirit", file: "Echo_Shard.png" },
          { category: "spirit", file: "Greater_Expansion.png" },
          { category: "vitality", file: "Divine_Barrier.png" },
          { category: "spirit", file: "Arctic_Blast.png" },
          { category: "vitality", file: "Healing_Tempo.png" },
          { category: "spirit", file: "Vortex_Web.png" },
          { category: "spirit", file: "Rapid_Recharge.png" },
          { category: "spirit", file: "Tankbuster.png" }
        ]
      },
      {
        id: "curated-piggy-support-rem-torment",
        name: "TORMENT",
        description: "",
        optional: true,
        width: 192,
        height: 319,
        items: [
          { category: "spirit", file: "Torment_Pulse.png" },
          { category: "spirit", file: "Suppressor.png" },
          { category: "spirit", file: "Mystic_Vulnerability.png" },
          { category: "spirit", file: "Bullet_Resist_Shredder.png" }
        ]
      }
    ]
  },
  {
    id: "curated-theta-zero-lazy-rem",
    name: "Theta Zero's \"WORK FOR ME\" LAZY REM SUPPORT BUILD",
    hero: "rem",
    author: "Theta Zero",
    savedAt: new Date("2026-08-31T00:00:00Z").getTime(),
    sections: [
      {
        id: "curated-theta-zero-lazy-rem-optionals",
        name: "OPTIONALS",
        description: "",
        optional: true,
        width: 192,
        height: 190,
        items: [
          { category: "spirit", file: "Golden_Goose_Egg.png" },
          { category: "spirit", file: "Mystic_Burst.png" }
        ]
      },
      {
        id: "curated-theta-zero-lazy-rem-phase1",
        name: "PHASE 1: LANING",
        description: "",
        optional: false,
        width: 192,
        height: 190,
        items: [
          { category: "spirit", file: "Extra_Charge.png" },
          { category: "vitality", file: "Healing_Booster.png" }
        ]
      },
      {
        id: "curated-theta-zero-lazy-rem-phase2",
        name: "PHASE 2: ROAMING",
        description: "Left-to-right. Swap Decay for a counter.",
        optional: false,
        width: 444,
        height: 190,
        items: [
          { category: "vitality", file: "Trophy_Collector.png" },
          { category: "spirit", file: "Compress_Cooldown.png" },
          { category: "weapon", file: "Heroic_Aura.png" },
          { category: "spirit", file: "Decay.png" },
          { category: "spirit", file: "Echo_Shard.png" }
        ]
      },
      {
        id: "curated-theta-zero-lazy-rem-gunbonus",
        name: "If you REALLY want the 4.8K gun bonus.",
        description: "",
        optional: true,
        width: 192,
        height: 190,
        items: [
          { category: "weapon", file: "Opening_Rounds.png" },
          { category: "weapon", file: "Fleetfoot.png" }
        ]
      },
      {
        id: "curated-theta-zero-lazy-rem-evil",
        name: "PHASE 3: HOW EVIL ARE YOU?",
        description: "PICK ONE, IF YOU DARE!",
        optional: true,
        width: 528,
        height: 190,
        items: [
          { category: "spirit", file: "Cursed_Relic.png" },
          { category: "spirit", file: "Scourge.png" },
          { category: "spirit", file: "Focus_Lens.png" },
          { category: "spirit", file: "Arctic_Blast.png" },
          { category: "weapon", file: "Alchemical_Fire.png" },
          { category: "vitality", file: "Divine_Barrier.png" }
        ]
      },
      {
        id: "curated-theta-zero-lazy-rem-endgame",
        name: "PHASE 4: THE ENDGAME BEGINS!",
        description: "Get this after in any order.",
        optional: false,
        width: 444,
        height: 190,
        items: [
          { category: "spirit", file: "Superior_Cooldown.png" },
          { category: "spirit", file: "Transcendent_Cooldown.png" },
          { category: "spirit", file: "Superior_Duration.png" },
          { category: "spirit", file: "Greater_Expansion.png" },
          { category: "spirit", file: "Rapid_Recharge.png" }
        ]
      },
      {
        id: "curated-theta-zero-lazy-rem-counters",
        name: "Counter-Items",
        description:
          "Buy one of these instead of (or with) Decay if you see more value in it. Swap it for a second tier 4 if you need one later.",
        optional: true,
        width: 948,
        height: 190,
        items: [
          { category: "spirit", file: "Silence_Wave.png" },
          { category: "vitality", file: "Restorative_Locket.png" },
          { category: "spirit", file: "Slowing_Hex.png" },
          { category: "spirit", file: "Knockdown.png" },
          { category: "vitality", file: "Rescue_Beam.png" },
          { category: "vitality", file: "Rebuttal.png" },
          { category: "vitality", file: "Reactive_Barrier.png" },
          { category: "vitality", file: "Debuff_Reducer.png" },
          { category: "spirit", file: "Disarming_Hex.png" },
          { category: "vitality", file: "Dispel_Magic.png" },
          { category: "spirit", file: "Vortex_Web.png" }
        ]
      },
      {
        id: "curated-theta-zero-lazy-rem-spendmoney",
        name: "\"I want to spend money.\"",
        description: "What a coincidence!",
        optional: false,
        width: 360,
        height: 190,
        items: [
          { category: "spirit", file: "Arcane_Surge.png" },
          { category: "vitality", file: "Counterspell.png" },
          { category: "vitality", file: "Healing_Tempo.png" },
          { category: "spirit", file: "Boundless_Spirit.png" }
        ]
      },
      {
        id: "curated-theta-zero-lazy-rem-dying",
        name: "\"I'm dying.\"",
        description: "Make sure to get Indomitable late game.",
        optional: true,
        width: 528,
        height: 190,
        items: [
          { category: "vitality", file: "Spirit_Shielding.png" },
          { category: "vitality", file: "Spirit_Resilience.png" },
          { category: "vitality", file: "Weapon_Shielding.png" },
          { category: "vitality", file: "Indomitable.png" },
          { category: "vitality", file: "Witchmail.png" },
          { category: "vitality", file: "Spellbreaker.png" }
        ]
      },
      {
        id: "curated-theta-zero-lazy-rem-nobrain",
        name: "\"I DO NOT HAVE A BRAIN.\"",
        description: "",
        optional: false,
        width: 108,
        height: 190,
        items: [{ category: "vitality", file: "Healing_Nova.png" }]
      }
    ]
  }
];
