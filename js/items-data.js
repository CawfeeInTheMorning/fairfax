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
  "weapon-damage": "weapon-damage-icon.png"
};

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
          "Inflict **damage over time** to a target, dealing damage based on their current health. " +
          "Decay's damage is non-lethal and does not apply item procs.",
        boxes: [
          { type: "stat", icon: "ability-range", value: "20m", label: "Cast Range", color: "white", scaling: "0.10" },
          { type: "stat", icon: "damage-per-second", value: "2.6%/sec", label: "Bleed Damage", color: "purple", scaling: "0.00" },
          { type: "stat", icon: "damage-resistance", value: "-50%", label: "Healing Reduction", color: "red", conditional: true },
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
  }
};
