#!/usr/bin/env node
// Cross-checks js/app.js's HERO_DETAILS against a hero_data.json dump pulled
// straight from the game files (Source 2 KV data exported to JSON, keyed by
// internal codename e.g. "hero_atlas" rather than display name). Reusable —
// re-run this any time you pull a fresh hero_data.json to see what drifted.
//
// Usage:
//   node tools/sync-hero-data.js [path/to/hero_data.json]
//   (defaults to ./hero_data.json next to this repo's root)
//
// This only REPORTS differences — it does not edit app.js. Every stat in
// hero_data.json is a hero's flat *base* value (no "+per-level growth"
// suffix like the wiki-scraped "830+39" strings in HERO_DETAILS carry), so
// the report compares the base component only.

const fs = require("fs");
const path = require("path");

const repoRoot = path.join(__dirname, "..");
const appJsPath = path.join(repoRoot, "js", "app.js");
const heroDataPath = path.resolve(process.argv[2] || path.join(repoRoot, "hero_data.json"));

// Extracts a `const NAME = <object or array literal>;` declaration's value
// out of app.js's source text by balanced-brace scanning (respects string
// literals so a brace/bracket inside a quoted string doesn't confuse the
// depth count), then evaluates just that literal. app.js can't be
// require()'d directly — it's a browser IIFE that touches `document` at
// module scope — so this is the simplest way to reuse its data in Node.
function extractDeclaration(source, varName) {
  const marker = "const " + varName + " = ";
  const start = source.indexOf(marker);
  if (start === -1) throw new Error("Could not find `" + marker + "` in " + appJsPath);
  let i = start + marker.length;
  const openChar = source[i];
  const closeChar = openChar === "{" ? "}" : "]";
  let depth = 0;
  let inString = null;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;
  let j = i;
  for (; j < source.length; j++) {
    const c = source[j];
    const next = source[j + 1];
    if (inLineComment) {
      if (c === "\n") inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (c === "*" && next === "/") {
        inBlockComment = false;
        j++;
      }
      continue;
    }
    if (inString) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === inString) inString = null;
      continue;
    }
    if (c === "/" && next === "/") {
      inLineComment = true;
      j++;
      continue;
    }
    if (c === "/" && next === "*") {
      inBlockComment = true;
      j++;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inString = c;
      continue;
    }
    if (c === openChar) depth++;
    else if (c === closeChar) {
      depth--;
      if (depth === 0) {
        j++;
        break;
      }
    }
  }
  const literal = source.slice(i, j);
  return new Function("return (" + literal + ");")();
}

// Our hero slug -> hero_data.json's top-level codename key. Not derivable
// programmatically — deadlock.wiki's "Internal Names" field is free text
// (e.g. "Geist; Ghost; Spectre") and doesn't consistently name the actual
// game codename, so this table was built by hand once, cross-referencing
// HERO_DETAILS[slug].info.internalNames against hero_data.json's key list.
// A hero missing from this table just gets skipped with a note.
const SLUG_TO_CODENAME = {
  abrams: "atlas",
  apollo: "fencer",
  bebop: "bebop",
  billy: "punkgoat",
  calico: "nano",
  celeste: "unicorn",
  doorman: "doorman",
  drifter: "drifter",
  dynamo: "dynamo",
  graves: "necro",
  grey_talon: "orion",
  haze: "haze",
  holliday: "astro",
  infernus: "inferno",
  ivy: "tengu",
  kelvin: "kelvin",
  lady_geist: "ghost",
  lash: "lash",
  mcginnis: "forge",
  mina: "vampirebat",
  mirage: "mirage",
  mo_and_krill: "krill",
  paige: "bookworm",
  paradox: "chrono",
  pocket: "synth",
  rem: "familiar",
  seven: "gigawatt",
  shiv: "shiv",
  silver_human: "werewolf",
  sinclair: "magician",
  venator: "priest",
  victor: "frank",
  vindicta: "hornet",
  viscous: "viscous",
  vyper: "viper",
  warden: "warden",
  wraith: "wraith",
  yamato: "yamato"
};

