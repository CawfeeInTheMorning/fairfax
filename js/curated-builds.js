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
  }
];
