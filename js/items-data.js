/*
 * Deadlock shop item database.
 * Tier placement + ACTIVE/IMBUE flags transcribed from the in-game shop
 * reference screenshots. Item counts per category/tier were cross-checked
 * against the icon folders (spirit 49, vitality 53, weapon 53) and match
 * exactly, aside from two items that are currently absent from the live
 * shop (see LEGACY_ITEMS below).
 *
 * `desc` is intentionally blank — descriptions/stats get filled in later.
 */

const SHOP_DATA = {
  weapon: {
    label: "Weapon",
    folder: "weapon_icons",
    tiers: {
      800: [
        { name: "Close Quarters", file: "Close_Quarters.png" },
        { name: "Extended Magazine", file: "Extended_Magazine.png" },
        { name: "Headshot Booster", file: "Headshot_Booster.png" },
        { name: "High-Velocity Rounds", file: "High-Velocity_Rounds.png" },
        { name: "Monster Rounds", file: "Monster_Rounds.png" },
        { name: "Rapid Rounds", file: "Rapid_Rounds.png" },
        { name: "Restorative Shot", file: "Restorative_Shot.png" }
      ],
      1600: [
        { name: "Active Reload", file: "Active_Reload.png" },
        { name: "Fleetfoot", file: "Fleetfoot.png", active: true },
        { name: "Intensifying Magazine", file: "Intensifying_Magazine.png" },
        { name: "Kinetic Dash", file: "Kinetic_Dash.png" },
        { name: "Long Range", file: "Long_Range.png" },
        { name: "Melee Charge", file: "Melee_Charge.png" },
        { name: "Mystic Shot", file: "Mystic_Shot.png" },
        { name: "Opening Rounds", file: "Opening_Rounds.png" },
        { name: "Recharging Rush", file: "Recharging_Rush.png" },
        { name: "Slowing Bullets", file: "Slowing_Bullets.png" },
        { name: "Spirit Shredder Bullets", file: "Spirit_Shredder_Bullets.png" },
        { name: "Split Shot", file: "Split_Shot.png", active: true },
        { name: "Stalker", file: "Stalker.png" },
        { name: "Swift Striker", file: "Swift_Striker.png" },
        { name: "Titanic Magazine", file: "Titanic_Magazine.png" },
        { name: "Weakening Headshot", file: "Weakening_Headshot.png" }
      ],
      3200: [
        { name: "Alchemical Fire", file: "Alchemical_Fire.png", active: true },
        { name: "Ballistic Enchantment", file: "Ballistic_Enchantment.png", imbue: true },
        { name: "Berserker", file: "Berserker.png" },
        { name: "Blood Tribute", file: "Blood_Tribute.png", active: true },
        { name: "Burst Fire", file: "Burst_Fire.png", active: true },
        { name: "Cultist Sacrifice", file: "Cultist_Sacrifice.png", active: true },
        { name: "Escalating Resilience", file: "Escalating_Resilience.png" },
        { name: "Express Shot", file: "Express_Shot.png" },
        { name: "Headhunter", file: "Headhunter.png" },
        { name: "Heroic Aura", file: "Heroic_Aura.png", active: true },
        { name: "Hollow Point", file: "Hollow_Point.png" },
        { name: "Hunter's Aura", file: "Hunter's_Aura.png" },
        { name: "Point Blank", file: "Point_Blank.png" },
        { name: "Sharpshooter", file: "Sharpshooter.png" },
        { name: "Spirit Rend", file: "Spirit_Rend.png" },
        { name: "Tesla Bullets", file: "Tesla_Bullets.png" },
        { name: "Toxic Bullets", file: "Toxic_Bullets.png" },
        { name: "Weighted Shots", file: "Weighted_Shots.png" }
      ],
      6400: [
        { name: "Armor Piercing Rounds", file: "Armor_Piercing_Rounds.png" },
        { name: "Capacitor", file: "Capacitor.png", active: true },
        { name: "Crippling Headshot", file: "Crippling_Headshot.png" },
        { name: "Crushing Fists", file: "Crushing_Fists.png" },
        { name: "Frenzy", file: "Frenzy.png" },
        { name: "Glass Cannon", file: "Glass_Cannon.png" },
        { name: "Lucky Shot", file: "Lucky_Shot.png" },
        { name: "Ricochet", file: "Ricochet.png" },
        { name: "Shadow Weave", file: "Shadow_Weave.png", active: true },
        { name: "Silencer", file: "Silencer.png" },
        { name: "Spellslinger", file: "Spellslinger.png" },
        { name: "Spiritual Overflow", file: "Spiritual_Overflow.png" }
      ]
    }
  },

  vitality: {
    label: "Vitality",
    folder: "vitality_icons",
    tiers: {
      800: [
        { name: "Extra Health", file: "Extra_Health.png" },
        { name: "Extra Regen", file: "Extra_Regen.png" },
        { name: "Extra Stamina", file: "Extra_Stamina.png" },
        { name: "Grit", file: "Grit.png" },
        { name: "Healing Rite", file: "Healing_Rite.png", active: true },
        { name: "Melee Lifesteal", file: "Melee_Lifesteal.png" },
        { name: "Rebuttal", file: "Rebuttal.png" },
        { name: "Sprint Boots", file: "Sprint_Boots.png" }
      ],
      1600: [
        { name: "Battle Vest", file: "Battle_Vest.png" },
        { name: "Bullet Lifesteal", file: "Bullet_Lifesteal_(item).png" },
        { name: "Debuff Reducer", file: "Debuff_Reducer.png" },
        { name: "Enchanter's Emblem", file: "Enchanter's_Emblem.png" },
        { name: "Enduring Speed", file: "Enduring_Speed.png" },
        { name: "Guardian Ward", file: "Guardian_Ward.png", active: true },
        { name: "Healbane", file: "Healbane.png" },
        { name: "Healing Booster", file: "Healing_Booster.png" },
        { name: "Reactive Barrier", file: "Reactive_Barrier.png", active: true },
        { name: "Restorative Locket", file: "Restorative_Locket.png", active: true },
        { name: "Return Fire", file: "Return_Fire.png", active: true },
        { name: "Spirit Lifesteal", file: "Spirit_Lifesteal_(item).png" },
        { name: "Spirit Shielding", file: "Spirit_Shielding.png" },
        { name: "Trophy Collector", file: "Trophy_Collector.png" },
        { name: "Weapon Shielding", file: "Weapon_Shielding.png" }
      ],
      3200: [
        { name: "Bullet Resilience", file: "Bullet_Resilience.png" },
        { name: "Counterspell", file: "Counterspell.png" },
        { name: "Dispel Magic", file: "Dispel_Magic.png", active: true },
        { name: "Fortitude", file: "Fortitude.png" },
        { name: "Fury Trance", file: "Fury_Trance.png", active: true },
        { name: "Healing Nova", file: "Healing_Nova.png", active: true },
        { name: "Lifestrike", file: "Lifestrike.png", active: true },
        { name: "Majestic Leap", file: "Majestic_Leap.png", active: true },
        { name: "Metal Skin", file: "Metal_Skin.png", active: true },
        { name: "Rescue Beam", file: "Rescue_Beam.png", active: true },
        { name: "Spirit Resilience", file: "Spirit_Resilience.png" },
        { name: "Stamina Mastery", file: "Stamina_Mastery.png" },
        { name: "Veil Walker", file: "Veil_Walker.png", active: true },
        { name: "Warp Stone", file: "Warp_Stone.png", active: true }
      ],
      6400: [
        { name: "Cheat Death", file: "Cheat_Death.png", active: true },
        { name: "Colossus", file: "Colossus.png", active: true },
        { name: "Divine Barrier", file: "Divine_Barrier.png", active: true },
        { name: "Diviner's Kevlar", file: "Diviner's_Kevlar.png" },
        { name: "Healing Tempo", file: "Healing_Tempo.png" },
        { name: "Indomitable", file: "Indomitable.png" },
        { name: "Infuser", file: "Infuser.png", active: true },
        { name: "Inhibitor", file: "Inhibitor.png", active: true },
        { name: "Juggernaut", file: "Juggernaut.png" },
        { name: "Leech", file: "Leech.png", active: true },
        { name: "Phantom Strike", file: "Phantom_Strike.png", active: true },
        { name: "Plated Armor", file: "Plated_Armor.png" },
        { name: "Siphon Bullets", file: "Siphon_Bullets.png" },
        { name: "Spellbreaker", file: "Spellbreaker.png" },
        { name: "Unstoppable", file: "Unstoppable.png", active: true },
        { name: "Vampiric Burst", file: "Vampiric_Burst.png", active: true },
        { name: "Witchmail", file: "Witchmail.png" }
      ]
    }
  },

  spirit: {
    label: "Spirit",
    folder: "spirit_icons",
    tiers: {
      800: [
        { name: "Extra Spirit", file: "Extra_Spirit.png" },
        { name: "Golden Goose Egg", file: "Golden_Goose_Egg.png", active: true },
        { name: "Mystic Burst", file: "Mystic_Burst.png" },
        { name: "Mystic Expansion", file: "Mystic_Expansion.png", imbue: true },
        { name: "Mystic Regeneration", file: "Mystic_Regeneration.png" },
        { name: "Rusted Barrel", file: "Rusted_Barrel.png", active: true },
        { name: "Spirit Strike", file: "Spirit_Strike.png" }
      ],
      1600: [
        { name: "Arcane Surge", file: "Arcane_Surge.png" },
        { name: "Bullet Resist Shredder", file: "Bullet_Resist_Shredder.png" },
        { name: "Cold Front", file: "Cold_Front.png", active: true },
        { name: "Compress Cooldown", file: "Compress_Cooldown.png", imbue: true },
        { name: "Duration Extender", file: "Duration_Extender.png", imbue: true },
        { name: "Improved Spirit", file: "Improved_Spirit.png" },
        { name: "Mystic Slow", file: "Mystic_Slow.png" },
        { name: "Mystic Vulnerability", file: "Mystic_Vulnerability.png" },
        { name: "Quicksilver Reload", file: "Quicksilver_Reload.png", imbue: true },
        { name: "Slowing Hex", file: "Slowing_Hex.png", active: true },
        { name: "Spirit Sap", file: "Spirit_Sap.png", active: true },
        { name: "Suppressor", file: "Suppressor.png" }
      ],
      3200: [
        { name: "Decay", file: "Decay.png", active: true },
        { name: "Disarming Hex", file: "Disarming_Hex.png", active: true },
        { name: "Greater Expansion", file: "Greater_Expansion.png", active: true },
        { name: "Knockdown", file: "Knockdown.png" },
        { name: "Radiant Regeneration", file: "Radiant_Regeneration.png" },
        { name: "Silence Wave", file: "Silence_Wave.png", active: true },
        { name: "Spirit Snatch", file: "Spirit_Snatch.png", active: true },
        { name: "Superior Cooldown", file: "Superior_Cooldown.png" },
        { name: "Superior Duration", file: "Superior_Duration.png" },
        { name: "Surge of Power", file: "Surge_of_Power.png", imbue: true },
        { name: "Tankbuster", file: "Tankbuster.png" },
        { name: "Torment Pulse", file: "Torment_Pulse.png" }
      ],
      6400: [
        { name: "Arctic Blast", file: "Arctic_Blast.png", active: true },
        { name: "Boundless Spirit", file: "Boundless_Spirit.png", active: true },
        { name: "Cursed Relic", file: "Cursed_Relic.png", active: true, imbue: true },
        { name: "Echo Shard", file: "Echo_Shard.png", active: true, imbue: true },
        { name: "Escalating Exposure", file: "Escalating_Exposure.png", active: true },
        { name: "Ethereal Shift", file: "Ethereal_Shift.png", active: true },
        { name: "Focus Lens", file: "Focus_Lens.png", active: true },
        { name: "Lightning Scroll", file: "Lightning_Scroll.png", active: true },
        { name: "Magic Carpet", file: "Magic_Carpet.png", active: true },
        { name: "Mercurial Magnum", file: "Mercurial_Magnum.png", imbue: true },
        { name: "Mystic Reverb", file: "Mystic_Reverb.png", imbue: true },
        { name: "Refresher", file: "Refresher.png", active: true },
        { name: "Scourge", file: "Scourge.png", active: true },
        { name: "Spirit Burn", file: "Spirit_Burn.png", active: true },
        { name: "Transcendent Cooldown", file: "Transcendent_Cooldown.png", active: true },
        { name: "Vortex Web", file: "Vortex_Web.png", active: true }
      ]
    }
  }
};

// Present in the icon folder but not currently placed in any tier in the
// reference screenshots (shown greyed-out/disabled in-game). Kept out of
// the rendered grid for now — flag here so they aren't mistaken for
// missing files later.
const LEGACY_ITEMS = {
  spirit: ["Extra_Charge.png", "Rapid_Recharge.png"]
};

// Maps the short icon codes used below (and in the "Icon Reference" sheet
// of item_data.xlsx) to their actual filename in stat_icons/.
const STAT_ICON_FILES = {
  "abilities": "abilities-icon.png",
  "ability-cooldown": "ability-cooldown-icon.png",
  "ability-duration": "ability-duration-icon.png",
  "ability-range": "ability-range-icon.png",
  "ammo": "ammo-icon.png",
  "bonus-ability-charges": "bonus-ability-charges-icon.png",
  "build-up": "build-up-icon.png",
  "bullet-damage": "bullet-damage-icon.png",
  "bullet-evasion": "bullet-evasion-icon.png",
  "bullet-velocity": "bullet-velocity-icon.png",
  "charge-up": "charge-up-icon.png",
  "damage-amplification": "damage-amplification-icon.png",
  "damage-barrier": "damage-barrier-icon.png",
  "damage-per-second": "damage-per-second-icon.png",
  "damage-resistance": "damage-resistance-icon.png",
  "dash-distance": "stamina-icon.png",
  "debuff-resist": "debuff-resist-icon.png",
  "duration": "duration-icon.png",
  "fire-rate": "fire-rate-icon.png",
  "health": "health-icon.png",
  "hero-attributes-table": "hero-attributes-table-icon.png",
  "imbue": "imbue-icon.png",
  "lifesteal": "lifesteal-icon.png",
  "melee-damage": "melee-damage-icon.png",
  "melee-distance": "melee-distance-icon.png",
  "move-speed": "move-speed-icon.png",
  "movement-slow": "movement-slow-icon.png",
  "pure-damage": "pure-damage-icon.png",
  "reload-time": "reload-time-icon.png",
  "slide-distance": "slide-distance-icon.png",
  "souls": "souls_icon.png",
  "spirit-damage": "spirit-damage-icon.png",
  "spirit-power": "spirit-power-icon.png",
  "spirit-scaling": "spirit-scaling-icon.png",
  "stack": "stack-icon.png",
  "stamina": "stamina-icon.png",
  "status-bleed": "status effects/bleed-status.png",
  "status-burn": "status effects/burn-status.webp",
  "status-damage-reduction": "status effects/damage-per-second-status.webp",
  "status-disarm": "status effects/disarm-status.webp",
  "status-move-slow": "status effects/move-slow-status.png",
  "status-silence": "status effects/silence-status.webp",
  "status-stun": "status effects/stun-status.webp",
  "status-weapon-damage-buff": "status effects/bullet-damage-status.webp",
  "weapon-damage": "weapon-damage-icon.png"
};

