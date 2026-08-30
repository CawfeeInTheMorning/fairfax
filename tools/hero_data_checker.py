#!/usr/bin/env python3
"""Standalone GUI tool: pick a hero_data.json dump pulled from the game
files, pick where to save a report, and it cross-checks the dump's base
stats against this project's HERO_DETAILS (baked in at build time from
js/app.js via export-hero-details.js) and writes a text report of every
mismatch. Read-only — it never touches app.js.

This is the source for the standalone .exe (built with PyInstaller — see
tools/README.md). It bundles hero_details_snapshot.json, so the .exe needs
neither Node nor a copy of this repo to run; it only goes stale if
HERO_DETAILS changes and the snapshot isn't re-exported/rebuilt.
"""
import json
import os
import sys
import tkinter as tk
from tkinter import filedialog, messagebox

# Our hero slug -> hero_data.json's top-level codename key. Not derivable
# programmatically (see sync-hero-data.js for the full explanation) — kept
# in sync by hand with that script's own copy of this table.
SLUG_TO_CODENAME = {
    "abrams": "atlas", "apollo": "fencer", "bebop": "bebop", "billy": "punkgoat",
    "calico": "nano", "celeste": "unicorn", "doorman": "doorman", "drifter": "drifter",
    "dynamo": "dynamo", "graves": "necro", "grey_talon": "orion", "haze": "haze",
    "holliday": "astro", "infernus": "inferno", "ivy": "tengu", "kelvin": "kelvin",
    "lady_geist": "ghost", "lash": "lash", "mcginnis": "forge", "mina": "vampirebat",
    "mirage": "mirage", "mo_and_krill": "krill", "paige": "bookworm", "paradox": "chrono",
    "pocket": "synth", "rem": "familiar", "seven": "gigawatt", "shiv": "shiv",
    "silver_human": "werewolf", "sinclair": "magician", "venator": "priest",
    "victor": "frank", "vindicta": "hornet", "viscous": "viscous", "vyper": "viper",
    "warden": "warden", "wraith": "wraith", "yamato": "yamato"
}


def base(value):
    import re
    m = re.search(r"-?\d+(\.\d+)?", str(value))
    return float(m.group(0)) if m else None


STAT_CHECKS = [
    ("Health", "vitalityStats", lambda s: s.get("EMaxHealth"), lambda v: f"{v:.0f}"),
    ("Health Regen", "vitalityStats", lambda s: s.get("EBaseHealthRegen"), lambda v: str(v)),
    ("Move Speed", "vitalityStats", lambda s: s.get("EMaxMoveSpeed"), lambda v: f"{v}m/s"),
    ("Sprint Speed", "vitalityStats", lambda s: s.get("ESprintSpeed"), lambda v: f"{v}m/s"),
    (
        "Dash Speed", "vitalityStats",
        lambda s: (s["EGroundDashDistanceInMeters"] / s["EGroundDashDuration"])
        if s.get("EGroundDashDuration") else None,
        lambda v: f"{v:.1f}m/s"
    ),
    ("Stamina", "vitalityStats", lambda s: s.get("EStamina"), lambda v: str(v)),
    (
        "Stamina Cooldown", "vitalityStats",
        lambda s: (1 / s["EStaminaRegenPerSecond"]) if s.get("EStaminaRegenPerSecond") else None,
        lambda v: f"{v:.1f}s"
    ),
    (
        "Melee Resist", "vitalityStats", lambda s: s.get("EMeleeResist") or None,
        lambda v: (("+" if v >= 0 else "") + f"{v:.0f}%")
    ),
    (
        "Debuff Resist", "vitalityStats", lambda s: s.get("EDebuffResist") or None,
        lambda v: (("+" if v >= 0 else "") + f"{v:.0f}%")
    ),
    ("Bullet Lifesteal", "vitalityStats", lambda s: s.get("EBulletLifesteal") or None, lambda v: f"{v:.0f}%"),
    (
        "Crit Reduction", "vitalityStats",
        lambda s: (1 - s["ECritDamageReceivedScale"]) * 100 if s.get("ECritDamageReceivedScale", 1) != 1 else None,
        lambda v: f"{v:.0f}%"
    ),
    (
        "Crit Bonus Scale", "weaponStats",
        lambda s: (s["ECritDamageBonusScale"] - 1) * 100 if s.get("ECritDamageBonusScale", 1) != 1 else None,
        lambda v: f"{v:.0f}%"
    ),
    ("Light Melee", "weaponStats", lambda s: s.get("ELightMeleeDamage"), lambda v: f"{v:.0f}"),
    ("Heavy Melee", "weaponStats", lambda s: s.get("EHeavyMeleeDamage"), lambda v: f"{v:.0f}")
]