// Maps a HERO_DETAILS stat label to how to derive the game-authoritative
// base value from hero_data.json's m_mapStartingStats fields, and how to
// format it the same way the wiki-scraped strings are formatted so a diff
// is easy to eyeball. `base` extracts the leading number out of strings
// like "830+39" or "6.4m/s" (drops the "+scaling"/unit suffix); the game
// file has no per-level growth numbers, so only the base is ever compared.
function base(str) {
  const m = String(str).match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

const STAT_CHECKS = [
  {
    label: "Health",
    section: "vitalityStats",
    gameValue: (s) => s.EMaxHealth,
    format: (v) => v.toFixed(0)
  },
  {
    label: "Health Regen",
    section: "vitalityStats",
    gameValue: (s) => s.EBaseHealthRegen,
    format: (v) => String(v)
  },
  {
    label: "Move Speed",
    section: "vitalityStats",
    gameValue: (s) => s.EMaxMoveSpeed,
    format: (v) => v + "m/s"
  },
  {
    label: "Sprint Speed",
    section: "vitalityStats",
    gameValue: (s) => s.ESprintSpeed,
    format: (v) => v + "m/s"
  },
  {
    label: "Dash Speed",
    section: "vitalityStats",
    gameValue: (s) => s.EGroundDashDistanceInMeters / s.EGroundDashDuration,
    format: (v) => v.toFixed(1) + "m/s"
  },
  {
    label: "Stamina",
    section: "vitalityStats",
    gameValue: (s) => s.EStamina,
    format: (v) => String(v)
  },
  {
    label: "Stamina Cooldown",
    section: "vitalityStats",
    gameValue: (s) => 1 / s.EStaminaRegenPerSecond,
    format: (v) => v.toFixed(1) + "s"
  },
  {
    // EMeleeResist/EDebuffResist/EBulletLifesteal are already stored as
    // whole percentages in this data (e.g. -5 means -5%), unlike
    // ECritDamageBonusScale/ECritDamageReceivedScale below which are
    // 0-1 multipliers — confirmed by comparing against wiki values.
    label: "Melee Resist",
    section: "vitalityStats",
    gameValue: (s) => (s.EMeleeResist ? s.EMeleeResist : null),
    format: (v) => (v >= 0 ? "+" : "") + v.toFixed(0) + "%"
  },
  {
    label: "Debuff Resist",
    section: "vitalityStats",
    gameValue: (s) => (s.EDebuffResist ? s.EDebuffResist : null),
    format: (v) => (v >= 0 ? "+" : "") + v.toFixed(0) + "%"
  },
  {
    label: "Bullet Lifesteal",
    section: "vitalityStats",
    gameValue: (s) => (s.EBulletLifesteal ? s.EBulletLifesteal : null),
    format: (v) => v.toFixed(0) + "%"
  },
  {
    label: "Crit Reduction",
    section: "vitalityStats",
    gameValue: (s) => (s.ECritDamageReceivedScale !== 1 ? (1 - s.ECritDamageReceivedScale) * 100 : null),
    format: (v) => v.toFixed(0) + "%"
  },
  {
    label: "Crit Bonus Scale",
    section: "weaponStats",
    gameValue: (s) => (s.ECritDamageBonusScale !== 1 ? (s.ECritDamageBonusScale - 1) * 100 : null),
    format: (v) => v.toFixed(0) + "%"
  },
  {
    label: "Light Melee",
    section: "weaponStats",
    gameValue: (s) => s.ELightMeleeDamage,
    format: (v) => v.toFixed(0)
  },
  {
    label: "Heavy Melee",
    section: "weaponStats",
    gameValue: (s) => s.EHeavyMeleeDamage,
    format: (v) => v.toFixed(0)
  }
];

function findStat(details, section, label) {
  const list = details[section];
  if (!list) return null;
  return list.find((s) => s.label === label) || null;
}

function main() {
  if (!fs.existsSync(heroDataPath)) {
    console.error("hero_data.json not found at " + heroDataPath);
    process.exit(1);
  }
  const gameData = JSON.parse(fs.readFileSync(heroDataPath, "utf8"));
  const appSource = fs.readFileSync(appJsPath, "utf8");
  const HERO_SLUGS = extractDeclaration(appSource, "HERO_SLUGS");
  const HERO_DETAILS = extractDeclaration(appSource, "HERO_DETAILS");

  const codenameToSlug = {};
  Object.keys(SLUG_TO_CODENAME).forEach((slug) => {
    codenameToSlug["hero_" + SLUG_TO_CODENAME[slug]] = slug;
  });

  let heroesChecked = 0;
  let mismatchCount = 0;
  let matchCount = 0;
  const unmappedSlugs = HERO_SLUGS.filter((s) => !SLUG_TO_CODENAME[s]);
  const unmappedCodenames = Object.keys(gameData).filter((k) => !codenameToSlug[k]);

  Object.keys(gameData).forEach((codename) => {
    const slug = codenameToSlug[codename];
    if (!slug) return;
    const details = HERO_DETAILS[slug];
    if (!details) {
      console.log("[skip] " + slug + " (" + codename + ") has no HERO_DETAILS entry yet");
      return;
    }
    heroesChecked++;
    const stats = gameData[codename].m_mapStartingStats;
    const diffs = [];
    STAT_CHECKS.forEach((check) => {
      const gameRaw = check.gameValue(stats);
      if (gameRaw === null || gameRaw === undefined || Number.isNaN(gameRaw)) return;
      const existing = findStat(details, check.section, check.label);
      const oursBase = existing ? base(existing.value) : null;
      const gameFormatted = check.format(gameRaw);
      const gameBase = base(gameFormatted);
      if (oursBase === null) {
        // We don't track this stat for this hero at all — only worth
        // surfacing if the game file has a non-trivial value for it.
        if (gameBase !== 0) {
          diffs.push("  + " + check.label + ": not in HERO_DETAILS, game has " + gameFormatted);
        }
        return;
      }
      if (Math.abs(oursBase - gameBase) > 0.01) {
        diffs.push("  " + check.label + ": ours=" + existing.value + "  game=" + gameFormatted);
      } else {
        matchCount++;
      }
    });
    if (diffs.length) {
      mismatchCount += diffs.length;
      console.log(slug + " (" + codename + "):");
      diffs.forEach((d) => console.log(d));
    }
  });

  console.log("");
  console.log("--- summary ---");
  console.log("heroes checked: " + heroesChecked);
  console.log("stats matched: " + matchCount);
  console.log("stats mismatched or missing: " + mismatchCount);
  if (unmappedSlugs.length) {
    console.log("HERO_SLUGS with no codename mapping (add to SLUG_TO_CODENAME): " + unmappedSlugs.join(", "));
  }
  if (unmappedCodenames.length) {
    console.log(
      "hero_data.json codenames with no matching slug (likely unreleased heroes not yet in HERO_SLUGS): " +
        unmappedCodenames.join(", ")
    );
  }
}

main();