// Global per-category Soul investment tiers — the sum of every owned
// item's soul cost within a category (weapon/vitality/spirit, regardless
// of which specific items), capped at 28,800, grants a passive stat bonus
// looked up here. weapon/vitality values are percentages; spirit is a
// flat stat value (matches the in-game reference table's own display
// convention). The 4,800 row is the game's "milestone" threshold. Not to
// be confused with TIER_ORDER in app.js (item price tiers) — a different
// concept that happens to share numbers at the low end.
const INVESTMENT_TIERS = [
  { souls: 800, weapon: 9, vitality: 9, spirit: 7 },
  { souls: 1600, weapon: 12, vitality: 12, spirit: 11 },
  { souls: 2400, weapon: 15, vitality: 15, spirit: 15 },
  { souls: 3200, weapon: 18, vitality: 20, spirit: 19 },
  { souls: 4800, weapon: 46, vitality: 38, spirit: 38, milestone: true },
  { souls: 6400, weapon: 54, vitality: 42, spirit: 45 },
  { souls: 8000, weapon: 62, vitality: 46, spirit: 52 },
  { souls: 11200, weapon: 74, vitality: 50, spirit: 59 },
  { souls: 16000, weapon: 86, vitality: 54, spirit: 66 },
  { souls: 22400, weapon: 100, vitality: 60, spirit: 75 },
  { souls: 28800, weapon: 115, vitality: 66, spirit: 100 }
];

/*
 * Rich tooltip content, filled in later from item_data.xlsx. Keyed as
 * "category:File_Name.png". Shape per entry:
 *
 * {
 *   innateStats: [
 *     "+8 Spirit Power",                          // plain line, default color
 *     { text: "-10% Damage Penalty", color: "red" } // or tinted, same colors as boxes below
 *   ],
 *   abilities: [{
 *     type: "Passive" | "Active",
 *     cooldown: "30s",                          // omit if none shown
 *     description: "Inflict **bold** text...",  // ** = highlighted span
 *     extraText: [                              // optional, rendered in order after description
 *       { text: "Second paragraph, not italic." },
 *       { text: "Small italic side-note.", italic: true }
 *     ],
 *     boxes: [{
 *       type: "stat" | "status_effect" | "footer",
 *       icon: "ability-range",                  // key into STAT_ICON_FILES
 *       value: "20m",
 *       label: "Cast Range",
 *       color: "white" | "purple" | "orange" | "green" | "red",
 *       conditional: true,                      // optional
 *       scaling: "0.10"                         // optional, the "x0.10" badge
 *     }, ...]
 *   }, ...],
 *   upgradesFrom: "Item Name" | ["Name1", "Name2"],  // optional, a base item can feed multiple upgrades
 *   upgradesTo: "Item Name" | ["Name1", "Name2"]      // optional
 * }
 */