def resource_path(filename):
    # PyInstaller unpacks --add-data files into sys._MEIPASS at runtime;
    # fall back to this script's own directory when run unbundled.
    base_dir = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_dir, filename)


def find_stat(details, section, label):
    for s in details.get(section, []):
        if s.get("label") == label:
            return s
    return None


def build_report(game_data, snapshot):
    hero_slugs = snapshot["heroSlugs"]
    hero_details = snapshot["heroDetails"]
    codename_to_slug = {"hero_" + v: k for k, v in SLUG_TO_CODENAME.items()}

    lines = []
    heroes_checked = 0
    match_count = 0
    mismatch_count = 0

    for codename, entry in game_data.items():
        slug = codename_to_slug.get(codename)
        if not slug:
            continue
        details = hero_details.get(slug)
        if not details:
            lines.append(f"[skip] {slug} ({codename}) has no HERO_DETAILS entry yet")
            continue
        heroes_checked += 1
        stats = entry.get("m_mapStartingStats", {})
        diffs = []
        for label, section, get_game, fmt in STAT_CHECKS:
            try:
                game_raw = get_game(stats)
            except (KeyError, TypeError, ZeroDivisionError):
                game_raw = None
            if game_raw is None:
                continue
            existing = find_stat(details, section, label)
            ours_base = base(existing["value"]) if existing else None
            game_formatted = fmt(game_raw)
            game_base = base(game_formatted)
            if ours_base is None:
                if game_base != 0:
                    diffs.append(f"  + {label}: not in HERO_DETAILS, game has {game_formatted}")
                continue
            if abs(ours_base - game_base) > 0.01:
                diffs.append(f"  {label}: ours={existing['value']}  game={game_formatted}")
            else:
                match_count += 1
        if diffs:
            mismatch_count += len(diffs)
            lines.append(f"{slug} ({codename}):")
            lines.extend(diffs)

    unmapped_slugs = [s for s in hero_slugs if s not in SLUG_TO_CODENAME]
    unmapped_codenames = [k for k in game_data.keys() if k not in codename_to_slug]

    lines.append("")
    lines.append("--- summary ---")
    lines.append(f"heroes checked: {heroes_checked}")
    lines.append(f"stats matched: {match_count}")
    lines.append(f"stats mismatched or missing: {mismatch_count}")
    if unmapped_slugs:
        lines.append("HERO_SLUGS with no codename mapping: " + ", ".join(unmapped_slugs))
    if unmapped_codenames:
        lines.append(
            "hero_data.json codenames with no matching slug (likely unreleased heroes): "
            + ", ".join(unmapped_codenames)
        )

    return "\n".join(lines), heroes_checked, match_count, mismatch_count


def main():
    root = tk.Tk()
    root.withdraw()

    try:
        with open(resource_path("hero_details_snapshot.json"), encoding="utf-8") as f:
            snapshot = json.load(f)
    except OSError as e:
        messagebox.showerror("Hero Data Checker", f"Could not load the bundled hero data snapshot:\n{e}")
        return

    input_path = filedialog.askopenfilename(
        title="Select hero_data.json",
        filetypes=[("JSON files", "*.json"), ("All files", "*.*")]
    )
    if not input_path:
        return

    try:
        with open(input_path, encoding="utf-8") as f:
            game_data = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        messagebox.showerror("Hero Data Checker", f"Could not read that file as JSON:\n{e}")
        return

    output_path = filedialog.asksaveasfilename(
        title="Save report as",
        defaultextension=".txt",
        initialfile="hero_data_diff_report.txt",
        filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
    )
    if not output_path:
        return

    report, heroes_checked, match_count, mismatch_count = build_report(game_data, snapshot)

    try:
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(report + "\n")
    except OSError as e:
        messagebox.showerror("Hero Data Checker", f"Could not write the report:\n{e}")
        return

    messagebox.showinfo(
        "Hero Data Checker",
        f"Checked {heroes_checked} heroes: {match_count} stats matched, "
        f"{mismatch_count} mismatched or missing.\n\nReport saved to:\n{output_path}"
    )


if __name__ == "__main__":
    main()
