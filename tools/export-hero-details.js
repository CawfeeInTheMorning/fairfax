#!/usr/bin/env node
// One-off export: pulls HERO_SLUGS and HERO_DETAILS out of js/app.js and
// writes them as plain JSON to tools/hero_details_snapshot.json. The
// standalone hero-data-checker executable (built from
// tools/hero_data_checker.py via PyInstaller) bakes this snapshot in so it
// can run on its own without needing Node installed. Re-run this — then
// rebuild the .exe (see tools/README.md) — any time HERO_DETAILS changes
// (new heroes added, stats corrected, etc.) so the checker stays current.
//
// Usage: node tools/export-hero-details.js

const fs = require("fs");
const path = require("path");

const repoRoot = path.join(__dirname, "..");
const appJsPath = path.join(repoRoot, "js", "app.js");
const outPath = path.join(__dirname, "hero_details_snapshot.json");

// Same string/comment-aware balanced-brace extractor as sync-hero-data.js.
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

function main() {
  const appSource = fs.readFileSync(appJsPath, "utf8");
  const heroSlugs = extractDeclaration(appSource, "HERO_SLUGS");
  const heroDetails = extractDeclaration(appSource, "HERO_DETAILS");
  fs.writeFileSync(outPath, JSON.stringify({ heroSlugs, heroDetails }, null, 2) + "\n", "utf8");
  console.log("wrote " + outPath + " (" + heroSlugs.length + " slugs, " + Object.keys(heroDetails).length + " with details)");
}

main();