const ITEM_DETAILS = {
  "spirit:Decay.png": {
    innateStats: ["+8 Spirit Power", "+65 Bonus Health"],
    abilities: [
      {
        type: "Active",
        cooldown: "30s",
        description:
          "Inflict **damage over time**{{icon:status-bleed}} to a target, dealing damage based on their current health. " +
          "Decay's damage is non-lethal and does not apply item procs.",
        boxes: [
          { type: "stat", icon: "ability-range", value: "20m", label: "Cast Range", color: "white", scaling: "0.10" },
          { type: "stat", icon: "damage-per-second", value: "2.6%/sec", label: "Bleed Damage", color: "purple", scaling: "0.00" },
          { type: "stat", icon: "status-damage-reduction", value: "-50%", label: "Healing Reduction", color: "red", conditional: true },
          { type: "footer", icon: "ability-duration", value: "10s", label: "Duration", color: "white" }
        ]
      }
    ]
  },

  "spirit:Extra_Charge.png": {
    innateStats: ["+1 Bonus Ability Charges", "+7 Bonus Spirit Power for Charged Abilities"],
    upgradesTo: "Rapid Recharge"
  },

  "spirit:Extra_Spirit.png": {
    innateStats: ["+10 Spirit Power"],
    upgradesTo: ["Improved Spirit", "Surge of Power"]
  },

  "spirit:Golden_Goose_Egg.png": {
    innateStats: [{ text: "-10% Damage Penalty", color: "red" }, "+1m Sprint Speed", "+1 Out of Combat Regen"],
    abilities: [
      {
        type: "Active",
        description: "Hatch the egg, gaining **souls** and **permanent buffs**.",
        extraText: [
          { text: "The value of the egg grows the longer you hold onto it." },
          { text: "Gain a permanent buff per 80 Souls accrued when hatched.", italic: true }
        ],
        boxes: [{ type: "footer", icon: "souls", value: "90", label: "Soul Value per Minute", color: "white" }]
      }
    ]
  },

  "spirit:Mystic_Burst.png": {
    abilities: [
      {
        type: "Passive",
        description:
          "Charges up over time with **bonus spirit damage**, causing abilities dealing more than **80** damage to deal additional damage.",
        boxes: [
          { type: "stat", icon: "spirit-damage", value: "40", label: "Bonus Damage", color: "purple" },
          { type: "stat", icon: "charge-up", value: "14s", label: "Charge-Up Time", color: "white" }
        ]
      }
    ],
    upgradesTo: "Tankbuster"
  },

  "spirit:Mystic_Expansion.png": {
    abilities: [
      {
        type: "Passive",
        description: "Imbue an ability to increase its **range** and **effect radius**.",
        boxes: [{ type: "stat", icon: "ability-range", value: "+20%", label: "Ability Range", color: "purple" }]
      }
    ],
    upgradesTo: ["Greater Expansion", "Ballistic Enchantment"]
  },

  "spirit:Mystic_Regeneration.png": {
    innateStats: ["+50 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        description:
          "Dealing **spirit damage** to enemy Heroes grants you Bonus **regeneration**. Stacks when dealing damage to different heroes.",
        boxes: [{ type: "stat", icon: "health", value: "4 HP/s", label: "Regeneration", color: "green" }]
      }
    ],
    upgradesTo: "Radiant Regeneration"
  },

  "spirit:Rusted_Barrel.png": {
    innateStats: ["+60 Bonus Health", "+0.5m Sprint Speed"],
    abilities: [
      {
        type: "Active",
        cooldown: "16s",
        description: "Target an enemy to reduce their **Fire Rate** and **Bullet Resistance**.",
        boxes: [
          { type: "stat", icon: "fire-rate", value: "-32%", label: "Fire Rate", color: "orange" },
          { type: "stat", icon: "damage-resistance", value: "-8%", label: "Bullet Resist", color: "green", conditional: true },
          { type: "footer", icon: "ability-range", value: "32m", label: "Cast Range", color: "white" },
          { type: "footer", icon: "ability-duration", value: "5s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesTo: "Disarming Hex"
  },

  "spirit:Spirit_Strike.png": {
    abilities: [
      {
        type: "Passive",
        cooldown: "8s",
        description:
          "When you perform a **Light or Heavy Melee** attack against a hero, deal extra **spirit damage** with the attack and reduce the target's **Spirit Resist**.",
        extraText: [{ text: "Cooldown is 2x longer for Light Melee hits.", italic: true }],
        boxes: [
          { type: "stat", icon: "spirit-damage", value: "40", label: "Spirit Damage", color: "purple", scaling: "0.37" },
          { type: "stat", icon: "damage-resistance", value: "-6%", label: "Spirit Resist", color: "green", conditional: true },
          { type: "footer", icon: "ability-duration", value: "6s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesTo: "Spirit Snatch"
  },

  "spirit:Arcane_Surge.png": {
    innateStats: ["+1 Stamina", "+12% Stamina Recovery"],
    abilities: [
      {
        type: "Passive",
        description:
          "After you **Dash-Jump**, the next ability you use within **7s** will have bonus **Range, Duration,** and **Spirit Power**.",
        boxes: [
          { type: "stat", icon: "ability-range", value: "+12%", label: "Ability Range", color: "purple", conditional: true },
          { type: "stat", icon: "ability-duration", value: "+15%", label: "Ability Duration", color: "purple", conditional: true },
          { type: "stat", icon: "spirit-power", value: "+20", label: "Spirit Power", color: "purple", conditional: true },
          { type: "footer", icon: "ability-duration", value: "7s", label: "Cast Window", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Extra Stamina"
  },

  "spirit:Bullet_Resist_Shredder.png": {
    innateStats: ["+9% Bullet Resist", "+9% Weapon Damage"],
    abilities: [
      {
        type: "Passive",
        description: "Reduces **Bullet Resist** on enemies when you deal **spirit damage**.",
        boxes: [
          { type: "stat", icon: "damage-resistance", value: "-10%", label: "Bullet Resist", color: "green", conditional: true },
          { type: "footer", icon: "ability-duration", value: "8s", label: "Duration", color: "white" }
        ]
      }
    ]
  },

  "spirit:Cold_Front.png": {
    innateStats: ["+6% Spirit Resist"],
    abilities: [
      {
        type: "Active",
        cooldown: "25s",
        description: "Release an expanding ice blast that deals **spirit damage** and **Slows** targets it hits.",
        boxes: [
          { type: "stat", icon: "spirit-damage", value: "95", label: "Damage", color: "purple", scaling: "0.47" },
          { type: "stat", icon: "status-move-slow", value: "-60%", label: "Move Speed", color: "purple", conditional: true },
          { type: "stat", icon: "ability-duration", value: "4s", label: "Duration", color: "purple" },
          { type: "footer", icon: "ability-range", value: "10m", label: "End Radius", color: "white" }
        ]
      }
    ],
    upgradesTo: "Arctic Blast"
  },

  "spirit:Compress_Cooldown.png": {
    abilities: [
      {
        type: "Passive",
        description: "Imbue an ability to reduce its **Cooldown**.",
        boxes: [{ type: "stat", icon: "ability-cooldown", value: "+18%", label: "Ability Cooldown Reduction", color: "purple" }]
      }
    ],
    upgradesTo: "Superior Cooldown"
  },

  "spirit:Duration_Extender.png": {
    abilities: [
      {
        type: "Passive",
        description: "Imbue an ability to increase its **Duration**.",
        boxes: [{ type: "stat", icon: "ability-duration", value: "+22%", label: "Ability Duration", color: "purple" }]
      }
    ],
    upgradesTo: "Superior Duration"
  },

  "spirit:Improved_Spirit.png": {
    innateStats: ["+18 Spirit Power", "+1.5 Out of Combat Regen"],
    upgradesFrom: "Extra Spirit",
    upgradesTo: "Boundless Spirit"
  },

  "spirit:Mystic_Slow.png": {
    innateStats: ["+50 Bonus Health", "+0.75m Sprint Speed"],
    abilities: [
      {
        type: "Passive",
        description: "When the target takes **spirit damage**, they have their **Move Speed** reduced.",
        boxes: [
          { type: "stat", icon: "status-move-slow", value: "-30%", label: "Move Speed", color: "purple", conditional: true },
          { type: "stat", icon: "dash-distance", value: "-12%", label: "Dash Distance", color: "purple", conditional: true },
          { type: "footer", icon: "ability-duration", value: "2s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesTo: "Lightning Scroll"
  },

  "spirit:Mystic_Vulnerability.png": {
    innateStats: ["+8% Spirit Resist"],
    abilities: [
      {
        type: "Passive",
        description: "When an enemy takes **spirit damage**, they have their **spirit resist** reduced.",
        boxes: [
          { type: "stat", icon: "damage-resistance", value: "-8%", label: "Spirit Resist", color: "green", conditional: true },
          { type: "footer", icon: "ability-duration", value: "7s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesTo: "Escalating Exposure"
  },

  "spirit:Quicksilver_Reload.png": {
    abilities: [
      {
        type: "Passive",
        description:
          "Your imbued ability charges up over time with **bonus spirit damage**, **bonus fire rate**, and reloads bullets on use.",
        boxes: [
          { type: "stat", icon: "spirit-damage", value: "44", label: "Damage", color: "purple", scaling: "0.16" },
          { type: "stat", icon: "fire-rate", value: "+10%", label: "Fire Rate", color: "orange" },
          { type: "stat", icon: "ammo", value: "100%", label: "Bullets Reloaded", color: "white" },
          { type: "footer", icon: "charge-up", value: "18s", label: "Charge-Up Time", color: "white" }
        ]
      }
    ],
    upgradesTo: "Mercurial Magnum"
  },

  "spirit:Slowing_Hex.png": {
    innateStats: ["+0.5m Sprint Speed"],
    abilities: [
      {
        type: "Active",
        cooldown: "27s",
        description: "**Slows movement** of enemy target. Also **Silences** their **movement-based items and abilities**.",
        extraText: [
          { text: "Increases the target's gravity.", italic: true },
          { text: "Does not affect target's stamina usage.", italic: true }
        ],
        boxes: [
          { type: "stat", icon: "status-move-slow", value: "-20%", label: "Move Speed", color: "purple", conditional: true },
          { type: "stat", icon: "dash-distance", value: "-30%", label: "Dash Distance", color: "purple", conditional: true },
          { type: "footer", icon: "ability-range", value: "25m", label: "Cast Range", color: "white" },
          { type: "footer", icon: "ability-duration", value: "3.5s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesTo: "Vortex Web"
  },

  "spirit:Spirit_Sap.png": {
    innateStats: ["+50 Bonus Health"],
    abilities: [
      {
        type: "Active",
        cooldown: "18s",
        description: "Target an enemy to **reduce their Spirit Resist** and **Spirit Power**.",
        boxes: [
          { type: "stat", icon: "damage-resistance", value: "-9%", label: "Spirit Resist", color: "green", conditional: true },
          { type: "stat", icon: "spirit-power", value: "-30", label: "Spirit Power", color: "purple" },
          { type: "stat", icon: "ability-duration", value: "12s", label: "Duration", color: "white" },
          { type: "footer", icon: "ability-range", value: "40m", label: "Cast Range", color: "white" }
        ]
      }
    ],
    upgradesTo: "Focus Lens"
  },

  "spirit:Suppressor.png": {
    innateStats: ["+6 Spirit Power", "+8% Bullet Resist"],
    abilities: [
      {
        type: "Passive",
        description: "When you deal **spirit damage** to enemies, you also reduce their **Fire Rate**.",
        boxes: [
          { type: "stat", icon: "fire-rate", value: "-28%", label: "Fire Rate", color: "orange" },
          { type: "footer", icon: "ability-duration", value: "4.5s", label: "Duration", color: "white" }
        ]
      }
    ]
  },

  "spirit:Disarming_Hex.png": {
    innateStats: ["+75 Bonus Health", "+0.75m Sprint Speed"],
    abilities: [
      {
        type: "Active",
        cooldown: "16s",
        description: "**Disarms** enemy target and reduces their **Bullet Resist**.",
        boxes: [
          { type: "status_effect", icon: "status-disarm", label: "Disarmed" },
          { type: "stat", icon: "damage-resistance", value: "-13%", label: "Bullet Resist", color: "green", conditional: true },
          { type: "footer", icon: "ability-range", value: "32m", label: "Cast Range", color: "white" },
          { type: "footer", icon: "ability-duration", value: "4.25s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Rusted Barrel"
  },

  "spirit:Greater_Expansion.png": {
    innateStats: ["+10% Spirit Resist"],
    abilities: [
      {
        type: "Passive",
        description: "Increases the **range** and **effect radius** of your abilities and items.",
        boxes: [{ type: "stat", icon: "ability-range", value: "+30%", label: "Ability Range", color: "purple" }]
      }
    ],
    upgradesFrom: "Mystic Expansion"
  },

  "spirit:Knockdown.png": {
    innateStats: ["+75 Bonus Health", "+5% Ability Range"],
    abilities: [
      {
        type: "Active",
        cooldown: "35s",
        description: "Apply a **Stun** after **2s**. Stun duration is increased against **airborne** targets.",
        extraText: [{ text: "Increases the target's gravity for the duration of the stun.", italic: true }],
        boxes: [
          { type: "status_effect", icon: "status-stun", label: "Stun" },
          { type: "stat", icon: "ability-duration", value: "0.5s", label: "Stun Duration", color: "purple" },
          { type: "footer", icon: "ability-range", value: "45m", label: "Cast Range", color: "white" }
        ]
      }
    ]
  },

  "spirit:Radiant_Regeneration.png": {
    innateStats: ["+90 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        description:
          "Dealing **spirit damage** to enemy Heroes grants you Bonus **regeneration**. Stacks when dealing damage to different heroes.",
        boxes: [
          { type: "stat", icon: "health", value: "4 HP/s", label: "Regeneration", color: "green" },
          { type: "stat", icon: "ability-duration", value: "7s", label: "Regeneration Duration", color: "white" }
        ]
      },
      {
        type: "Passive",
        cooldown: "6s",
        description: "**Heal** and gain bonus **Movement Speed** for a short duration when you cast an ability.",
        boxes: [
          { type: "stat", icon: "health", value: "70", label: "Healing on Ability Cast", color: "green" },
          { type: "stat", icon: "move-speed", value: "+1.75m", label: "Move Speed", color: "green" },
          { type: "footer", icon: "ability-duration", value: "3s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Mystic Regeneration"
  },

  "spirit:Rapid_Recharge.png": {
    innateStats: [
      "+2 Bonus Ability Charges",
      "+30% Faster Time Between Charges",
      "+14% Cooldown Reduction For Charged Abilities",
      "+14 Bonus Spirit Power for Charged Abilities"
    ],
    upgradesFrom: "Extra Charge"
  },

  "spirit:Silence_Wave.png": {
    innateStats: ["+50 Bonus Health"],
    abilities: [
      {
        type: "Active",
        cooldown: "42s",
        description: "Launch an expanding projectile which **Silences** enemies for a short duration and deals impact damage.",
        extraText: [{ text: "Silence does not interrupt channeling abilities.", italic: true }],
        boxes: [
          { type: "status_effect", icon: "status-silence", label: "Silenced" },
          { type: "stat", icon: "spirit-damage", value: "75", label: "Damage", color: "purple", scaling: "0.70" },
          { type: "footer", icon: "ability-range", value: "40m", label: "Cast Range", color: "white" },
          { type: "footer", icon: "ability-duration", value: "3s", label: "Silence Duration", color: "white" }
        ]
      }
    ]
  },

  "spirit:Spirit_Snatch.png": {
    innateStats: ["+7% Melee Damage", "+75 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        cooldown: "6s",
        description:
          "When you perform a **Light or Heavy Melee** attack against a hero, the attack deals extra **spirit damage** and steals **Spirit Resist** and **Spirit Power**.",
        extraText: [{ text: "Effects are reduced by 30% for Light Melee hits.", italic: true }],
        boxes: [
          { type: "stat", icon: "spirit-damage", value: "50", label: "Spirit Damage", color: "purple", scaling: "0.84" },
          { type: "stat", icon: "damage-resistance", value: "12%", label: "Spirit Resist Steal", color: "green", conditional: true },
          { type: "stat", icon: "spirit-power", value: "25", label: "Spirit Power Steal", color: "purple", conditional: true },
          { type: "footer", icon: "ability-duration", value: "10s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Spirit Strike"
  },

  "spirit:Superior_Cooldown.png": {
    innateStats: ["+4 Out of Combat Regen"],
    abilities: [
      {
        type: "Passive",
        description: "Reduces the **Cooldown** of your abilities.",
        boxes: [{ type: "stat", icon: "ability-cooldown", value: "+20%", label: "Ability Cooldown Reduction", color: "purple" }]
      }
    ],
    upgradesFrom: "Compress Cooldown",
    upgradesTo: "Transcendent Cooldown"
  },

  "spirit:Superior_Duration.png": {
    innateStats: ["+8% Bullet Resist"],
    abilities: [
      {
        type: "Passive",
        description: "Increases the **duration** of your abilities and items.",
        boxes: [{ type: "stat", icon: "ability-duration", value: "+28%", label: "Ability Duration", color: "purple" }]
      }
    ],
    upgradesFrom: "Duration Extender"
  },

  "spirit:Surge_of_Power.png": {
    abilities: [
      {
        type: "Passive",
        cooldown: "14s",
        description:
          "Imbue an ability with **permanent Spirit Power**. When that ability is used, gain bonus **Move Speed** and maintain full speed while attacking.",
        boxes: [
          { type: "stat", icon: "spirit-power", value: "+28", label: "Imbued Ability Spirit Power", color: "purple" },
          { type: "stat", icon: "fire-rate", value: "20%", label: "Fire Rate Bonus", color: "orange", conditional: true },
          { type: "stat", icon: "move-speed", value: "+1.75m", label: "Move Speed", color: "green", conditional: true },
          { type: "footer", icon: "ability-duration", value: "8s", label: "Move Speed Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Extra Spirit"
  },

  "spirit:Tankbuster.png": {
    innateStats: ["+50 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        description:
          "Charges up over time with **bonus spirit damage**, causing abilities dealing more than **165** damage to deal additional damage. **Ignores Spirit Resistance.**",
        boxes: [
          { type: "stat", icon: "spirit-damage", value: "40", label: "Damage", color: "purple" },
          { type: "stat", icon: "spirit-damage", value: "8%", label: "Current Health Bonus Damage", color: "purple" }
        ]
      }
    ],
    upgradesFrom: "Mystic Burst"
  },

  "spirit:Torment_Pulse.png": {
    innateStats: ["+100 Bonus Health", "+18% Melee Resist"],
    abilities: [
      {
        type: "Passive",
        cooldown: "1.4s",
        description: "Periodically deals **spirit damage** to the closest two enemies nearby.",
        boxes: [
          { type: "stat", icon: "spirit-damage", value: "25", label: "Pulse Damage", color: "purple", scaling: "0.23" },
          { type: "stat", icon: "ability-range", value: "9m", label: "Pulse Radius", color: "white" }
        ]
      }
    ]
  },

  "spirit:Arctic_Blast.png": {
    innateStats: ["+10% Spirit Resist"],
    abilities: [
      {
        type: "Active",
        cooldown: "24s",
        description: "Release an expanding ice blast that deals **spirit damage**, **Freezing** and then **Slowing** targets it hits.",
        extraText: [{ text: "Slowed targets have their **stamina regen frozen**" }],
        boxes: [
          { type: "stat", icon: "spirit-damage", value: "175", label: "Damage", color: "purple", scaling: "0.70" },
          { type: "stat", icon: "ability-duration", value: "1s", label: "Freeze Duration", color: "white" },
          { type: "footer", icon: "ability-range", value: "16m", label: "End Radius", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Cold Front"
  },

  "spirit:Boundless_Spirit.png": {
    innateStats: ["+15% Spirit Power", "+30 Spirit Power", "+75 Bonus Health", "+4 Out of Combat Regen"],
    upgradesFrom: "Improved Spirit"
  },

  "spirit:Cursed_Relic.png": {
    abilities: [
      {
        type: "Active",
        cooldown: "55s",
        description:
          "Curses an enemy - **interrupting**, **Silencing**, **Disarming**, and **preventing item usage**. **Removes all non-ultimate buffs**.",
        extraText: [{ text: "Your own **Damage Output** is reduced for the duration." }],
        boxes: [
          { type: "status_effect", icon: "status-silence", label: "Silenced" },
          { type: "status_effect", icon: "status-disarm", label: "Disarmed" },
          { type: "footer", icon: "ability-duration", value: "3.25s", label: "Duration", color: "white" },
          { type: "footer", icon: "ability-range", value: "20m", label: "Cast Range", color: "white" },
          { type: "footer", icon: "damage-amplification", value: "-25%", label: "Damage Penalty", color: "red" }
        ]
      }
    ]
  },

  "spirit:Echo_Shard.png": {
    innateStats: ["+5% Spirit Resist", "+5% Bullet Resist"],
    abilities: [
      {
        type: "Active",
        cooldown: "30s",
        description: "**Reset the cooldown** of the imbued non-ultimate ability.",
        extraText: [{ text: "This item's cooldown is increased by **the cooldown of the imbued ability**." }]
      }
    ]
  },

  "spirit:Escalating_Exposure.png": {
    innateStats: ["-8% Spirit Resist On Spirit Damage", "+17% Spirit Resist"],
    abilities: [
      {
        type: "Passive",
        description:
          "Dealing **spirit damage** applies a stacking **Spirit Amp** that increases your **spirit damage** to the target.",
        boxes: [
          { type: "stat", icon: "damage-amplification", value: "+4.5%", label: "Spirit Amp per Stack", color: "green" },
          { type: "footer", icon: "stack", value: "12", label: "Max Stacks", color: "white" },
          { type: "footer", icon: "ability-duration", value: "12s", label: "Duration", color: "white" },
          { type: "footer", icon: "ability-duration", value: "0.7s", label: "Max Frequency Per Target", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Mystic Vulnerability"
  },

  "spirit:Ethereal_Shift.png": {
    abilities: [
      {
        type: "Active",
        cooldown: "37s",
        description:
          "You enter a void state and become **untargetable and invincible** for a short duration, during which you float slowly and cannot perform actions. Afterwards you gain **Spirit Power, Move Speed, and Spirit Resist**. Can be canceled early.",
        extraText: [{ text: "Activation cancels any active ability.", italic: true }],
        boxes: [
          { type: "stat", icon: "ability-duration", value: "4s", label: "Duration", color: "white" },
          { type: "footer", value: "+20", label: "Spirit Power", color: "white" },
          { type: "footer", value: "+30%", label: "Spirit Resist", color: "white" },
          { type: "footer", value: "+3m", label: "Move Speed", color: "white" },
          { type: "footer", value: "5s", label: "Buff Duration", color: "white" },
          { type: "footer", value: "2.5m", label: "Float Speed", color: "white" }
        ]
      }
    ]
  },

  "spirit:Focus_Lens.png": {
    innateStats: ["+10% Fire Rate"],
    abilities: [
      {
        type: "Active",
        cooldown: "45s",
        description:
          "Target an enemy to **Silence** them. A portion of **all damage dealt** during the silence gets applied to the target when the silence wears off.",
        boxes: [
          { type: "stat", icon: "ability-duration", value: "4.5s", label: "Duration", color: "white" },
          { type: "stat", icon: "pure-damage", value: "30%", label: "Damage On Expire", color: "red" },
          { type: "stat", icon: "damage-resistance", value: "-9%", label: "Spirit Resist", color: "green", conditional: true },
          { type: "stat", icon: "spirit-power", value: "-30", label: "Spirit Power", color: "purple" },
          { type: "footer", icon: "ability-range", value: "20m", label: "Cast Range", color: "white" },
          { type: "footer", icon: "ability-duration", value: "12s", label: "Resist Reduction Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Spirit Sap"
  },

  "spirit:Lightning_Scroll.png": {
    innateStats: ["-30% Move Speed on Spirit Damage", "+50 Bonus Health", "+0.75m Sprint Speed"],
    abilities: [
      {
        type: "Passive",
        description: "Damage from your ultimate applies a **stun** and deals **bonus spirit damage** after a short delay.",
        boxes: [
          { type: "status_effect", icon: "status-stun", label: "Stun" },
          { type: "stat", icon: "ability-duration", value: "0.75s", label: "Stun Duration", color: "white" },
          { type: "stat", icon: "spirit-damage", value: "150", label: "Damage", color: "purple" },
          { type: "footer", icon: "ability-duration", value: "3s", label: "Delay Before Effect", color: "white" }
        ]
      },
      {
        type: "Passive",
        description: "",
        extraText: [{ text: "This effect can only trigger once per target per ultimate.", italic: true }]
      },
      {
        type: "Passive",
        description: "Mystic Slow effects"
      }
    ],
    upgradesFrom: "Mystic Slow"
  },

  "spirit:Magic_Carpet.png": {
    innateStats: ["+15% Ability Duration", "+125 Bonus Health", "+14 Spirit Power", "-15% Gravity Scale", "+25% Air Control"],
    abilities: [
      {
        type: "Active",
        cooldown: "32s",
        description:
          "Summon a Magic Carpet that will **fly** you away. While flying you are immune to slows and doing any action will dismiss the carpet.",
        extraText: [{ text: "Cannot use abilities while the carpet is being summoned.", italic: true }],
        boxes: [
          { type: "stat", icon: "ability-duration", value: "12s", label: "Duration", color: "white" },
          { type: "footer", icon: "move-speed", value: "+7m", label: "Bonus Fly Speed", color: "white" },
          { type: "footer", icon: "ability-duration", value: "1.3s", label: "Summon Duration", color: "white" }
        ]
      }
    ]
  },

  "spirit:Mercurial_Magnum.png": {
    innateStats: ["+20% Max Ammo", "+7 Spirit Power"],
    abilities: [
      {
        type: "Passive",
        description:
          "Your imbued ability charges up over time with **bonus spirit damage**, **bonus fire rate**, and **reloads bullets** on use. Until your next reload, your **bullets deal bonus spirit damage** based on your Spirit Power.",
        boxes: [
          { type: "stat", icon: "bullet-damage", value: "+25%", label: "Base Bullet Damage", color: "purple", scaling: "0.49" },
          { type: "stat", icon: "spirit-damage", value: "60", label: "Damage", color: "purple", scaling: "0.16" },
          { type: "stat", icon: "fire-rate", value: "+22%", label: "Fire Rate", color: "orange" },
          { type: "footer", icon: "ammo", value: "100%", label: "Bullets Reloaded", color: "white" },
          { type: "footer", icon: "charge-up", value: "14s", label: "Charge-Up Time", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Quicksilver Reload"
  },

  "spirit:Mystic_Reverb.png": {
    innateStats: ["+8% Spirit Lifesteal"],
    abilities: [
      {
        type: "Passive",
        cooldown: "6.25s",
        description:
          "Imbue an ability with **Lifesteal** and to apply **slow** on hit target and deal an **additional percentage of the damage dealt** to enemies around the target after a short delay.",
        boxes: [
          { type: "stat", icon: "pure-damage", value: "50%", label: "Damage", color: "red", conditional: true },
          { type: "stat", icon: "lifesteal", value: "+22%", label: "Imbued Lifesteal", color: "green" },
          { type: "stat", icon: "status-move-slow", value: "-40%", label: "Move Speed", color: "purple", conditional: true },
          { type: "footer", icon: "ability-range", value: "16m", label: "Radius", color: "white" },
          { type: "footer", icon: "ability-duration", value: "3s", label: "Delay Duration", color: "white" }
        ]
      }
    ]
  },

  "spirit:Refresher.png": {
    abilities: [
      {
        type: "Active",
        cooldown: "300s",
        description: "Reset the **cooldown** of all your abilities and **restore all your charges**."
      }
    ]
  },

  "spirit:Scourge.png": {
    innateStats: ["+100 Bonus Health"],
    abilities: [
      {
        type: "Active",
        cooldown: "35s",
        description:
          "Apply **Spirit Resist**, **Debuff Resist** and an aura on a friendly target that deals **damage** to enemies proportional to their max health. Existing debuffs on the target are reduced.",
        extraText: [{ text: "Can be self cast." }],
        boxes: [
          { type: "stat", icon: "spirit-damage", value: "2.3%", label: "Max Health per second", color: "purple", scaling: "0.01" },
          { type: "stat", icon: "damage-resistance", value: "+40%", label: "Spirit Resist", color: "green", conditional: true },
          { type: "stat", icon: "debuff-resist", value: "+20%", label: "Debuff Resist", color: "green", conditional: true },
          { type: "footer", icon: "ability-duration", value: "10s", label: "Duration", color: "white" },
          { type: "footer", icon: "ability-range", value: "35m", label: "Cast Range", color: "white" },
          { type: "footer", icon: "ability-range", value: "10m", label: "Radius", color: "white" }
        ]
      }
    ]
  },

  "spirit:Spirit_Burn.png": {
    innateStats: ["+6% Ability Range"],
    abilities: [
      {
        type: "Passive",
        description:
          "Dealing significant **spirit damage** to an enemy within 5s causes an explosion dealing damage and a burn{{icon:status-burn}} to that enemy. While burning{{icon:status-burn}}, enemies take damage over time and receive reduced healing.",
        extraText: [
          { text: "The cooldown is per enemy, so each target can only be burned once per cooldown. Deals half-damage on non-heroes.", italic: true }
        ],
        boxes: [
          { type: "stat", icon: "build-up", value: "500", label: "Damage Threshold", color: "white" },
          { type: "stat", icon: "spirit-damage", value: "50", label: "Explosion Damage", color: "purple" },
          { type: "stat", icon: "damage-per-second", value: "24", label: "Damage Per Second", color: "purple", scaling: "0.06" },
          { type: "footer", icon: "ability-duration", value: "20s", label: "Immunity Duration", color: "white" },
          { type: "footer", icon: "ability-duration", value: "8s", label: "Debuff Duration", color: "white" },
          { type: "footer", icon: "status-damage-reduction", value: "-70%", label: "Healing Reduction", color: "red" }
        ]
      }
    ]
  },

  "spirit:Transcendent_Cooldown.png": {
    innateStats: ["+4 Out of Combat Regen"],
    abilities: [
      {
        type: "Passive",
        description: "Reduces the **Cooldown** of your abilities and items.",
        boxes: [
          { type: "stat", icon: "ability-cooldown", value: "+25%", label: "Ability Cooldown Reduction", color: "purple" },
          { type: "stat", icon: "ability-cooldown", value: "+25%", label: "Item Cooldown Reduction", color: "purple" }
        ]
      }
    ],
    upgradesFrom: "Superior Cooldown"
  },

  "spirit:Vortex_Web.png": {
    innateStats: ["+8% Ability Range", "+0.75m Sprint Speed"],
    abilities: [
      {
        type: "Active",
        cooldown: "42s",
        description: "Throw a **vacuum** grenade, pulling all enemies into a small area and applying **Slowing Hex**.",
        extraText: [{ text: "Alt Cast to Target Unit Directly.", italic: true }],
        boxes: [
          { type: "stat", icon: "ability-range", value: "12m", label: "Capture Radius", color: "white" },
          { type: "stat", icon: "status-move-slow", value: "-35%", label: "Move Speed", color: "purple", conditional: true },
          { type: "footer", icon: "ability-duration", value: "4s", label: "Duration", color: "white" },
          { type: "footer", icon: "dash-distance", value: "-40%", label: "Dash Distance", color: "purple" }
        ]
      }
    ],
    upgradesFrom: "Slowing Hex"
  },

  "weapon:Close_Quarters.png": {
    innateStats: ["+20% Melee Resist"],
    abilities: [
      {
        type: "Passive",
        description: "Deal additional **Weapon Damage** when in **close range** to your target.",
        boxes: [
          { type: "stat", icon: "weapon-damage", value: "+20%", label: "Weapon Damage", color: "orange", conditional: true },
          { type: "stat", icon: "ability-range", value: "15m", label: "Close Range", color: "white" }
        ]
      }
    ],
    upgradesTo: "Point Blank"
  },

  "weapon:Extended_Magazine.png": {
    innateStats: ["+30% Max Ammo", "+8% Weapon Damage"],
    upgradesTo: ["Escalating Resilience", "Titanic Magazine"]
  },

  "weapon:Headshot_Booster.png": {
    innateStats: ["+30 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        cooldown: "9s",
        description: "Your next **headshot** against an enemy Hero deals **bonus weapon damage**.",
        boxes: [{ type: "stat", icon: "weapon-damage", value: "+45", label: "Head Shot Bonus Damage", color: "orange" }]
      }
    ],
    upgradesTo: "Headhunter"
  },

  "weapon:High-Velocity_Rounds.png": {
    innateStats: ["+60% Bullet Velocity", "+8% Weapon Damage"],
    upgradesTo: ["Opening Rounds", "Sharpshooter", "Armor Piercing Rounds", "Express Shot"]
  },

  "weapon:Monster_Rounds.png": {
    innateStats: ["+25% Weapon Damage vs. NPCs", "+25% Bullet Resist vs. NPCs", "+1 Out of Combat Regen"],
    upgradesTo: "Cultist Sacrifice"
  },

  "weapon:Rapid_Rounds.png": {
    innateStats: ["+9% Fire Rate"],
    upgradesTo: ["Burst Fire", "Swift Striker"]
  },

  "weapon:Restorative_Shot.png": {
    innateStats: ["+6% Weapon Damage"],
    abilities: [
      {
        type: "Passive",
        cooldown: "6s",
        description: "Your next bullet will **heal** you based on what target you hit.",
        boxes: [
          { type: "stat", icon: "lifesteal", value: "50", label: "Healing From Heroes", color: "green" },
          { type: "stat", icon: "lifesteal", value: "20", label: "Healing From NPCs / Orbs", color: "green" }
        ]
      }
    ]
  },

  "weapon:Active_Reload.png": {
    innateStats: ["+20% Max Ammo"],
    abilities: [
      {
        type: "Passive",
        cooldown: "12s",
        description:
          "While reloading, pressing Reload during the highlighted portion will **instantly finish your reload** and grant you **Fire Rate**, **Bullet Lifesteal** and **Move Speed**.",
        boxes: [
          { type: "stat", icon: "fire-rate", value: "+25%", label: "Fire Rate", color: "orange", conditional: true },
          { type: "stat", icon: "lifesteal", value: "+16%", label: "Bullet Lifesteal", color: "green", conditional: true },
          { type: "stat", icon: "move-speed", value: "+0.75m", label: "Move Speed", color: "green" },
          { type: "footer", icon: "ability-duration", value: "7s", label: "Duration", color: "white" }
        ]
      }
    ]
  },

  "weapon:Fleetfoot.png": {
    innateStats: ["+6% Weapon Damage", "+35% Slide Distance", "+6% Bullet Resist"],
    abilities: [
      {
        type: "Passive",
        description: "Removes the **Move Speed** penalty while shooting."
      },
      {
        type: "Active",
        cooldown: "16s",
        description: "Gain bonus **Move Speed** and **Slow Resistance**.",
        boxes: [
          { type: "stat", icon: "move-speed", value: "+3m", label: "Move Speed", color: "green", conditional: true },
          { type: "stat", icon: "move-speed", value: "+40%", label: "Slow Resist", color: "green" },
          { type: "footer", icon: "ability-duration", value: "5s", label: "Duration", color: "white" }
        ]
      }
    ]
  },

  "weapon:Intensifying_Magazine.png": {
    innateStats: ["+20% Max Ammo"],
    abilities: [
      {
        type: "Passive",
        description: "Increases **Weapon Damage** as you continuously fire your weapon.",
        boxes: [
          { type: "stat", icon: "weapon-damage", value: "45%", label: "Max Weapon Damage", color: "orange", conditional: true },
          { type: "stat", icon: "ability-duration", value: "2.5s", label: "Time for Max Damage", color: "white" }
        ]
      }
    ]
  },

  "weapon:Kinetic_Dash.png": {
    innateStats: ["+1 Stamina", "+12% Stamina Recovery"],
    abilities: [
      {
        type: "Passive",
        description:
          "When you **Dash-Jump** you gain **Fire Rate** and bonus **Ammo** until your next reload. Lasts up to 7s.",
        boxes: [
          { type: "stat", icon: "fire-rate", value: "+25%", label: "Fire Rate", color: "orange", conditional: true },
          { type: "stat", icon: "ammo", value: "+6", label: "Temporary Ammo", color: "orange", conditional: true },
          { type: "footer", icon: "ability-duration", value: "7s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Extra Stamina"
  },

  "weapon:Long_Range.png": {
    innateStats: ["+8% Weapon Fall-off Range", "+0.75m Sprint Speed"],
    abilities: [
      {
        type: "Passive",
        description: "Deal additional **Weapon Damage** when **beyond a minimum distance** from your target.",
        boxes: [
          { type: "stat", icon: "weapon-damage", value: "+40%", label: "Weapon Damage", color: "orange", conditional: true },
          { type: "stat", value: "15m", label: "Min. Distance", color: "white" }
        ]
      }
    ],
    upgradesTo: "Sharpshooter"
  },

  "weapon:Melee_Charge.png": {
    innateStats: ["+50% Heavy Melee Distance", "+10% Melee Damage", "+6% Bullet Resist"],
    abilities: [
      {
        type: "Passive",
        cooldown: "5s",
        description: "Your next **Heavy Melee** attack against an enemy **deals increased damage**.",
        boxes: [{ type: "stat", icon: "melee-damage", value: "+25%", label: "Bonus Heavy Damage", color: "white" }]
      }
    ],
    upgradesTo: "Crushing Fists"
  },

  "weapon:Mystic_Shot.png": {
    innateStats: ["+7 Spirit Power"],
    abilities: [
      {
        type: "Passive",
        cooldown: "8s",
        description: "Your next bullet deals bonus **spirit damage**.",
        boxes: [{ type: "stat", icon: "spirit-damage", value: "+40", label: "Spirit Damage", color: "purple", scaling: "0.90" }]
      }
    ]
  },

  "weapon:Opening_Rounds.png": {
    innateStats: ["+60% Bullet Velocity", "+8% Weapon Damage", "+7 Spirit Power"],
    abilities: [
      {
        type: "Passive",
        description: "Your attacks have additional **Weapon Damage** against **enemies above 50% health**.",
        boxes: [{ type: "stat", icon: "weapon-damage", value: "+25%", label: "Weapon Damage", color: "orange", conditional: true }]
      }
    ],
    upgradesFrom: "High-Velocity Rounds"
  },

  "weapon:Recharging_Rush.png": {
    innateStats: ["+20% Max Ammo", "+10% Weapon Damage"],
    abilities: [
      {
        type: "Passive",
        cooldown: "25s",
        description: "Dealing significant **weapon damage** replenishes a charge for **each of your charged abilities**.",
        boxes: [
          { type: "stat", icon: "build-up", value: "200", label: "Damage Threshold", color: "white" },
          { type: "stat", icon: "ability-duration", value: "3.5s", label: "Time Frame", color: "white" }
        ]
      }
    ]
  },

  "weapon:Slowing_Bullets.png": {
    abilities: [
      {
        type: "Passive",
        description: "Your bullets build up a **Movement Slow** on enemies.",
        boxes: [
          { type: "stat", icon: "status-move-slow", value: "-30%", label: "Move Speed", color: "purple", conditional: true },
          { type: "footer", icon: "dash-distance", value: "-22%", label: "Dash Distance", color: "white" },
          { type: "footer", icon: "ability-duration", value: "3.5s", label: "Slow Duration", color: "white" },
          { type: "footer", icon: "build-up", value: "0.7%", label: "Buildup Per Shot", color: "white" }
        ]
      }
    ],
    upgradesTo: "Weighted Shots"
  },

  "weapon:Spirit_Shredder_Bullets.png": {
    abilities: [
      {
        type: "Passive",
        description:
          "Your bullets apply a debuff that reduces the **Spirit Resist** of the target and grants you and your allies **Spirit Lifesteal** against them.",
        boxes: [
          { type: "stat", icon: "damage-resistance", value: "-8%", label: "Spirit Resist", color: "green", conditional: true },
          { type: "stat", icon: "lifesteal", value: "+10%", label: "Spirit Lifesteal", color: "green", conditional: true },
          { type: "footer", icon: "ability-duration", value: "8s", label: "Debuff Duration", color: "white" }
        ]
      }
    ],
    upgradesTo: "Spirit Rend"
  },

  "weapon:Split_Shot.png": {
    abilities: [
      {
        type: "Active",
        cooldown: "27s",
        description: "Make your weapon fire **multishot**.",
        extraText: [
          { text: "Hitting more than one Hero per attack will grant a **stacking weapon damage bonus**." },
          { text: "Targets can only be hit once per multishot.", italic: true }
        ],
        boxes: [
          { type: "stat", icon: "fire-rate", value: "5", label: "Weapon Multishot", color: "white", conditional: true },
          { type: "stat", icon: "status-weapon-damage-buff", value: "+8%", label: "Weapon Damage per Stack", color: "orange" },
          { type: "footer", icon: "ability-duration", value: "5s", label: "Buff Duration", color: "white" },
          { type: "footer", icon: "stack", value: "5", label: "Max Stacks", color: "white" },
          { type: "footer", icon: "ability-duration", value: "12s", label: "Stack Duration", color: "white" }
        ]
      }
    ]
  },

  "weapon:Stalker.png": {
    innateStats: ["-50% Footstep Sound Distance", "+50 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        cooldown: "6s",
        description: "Dealing **weapon damage** at close range opens a wound and grants you **bonus move speed**.",
        extraText: [
          { text: "Wounded enemies take **spirit damage over time**, have reduced **bullet resist**, and are revealed **through walls**." }
        ],
        boxes: [
          { type: "stat", icon: "spirit-damage", value: "17", label: "Damage Per Second", color: "purple" },
          { type: "stat", icon: "damage-resistance", value: "-6%", label: "Bullet Resist", color: "green", conditional: true },
          { type: "stat", icon: "move-speed", value: "+1.5m", label: "Move Speed", color: "green", conditional: true },
          { type: "footer", icon: "ability-duration", value: "5s", label: "Debuff Duration", color: "white" },
          { type: "footer", icon: "ability-range", value: "8m", label: "Close Range", color: "white" }
        ]
      }
    ]
  },

  "weapon:Swift_Striker.png": {
    innateStats: ["+20% Fire Rate", "+0.75m Sprint Speed"],
    upgradesFrom: "Rapid Rounds"
  },

  "weapon:Titanic_Magazine.png": {
    innateStats: ["+100% Max Ammo", "+14% Weapon Damage"],
    upgradesFrom: "Extended Magazine"
  },

  "weapon:Weakening_Headshot.png": {
    innateStats: ["+60 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        description: "Landing a **Headshot** reduces their **Bullet Resist**.",
        boxes: [
          { type: "stat", icon: "damage-resistance", value: "-13%", label: "Bullet Resist", color: "green", conditional: true },
          { type: "stat", icon: "ability-duration", value: "12s", label: "Debuff Duration", color: "white" }
        ]
      }
    ],
    upgradesTo: "Crippling Headshot"
  },

  "weapon:Alchemical_Fire.png": {
    innateStats: ["+10 Spirit Power"],
    abilities: [
      {
        type: "Active",
        cooldown: "30s",
        description:
          "Throw a flask that explodes on contact, creating an area that does increasing **spirit damage** per second and reduces enemy **Bullet Resist**.",
        extraText: [{ text: "50% less effective vs non-heroes." }],
        boxes: [
          { type: "stat", icon: "spirit-damage", value: "45", label: "Damage Per Second", color: "purple", scaling: "0.20" },
          { type: "stat", icon: "damage-resistance", value: "-7%", label: "Bullet Resist", color: "green", conditional: true, scaling: "-0.06" },
          { type: "footer", value: "95", label: "Max DPS", color: "white" },
          { type: "footer", icon: "ability-range", value: "10m", label: "Radius", color: "white" },
          { type: "footer", icon: "ability-duration", value: "5s", label: "Duration", color: "white" }
        ]
      }
    ]
  },

  "weapon:Ballistic_Enchantment.png": {
    abilities: [
      {
        type: "Passive",
        description:
          "Imbue an ability with increased **range**. Dealing damage with that ability grants you increased **weapon damage** per unique hero hit. Has reduced effect on non-heroes.",
        boxes: [
          { type: "stat", icon: "weapon-damage", value: "+20%", label: "Weapon Damage per Stack", color: "orange", conditional: true },
          { type: "stat", icon: "ability-range", value: "+22%", label: "Ability Range", color: "purple" },
          { type: "footer", icon: "ability-duration", value: "14s", label: "Duration", color: "white" },
          { type: "footer", value: "+5%", label: "Non-Hero Weapon Damage", color: "white" },
          { type: "footer", value: "8", label: "Non-Hero Stack Limit", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Mystic Expansion"
  },

  "weapon:Berserker.png": {
    innateStats: ["+8% Bullet Resist"],
    abilities: [
      {
        type: "Passive",
        description: "Your **Weapon Damage** increases as you take sustained damage.",
        boxes: [
          { type: "stat", icon: "status-weapon-damage-buff", value: "+7%", label: "Weapon Damage per Stack", color: "orange" },
          { type: "footer", value: "120", label: "Damage taken to Stack", color: "white" },
          { type: "footer", value: "10", label: "Max Stacks", color: "white" },
          { type: "footer", icon: "ability-duration", value: "10s", label: "Duration", color: "white" }
        ]
      }
    ]
  },

  "weapon:Blood_Tribute.png": {
    innateStats: ["+8% Debuff Resist", "+8% Spirit Resist", "+4 Out of Combat Regen"],
    abilities: [
      {
        type: "Active",
        description: "Toggle: Continually sacrifice Health to improve **fire rate**, Debuff Resistance and Move Speed.",
        boxes: [
          { type: "stat", icon: "pure-damage", value: "50/s", label: "Health Drain", color: "red" },
          { type: "footer", icon: "fire-rate", value: "+35%", label: "Fire Rate", color: "white" },
          { type: "footer", value: "+35%", label: "Debuff Resist", color: "white" },
          { type: "footer", icon: "move-speed", value: "+2m", label: "Move Speed", color: "white" }
        ]
      }
    ]
  },

  "weapon:Burst_Fire.png": {
    innateStats: ["+50% Slide Distance", "+10% Fire Rate"],
    abilities: [
      {
        type: "Passive",
        cooldown: "9s",
        description: "Briefly gain **Fire Rate** and **Move Speed** when one of your bullets hits an enemy hero.",
        boxes: [
          { type: "stat", icon: "fire-rate", value: "+32%", label: "Fire Rate", color: "orange", conditional: true },
          { type: "stat", icon: "move-speed", value: "+1.25m", label: "Move Speed", color: "green", conditional: true },
          { type: "footer", icon: "ability-duration", value: "4.5s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Rapid Rounds"
  },

  "weapon:Cultist_Sacrifice.png": {
    innateStats: ["+2 Out of Combat Regen", "+30% Weapon Damage vs. NPCs", "+30% Bullet Resist vs. NPCs"],
    abilities: [
      {
        type: "Active",
        cooldown: "270s",
        description: "Target an enemy NPC and consume it for **180% Bonus Souls** and grants a powerful long lasting buff.",
        boxes: [
          { type: "stat", icon: "weapon-damage", value: "+10%", label: "Weapon Damage", color: "orange", conditional: true, scaling: "0.80" },
          { type: "stat", icon: "health", value: "+50", label: "Bonus Health", color: "green", conditional: true, scaling: "4.00" },
          { type: "stat", icon: "ability-range", value: "+12%", label: "Ability Range", color: "purple", conditional: true },
          { type: "footer", icon: "ability-duration", value: "160s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Monster Rounds"
  },

  "weapon:Escalating_Resilience.png": {
    innateStats: ["+35% Max Ammo", "+75 Bonus Health", "+18% Weapon Damage"],
    abilities: [
      {
        type: "Passive",
        description: "Grants **Bullet Resist** when your bullets hit an enemy hero. **Each shot can only grant one stack**.",
        boxes: [
          { type: "stat", value: "30%", label: "Max Bullet Resist", color: "white" },
          { type: "footer", value: "2%", label: "Bullet Resist per Stack", color: "white" },
          { type: "footer", icon: "ability-duration", value: "24s", label: "Stack Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Extended Magazine"
  },

  "weapon:Express_Shot.png": {
    innateStats: ["+60% Bullet Velocity", "+8% Weapon Damage"],
    abilities: [
      {
        type: "Passive",
        cooldown: "8s",
        description:
          "Your next attack will **fire twice** in quick succession with **increased damage** and velocity. This attack consumes extra ammo.",
        boxes: [
          { type: "stat", icon: "weapon-damage", value: "+125%", label: "Weapon Damage", color: "orange", conditional: true, scaling: "2.00" },
          { type: "stat", icon: "weapon-damage", value: "+40%", label: "Secondary Fire Weapon Damage", color: "orange", conditional: true, scaling: "1.30" },
          { type: "footer", icon: "bullet-velocity", value: "+100%", label: "Bullet Velocity", color: "white" },
          { type: "footer", value: "2", label: "Extra Ammo Consumed", color: "red" }
        ]
      }
    ],
    upgradesFrom: "High-Velocity Rounds"
  },

  "weapon:Headhunter.png": {
    innateStats: ["+5% Weapon Damage", "+50 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        cooldown: "8s",
        description:
          "Your next **headshot** against an enemy Hero deals **bonus weapon damage**, **heal** you, and briefly grants **bonus move speed**.",
        boxes: [
          { type: "stat", icon: "weapon-damage", value: "+75", label: "Head Shot Bonus Damage", color: "orange", scaling: "4.00" },
          { type: "stat", icon: "lifesteal", value: "4%", label: "Heal Per Headshot", color: "green" },
          { type: "footer", icon: "move-speed", value: "+1.75m", label: "Move Speed", color: "white" },
          { type: "footer", icon: "ability-duration", value: "3s", label: "Move Speed Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Headshot Booster"
  },

  "weapon:Heroic_Aura.png": {
    innateStats: ["+1.5m Sprint Speed"],
    abilities: [
      {
        type: "Passive",
        description: "Provides **Bullet Resist** to nearby friendly units.",
        boxes: [
          { type: "stat", icon: "damage-resistance", value: "+17%", label: "Bullet Resist", color: "green" },
          { type: "footer", icon: "ability-range", value: "35m", label: "Radius", color: "white" }
        ]
      },
      {
        type: "Active",
        cooldown: "22s",
        description: "Provides **move speed** and **fire rate** to you and nearby allies. **Minions get double value**.",
        boxes: [
          { type: "stat", icon: "move-speed", value: "+2.25m", label: "Move Speed", color: "green", conditional: true },
          { type: "stat", icon: "fire-rate", value: "+26%", label: "Fire Rate", color: "orange", conditional: true },
          { type: "footer", icon: "ability-range", value: "35m", label: "Active Radius", color: "white" },
          { type: "footer", icon: "ability-duration", value: "7s", label: "Duration", color: "white" }
        ]
      }
    ]
  },

  "weapon:Hollow_Point.png": {
    innateStats: ["+4.5 Out of Combat Regen", "+125 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        description:
          "When you are **above 65% health**, deal additional **Weapon Damage** and your bullets reduce enemy **Bullet Resist**.",
        boxes: [
          { type: "stat", icon: "weapon-damage", value: "+35%", label: "Weapon Damage", color: "orange", conditional: true },
          { type: "stat", icon: "damage-resistance", value: "-9%", label: "Bullet Resist", color: "green", conditional: true },
          { type: "footer", icon: "ability-duration", value: "8s", label: "Debuff Duration", color: "white" }
        ]
      }
    ]
  },

  "weapon:Hunter's_Aura.png": {
    innateStats: ["+100 Bonus Health", "+0.75m Sprint Speed"],
    abilities: [
      {
        type: "Passive",
        description:
          "Reduces nearby enemies' **Bullet Resist and Fire Rate**. If there is only one enemy hero nearby, this effect is doubled.",
        boxes: [
          { type: "stat", icon: "damage-resistance", value: "-10%", label: "Bullet Resist", color: "green", conditional: true },
          { type: "stat", icon: "fire-rate", value: "-15%", label: "Fire Rate", color: "orange" },
          { type: "footer", icon: "ability-range", value: "15m", label: "Radius", color: "white" }
        ]
      }
    ]
  },

  "weapon:Point_Blank.png": {
    innateStats: ["+75 Bonus Health", "+30% Melee Resist"],
    abilities: [
      {
        type: "Passive",
        description: "When in **close range** to your target, gain **Weapon Damage** and your bullets apply a **Movement Slow**.",
        boxes: [
          { type: "stat", icon: "weapon-damage", value: "+50%", label: "Weapon Damage", color: "orange" },
          { type: "stat", icon: "status-move-slow", value: "-25%", label: "Move Speed", color: "purple", conditional: true },
          { type: "footer", icon: "ability-duration", value: "2s", label: "Slow Duration", color: "white" },
          { type: "footer", icon: "ability-range", value: "15m", label: "Close Range", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Close Quarters"
  },

  "weapon:Shadow_Weave.png": {
    innateStats: ["+5 Out of Combat Regen", "+1.5m Sprint Speed"],
    abilities: [
      {
        type: "Active",
        cooldown: "45s",
        description: "Become **Stealthed**. Whenever you take damage while Stealthed you get briefly revealed.",
        extraText: [
          {
            text:
              "Attacking or using an ability will end your stealth and start an **ambush**, temporarily granting you bonus **Fire Rate**, **Spirit Power** and **Melee Damage**."
          }
        ],
        boxes: [
          { type: "status_effect", label: "Invisible" },
          { type: "stat", icon: "ability-duration", value: "13s", label: "Stealth Duration", color: "white" },
          { type: "stat", icon: "fire-rate", value: "+25%", label: "Ambush Fire Rate", color: "orange", conditional: true },
          { type: "stat", icon: "spirit-power", value: "+25", label: "Ambush Spirit Power", color: "purple", conditional: true },
          { type: "stat", icon: "melee-damage", value: "25%", label: "Ambush Melee Damage", color: "orange", conditional: true },
          { type: "footer", icon: "ability-range", value: "20m", label: "Spot Radius", color: "white" },
          { type: "footer", icon: "move-speed", value: "+5m", label: "Invis Sprint Speed", color: "white" },
          { type: "footer", icon: "ability-duration", value: "5s", label: "Ambush Duration", color: "white" }
        ]
      }
    ]
  },

  "weapon:Sharpshooter.png": {
    innateStats: [
      "+20% Weapon Fall-off Range",
      "+25% Weapon Zoom",
      "+60% Bullet Velocity",
      "+10% Weapon Damage",
      "+1m Sprint Speed",
      { text: "-0.7m Move Speed", color: "red" }
    ],
    abilities: [
      {
        type: "Passive",
        description: "Deal additional **Weapon Damage** when **beyond a minimum distance** from your target.",
        boxes: [
          { type: "stat", icon: "weapon-damage", value: "+60%", label: "Weapon Damage", color: "orange", conditional: true },
          { type: "stat", value: "15m", label: "Min. Distance", color: "white" }
        ]
      }
    ],
    upgradesFrom: ["Long Range", "High-Velocity Rounds"]
  },

  "weapon:Spirit_Rend.png": {
    innateStats: ["+75 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        description:
          "Your bullets apply a debuff that reduces the **Spirit Resist** of the target and grants you and your allies **Spirit Lifesteal** against them.",
        boxes: [
          { type: "stat", icon: "damage-resistance", value: "-8%", label: "Spirit Resist", color: "green", conditional: true },
          { type: "stat", icon: "lifesteal", value: "+10%", label: "Spirit Lifesteal", color: "green", conditional: true }
        ]
      },
      {
        type: "Passive",
        description: "Landing **headshots** against the target reduces their **Spirit Resist** further.",
        boxes: [
          { type: "stat", icon: "damage-resistance", value: "-7%", label: "Spirit Resist on Headshot", color: "green", conditional: true },
          { type: "footer", icon: "ability-duration", value: "8s", label: "Debuff Duration", color: "white" },
          { type: "footer", value: "4", label: "Max Stacks", color: "white" },
          { type: "footer", icon: "ability-duration", value: "2s", label: "Max Frequency", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Spirit Shredder Bullets"
  },

  "weapon:Tesla_Bullets.png": {
    abilities: [
      {
        type: "Passive",
        description: "Your bullets have a chance to **shock** your target. The **shock** will jump to a nearby enemy.",
        boxes: [
          { type: "stat", icon: "spirit-damage", value: "33", label: "Shock Damage", color: "purple", scaling: "0.19" },
          { type: "stat", value: "15%", label: "Proc Chance", color: "white" },
          { type: "footer", icon: "ability-duration", value: "0.2s", label: "Max Frequency", color: "white" },
          { type: "footer", value: "4", label: "Max Jumps", color: "white" },
          { type: "footer", icon: "ability-range", value: "8m", label: "Jump Radius", color: "white" }
        ]
      }
    ],
    upgradesTo: "Capacitor"
  },

  "weapon:Toxic_Bullets.png": {
    abilities: [
      {
        type: "Passive",
        description:
          "Your bullets build up a **Bleed**{{icon:status-bleed}} on enemies, causing them to lose a **percentage** of their **Max Health** over time. Also applies **Healing Reduction** on the bleeding target.",
        boxes: [
          { type: "stat", icon: "damage-per-second", value: "1.9%/sec", label: "Bleed Damage", color: "purple", scaling: "0.01" },
          { type: "stat", icon: "status-damage-reduction", value: "-35%", label: "Healing Reduction", color: "red", conditional: true },
          { type: "footer", icon: "ability-duration", value: "4s", label: "Duration", color: "white" },
          { type: "footer", icon: "build-up", value: "1.28%", label: "Buildup Per Shot", color: "white" }
        ]
      }
    ]
  },

  "weapon:Weighted_Shots.png": {
    innateStats: [
      "+30% Weapon Damage",
      "+22% Debuff Resist",
      { text: "-14% Stamina Recovery", color: "red" },
      { text: "-0.5m Move Speed", color: "red" }
    ],
    abilities: [
      {
        type: "Passive",
        description: "Your bullets build up a **Movement Slow** on enemies.",
        boxes: [
          { type: "stat", icon: "status-move-slow", value: "-30%", label: "Move Speed", color: "purple", conditional: true },
          { type: "footer", icon: "dash-distance", value: "-22%", label: "Dash Distance", color: "white" },
          { type: "footer", icon: "ability-duration", value: "3.5s", label: "Slow Duration", color: "white" },
          { type: "footer", icon: "build-up", value: "0.7%", label: "Buildup Per Shot", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Slowing Bullets"
  },

  "weapon:Armor_Piercing_Rounds.png": {
    innateStats: ["+60% Bullet Velocity", "+8% Weapon Damage"],
    abilities: [
      {
        type: "Passive",
        description:
          "Your Bullets have a chance to become **unavoidable**, **piercing through** enemies and **ignoring their Bullet Resistance**.",
        boxes: [{ type: "stat", value: "55%", label: "Proc Chance", color: "white" }]
      }
    ],
    upgradesFrom: "High-Velocity Rounds"
  },

  "weapon:Capacitor.png": {
    innateStats: ["+5% Fire Rate"],
    abilities: [
      {
        type: "Passive",
        description: "Your bullets have a chance to **shock** your target. The **shock** will jump to a nearby enemy.",
        boxes: [
          { type: "stat", icon: "spirit-damage", value: "43", label: "Shock Damage", color: "purple", scaling: "0.19" },
          { type: "stat", value: "20%", label: "Proc Chance", color: "white" },
          { type: "footer", icon: "ability-duration", value: "0.2s", label: "Max Frequency", color: "white" },
          { type: "footer", value: "6", label: "Max Jumps", color: "white" },
          { type: "footer", icon: "ability-range", value: "10m", label: "Jump Radius", color: "white" }
        ]
      },
      {
        type: "Active",
        cooldown: "40s",
        description:
          "Launch a projectile that deals **damage**, applies a strong slow that recovers over time, **prevents Stamina usage** and **Silences** their **movement-based items and abilities**.",
        boxes: [
          { type: "stat", icon: "spirit-damage", value: "100", label: "Damage", color: "purple" },
          { type: "stat", icon: "status-move-slow", value: "-75%", label: "Max Move Speed", color: "purple", conditional: true },
          { type: "footer", icon: "ability-duration", value: "3s", label: "Slow Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Tesla Bullets"
  },

  "weapon:Crippling_Headshot.png": {
    innateStats: ["+125 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        description:
          "Landing a **Headshot** will reduce their **Bullet and Spirit Resist** and applies **Healing Reduction**.",
        boxes: [
          { type: "stat", icon: "damage-resistance", value: "-16%", label: "Bullet Resist", color: "green", conditional: true },
          { type: "stat", icon: "damage-resistance", value: "-16%", label: "Spirit Resist", color: "green", conditional: true },
          { type: "stat", icon: "status-damage-reduction", value: "-35%", label: "Healing Reduction", color: "red", conditional: true },
          { type: "footer", icon: "ability-duration", value: "12s", label: "Debuff Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Weakening Headshot"
  },

  "weapon:Crushing_Fists.png": {
    innateStats: ["+60% Heavy Melee Distance", "+22% Melee Damage", "+12% Bullet Resist"],
    abilities: [
      {
        type: "Passive",
        cooldown: "5s",
        description: "Your next **Heavy Melee** attack against an enemy **deals increased damage**.",
        boxes: [{ type: "stat", icon: "melee-damage", value: "+25%", label: "Bonus Heavy Damage", color: "white" }]
      },
      {
        type: "Passive",
        description:
          "Your **melee damage** will **restore ammo** and apply a **stacking bullet resist debuff** on enemies. Heavy melee applies 2 stacks.",
        extraText: [{ text: "If the target reaches max stacks, they will be **stunned**." }],
        boxes: [
          { type: "stat", icon: "ammo", value: "+15%", label: "Ammo", color: "white" },
          { type: "stat", icon: "damage-resistance", value: "-5%", label: "Bullet Resist", color: "green", conditional: true },
          { type: "stat", value: "6", label: "Max Stacks", color: "white" },
          { type: "footer", icon: "ability-duration", value: "0.75s", label: "Stun Duration", color: "white" },
          { type: "footer", icon: "ability-duration", value: "8s", label: "Debuff Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Melee Charge"
  },

  "weapon:Frenzy.png": {
    innateStats: ["+160 Bonus Health", "+15% Fire Rate", "+10% Bullet Lifesteal"],
    abilities: [
      {
        type: "Passive",
        cooldown: "16s",
        description:
          "While you are **below 50% health**, you gain stat bonuses for a duration and existing debuffs on you are reduced.",
        boxes: [
          { type: "stat", icon: "move-speed", value: "4m/s", label: "Move Speed", color: "green", conditional: true },
          { type: "stat", icon: "fire-rate", value: "40%", label: "Fire Rate", color: "orange", conditional: true },
          { type: "stat", icon: "debuff-resist", value: "+40%", label: "Debuff Resist", color: "purple", conditional: true },
          { type: "footer", icon: "ability-duration", value: "10s", label: "Duration", color: "white" }
        ]
      }
    ]
  },

  "weapon:Glass_Cannon.png": {
    innateStats: ["+80% Weapon Damage", { text: "-13% Max Health", color: "red" }],
    abilities: [
      {
        type: "Passive",
        description:
          "Each hero kill grants **permanent Fire Rate** (up to a max of 8 times). Death results in the loss of 1 stack.",
        boxes: [{ type: "stat", icon: "fire-rate", value: "+7%", label: "Fire Rate per Kill", color: "orange", conditional: true }]
      }
    ]
  },

  "weapon:Lucky_Shot.png": {
    innateStats: ["+30% Max Ammo"],
    abilities: [
      {
        type: "Passive",
        description:
          "Your bullets have a chance to be **empowered**, causing them to deal **bonus weapon damage** on hit.",
        extraText: [{ text: "Bonus damage cannot Crit.", italic: true }],
        boxes: [
          { type: "stat", icon: "weapon-damage", value: "+100%", label: "Bonus Weapon Damage", color: "orange" },
          { type: "stat", value: "25%", label: "Proc Chance", color: "white" }
        ]
      }
    ]
  },

  "weapon:Ricochet.png": {
    innateStats: ["+18% Fire Rate"],
    abilities: [
      {
        type: "Passive",
        description:
          "Your bullets will **ricochet** on enemies near your target, applying any bullet procs and **dealing a percentage of the original damage**.",
        boxes: [
          { type: "stat", icon: "weapon-damage", value: "65%", label: "Ricochet Damage", color: "orange" },
          { type: "footer", value: "2", label: "Ricochet Targets", color: "white" },
          { type: "footer", icon: "ability-range", value: "13m", label: "Ricochet Range", color: "white" }
        ]
      }
    ]
  },

  "weapon:Silencer.png": {
    innateStats: ["+12% Spirit Resist"],
    abilities: [
      {
        type: "Passive",
        description: "Your bullets reduce the target's **outgoing spirit damage**.",
        boxes: [
          { type: "stat", icon: "status-damage-reduction", value: "-25%", label: "Spirit Damage Reduction", color: "purple", conditional: true },
          { type: "footer", icon: "ability-duration", value: "6s", label: "Debuff Duration", color: "white" }
        ]
      },
      {
        type: "Passive",
        description: "Your bullets build up to a **Silence**. Victims are immune to the build up for **10s** after silence expires.",
        boxes: [
          { type: "status_effect", icon: "status-silence", label: "Silenced" },
          { type: "footer", icon: "ability-duration", value: "2.5s", label: "Silence Duration", color: "white" },
          { type: "footer", icon: "ability-duration", value: "10s", label: "Immunity Duration", color: "white" },
          { type: "footer", icon: "build-up", value: "1.04%", label: "Buildup Per Shot", color: "white" }
        ]
      }
    ]
  },

  "weapon:Spellslinger.png": {
    innateStats: ["+5% Ability Cooldown Reduction"],
    abilities: [
      {
        type: "Passive",
        description:
          "While in-combat whenever you cast an ability or item, gain a stacking buff that improves fire rate and reload speed.",
        extraText: [{ text: "Each stack refreshes the duration.", italic: true }],
        boxes: [
          { type: "stat", icon: "fire-rate", value: "+11%", label: "Fire Rate", color: "orange" },
          { type: "stat", icon: "reload-time", value: "-10%", label: "Reload Time", color: "orange" },
          { type: "footer", value: "6", label: "Max Stacks", color: "white" },
          { type: "footer", icon: "ability-duration", value: "18s", label: "Buff Duration", color: "white" }
        ]
      }
    ]
  },

  "weapon:Spiritual_Overflow.png": {
    innateStats: ["+13% Ability Duration", "+13% Spirit Lifesteal", "+90 Bonus Health", "+6 Spirit Power"],
    abilities: [
      {
        type: "Passive",
        description:
          "Gain bonus **Fire Rate**, **Spirit Power** and **Spirit Lifesteal** by **charging up** when shooting enemy heroes.",
        boxes: [
          { type: "stat", icon: "fire-rate", value: "+30%", label: "Fire Rate", color: "orange" },
          { type: "stat", icon: "spirit-power", value: "+40", label: "Spirit Power", color: "purple" },
          { type: "stat", icon: "lifesteal", value: "+10%", label: "Spirit Lifesteal", color: "green" },
          { type: "footer", icon: "build-up", value: "0.75%", label: "Buildup Per Shot", color: "white" },
          { type: "footer", icon: "ability-duration", value: "15s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Spirit Lifesteal"
  },

  "vitality:Extra_Health.png": {
    innateStats: ["+210 Bonus Health"],
    upgradesTo: ["Fortitude", "Colossus"]
  },

  "vitality:Extra_Regen.png": {
    innateStats: ["+2.5 Health Regen", "+1.5 Out of Combat Regen"],
    upgradesTo: "Healing Booster"
  },

  "vitality:Extra_Stamina.png": {
    innateStats: ["+1 Stamina", "+12% Stamina Recovery"],
    upgradesTo: ["Stamina Mastery", "Kinetic Dash", "Arcane Surge"]
  },

  "vitality:Grit.png": {
    innateStats: ["+1 Out of Combat Regen"],
    abilities: [
      {
        type: "Active",
        cooldown: "60s",
        description: "Gain a **Barrier** for a short duration.",
        boxes: [
          { type: "stat", icon: "damage-barrier", value: "200", label: "Barrier", color: "green", conditional: true },
          { type: "footer", icon: "ability-duration", value: "4s", label: "Barrier Duration", color: "white" }
        ]
      }
    ],
    upgradesTo: ["Weapon Shielding", "Spirit Shielding", "Guardian Ward", "Reactive Barrier"]
  },

  "vitality:Healing_Rite.png": {
    abilities: [
      {
        type: "Active",
        cooldown: "70s",
        description:
          "Grant **Regen** and **Sprint Speed** to the target. Gets dispelled if you take damage from enemy players or objectives. Can be self-cast.",
        boxes: [
          { type: "stat", icon: "lifesteal", value: "300", label: "Total HP Regen", color: "green" },
          { type: "stat", icon: "move-speed", value: "+2m", label: "Sprint Speed", color: "green", conditional: true },
          { type: "footer", icon: "ability-duration", value: "20s", label: "Regen Duration", color: "white" },
          { type: "footer", icon: "ability-range", value: "30m", label: "Cast Range", color: "white" }
        ]
      }
    ],
    upgradesTo: ["Rescue Beam", "Healing Nova"]
  },

  "vitality:Melee_Lifesteal.png": {
    innateStats: ["+12% Melee Damage"],
    abilities: [
      {
        type: "Passive",
        cooldown: "8s",
        description: "Your next **Melee** attack **heals you**.",
        extraText: [
          { text: "This heal is 30% effective vs non-heroes.", italic: true },
          { text: "Cooldown is 1.5x as long for Light Melee hits.", italic: true }
        ],
        boxes: [{ type: "stat", icon: "lifesteal", value: "100", label: "Heal on Melee Hit", color: "green" }]
      }
    ],
    upgradesTo: "Lifestrike"
  },

  "vitality:Rebuttal.png": {
    innateStats: ["-1.75s Parry Cooldown", "+18% Melee Resist", "+75 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        description:
          "On a successful **Parry** against an enemy Hero, **Heal** yourself for the damage parried and returns that damage to the target, and temporarily gain increased **damage**.",
        boxes: [
          { type: "stat", icon: "pure-damage", value: "+30%", label: "Bonus Damage", color: "red", conditional: true },
          { type: "footer", icon: "ability-duration", value: "6s", label: "Buff Duration", color: "white" }
        ]
      }
    ]
  },

  "vitality:Sprint_Boots.png": {
    innateStats: ["+2m Sprint Speed", "+2 Out of Combat Regen"],
    upgradesTo: ["Trophy Collector", "Enduring Speed", "Veil Walker"]
  },

  "vitality:Battle_Vest.png": {
    innateStats: ["+18% Bullet Resist", "+3 Out of Combat Regen"],
    abilities: [
      {
        type: "Passive",
        description: "While you are **above 65% health**, gain **weapon damage** and **bonus fire rate**.",
        boxes: [
          { type: "stat", icon: "weapon-damage", value: "+18%", label: "Weapon Damage", color: "orange", conditional: true },
          { type: "stat", icon: "fire-rate", value: "+7%", label: "Fire Rate", color: "orange", conditional: true }
        ]
      }
    ]
  },

  "vitality:Bullet_Lifesteal_(item).png": {
    innateStats: ["+13% Bullet Lifesteal", "+90 Bonus Health", "+6% Weapon Damage"],
    upgradesTo: ["Leech", "Fury Trance", "Vampiric Burst"]
  },

  "vitality:Debuff_Reducer.png": {
    innateStats: ["+90 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        description: "Reduces the **duration** of all negative effects applied to you.",
        boxes: [{ type: "stat", icon: "debuff-resist", value: "+25%", label: "Debuff Resist", color: "white" }]
      }
    ],
    upgradesTo: ["Unstoppable", "Spellbreaker"]
  },

  "vitality:Enchanter's_Emblem.png": {
    innateStats: ["+18% Spirit Resist", "+2 Out of Combat Regen"],
    abilities: [
      {
        type: "Passive",
        description: "While you are **above 65% health**, gain bonus **Spirit** and **Cooldown Reduction**.",
        boxes: [
          { type: "stat", icon: "spirit-power", value: "+15", label: "Spirit Power", color: "purple", conditional: true },
          { type: "stat", icon: "ability-cooldown", value: "+5%", label: "Ability Cooldown Reduction", color: "purple", conditional: true }
        ]
      }
    ]
  },

  "vitality:Enduring_Speed.png": {
    innateStats: ["+2m Move Speed", "+2 Out of Combat Regen"],
    abilities: [
      {
        type: "Passive",
        description: "Reduces the effect of enemy **Move Speed** penalties.",
        boxes: [{ type: "stat", icon: "move-speed", value: "+25%", label: "Slow Resist", color: "green" }]
      }
    ],
    upgradesFrom: "Sprint Boots",
    upgradesTo: "Juggernaut"
  },

  "vitality:Guardian_Ward.png": {
    innateStats: ["+8% Ability Range", "+1.5 Out of Combat Regen"],
    abilities: [
      {
        type: "Active",
        cooldown: "60s",
        description: "Provide the target with a **Barrier** and temporary **Move Speed**.",
        extraText: [
          { text: "Can be self-cast.", italic: true },
          { text: "Cooldown is reduced by half when cast on someone else.", italic: true }
        ],
        boxes: [
          { type: "stat", icon: "damage-barrier", value: "250", label: "Barrier", color: "green", conditional: true },
          { type: "stat", icon: "move-speed", value: "+2.75m", label: "Move Speed", color: "green", conditional: true },
          { type: "footer", icon: "ability-duration", value: "6s", label: "Buff Duration", color: "white" },
          { type: "footer", icon: "ability-range", value: "40m", label: "Cast Range", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Grit",
    upgradesTo: "Divine Barrier"
  },

  "vitality:Healbane.png": {
    innateStats: ["+7 Spirit Power"],
    abilities: [
      {
        type: "Passive",
        description:
          "Your **spirit damage** applies **Healing Reduction**. If an enemy hero dies under this effect, you receive a large heal.",
        boxes: [
          { type: "stat", icon: "status-damage-reduction", value: "-35%", label: "Healing Reduction", color: "red", conditional: true },
          { type: "stat", icon: "lifesteal", value: "275", label: "Heal On Hero Kill", color: "green" },
          { type: "footer", icon: "ability-duration", value: "8s", label: "Duration", color: "white" }
        ]
      }
    ]
  },

  "vitality:Healing_Booster.png": {
    innateStats: ["+3 Health Regen", "+1 Out of Combat Regen"],
    abilities: [
      {
        type: "Passive",
        description: "Increases the effectiveness of your **healing**.",
        boxes: [{ type: "stat", value: "+20%", label: "Healing Effectiveness", color: "white" }]
      }
    ],
    upgradesFrom: "Extra Regen",
    upgradesTo: "Healing Tempo"
  },

  "vitality:Reactive_Barrier.png": {
    innateStats: ["+1 Out of Combat Regen"],
    abilities: [
      {
        type: "Passive",
        cooldown: "55s",
        description: "Gain a **Barrier** when you are **Stunned, Chained, Immobilized, Slept or Silenced**.",
        boxes: [
          { type: "stat", icon: "damage-barrier", value: "325", label: "Barrier", color: "green", conditional: true, scaling: "1.80" },
          { type: "footer", icon: "ability-duration", value: "10s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Grit",
    upgradesTo: "Indomitable"
  },

  "vitality:Restorative_Locket.png": {
    innateStats: ["+10% Spirit Resist"],
    abilities: [
      {
        type: "Active",
        cooldown: "20s",
        description: "When an enemy uses an ability within 35m range from you, store one **Restoration Stack**.",
        extraText: [
          { text: "Consume all stacks to **heal yourself** and replenish **up to 3 stamina** based on how many stacks you have." }
        ],
        boxes: [
          { type: "stat", icon: "lifesteal", value: "16", label: "Heal Per Stack", color: "green" },
          { type: "stat", value: "25", label: "Max Stacks", color: "white" },
          { type: "stat", value: "3", label: "Max Stamina Restore", color: "white" }
        ]
      }
    ]
  },

  "vitality:Return_Fire.png": {
    innateStats: ["+10% Bullet Resist"],
    abilities: [
      {
        type: "Active",
        cooldown: "23s",
        description: "Automatically **fire a bullet** towards any attacker who damages you with their abilities or weapon.",
        boxes: [
          { type: "stat", icon: "pure-damage", value: "65%", label: "Bullet Damage Returned", color: "orange" },
          { type: "stat", icon: "pure-damage", value: "25%", label: "Spirit Damage Returned", color: "purple" },
          { type: "footer", icon: "ability-duration", value: "6.5s", label: "Duration", color: "white" }
        ]
      }
    ]
  },

  "vitality:Spirit_Lifesteal_(item).png": {
    innateStats: ["+13% Spirit Lifesteal", "+90 Bonus Health", "+6 Spirit Power"],
    upgradesTo: ["Leech", "Spiritual Overflow", "Infuser"]
  },

  "vitality:Spirit_Shielding.png": {
    innateStats: ["+2.5 Out of Combat Regen"],
    abilities: [
      {
        type: "Passive",
        cooldown: "45s",
        description:
          "Gain a **Barrier** whenever you take significant **spirit damage** from enemy Heroes in a small time frame.",
        boxes: [
          { type: "stat", icon: "damage-barrier", value: "300", label: "Barrier", color: "green", conditional: true, scaling: "5.00" },
          { type: "stat", icon: "damage-resistance", value: "+18%", label: "Spirit Resist", color: "purple", conditional: true },
          { type: "footer", icon: "build-up", value: "225", label: "Damage Threshold", color: "white" },
          { type: "footer", icon: "ability-duration", value: "3.5s", label: "Time Frame", color: "white" },
          { type: "footer", icon: "ability-duration", value: "8s", label: "Barrier Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Grit"
  },

  "vitality:Trophy_Collector.png": {
    innateStats: [{ text: "-15% Weapon Damage vs. NPCs", color: "red" }, "+2m Sprint Speed", "+2 Out of Combat Regen"],
    abilities: [
      {
        type: "Passive",
        description:
          "Whenever you score an **assist or kill**, gain extra **sprint, ability range** and **passive soul generation**. This effect stacks and persists through death.",
        boxes: [
          { type: "stat", icon: "move-speed", value: "+0.15m", label: "Sprint Speed", color: "white" },
          { type: "stat", icon: "ability-range", value: "+0.75%", label: "Ability Range", color: "purple" },
          { type: "stat", icon: "souls", value: "18", label: "Souls per Minute", color: "green" },
          { type: "footer", value: "16", label: "Max Stacks", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Sprint Boots"
  },

  "vitality:Weapon_Shielding.png": {
    innateStats: ["+2.5 Out of Combat Regen"],
    abilities: [
      {
        type: "Passive",
        cooldown: "35s",
        description:
          "Gain a **Barrier** whenever you take significant **weapon damage** from enemy Heroes in a small time frame.",
        boxes: [
          { type: "stat", icon: "damage-barrier", value: "300", label: "Barrier", color: "green", conditional: true, scaling: "5.00" },
          { type: "stat", icon: "damage-resistance", value: "+18%", label: "Bullet Resist", color: "orange", conditional: true },
          { type: "footer", icon: "build-up", value: "250", label: "Damage Threshold", color: "white" },
          { type: "footer", icon: "ability-duration", value: "4s", label: "Time Frame", color: "white" },
          { type: "footer", icon: "ability-duration", value: "8s", label: "Barrier Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Grit"
  },

  "vitality:Bullet_Resilience.png": {
    innateStats: ["+30% Bullet Resist", "+3 Out of Combat Regen"],
    abilities: [
      {
        type: "Passive",
        description: "When below **50% health**, gain additional Bullet Resist.",
        boxes: [{ type: "stat", icon: "damage-resistance", value: "+15%", label: "Bullet Resist", color: "orange", conditional: true }]
      }
    ]
  },

  "vitality:Counterspell.png": {
    innateStats: ["+50 Bonus Health", "+5 Spirit Power"],
    abilities: [
      {
        type: "Passive",
        cooldown: "23s",
        description:
          "Your next parry **protects you** from the damage and effects of enemy abilities and items. On a successful spell parry **heal** and gain **move speed** and **Spirit**.",
        boxes: [
          { type: "stat", icon: "lifesteal", value: "150", label: "Healing", color: "green", conditional: true },
          { type: "stat", icon: "spirit-power", value: "+20", label: "Spirit Power", color: "purple", conditional: true },
          { type: "stat", icon: "move-speed", value: "+1.75m", label: "Move Speed", color: "green", conditional: true },
          { type: "footer", icon: "ability-duration", value: "6s", label: "Buff Duration", color: "white" },
          { type: "footer", icon: "ability-duration", value: "0.8s", label: "Spell Parry Duration", color: "white" }
        ]
      }
    ]
  },

  "vitality:Dispel_Magic.png": {
    innateStats: ["+10% Spirit Resist"],
    abilities: [
      {
        type: "Active",
        cooldown: "45s",
        description:
          "Purge all non-ultimate negative effects currently applied to you. If any effects were removed, **heal yourself** and gain a **move speed bonus**.",
        extraText: [{ text: "Cannot be used while Stunned or Slept.", italic: true }],
        boxes: [
          { type: "stat", icon: "lifesteal", value: "250", label: "HP Healed On Activate", color: "green" },
          { type: "stat", icon: "move-speed", value: "+2m", label: "Move Speed", color: "white" },
          { type: "footer", icon: "ability-duration", value: "3s", label: "Buff Duration", color: "white" }
        ]
      }
    ]
  },

  "vitality:Fortitude.png": {
    innateStats: ["+375 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        description: "After not taking damage for a period, gain **health regen**.",
        boxes: [
          { type: "stat", value: "+10s", label: "Restore Delay", color: "white" },
          { type: "stat", value: "+2%", label: "Max Health Regen", color: "white" }
        ]
      },
      {
        type: "Passive",
        description: "When you are **above 75% health**, you have bonus **Move Speed**.",
        boxes: [{ type: "stat", icon: "move-speed", value: "+1.5m", label: "Move Speed", color: "green", conditional: true }]
      }
    ],
    upgradesFrom: "Extra Health"
  },

  "vitality:Fury_Trance.png": {
    innateStats: ["+14% Bullet Lifesteal", "+100 Bonus Health", "+6% Weapon Damage"],
    abilities: [
      {
        type: "Active",
        cooldown: "18s",
        description:
          "Grants **Fire Rate**, **Spirit Resistance** and **Move Speed**, and removes the **Move Speed** penalty while shooting, but **Silences** you and disables stamina usage and regeneration.",
        boxes: [
          { type: "stat", icon: "fire-rate", value: "32%", label: "Fire Rate", color: "orange" },
          { type: "stat", icon: "move-speed", value: "+1m", label: "Move Speed", color: "green", conditional: true },
          { type: "stat", icon: "damage-resistance", value: "+40%", label: "Spirit Resist", color: "purple" },
          { type: "footer", icon: "ability-duration", value: "6.5s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Bullet Lifesteal"
  },

  "vitality:Healing_Nova.png": {
    innateStats: ["+5% Ability Range", "+8 Spirit Power"],
    abilities: [
      {
        type: "Active",
        cooldown: "60s",
        description: "**Heal** yourself and nearby allies.",
        boxes: [
          { type: "stat", icon: "lifesteal", value: "325", label: "Total HP Regen", color: "green" },
          { type: "stat", value: "2s", label: "Regen Duration", color: "white" },
          { type: "stat", value: "18m", label: "Radius", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Healing Rite"
  },

  "vitality:Lifestrike.png": {
    innateStats: ["+16% Melee Damage", "+125 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        cooldown: "4s",
        description:
          "Your **Melee Attack** applies **Movement Slow** and **heals you** for a percentage of the **Melee Damage** dealt plus a fixed amount.",
        extraText: [
          { text: "This heal is 40% effective vs non-heroes.", italic: true },
          { text: "Cooldown is 1.5x as long for Light Melee hits.", italic: true }
        ],
        boxes: [
          { type: "stat", icon: "status-move-slow", value: "-60%", label: "Move Speed", color: "purple", conditional: true },
          { type: "stat", icon: "lifesteal", value: "100", label: "Heal on Melee Hit", color: "green" },
          { type: "stat", icon: "lifesteal", value: "30%", label: "Melee Hit Heal", color: "green" },
          { type: "footer", icon: "ability-duration", value: "2.5s", label: "Slow Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Melee Lifesteal"
  },

  "vitality:Majestic_Leap.png": {
    abilities: [
      {
        type: "Active",
        cooldown: "45s",
        description:
          "**Launch yourself** high into the air and grant yourself a **Barrier**. While in the air, you can use the active again to drop down faster.",
        extraText: [{ text: "Cannot be used for 5s if attacked by enemy Hero.", italic: true }],
        boxes: [
          { type: "stat", icon: "damage-barrier", value: "200", label: "Barrier", color: "green", conditional: true, scaling: "12.00" },
          { type: "stat", icon: "ability-cooldown", value: "5s", label: "Interrupt Cooldown", color: "white" },
          { type: "footer", icon: "ability-duration", value: "8s", label: "Barrier Duration", color: "white" },
          { type: "footer", value: "+50%", label: "Air Control", color: "white" }
        ]
      }
    ]
  },

  "vitality:Metal_Skin.png": {
    innateStats: ["+12% Bullet Resist"],
    abilities: [
      {
        type: "Active",
        cooldown: "24s",
        description: "Become **immune to bullets**.",
        boxes: [
          { type: "footer", value: "-1.5m", label: "Active Movespeed Penalty", color: "red" },
          { type: "footer", icon: "dash-distance", value: "-20%", label: "Dash Distance", color: "white" },
          { type: "footer", icon: "ability-duration", value: "5s", label: "Duration", color: "white" }
        ]
      }
    ]
  },

  "vitality:Rescue_Beam.png": {
    innateStats: ["+0.75m Sprint Speed", "+6% Ability Range"],
    abilities: [
      {
        type: "Active",
        cooldown: "60s",
        description:
          "**Heals** a target allied hero and yourself for a percentage of **Max Health**. Once while healing, you can **Pull** the target towards you. Can be self-cast.",
        boxes: [
          { type: "stat", icon: "lifesteal", value: "20%", label: "Heal Amount", color: "green" },
          { type: "stat", icon: "move-speed", value: "0m", label: "Move Speed", color: "white" },
          { type: "footer", value: "2.5s", label: "Channel Duration", color: "white" },
          { type: "footer", icon: "ability-range", value: "35m", label: "Cast Range", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Healing Rite"
  },

  "vitality:Spirit_Resilience.png": {
    innateStats: ["+30% Spirit Resist", "+3 Out of Combat Regen"],
    abilities: [
      {
        type: "Passive",
        description: "When below **50% health**, gain additional Spirit Resist.",
        boxes: [{ type: "stat", icon: "damage-resistance", value: "+15%", label: "Spirit Resist", color: "purple", conditional: true }]
      }
    ]
  },

  "vitality:Stamina_Mastery.png": {
    innateStats: ["+2 Stamina", "+18% Stamina Recovery", "+23% Air Jump/Dash Distance"],
    abilities: [
      {
        type: "Passive",
        description: "Allows an additional use of **Air Jump** or **Air Dash** before landing."
      }
    ],
    upgradesFrom: "Extra Stamina",
    upgradesTo: "Aerial Supremacy"
  },

  "vitality:Veil_Walker.png": {
    innateStats: ["+2m Sprint Speed", "+2 Out of Combat Regen", "+125 Bonus Health", "+10 Spirit Power"],
    abilities: [
      {
        type: "Passive",
        cooldown: "15s",
        description: "Walking through a **cosmic veil** grants you **Stealth**, **Heal** and increased **Move Speed**.",
        boxes: [
          { type: "status_effect", label: "Invisible" },
          { type: "stat", icon: "move-speed", value: "3.5m", label: "Invis Move Speed", color: "green", conditional: true },
          { type: "stat", icon: "lifesteal", value: "85", label: "Heal", color: "green" },
          { type: "footer", icon: "ability-duration", value: "8s", label: "Invisibility Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Sprint Boots"
  },

  "vitality:Warp_Stone.png": {
    abilities: [
      {
        type: "Active",
        cooldown: "16s",
        description: "**Teleport** straight ahead, gaining **Bullet Resist**.",
        boxes: [
          { type: "stat", value: "11m", label: "Teleport Range", color: "white" },
          { type: "stat", icon: "damage-resistance", value: "+30%", label: "Bullet Resist", color: "orange", conditional: true },
          { type: "footer", icon: "ability-duration", value: "6s", label: "Buff Duration", color: "white" }
        ]
      }
    ]
  },

  "vitality:Cheat_Death.png": {
    innateStats: ["+200 Bonus Health", "+15% Bullet Resist"],
    abilities: [
      {
        type: "Passive",
        cooldown: "90s",
        description:
          "When you would take lethal damage, instead become **temporarily death immune** and **remove all non-stun debuffs**.",
        extraText: [{ text: "While death immune, you deal **reduced damage** and have **reduced healing**." }],
        boxes: [
          { type: "stat", icon: "ability-duration", value: "4.5s", label: "Death Immunity Duration", color: "white" },
          { type: "stat", value: "-60%", label: "Damage Reduction", color: "red" },
          { type: "stat", icon: "status-damage-reduction", value: "-60%", label: "Healing Reduction", color: "red" }
        ]
      }
    ]
  },

  "vitality:Colossus.png": {
    innateStats: ["+25% Base Health", "+15% Weapon Damage"],
    abilities: [
      {
        type: "Active",
        cooldown: "37s",
        description: "Grow **larger in size**, gaining **bullet resist**, **spirit resist**, and **melee damage**.",
        extraText: [{ text: "Nearby enemies suffer from **slow** and have reduced dash speed." }],
        boxes: [
          { type: "stat", icon: "damage-resistance", value: "35%", label: "Bullet Resist", color: "orange", conditional: true },
          { type: "stat", icon: "damage-resistance", value: "35%", label: "Spirit Resist", color: "purple", conditional: true },
          { type: "stat", icon: "melee-damage", value: "+30%", label: "Melee Damage", color: "orange", conditional: true },
          { type: "stat", icon: "status-move-slow", value: "-30%", label: "Move Speed", color: "purple", conditional: true },
          { type: "footer", icon: "ability-range", value: "14m", label: "Radius", color: "white" },
          { type: "footer", icon: "ability-duration", value: "7s", label: "Duration", color: "white" },
          { type: "footer", value: "20%", label: "Model Scale", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Extra Health"
  },

  "vitality:Divine_Barrier.png": {
    innateStats: ["+10% Ability Range", "+1.5 Out of Combat Regen"],
    abilities: [
      {
        type: "Active",
        cooldown: "45s",
        description: "Remove **all non-stun debuffs** from the target and provide them with a **Barrier** and **Move Speed**.",
        extraText: [{ text: "Can be self-cast. Cooldown is reduced by half when cast on someone else.", italic: true }],
        boxes: [
          { type: "stat", icon: "damage-barrier", value: "600", label: "Barrier", color: "green", conditional: true },
          { type: "stat", icon: "move-speed", value: "+2.75m", label: "Move Speed", color: "green", conditional: true },
          { type: "footer", icon: "ability-duration", value: "6s", label: "Buff Duration", color: "white" },
          { type: "footer", icon: "ability-range", value: "40m", label: "Cast Range", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Guardian Ward"
  },

  "vitality:Diviner's_Kevlar.png": {
    innateStats: ["+15% Ability Duration"],
    abilities: [
      {
        type: "Passive",
        cooldown: "40s",
        description: "Upon casting an **ultimate ability** gain a **Barrier** and temporary **Spirit Power**.",
        boxes: [
          { type: "stat", icon: "damage-barrier", value: "1000", label: "Barrier", color: "green", conditional: true },
          { type: "stat", icon: "spirit-power", value: "+40", label: "Spirit Power", color: "purple", conditional: true },
          { type: "footer", icon: "ability-duration", value: "20s", label: "Buff Duration", color: "white" }
        ]
      }
    ]
  },

  "vitality:Healing_Tempo.png": {
    innateStats: ["+25% Healing Effectiveness", "+10% Spirit Resist", "+6 Health Regen", "+4 Out of Combat Regen"],
    abilities: [
      {
        type: "Passive",
        description: "Applying **heal** to yourself or an ally grants the target **bonus fire rate** and **bonus move speed**.",
        extraText: [{ text: "Does not apply on innate Regen or passive Bullet/Spirit Lifesteals.", italic: true }],
        boxes: [
          { type: "stat", icon: "fire-rate", value: "+35%", label: "Fire Rate", color: "orange" },
          { type: "stat", icon: "move-speed", value: "+1.25m", label: "Move Speed", color: "green" },
          { type: "footer", icon: "ability-duration", value: "7s", label: "Buff Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Healing Booster"
  },

  "vitality:Indomitable.png": {
    innateStats: ["+10% Bullet Resist", "+10% Spirit Resist", "+2 Out of Combat Regen"],
    abilities: [
      {
        type: "Passive",
        cooldown: "55s",
        description:
          "The next **Stun, Chain, Immobilize, Sleep or Silence** is automatically cleansed. When this happens, you gain a **barrier** and all your **ability cooldowns** get reduced by 20%.",
        boxes: [
          { type: "stat", icon: "damage-barrier", value: "325", label: "Barrier", color: "green", conditional: true, scaling: "2.00" },
          { type: "stat", value: "10s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Reactive Barrier"
  },

  "vitality:Infuser.png": {
    innateStats: ["+13% Spirit Lifesteal", "+10% Spirit Resist", "+100 Bonus Health", "+6 Spirit Power"],
    abilities: [
      {
        type: "Active",
        cooldown: "30s",
        description: "Gain **Spirit Lifesteal** and **Spirit Power**.",
        boxes: [
          { type: "stat", icon: "lifesteal", value: "+70%", label: "Spirit Lifesteal", color: "green", conditional: true },
          { type: "stat", icon: "spirit-power", value: "+30", label: "Spirit Power", color: "purple", conditional: true },
          { type: "footer", icon: "ability-duration", value: "7s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Spirit Lifesteal"
  },

  "vitality:Inhibitor.png": {
    innateStats: ["+10% Weapon Damage", "+150 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        description: "Your bullets build up to reduce the target's **outgoing damage** and apply **healing reduction**.",
        boxes: [
          { type: "stat", icon: "status-damage-reduction", value: "-30%", label: "Damage Penalty", color: "red", conditional: true },
          { type: "stat", icon: "status-damage-reduction", value: "-40%", label: "Healing Reduction", color: "red", conditional: true },
          { type: "footer", icon: "ability-duration", value: "5s", label: "Debuff Duration", color: "white" },
          { type: "footer", icon: "build-up", value: "0.77%", label: "Buildup Per Shot", color: "white" }
        ]
      }
    ]
  },

  "vitality:Leech.png": {
    innateStats: ["+25% Spirit Lifesteal", "+25% Bullet Lifesteal", "+180 Bonus Health", "+12% Weapon Damage", "+12 Spirit Power"],
    upgradesFrom: ["Bullet Lifesteal", "Spirit Lifesteal"]
  },

  "vitality:Phantom_Strike.png": {
    innateStats: ["+15% Weapon Damage", "+8 Spirit Power"],
    abilities: [
      {
        type: "Active",
        cooldown: "35s",
        description:
          "**Teleport** to an enemy target and pull them to the ground. Dealing **damage**, **Move speed** reduction and **Disarm**.",
        boxes: [
          { type: "status_effect", icon: "status-disarm", label: "Disarmed" },
          { type: "stat", icon: "status-move-slow", value: "-50%", label: "Move Speed", color: "purple", conditional: true },
          { type: "stat", icon: "spirit-damage", value: "75", label: "Impact Damage", color: "purple", scaling: "0.93" },
          { type: "footer", icon: "ability-range", value: "25m", label: "Cast Range", color: "white" },
          { type: "footer", icon: "ability-duration", value: "3s", label: "Debuff Duration", color: "white" }
        ]
      }
    ]
  },

  "vitality:Plated_Armor.png": {
    innateStats: ["+130 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        description:
          "Gain a chance to either **deflect** incoming bullets, preventing all **weapon damage** or prevent all **on-hit effects** from bullets.",
        boxes: [
          { type: "stat", icon: "damage-resistance", value: "30%", label: "Deflection Percent", color: "white" },
          { type: "stat", icon: "damage-resistance", value: "50%", label: "On-Hit Prevention Percent", color: "white" }
        ]
      }
    ]
  },

  "vitality:Siphon_Bullets.png": {
    innateStats: ["+15% Weapon Damage", "+10% Bullet Resist"],
    abilities: [
      {
        type: "Passive",
        description:
          "Your bullets temporarily **steal Max HP** from enemies. Enemies regain their stolen health when the debuff expires.",
        boxes: [
          { type: "stat", icon: "health", value: "2.5%", label: "Max HP Steal", color: "green" },
          { type: "stat", value: "17s", label: "Steal Duration", color: "white" },
          { type: "stat", value: "1.2s", label: "Max Frequency", color: "white" }
        ]
      }
    ]
  },

  "vitality:Spellbreaker.png": {
    innateStats: ["+18% Spirit Resist", "+25% Debuff Resist", "+90 Bonus Health"],
    abilities: [
      {
        type: "Passive",
        cooldown: "9s",
        description: "The next instance of high **spirit damage** you take is significantly reduced.",
        boxes: [
          { type: "stat", icon: "damage-resistance", value: "65%", label: "Spirit Damage Reduction", color: "purple" },
          { type: "stat", icon: "build-up", value: "175", label: "Damage Threshold", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Debuff Reducer"
  },

  "vitality:Unstoppable.png": {
    innateStats: ["+25% Debuff Resist", "+125 Bonus Health"],
    abilities: [
      {
        type: "Active",
        cooldown: "60s",
        description:
          "Temporarily suppress **negative status effects** and become **immune** to **Stun, Silence, Sleep, Root, and Disarm**.",
        extraText: [{ text: "Cannot be used while Stunned or Slept." }],
        boxes: [{ type: "stat", icon: "ability-duration", value: "5.5s", label: "Duration", color: "white" }]
      }
    ],
    upgradesFrom: "Debuff Reducer"
  },

  "vitality:Vampiric_Burst.png": {
    innateStats: ["+13% Bullet Lifesteal", "+10% Bullet Resist", "+100 Bonus Health", "+6% Weapon Damage"],
    abilities: [
      {
        type: "Active",
        cooldown: "30s",
        description: "Grants **Lifesteal**, **Fire Rate**, and **Ammo**. This added Ammo is not limited by your max magazine size.",
        boxes: [
          { type: "stat", icon: "lifesteal", value: "70%", label: "Bullet Lifesteal", color: "green" },
          { type: "stat", icon: "fire-rate", value: "34%", label: "Fire Rate", color: "orange" },
          { type: "footer", value: "+75%", label: "Ammo", color: "white" },
          { type: "footer", icon: "ability-duration", value: "5s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Bullet Lifesteal"
  },

  "vitality:Witchmail.png": {
    innateStats: ["+22% Spirit Resist", "+14 Spirit Power"],
    abilities: [
      {
        type: "Passive",
        cooldown: "1s",
        description: "Taking heavy hits of **spirit damage** from an enemy reduces a **random ability cooldown**.",
        boxes: [
          { type: "stat", icon: "ability-cooldown", value: "4s", label: "Cooldown Reduction per Hit", color: "white" },
          { type: "stat", icon: "build-up", value: "75", label: "Damage Threshold", color: "white" }
        ]
      }
    ]
  },

  "vitality:Juggernaut.png": {
    innateStats: ["+50% Slow Resist", "+2.5m Move Speed", "+25% Melee Resist", "+8 Health Regen"],
    abilities: [
      {
        type: "Passive",
        description: "Enemies that shoot you have their **Fire Rate** slowed.",
        boxes: [
          { type: "stat", icon: "fire-rate", value: "-40%", label: "Fire Rate", color: "orange" },
          { type: "stat", value: "4s", label: "Duration", color: "white" }
        ]
      }
    ],
    upgradesFrom: "Enduring Speed"
  }
};
