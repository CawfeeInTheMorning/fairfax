# tools/

## Hero data checker

`HeroDataChecker.exe` (in `dist/`) is a standalone Windows app: double-click
it, pick a `hero_data.json` dump from the game files, pick where to save a
report, and it cross-checks the dump's base stats against this project's
`HERO_DETAILS` (in `js/app.js`). Read-only — it never edits app.js.

It bundles a snapshot of `HERO_DETAILS` taken at build time
(`hero_details_snapshot.json`), so it needs neither Node nor a copy of this
repo to run. That also means **it goes stale** whenever `HERO_DETAILS`
changes (new heroes added, stats corrected). To refresh it:

```bash
node tools/export-hero-details.js
python -m PyInstaller --onefile --windowed --name "HeroDataChecker" \
  --add-data "tools/hero_details_snapshot.json;." \
  --distpath tools/dist --workpath tools/build --specpath tools \
  tools/hero_data_checker.py
```

(Or just ask Claude to rebuild it.)

`sync-hero-data.js` is the same checker as a Node script instead — useful if
you're already in a dev environment with Node and want console output
without building anything: `node tools/sync-hero-data.js path/to/hero_data.json`.

## Item data

`xlsx_to_item_json.py` converts `item_data.xlsx` (Items/Abilities/Stat Boxes
sheets) into `item_data.json` — one nested, editable object per item. Re-run
it any time the spreadsheet changes:

```bash
python tools/xlsx_to_item_json.py
```
