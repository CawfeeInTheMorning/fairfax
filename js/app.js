(function () {
  "use strict";

  const CATEGORY_ORDER = ["weapon", "vitality", "spirit"];
  const TIER_ORDER = [800, 1600, 3200, 6400];
  const BUILD_STORAGE_KEY = "deadlockShopBuild";
  const BUILD_STORAGE_VERSION = 1;
  // Separate key: an array of named snapshots (see saveCurrentBuildToLibrary),
  // independent of BUILD_STORAGE_KEY's single "whatever's currently on the
  // canvas" slot — the canvas keeps auto-persisting on every edit either way,
  // this is only written to on an explicit Save.
  const SAVED_BUILDS_STORAGE_KEY = "deadlockSavedBuilds";
  const SECTION_COLORS = [
    "rgb(83 126 139)",
    "rgb(142 162 73)",
    "rgb(197 118 71)",
    "rgb(162 73 73)",
    "rgb(136 75 137)",
    "rgb(114 129 77)",
    "rgb(157 136 163)",
    "rgb(32 27 43)",
    "rgb(27 43 33)",
    "rgb(43 27 27)",
    "rgb(15 13 19)",
  ];

  // Portrait picker options for the build title row — hero_icons/ has no
  // index of its own (a static site can't list a directory at runtime),
  // so this mirrors its actual file list by hand (minus silver_wolf,
  // deliberately excluded — see HERO_NAME_OVERRIDES). Display names are
  // derived from the filename slug with a couple of manual overrides
  // (McGinnis' capitalization, Mo & Krill's "&", Silver's shortened name)
  // that a generic title-case pass would get wrong.
  const HERO_SLUGS = [
    "abrams",
    "apollo",
    "bebop",
    "billy",
    "calico",
    "celeste",
    "doorman",
    "drifter",
    "dynamo",
    "graves",
    "grey_talon",
    "haze",
    "holliday",
    "infernus",
    "ivy",
    "kelvin",
    "lady_geist",
    "lash",
    "mcginnis",
    "mina",
    "mirage",
    "mo_and_krill",
    "paige",
    "paradox",
    "pocket",
    "rem",
    "seven",
    "shiv",
    "silver_human",
    "sinclair",
    "venator",
    "victor",
    "vindicta",
    "viscous",
    "vyper",
    "warden",
    "wraith",
    "yamato",
  ];
  const HERO_NAME_OVERRIDES = {
    grey_talon: "Grey Talon",
    lady_geist: "Lady Geist",
    mcginnis: "McGinnis",
    mo_and_krill: "Mo & Krill",
    silver_human: "Silver",
  };
  const HERO_LIST = HERO_SLUGS.map((slug) => ({
    slug,
    file: slug + "_icon.png",
    name: HERO_NAME_OVERRIDES[slug] || slug.charAt(0).toUpperCase() + slug.slice(1),
  }));

  // hero_icons/hero_mini and hero_icons/hero_logos mostly follow the same
  // <slug>_mini.png / <slug>_logo.svg pattern as hero_icons/ itself, but
  // both use "silver_mini.png"/"silver_logo.svg" rather than
  // "silver_human_..." — this map patches just that lookup rather than
  // assuming every folder matches HERO_SLUGS 1:1. (hero_mini's dynamo
  // typo and hero_logos' missing vyper entry — both handled here too at
  // one point — have since been fixed at the source.)
  const HERO_ASSET_SLUG_OVERRIDES = { silver_human: "silver" };

  function heroMiniFile(hero) {
    return "hero_icons/hero_mini/" + (HERO_ASSET_SLUG_OVERRIDES[hero.slug] || hero.slug) + "_mini.png";
  }

  function heroLogoFile(hero) {
    return "hero_icons/hero_logos/" + (HERO_ASSET_SLUG_OVERRIDES[hero.slug] || hero.slug) + "_logo.svg";
  }

  // Mirrors the .mod-box / .build-section-items sizing in style.css (80x125
  // cards, 4px gap, 12px padding on the items row, 2px section border) —
  // used to snap section resizing to whole numbers of item columns/rows
  // rather than arbitrary pixel sizes.
  const ITEM_SLOT_W = 80;
  const ITEM_SLOT_H = 125;
  const ITEM_SLOT_GAP = 4;
  const ITEMS_PADDING = 12; // each side of .build-section-items
  const SECTION_BORDER = 2; // each side of .build-section
  const DEFAULT_SECTION_ROW_H = 190; // heightForRows(1, ~37px header) — matches addBuildSection's default section size
  const DEFAULT_SECTION_ROW_W = 276; // widthForColumns(3) — matches addBuildSection's default section size
  const SECTIONS_ROW_GAP = 32; // matches .build-sections-container's gap (style.css)
  // Floor used by updateInvestmentBarsContentScale so the investment panel
  // never shrinks thinner than "2 full rows of default-size sections" tall,
  // even when there's only 0 or 1 row actually present.
  const TWO_ROW_SECTIONS_NATIVE_H = 2 * DEFAULT_SECTION_ROW_H + SECTIONS_ROW_GAP;
  // Hard cap on .shop-builds' total rendered height (matches the CSS
  // max-height on .shop-builds) — used to predict whether one more
  // default-size section would still fit, so the Add Section button can
  // be disabled *before* a section silently gets clipped off rather than
  // after.
  const SHOP_BUILDS_MAX_HEIGHT = 950;

  const shopEl = document.getElementById("shop-panels");
  const tabsEl = document.getElementById("category-tabs");
  const tooltipDisplayEl = document.getElementById("tooltip-display");
  const shopBuildsEl = document.getElementById("shop-builds");
  const shopBuildsWrapEl = document.querySelector(".shop-builds-wrap");
  const shopGraphsEl = document.getElementById("shop-graphs");
  const searchTab = document.getElementById("tab-search");

  let searchInputEl = null;
  let tooltipCard = null;
  let selectedCard = null;
  let activeCategory = "weapon";
  let buildState = null;
  let sectionsContainerEl = null;
  let buildSectionsViewportEl = null;
  let investmentBarEls = null; // { weapon: {segments: []}, vitality: {...}, spirit: {...} }
  let shopBuildsRightEl = null;
  let investmentBarsEl = null;
  let investmentBarsViewportEl = null;
  let investmentBarsContentEl = null;
  let openSectionSettingsId = null; // id of the section whose settings dropdown is open, if any
  let sectionActionsRowEl = null;
  let addSectionBtnViewportEl = null;
  let addSectionBtnEl = null;
  let buildSaveBtnEl = null;
  let buildTitleInputEl = null;
  let savedBuildsHeroesEl = null;
  let savedBuildsHeroPanelEl = null;
  let infoTabViewportEl = null;
  let selectedSavedHeroSlug = null;
  let savedBuildsSearchInputEl = null;
  let savedBuildsSearchQuery = "";
  let saveBuildModalEl = null;
  let saveBuildNameInputEl = null;
  let saveBuildHeroListEl = null;
  let saveBuildModalHero = null; // staged hero pick while the modal is open — only committed to buildState on confirm
  let newBuildConfirmModalEl = null;
  let savedBuilds = []; // [{id, name, hero, sections, savedAt}] — see loadSavedBuilds/saveCurrentBuildToLibrary
  let dragPayload = null; // set on dragstart, read on drop (dataTransfer.getData is unreliable during dragover in some browsers)
  let lastSectionPreviewIndex = null;
  let autoScrollSpeed = 0;
  let autoScrollRAF = null;

  function iconPath(category, file) {
    return SHOP_DATA[category].folder + "/" + file;
  }

  function buildTabs() {
    CATEGORY_ORDER.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "category-tab is-" + cat;
      btn.dataset.category = cat;
      btn.setAttribute("aria-label", SHOP_DATA[cat].label);
      btn.innerHTML = '<img class="tab-icon" src="frontend_assets/shop_icon_' + cat + '.png" alt="">';
      btn.addEventListener("click", () => setActiveCategory(cat));
      tabsEl.appendChild(btn);
    });

    searchTab.addEventListener("click", () => setActiveCategory("search"));
  }

  function setActiveCategory(cat) {
    activeCategory = cat;
    document.querySelectorAll(".category-tab").forEach((el) => {
      el.classList.toggle("active", el.dataset.category === cat);
    });
    document.querySelectorAll(".shop-panel").forEach((el) => {
      el.classList.toggle("active", el.id === "panel-" + cat);
    });
    searchTab.classList.toggle("is-open", cat === "search");
    if (cat === "search") {
      if (searchInputEl) searchInputEl.focus();
    } else if (searchInputEl) {
      searchInputEl.value = "";
      applySearchFilter("");
    }
    deselectCard();
    hideTooltipDisplay();
  }

  // Same style/behavior as buildTabs/setActiveCategory above, applied to
  // the new vertical tab stack next to .shop-builds instead of
  // #shop-panels — switching to "Saved Builds" swaps in the saved-build
  // cards (renderSavedBuildsList) in place of the sections/investment-bars
  // columns, see .shop-builds.is-saves-tab in style.css.
  function buildBuildTabsUI() {
    const buildTabsEl = document.getElementById("build-tabs");
    if (!buildTabsEl) return;

    const buildsTab = document.createElement("button");
    buildsTab.type = "button";
    buildsTab.className = "build-tab is-builds active";
    buildsTab.dataset.buildTab = "builds";
    buildsTab.setAttribute("aria-label", "Builds");
    buildsTab.innerHTML = '<img class="tab-icon" src="frontend_assets/shop_icon_build.png" alt="">';
    buildsTab.addEventListener("click", () => setActiveBuildTab("builds"));
    buildTabsEl.appendChild(buildsTab);

    const savesTab = document.createElement("button");
    savesTab.type = "button";
    savesTab.className = "build-tab is-saves";
    savesTab.dataset.buildTab = "saves";
    savesTab.setAttribute("aria-label", "Saved Builds");
    savesTab.innerHTML = '<img class="tab-icon" src="frontend_assets/shop_icon_save.png" alt="">';
    savesTab.addEventListener("click", () => setActiveBuildTab("saves"));
    buildTabsEl.appendChild(savesTab);

    const infoTab = document.createElement("button");
    infoTab.type = "button";
    infoTab.className = "build-tab is-info";
    infoTab.dataset.buildTab = "info";
    infoTab.setAttribute("aria-label", "Info");
    infoTab.innerHTML = '<img class="tab-icon" src="frontend_assets/shop_icon_info.png" alt="">';
    infoTab.addEventListener("click", () => setActiveBuildTab("info"));
    buildTabsEl.appendChild(infoTab);
  }

  function setActiveBuildTab(tab) {
    document.querySelectorAll(".build-tab").forEach((el) => {
      el.classList.toggle("active", el.dataset.buildTab === tab);
    });
    if (shopBuildsEl) {
      shopBuildsEl.classList.toggle("is-saves-tab", tab === "saves");
      shopBuildsEl.classList.toggle("is-info-tab", tab === "info");
    }
    // .shop-graphs is a sibling of .shop-builds-wrap, not a descendant of
    // #shop-builds, so the CSS .shop-builds.is-saves-tab/.is-info-tab
    // toggles above can't reach it directly (no combinator connects them)
    // — toggled here instead.
    if (shopGraphsEl) shopGraphsEl.classList.toggle("is-hidden", tab === "saves" || tab === "info");
  }

  function buildPanels() {
    CATEGORY_ORDER.forEach((cat) => {
      const data = SHOP_DATA[cat];
      const panel = document.createElement("div");
      panel.className = "shop-panel category-" + cat;
      panel.id = "panel-" + cat;
      panel.style.backgroundImage = 'url("frontend_assets/shop_bg_' + cat + '.webp")';

      const tierGrid = document.createElement("div");
      tierGrid.className = "tier-grid";
      TIER_ORDER.forEach((tier) => {
        tierGrid.appendChild(buildTierQuadrant(cat, tier));
      });
      panel.appendChild(tierGrid);

      shopEl.appendChild(panel);
    });

    setActiveCategory(activeCategory);
  }

  function buildSearchPanel() {
    const panel = document.createElement("div");
    panel.className = "shop-panel category-search";
    panel.id = "panel-search";
    panel.style.backgroundImage = 'url("frontend_assets/shop_bg_search.png")';

    const inputWrap = document.createElement("div");
    inputWrap.className = "search-input-wrap";

    const inputInner = document.createElement("div");
    inputInner.className = "search-input-inner";

    const input = document.createElement("input");
    input.type = "text";
    input.id = "item-search-input";
    input.placeholder = "Search items...";
    input.addEventListener("input", (e) => applySearchFilter(e.target.value));
    inputInner.appendChild(input);
    searchInputEl = input;

    // CSS shows/hides this via #item-search-input:not(:placeholder-shown)
    // — no JS state needed to track whether there's anything to clear.
    const clearBtn = document.createElement("div");
    clearBtn.className = "search-clear-btn";
    clearBtn.title = "Clear search";
    clearBtn.addEventListener("click", () => {
      input.value = "";
      applySearchFilter("");
      input.focus();
    });
    inputInner.appendChild(clearBtn);
    inputWrap.appendChild(inputInner);

    // Narrows which fields the query is matched against — unchecked (the
    // default) searches name+description+stats together; checking any
    // number of these restricts matching to just the checked field(s) (see
    // applySearchFilter's anyScopeActive branch).
    const scopeToggles = document.createElement("div");
    scopeToggles.className = "search-scope-toggles";
    [
      { scope: "description", label: "By Description Only" },
      { scope: "name", label: "By Name Only" },
      { scope: "stats", label: "By Stats Only" }
    ].forEach(({ scope, label: labelText }) => {
      const chip = document.createElement("label");
      chip.className = "search-scope-chip";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "search-scope-checkbox";
      checkbox.addEventListener("change", () => toggleSearchScope(scope, checkbox.checked));
      chip.appendChild(checkbox);

      const box = document.createElement("span");
      box.className = "search-scope-box";
      chip.appendChild(box);

      const label = document.createElement("span");
      label.className = "search-scope-label";
      label.textContent = labelText;
      chip.appendChild(label);

      scopeToggles.appendChild(chip);
    });
    inputWrap.appendChild(scopeToggles);

    panel.appendChild(inputWrap);

    const results = document.createElement("div");
    results.className = "search-results";

    // Native-1076px-wide canvas, scaled down as one rigid unit — same
    // technique as .tier-grid — so search result cards render at the
    // same size as the same items shown in their category panel, instead
    // of at native .mod-box size (which is what .tier-grid's own cards
    // are scaled DOWN from). .search-results itself stays the scrolling
    // element (unlike .build-sections-viewport, no JS height sync is
    // needed here — this content's height is naturally variable, and a
    // position:relative scrolling ancestor correctly derives its
    // scrollable overflow from an absolutely positioned + transformed
    // descendant's rendered bounds).
    const scaled = document.createElement("div");
    scaled.className = "search-content-scaled";

    CATEGORY_ORDER.forEach((cat) => {
      const section = document.createElement("section");
      section.className = "search-section";

      const heading = document.createElement("h2");
      heading.className = "search-section-title";
      heading.textContent = SHOP_DATA[cat].label;
      section.appendChild(heading);

      const grid = document.createElement("div");
      grid.className = "search-grid";
      TIER_ORDER.forEach((tier) => {
        (SHOP_DATA[cat].tiers[tier] || []).forEach((item) => {
          grid.appendChild(buildItemCard(cat, tier, item, true));
        });
      });
      section.appendChild(grid);

      scaled.appendChild(section);
    });

    results.appendChild(scaled);
    panel.appendChild(results);
    shopEl.appendChild(panel);
  }

  function buildTierQuadrant(cat, tier) {
    const items = SHOP_DATA[cat].tiers[tier] || [];

    const quad = document.createElement("div");
    quad.className = "tier-quadrant tier-" + tier;

    const grid = document.createElement("div");
    grid.className = "mods-container";
    items.forEach((item) => grid.appendChild(buildItemCard(cat, tier, item, true)));
    quad.appendChild(grid);

    return quad;
  }

  function buildItemCard(cat, tier, item, showAddBadge) {
    const card = document.createElement("div");
    card.className = "mod-box";
    card.dataset.category = cat;
    card.dataset.tier = tier;
    card.dataset.name = item.name;
    card.dataset.file = item.file;
    if (item.active) card.dataset.active = "1";
    if (item.imbue) card.dataset.imbue = "1";

    const cardBg = document.createElement("div");
    cardBg.className = "card-background";
    cardBg.style.backgroundImage = 'url("frontend_assets/card_' + cat + "_" + tier + '.png")';
    card.appendChild(cardBg);

    const paperIdx = ((item.name.length + tier) % 3) + 1;
    const paper = document.createElement("div");
    paper.className = "paper-texture";
    paper.style.backgroundImage = 'url("frontend_assets/shop_paper_' + paperIdx + '.png")';
    card.appendChild(paper);

    if (item.imbue) {
      const t = document.createElement("span");
      t.className = "item-tag tag-imbue";
      t.textContent = "Imbue";
      card.appendChild(t);
    }
    if (item.active) {
      const t = document.createElement("span");
      t.className = "item-tag tag-active";
      t.textContent = "Active";
      card.appendChild(t);
    }

    const iconContainer = document.createElement("div");
    iconContainer.className = "mod-icon-container";
    const icon = document.createElement("div");
    icon.className = "mod-icon";
    icon.style.backgroundImage = 'url("' + iconPath(cat, item.file) + '")';
    iconContainer.appendChild(icon);
    card.appendChild(iconContainer);

    const labelWrap = document.createElement("div");
    labelWrap.className = "mod-name-label-container";
    const label = document.createElement("div");
    label.className = "mod-name-label";
    label.textContent = item.name;
    labelWrap.appendChild(label);
    card.appendChild(labelWrap);

    const selectedOverlay = document.createElement("div");
    selectedOverlay.className = "card-selected-overlay";
    card.appendChild(selectedOverlay);

    if (showAddBadge) {
      const addBadge = document.createElement("div");
      addBadge.className = "mod-box-add-badge";
      addBadge.title = "Add Item";
      addBadge.addEventListener("click", (e) => {
        e.stopPropagation();
        addItemToLastSection(cat, item.file);
      });
      card.appendChild(addBadge);
    }

    card.addEventListener("mouseenter", () => {
      // While something's selected, only ITS OWN card still responds to
      // hover — every other card ignores mouseenter entirely, so mousing
      // over them can't swap the tooltip away from (or otherwise disturb)
      // the selected item. The matching :hover CSS animation is
      // separately neutralized for them too (see .shop-panel.dimming
      // .mod-box:hover in style.css) — pointer-events stays untouched, so
      // clicking a different card to change the selection still works.
      if (selectedCard && selectedCard.el !== card) return;
      showTooltipDisplay(cat, tier, item);
      card.classList.add("is-hovered");
      updatePanelDimming(card.closest(".shop-panel"));
      updateUpgradeHighlight(cat, item.file);
    });
    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-hovered");
      updatePanelDimming(card.closest(".shop-panel"));
      if (selectedCard) {
        showTooltipDisplay(selectedCard.cat, selectedCard.tier, selectedCard.item);
        updateUpgradeHighlight(selectedCard.cat, selectedCard.item.file);
      } else {
        hideTooltipDisplay();
        updateUpgradeHighlight(null, null);
      }
    });
    card.addEventListener("click", () => {
      if (selectedCard && selectedCard.el === card) {
        deselectCard();
        hideTooltipDisplay();
        updatePanelDimming(card.closest(".shop-panel"));
        updateUpgradeHighlight(null, null);
        return;
      }
      if (selectedCard) selectedCard.el.classList.remove("selected");
      card.classList.add("selected");
      selectedCard = { el: card, cat, tier, item };
      showTooltipDisplay(cat, tier, item);
      updatePanelDimming(card.closest(".shop-panel"));
      updateUpgradeHighlight(cat, item.file);
    });

    // draggable itself is toggled dynamically by updateShopItemUsedState()
    // (an already-placed item shouldn't be draggable), not fixed here.
    card.addEventListener("dragstart", (e) => {
      if (card.classList.contains("used")) {
        e.preventDefault();
        return;
      }
      card.classList.add("dragging");
      dragPayload = { source: "shop", category: cat, file: item.file };
      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.setData("text/plain", item.file);
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
      dragPayload = null;
      hideBuildSlotPlaceholder();
    });

    return card;
  }

  function updatePanelDimming(panel) {
    if (!panel) return;
    const shouldDim = !!panel.querySelector(".mod-box.is-hovered, .mod-box.selected");
    panel.classList.toggle("dimming", shouldDim);
  }

  // Exempts whatever the hovered/selected item's own tooltip lists under
  // "Upgrades To" from the dimming effect (.shop-panel.dimming .mod-box
  // in style.css already excludes .is-hovered/.selected themselves — this
  // is the same idea extended to the upgrade target(s), so the upgrade
  // path stays visible instead of fading along with everything else).
  // Called with (null, null) to just clear the previous highlight (e.g.
  // on deselect) without setting a new one.
  function updateUpgradeHighlight(cat, file) {
    document.querySelectorAll(".mod-box.is-upgrade-highlight").forEach((el) => el.classList.remove("is-upgrade-highlight"));
    if (!cat || !file) return;
    const details = ITEM_DETAILS[cat + ":" + file];
    if (!details || !details.upgradesTo) return;
    [].concat(details.upgradesTo).forEach((name) => {
      const found = findItemFile(name);
      if (!found) return;
      const el = document.querySelector('.mod-box[data-category="' + found.cat + '"][data-file="' + found.file + '"]');
      if (el) el.classList.add("is-upgrade-highlight");
    });
  }

  function deselectCard() {
    if (!selectedCard) return;
    const panel = selectedCard.el.closest(".shop-panel");
    selectedCard.el.classList.remove("selected");
    selectedCard = null;
    // Without this, the panel's "dimming" class (added while something was
    // selected) sticks around after deselecting — so switching away and
    // back to that category later shows every icon still faded, since
    // nothing is hovered/selected to exempt from the dimming rule anymore.
    updatePanelDimming(panel);
    updateUpgradeHighlight(null, null);
  }

  function buildTooltipDisplay() {
    const card = document.createElement("div");
    card.className = "tooltip-card";

    const top = document.createElement("div");
    top.className = "tooltip-card-top";

    const name = document.createElement("div");
    name.className = "tooltip-card-name";
    top.appendChild(name);

    const cost = document.createElement("div");
    cost.className = "tooltip-card-cost";
    const costIcon = document.createElement("img");
    costIcon.className = "tooltip-soul-icon";
    costIcon.src = "frontend_assets/icon_soul.svg";
    costIcon.alt = "";
    const costValue = document.createElement("span");
    cost.appendChild(costIcon);
    cost.appendChild(costValue);
    top.appendChild(cost);

    card.appendChild(top);

    const body = document.createElement("div");
    body.className = "tooltip-card-body";
    const desc = document.createElement("div");
    desc.className = "tooltip-card-desc";
    // desc's innerHTML gets fully rebuilt on every hover, so this listens
    // via delegation on the (never-replaced) desc container itself rather
    // than on the individual upgrade-link elements, which wouldn't exist
    // yet to attach a listener to at build time.
    desc.addEventListener("click", (e) => {
      const link = e.target.closest("[data-upgrade-target]");
      if (link) jumpToItem(link.dataset.upgradeTarget);
    });
    body.appendChild(desc);
    card.appendChild(body);

    // Empirically-derived "statistical" souls-per-unit breakdown — its own
    // top+body pair (tooltip_bg_actual_top.png/tooltip_bg_actual.png,
    // same 500x115 / 500-wide-tiling dimensions as .tooltip-card-top/
    // -body) rather than a single-image card like .tooltip-card-notes
    // below, since it needs its own title bar. Only shown when the
    // hovered item has at least one priced innate stat — see
    // computeStatisticalStatsForItem/buildStatisticalStatsHtml.
    const statistical = document.createElement("div");
    statistical.className = "tooltip-card-statistical";
    const statisticalTop = document.createElement("div");
    statisticalTop.className = "tooltip-card-statistical-top";
    statisticalTop.textContent = "Statistical Stats";
    statistical.appendChild(statisticalTop);

    // Positioned relative to `statistical` (not statisticalTop, which has
    // overflow:hidden for its own background-crop — see style.css) so its
    // -4px/-4px offset can actually poke outside the top bar's corner
    // instead of being clipped by it.
    const statisticalHelpBtn = document.createElement("button");
    statisticalHelpBtn.type = "button";
    statisticalHelpBtn.className = "tooltip-statistical-help-btn";
    statisticalHelpBtn.title = "Learn more about Statistical Stats";
    statisticalHelpBtn.textContent = "?";
    statisticalHelpBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setActiveBuildTab("info");
      if (shopBuildsWrapEl) shopBuildsWrapEl.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    statistical.appendChild(statisticalHelpBtn);
    const statisticalBody = document.createElement("div");
    statisticalBody.className = "tooltip-card-statistical-body";
    statistical.appendChild(statisticalBody);
    card.appendChild(statistical);

    // Separate card-like panel below the main tooltip, only shown when
    // the hovered item has notes (see ITEM_NOTES) — same bottom
    // background art as .tooltip-card-body, styled as its own small
    // card rather than folded into the main description.
    const notes = document.createElement("div");
    notes.className = "tooltip-card-notes";
    const notesTitle = document.createElement("div");
    notesTitle.className = "tooltip-card-notes-title";
    notesTitle.textContent = "Notes";
    notes.appendChild(notesTitle);
    const notesList = document.createElement("ul");
    notesList.className = "tooltip-card-notes-list";
    // Same delegation rationale as desc's click listener above —
    // notesList's innerHTML is fully rebuilt on every hover.
    notesList.addEventListener("click", (e) => {
      const link = e.target.closest("[data-item-link]");
      if (link) jumpToItem(link.dataset.itemLink);
    });
    notes.appendChild(notesList);
    card.appendChild(notes);

    // .tooltip-scroll-viewport is the element that actually scrolls —
    // inset from .tooltip-display's own edges by --tooltip-crop-top/
    // -bottom (see style.css) so where the card visually clips is
    // independently tunable from .tooltip-display's own box/background.
    const viewport = document.createElement("div");
    viewport.className = "tooltip-scroll-viewport";
    viewport.appendChild(card);
    tooltipDisplayEl.appendChild(viewport);

    tooltipCard = { root: card, top, name, costValue, body, desc, statistical, statisticalBody, notes, notesList };
  }

  // Clicking an "Upgrades To/From" link: switch to that item's category if
  // needed, then click its actual card so the exact same select/dimming/
  // tooltip logic as a normal click runs.
  function jumpToItem(itemName) {
    const found = findItemFile(itemName);
    if (!found) return;
    if (found.cat !== activeCategory) {
      setActiveCategory(found.cat);
    }
    const box = document.querySelector('#panel-' + found.cat + ' .mod-box[data-file="' + found.file + '"]');
    if (box) box.click();
  }

  function showTooltipDisplay(cat, tier, item) {
    const key = cat + ":" + item.file;
    const details = ITEM_DETAILS[key];

    tooltipCard.top.style.backgroundImage = 'url("frontend_assets/tooltip_bg_' + cat + '_top.png")';
    tooltipCard.body.style.backgroundImage = 'url("frontend_assets/tooltip_bg_' + cat + '_bottom.png")';
    tooltipCard.name.textContent = item.name;
    tooltipCard.costValue.textContent = tier.toLocaleString();
    tooltipCard.desc.innerHTML = details
      ? buildTooltipBodyHtml(details)
      : '<div class="tooltip-placeholder">Description coming soon.</div>';

    const statisticalHtml = details ? buildStatisticalStatsHtml(details) : "";
    if (statisticalHtml) {
      tooltipCard.statisticalBody.innerHTML = statisticalHtml;
      tooltipCard.statistical.classList.add("visible");
    } else {
      tooltipCard.statisticalBody.innerHTML = "";
      tooltipCard.statistical.classList.remove("visible");
    }

    const notes = ITEM_NOTES[key];
    if (notes && notes.length) {
      tooltipCard.notes.style.backgroundImage = 'url("frontend_assets/tooltip_bg_' + cat + '_bottom.png")';
      tooltipCard.notesList.innerHTML = notes.map((n) => "<li>" + renderNoteHtml(n, item.name, key) + "</li>").join("");
      tooltipCard.notes.classList.add("visible");
    } else {
      tooltipCard.notes.classList.remove("visible");
      tooltipCard.notesList.innerHTML = "";
    }

    tooltipCard.root.classList.add("visible");
  }

  function hideTooltipDisplay() {
    tooltipCard.root.classList.remove("visible");
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderInlineFormatting(text) {
    return escapeHtml(text || "")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\{\{icon:([a-z0-9-]+)\}\}/g, function (match, code) {
        return statIconImg(code, "tooltip-inline-icon");
      });
  }

  function statIconImg(code, extraClass) {
    const file = STAT_ICON_FILES[code];
    if (!file) return "";
    return '<img class="' + extraClass + '" src="stat_icons/' + file + '" alt="">';
  }

  // Built once — every {name, cat, file} in SHOP_DATA, longest name
  // first. The length-descending order matters: it's fed into a single
  // regex alternation (see renderNoteHtml) so that at any given match
  // position the longest possible item name wins, rather than a shorter
  // name that happens to be a prefix/substring of a longer one (e.g.
  // matching "Mystic Slow" whole rather than some hypothetical shorter
  // name inside it).
  let itemNameLookup = null;
  function buildItemNameLookup() {
    if (itemNameLookup) return itemNameLookup;
    const list = [];
    CATEGORY_ORDER.forEach((cat) => {
      const tiers = SHOP_DATA[cat].tiers;
      Object.keys(tiers).forEach((t) => {
        tiers[t].forEach((item) => list.push({ name: item.name, cat, file: item.file }));
      });
    });
    list.sort((a, b) => b.name.length - a.name.length);
    itemNameLookup = list;
    return list;
  }

  // Per-item list of names that should NOT be auto-linked even though
  // they match a real item name — e.g. Spirit Shredder Bullets' note uses
  // "Spirit Lifesteal" as the generic mechanic, not a reference to the
  // item of the same name. Keyed the same as ITEM_NOTES.
  const NOTE_LINK_EXCLUSIONS = {
    "weapon:Spirit_Shredder_Bullets.png": ["Spirit Lifesteal"],
  };

  // Notes reference other items in plain prose (e.g. "...effects like
  // Mystic Slow or Bullet Resist Shredder"). Rather than hand-authoring
  // link markup into ITEM_NOTES, every OTHER known item name is
  // auto-detected here (excluding the note's own item and any
  // NOTE_LINK_EXCLUSIONS for it) and turned into a clickable icon+text
  // span, same click behavior as the tooltip's Upgrades To/From links
  // (see the notesList click delegation in buildTooltipDisplay and
  // jumpToItem). Single combined regex pass (not one .replace() per
  // name) so a shorter name can never accidentally match text already
  // inside a just-inserted link for a longer one.
  function renderNoteHtml(text, ownItemName, key) {
    let html = escapeHtml(text || "").replace(/ {2,}/g, " ");
    const excluded = (key && NOTE_LINK_EXCLUSIONS[key]) || [];
    const lookup = buildItemNameLookup().filter((e) => e.name !== ownItemName && excluded.indexOf(e.name) === -1);
    if (!lookup.length) return html;
    const byName = {};
    const pattern = lookup
      .map((e) => {
        byName[e.name] = e;
        return e.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      })
      .join("|");
    const re = new RegExp("\\b(" + pattern + ")\\b", "g");
    return html.replace(re, (match) => {
      const entry = byName[match];
      if (!entry) return match;
      return (
        '<span class="tooltip-note-link" data-item-link="' +
        escapeHtml(entry.name) +
        '"><img class="tooltip-note-link-icon" src="' +
        iconPath(entry.cat, entry.file) +
        '" alt="">' +
        match +
        "</span>"
      );
    });
  }

  function buildTooltipBodyHtml(details) {
    const innateHtml = (details.innateStats || []).length
      ? '<div class="tooltip-innate-stats">' + details.innateStats.map(renderInnateStat).join("") + "</div>"
      : "";

    const sectionsHtml = (details.abilities || []).map(buildAbilitySectionHtml).join("");
    const upgradesHtml = buildUpgradesHtml(details);

    return innateHtml + sectionsHtml + upgradesHtml;
  }

  // Matches the leading sign+number(+unit letters, e.g. "%"/"m")+whitespace
  // of an innateStats line, e.g. "+30% Max Ammo" -> match[0]="+30% ",
  // match[1]="+", match[2]="30", match[3]="%" — the numeric value is what's
  // needed here (unlike the stat name alone), so the captured groups are
  // kept instead of discarded.
  const STATISTICAL_STAT_VALUE_RE = /^([+-])(\d+(?:\.\d+)?)([a-z%]*)\s*/i;

  // STATISTICAL_STATS_TABLE keys stats by their bare name (as left over
  // after STATISTICAL_STAT_VALUE_RE strips the leading value) plus whether
  // the source table's Unit column was "1%" (isPercent) — the only name
  // that appears both ways is Spirit Power (flat "1 SP" vs percent "Spirit
  // Power %"), so isPercent is what disambiguates those two rows from each
  // other. "vs."/"vs" and stray whitespace are normalized before comparing
  // so "Weapon Damage vs. NPCs" (item text) matches "Weapon Damage % vs
  // NPCs" (table) without being treated as a different stat. Deliberately
  // NOT fuzzy beyond that — e.g. "Ability Cooldown Reduction" and
  // "Cooldown Reduction For Charged Abilities" are left unmapped rather
  // than guessed to alias "Cooldown Reduction %", since a qualifier can
  // change what the stat actually measures.
  function normalizeStatNameForMatch(name) {
    return name
      .replace(/vs\.?/gi, "vs")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function findStatisticalStatRow(name, isPercent) {
    const normalized = normalizeStatNameForMatch(name);
    return (
      STATISTICAL_STATS_TABLE.find(
        (row) => row.isPercent === isPercent && normalizeStatNameForMatch(row.name) === normalized
      ) || null
    );
  }

  // 1-decimal precision, trimmed to a bare integer when the result lands on
  // a whole number (e.g. 640 rather than 640.0) — matches how the souls
  // costs read everywhere else on the site. Used for computed *results*
  // (per-stat souls, the total) — not for the souls-per-unit rate itself,
  // which needs its full 2-decimal source precision (see
  // formatSoulsRateNumber) or the displayed multiplication stops matching
  // the displayed result (e.g. "4.2 souls/%" next to a result that was
  // actually computed from 4.21).
  function formatSoulsNumber(n) {
    const rounded = Math.round(n * 10) / 10;
    return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1);
  }

  // Up to 2-decimal precision, trailing zeros trimmed (84.21 -> "84.21",
  // 80.00 -> "80") — preserves STATISTICAL_STATS_TABLE's source precision
  // for the souls-per-unit rate shown in each stat's math line.
  function formatSoulsRateNumber(n) {
    return String(Math.round(n * 100) / 100);
  }

  // Prices an item's always-on innateStats lines against
  // STATISTICAL_STATS_TABLE (see items-data.js) — deliberately skips
  // ability boxes entirely, since those are largely conditional/proc
  // effects (e.g. Active Reload's temporary Fire Rate window) that don't
  // reduce to a flat souls value the same way a permanent stat does. Every
  // parseable innateStats line gets a row (even ones with no table match,
  // or a table match whose soulsPerUnit is null) so the section can show
  // "n/a" for stats that don't have a conversion factor yet rather than
  // silently dropping them — only souls-summed (`souls != null`) rows
  // count toward `total`.
  function computeStatisticalStatsForItem(details) {
    const rows = [];
    let total = 0;
    (details.innateStats || []).forEach((raw) => {
      const text = typeof raw === "string" ? raw : raw.text;
      const match = STATISTICAL_STAT_VALUE_RE.exec(text);
      if (!match) return;

      const rawValueText = match[0].trim();
      const sign = match[1] === "-" ? -1 : 1;
      const magnitude = parseFloat(match[2]);
      const isPercent = (match[3] || "").indexOf("%") !== -1;
      const name = text.slice(match[0].length).trim();

      const row = findStatisticalStatRow(name, isPercent);
      const priced = !!row && row.soulsPerUnit != null;
      const souls = priced ? sign * magnitude * row.soulsPerUnit : null;
      if (priced) total += souls;

      rows.push({
        name,
        isPercent,
        color: (row && STATISTICAL_STAT_CATEGORY_COLORS[row.category]) || "#ffffff",
        rawValueText,
        unitLabel: row ? row.unitLabel : isPercent ? "%" : "",
        soulsPerUnit: priced ? row.soulsPerUnit : null,
        souls
      });
    });
    return { rows, total };
  }

  function buildStatisticalStatsHtml(details) {
    const { rows, total } = computeStatisticalStatsForItem(details);
    if (!rows.length) return "";

    const sectionsHtml = rows
      .map((r) => {
        const title = "Statistical " + r.name + (r.isPercent ? " %" : "");
        // Split into a calculation (left, dimmed) and its result (right,
        // bolded) rather than one flowing sentence — see the scoped
        // .tooltip-card-statistical-body .tooltip-section-desc flex rule
        // in style.css, which only applies within this card (the
        // .tooltip-section-desc class is shared with ability descriptions
        // elsewhere, which still need normal flowing paragraph text).
        // Stats with no conversion factor yet (r.souls === null) just show
        // the raw stat line with no multiplication and "n/a" as the result.
        const calcExpr =
          r.souls != null
            ? escapeHtml(r.rawValueText) +
              " " +
              escapeHtml(r.name) +
              " &times; " +
              formatSoulsRateNumber(r.soulsPerUnit) +
              " souls per " +
              escapeHtml(r.unitLabel || "1")
            : escapeHtml(r.rawValueText) + " " + escapeHtml(r.name);
        const calcResult = r.souls != null ? formatSoulsNumber(r.souls) + " souls" : "n/a";
        return (
          '<div class="tooltip-section">' +
          '<div class="tooltip-section-header">' +
          '<span class="tooltip-section-type" style="color:' + r.color + '">' + escapeHtml(title) + "</span>" +
          "</div>" +
          '<div class="tooltip-section-body">' +
          '<div class="tooltip-section-desc">' +
          '<span class="tooltip-statistical-calc-expr">' + calcExpr + "</span>" +
          '<span class="tooltip-statistical-calc-result">' + calcResult + "</span>" +
          "</div>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    // The desc line sits below the whole label+value row (not inside a
    // shared flex group with the label) so its own font-size/line-height
    // can't shift where .tooltip-statistical-total-value sits vertically.
    const totalHtml =
      '<div class="tooltip-statistical-total-wrap">' +
      '<div class="tooltip-statistical-total">' +
      '<span class="tooltip-statistical-total-label">Total Statistical Value</span>' +
      '<span class="tooltip-statistical-total-value">' + formatSoulsNumber(total) + " souls</span>" +
      "</div>" +
      '<div class="tooltip-statistical-total-desc">Not including passives or actives.</div>' +
      "</div>";

    return sectionsHtml + totalHtml;
  }

  // Static reference content for the Info tab's "Statistical Stats"
  // explainer — built once (the table never changes at runtime) rather
  // than re-rendered per tab switch, unlike the per-item tooltip section
  // above which reads live item data.
  function buildInfoTabHtml() {
    const intro =
      '<div class="info-section">' +
      '<p class="info-section-text">' +
      'Every item\'s tooltip includes a <strong style="color:#2f6376">Statistical Stats</strong> breakdown, ' +
      "converting each of its stats into an empirically-derived souls value. These " +
      "souls-per-unit numbers were solved from a linear system of equations built out of " +
      "single and also some dual-stat items. The idea is that items are worth more than " +
      "their raw soul cost, since the game design assumes that players will find skill " +
      'ceilings for items. <span class="info-stat-value-na">N/A</span> means no ' +
      "empirical value has been solved for that stat yet. All data is pulled from the " +
      '<span style="color:#70e050">Clear Comms</span> community.' +
      "</p>" +
      "</div>";

    // Groups rows by category in the table's own order (categories are
    // already contiguous in STATISTICAL_STATS_TABLE — see items-data.js)
    // rather than re-sorting, so this always matches the source table's
    // layout without needing a separate category-order list to maintain.
    const categories = [];
    const byCategory = {};
    STATISTICAL_STATS_TABLE.forEach((row) => {
      if (!byCategory[row.category]) {
        byCategory[row.category] = [];
        categories.push(row.category);
      }
      byCategory[row.category].push(row);
    });

    const tableHtml = categories
      .map((cat) => {
        const color = STATISTICAL_STAT_CATEGORY_COLORS[cat] || "#ffffff";
        const rowsHtml = byCategory[cat]
          .map((row) => {
            const valueHtml =
              row.soulsPerUnit == null
                ? '<span class="info-stat-value-na">N/A</span>'
                : formatSoulsRateNumber(row.soulsPerUnit) + " souls";
            return (
              '<div class="info-stat-row">' +
              statIconImg(row.icon, "info-stat-icon") +
              '<span class="info-stat-name">' + escapeHtml(row.name) + (row.isPercent ? " %" : "") + "</span>" +
              '<span class="info-stat-value">' + valueHtml + "</span>" +
              "</div>"
            );
          })
          .join("");
        return (
          '<div class="info-stat-category">' +
          '<div class="info-stat-category-header" style="color:' + color + '">' + escapeHtml(cat) + "</div>" +
          rowsHtml +
          "</div>"
        );
      })
      .join("");

    return intro + '<div class="info-stat-table">' + tableHtml + "</div>";
  }

  // An innate stat is either a plain string, or { text, color } to tint it
  // (e.g. a red damage-penalty line) using the same tooltip-stat-color-*
  // classes as stat boxes.
  function renderInnateStat(stat) {
    const isObj = typeof stat === "object" && stat !== null;
    const text = isObj ? stat.text : stat;
    const colorClass = isObj && stat.color ? " tooltip-stat-color-" + stat.color : "";
    return '<div class="tooltip-innate-stat' + colorClass + '">' + renderInlineFormatting(text) + "</div>";
  }

  function buildAbilitySectionHtml(section) {
    const cooldownHtml = section.cooldown
      ? '<span class="tooltip-section-cooldown">' +
        statIconImg("ability-cooldown", "tooltip-section-cooldown-icon") +
        section.cooldown +
        "</span>"
      : "";

    // Extra paragraphs after the main description, in whatever order the
    // item calls for (a plain second paragraph, an italic side-note, or
    // both — different items order these differently).
    const extraHtml = (section.extraText || [])
      .map(
        (block) =>
          '<div class="' +
          (block.italic ? "tooltip-section-note" : "tooltip-section-desc") +
          '">' +
          renderInlineFormatting(block.text) +
          "</div>"
      )
      .join("");

    const boxes = section.boxes || [];
    const statusBoxes = boxes.filter((b) => b.type === "status_effect");
    const statBoxes = boxes.filter((b) => b.type === "stat");
    const footerBoxes = boxes.filter((b) => b.type === "footer");

    const statusHtml = statusBoxes.length
      ? '<div class="tooltip-status-row">' + statusBoxes.map(renderStatusChip).join("") + "</div>"
      : "";
    const statGridHtml = statBoxes.length
      ? '<div class="tooltip-stat-grid">' + statBoxes.map(renderStatBox).join("") + "</div>"
      : "";
    const footerHtml = footerBoxes.length
      ? '<div class="tooltip-footer-row">' + footerBoxes.map(renderStatBox).join("") + "</div>"
      : "";

    return (
      '<div class="tooltip-section">' +
      '<div class="tooltip-section-header">' +
      '<span class="tooltip-section-type">' +
      escapeHtml(section.type) +
      "</span>" +
      cooldownHtml +
      "</div>" +
      '<div class="tooltip-section-body">' +
      '<div class="tooltip-section-desc">' +
      renderInlineFormatting(section.description) +
      "</div>" +
      extraHtml +
      statusHtml +
      statGridHtml +
      footerHtml +
      "</div>" +
      "</div>"
    );
  }

  function renderStatusChip(box) {
    return (
      '<div class="tooltip-status-chip">' +
      statIconImg(box.icon, "tooltip-status-chip-icon") +
      '<span class="tooltip-status-chip-name">' +
      escapeHtml(box.label) +
      "</span>" +
      '<span class="tooltip-status-chip-caption">Status Effect</span>' +
      "</div>"
    );
  }

  function renderStatBox(box) {
    const isFooter = box.type === "footer";
    const colorClass = "tooltip-stat-color-" + (box.color || "white");
    const scalingHtml = box.scaling
      ? '<span class="tooltip-stat-scaling">' +
        statIconImg("spirit-scaling", "tooltip-stat-scaling-icon") +
        "x" +
        escapeHtml(box.scaling) +
        "</span>"
      : "";
    const conditionalHtml = box.conditional ? '<div class="tooltip-stat-conditional">Conditional</div>' : "";

    return (
      '<div class="tooltip-stat-box' +
      (isFooter ? " tooltip-stat-box-footer" : "") +
      '">' +
      scalingHtml +
      '<div class="tooltip-stat-icon-value">' +
      statIconImg(box.icon, "tooltip-stat-icon") +
      '<span class="tooltip-stat-value ' +
      colorClass +
      '">' +
      escapeHtml(box.value) +
      "</span>" +
      (isFooter ? '<span class="tooltip-stat-label">' + escapeHtml(box.label) + "</span>" : "") +
      "</div>" +
      (isFooter ? "" : '<div class="tooltip-stat-label">' + escapeHtml(box.label) + "</div>") +
      conditionalHtml +
      "</div>"
    );
  }

  // Upgrade chains aren't always within the same category — e.g. Mystic
  // Expansion (spirit) upgrades into Ballistic Enchantment (weapon), since
  // the base imbue items branch into category-specific advanced imbues.
  // So this searches every category rather than assuming the source
  // item's own category.
  function findItemFile(name) {
    for (const cat of CATEGORY_ORDER) {
      const tiers = SHOP_DATA[cat].tiers;
      for (const t of Object.keys(tiers)) {
        const found = tiers[t].find((i) => i.name === name);
        if (found) return { cat, file: found.file };
      }
    }
    return null;
  }

  function buildUpgradesHtml(details) {
    // A mid-tier item commonly has both a base it came from and one or
    // more items it upgrades into (e.g. Improved Spirit shows "Upgrades
    // From: Extra Spirit" AND "Upgrades To: Boundless Spirit"), so both
    // directions render as separate blocks when present, not just one.
    return buildUpgradesBlock("From", details.upgradesFrom) + buildUpgradesBlock("To", details.upgradesTo);
  }

  function buildUpgradesBlock(direction, names) {
    if (!names) return "";
    // A base-tier item commonly upgrades into more than one higher-tier
    // option (e.g. Extra Spirit -> Improved Spirit + Surge of Power), so
    // this accepts either a single name or an array of names.
    const itemsHtml = [].concat(names).map(renderUpgradeItem).join("");

    return (
      '<div class="tooltip-upgrades">' +
      '<div class="tooltip-upgrades-label">Upgrades ' +
      direction +
      ":</div>" +
      '<div class="tooltip-upgrade-items">' +
      itemsHtml +
      "</div>" +
      "</div>"
    );
  }

  function renderUpgradeItem(itemName) {
    const found = findItemFile(itemName);
    const iconHtml = found
      ? '<div class="tooltip-upgrade-icon" style="background-image:url(\'' + iconPath(found.cat, found.file) + "')\"></div>"
      : "";
    // Only clickable when the target actually resolves to a real card
    // (e.g. not a currently-legacy/disabled item with no card to jump to).
    const attrs = found
      ? 'class="tooltip-upgrade-item tooltip-upgrade-item-clickable" data-upgrade-target="' + escapeHtml(itemName) + '"'
      : 'class="tooltip-upgrade-item"';
    return "<div " + attrs + ">" + iconHtml + "<span>" + escapeHtml(itemName) + "</span></div>";
  }

  // Concatenated ability prose for an item — the flowing description text
  // (not stat boxes/values), used by applySearchFilter's "description"
  // scope.
  function itemDescriptionText(details) {
    if (!details) return "";
    const parts = [];
    (details.abilities || []).forEach((section) => {
      if (section.description) parts.push(section.description);
      (section.extraText || []).forEach((t) => parts.push(typeof t === "string" ? t : t.text));
    });
    return parts.join(" ");
  }

  // Concatenated stat text for an item — both its always-on innateStats
  // lines and any stat/status boxes granted by an ability (e.g. Active
  // Reload's conditional Fire Rate/Lifesteal/Move Speed boxes) — used by
  // applySearchFilter's "stats" scope.
  function itemStatsText(details) {
    if (!details) return "";
    const parts = [];
    (details.innateStats || []).forEach((s) => parts.push(typeof s === "string" ? s : s.text));
    (details.abilities || []).forEach((section) => {
      (section.boxes || []).forEach((box) => {
        if (box.label) parts.push(box.label);
        if (box.value) parts.push(String(box.value));
      });
    });
    return parts.join(" ");
  }

  // Which fields the search query is restricted to — all false (the
  // default) means an unrestricted search across name+description+stats;
  // checking any of these narrows matching to just the checked field(s).
  let searchScopeName = false;
  let searchScopeDescription = false;
  let searchScopeStats = false;

  function toggleSearchScope(scope, checked) {
    if (scope === "name") searchScopeName = checked;
    else if (scope === "description") searchScopeDescription = checked;
    else if (scope === "stats") searchScopeStats = checked;
    applySearchFilter(searchInputEl ? searchInputEl.value : "");
  }

  function applySearchFilter(query) {
    const q = query.trim().toLowerCase();
    const anyScopeActive = searchScopeName || searchScopeDescription || searchScopeStats;

    document.querySelectorAll(".mod-box").forEach((card) => {
      let matches = true;
      if (q) {
        const details = ITEM_DETAILS[card.dataset.category + ":" + card.dataset.file];
        const nameText = card.dataset.name.toLowerCase();
        const descText = itemDescriptionText(details).toLowerCase();
        const statsText = itemStatsText(details).toLowerCase();
        matches = anyScopeActive
          ? (searchScopeName && nameText.includes(q)) ||
            (searchScopeDescription && descText.includes(q)) ||
            (searchScopeStats && statsText.includes(q))
          : nameText.includes(q) || descText.includes(q) || statsText.includes(q);
      }
      card.classList.toggle("search-hidden", !matches);
    });
    document.querySelectorAll(".search-section").forEach((section) => {
      const hasVisibleItem = Array.from(section.querySelectorAll(".mod-box")).some(
        (card) => !card.classList.contains("search-hidden")
      );
      const title = section.querySelector(".search-section-title");
      if (title) title.classList.toggle("search-hidden", !hasVisibleItem);
    });
  }

  // ---------- Build creator ----------

  function makeId(prefix) {
    return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  function loadBuildFromStorage() {
    const fallback = { version: BUILD_STORAGE_VERSION, title: "", hero: null, sections: [], savedBuildId: null };
    let raw;
    try {
      raw = localStorage.getItem(BUILD_STORAGE_KEY);
    } catch (e) {
      return fallback;
    }
    if (!raw) return fallback;
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.sections)) return fallback;
    return {
      version: BUILD_STORAGE_VERSION,
      title: typeof parsed.title === "string" ? parsed.title : "",
      hero: typeof parsed.hero === "string" ? parsed.hero : null,
      sections: parsed.sections,
      // Which SAVED_BUILDS_STORAGE_KEY entry (if any) the canvas currently
      // matches — set by saveCurrentBuildToLibrary/loadBuildFromLibrary, so
      // a later Save updates that same entry instead of creating a
      // duplicate, and the "My Builds" list can highlight it as current.
      savedBuildId: typeof parsed.savedBuildId === "string" ? parsed.savedBuildId : null,
    };
  }

  function saveBuildToStorage(state) {
    try {
      localStorage.setItem(BUILD_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Storage full/unavailable (e.g. private browsing) — the build stays
      // usable for the rest of the session, it just won't persist.
    }
    // Keeps the canvas's linked library entry (if any — see
    // saveCurrentBuildToLibrary/loadBuildFromLibrary) mirroring it in real
    // time, on every edit, not just an explicit Save. Without this, the
    // saved entry only reflected whatever it looked like at the moment of
    // the last Save/Load — meaning any edits made since then were
    // invisible to "My Builds", and clicking back onto what the dropdown
    // itself was already labeling as your CURRENT build would silently
    // discard all of that unsaved work, reloading the stale snapshot.
    if (state.savedBuildId) {
      const linked = savedBuilds.find((b) => b.id === state.savedBuildId);
      if (linked) {
        linked.name = (state.title || "").trim() || "Unnamed Build";
        linked.hero = state.hero;
        linked.sections = JSON.parse(JSON.stringify(state.sections));
        linked.savedAt = Date.now();
        persistSavedBuilds();
        renderSavedBuildsList();
      }
    }
  }

  function loadSavedBuilds() {
    let raw;
    try {
      raw = localStorage.getItem(SAVED_BUILDS_STORAGE_KEY);
    } catch (e) {
      return [];
    }
    if (!raw) return [];
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return [];
    }
    return Array.isArray(parsed) ? parsed : [];
  }

  function persistSavedBuilds() {
    try {
      localStorage.setItem(SAVED_BUILDS_STORAGE_KEY, JSON.stringify(savedBuilds));
    } catch (e) {
      // Storage full/unavailable — saved builds stay usable for the rest of
      // the session, they just won't persist.
    }
  }

  function getPlacedItemKeys(state) {
    const keys = new Set();
    state.sections.forEach((section) => {
      section.items.forEach((it) => keys.add(it.category + ":" + it.file));
    });
    return keys;
  }

  // Complements findItemFile (which searches by display name in the other
  // direction) — here we already have {category, file} from stored build
  // data and need the full item record (+ its tier) to render a card.
  function resolveBuildItem(category, file) {
    const tiers = SHOP_DATA[category].tiers;
    for (const t of Object.keys(tiers)) {
      const found = tiers[t].find((i) => i.file === file);
      if (found) return { tier: Number(t), item: found };
    }
    return null;
  }

  function findSection(id) {
    return buildState.sections.find((s) => s.id === id);
  }

  // Sums every placed item's soul cost (its price tier, via
  // resolveBuildItem) grouped by category, across ALL non-optional
  // sections — the investment mechanic is a single global total per
  // category, not a per-section one, matching how it actually works
  // in-game. Optional sections are excluded since their items represent
  // situational/alternative picks that aren't necessarily part of the
  // actual build.
  function calculateInvestmentTotals() {
    const totals = { weapon: 0, vitality: 0, spirit: 0 };
    buildState.sections.forEach((section) => {
      if (section.optional) return;
      section.items.forEach((it) => {
        const resolved = resolveBuildItem(it.category, it.file);
        if (resolved) totals[it.category] += resolved.tier;
      });
    });
    CATEGORY_ORDER.forEach((cat) => {
      totals[cat] = Math.min(totals[cat], 28800);
    });
    return totals;
  }

  // Returns {index, tier} for the highest INVESTMENT_TIERS row whose
  // souls threshold `total` meets or exceeds, or null if under 800 souls
  // (no bonus reached yet). `index` (0-10) is how many bar segments
  // should render filled.
  function getInvestmentTier(total) {
    let result = null;
    let index = -1;
    for (let i = 0; i < INVESTMENT_TIERS.length; i++) {
      if (total >= INVESTMENT_TIERS[i].souls) {
        result = INVESTMENT_TIERS[i];
        index = i;
      } else {
        break;
      }
    }
    return result ? { index, tier: result } : null;
  }

  // Built once — 3 bars (one per category) of INVESTMENT_TIERS.length
  // segments each, plus a category icon below. Segments are created
  // bottom-tier-first-in-DOM-last so index 0 (the 800-soul tier) ends up
  // as the last child, i.e. visually at the bottom of the bar, matching
  // how the fill should read (bottom-up as investment grows). Element
  // refs are cached in investmentBarEls so re-rendering is just toggling
  // a class, not rebuilding the DOM every time.
  function tierBonusText(cat, tierRow) {
    return cat === "spirit" ? "+" + tierRow.spirit : "+" + tierRow[cat] + "%";
  }

  // Builds one shared "Souls" column (11 rows, 28,800 at top down to 800
  // at bottom, star on the 4,800 milestone row) that sits to the left of
  // the 3 category pills — row-for-row aligned with each pill's own 11
  // segments since both are built from the same INVESTMENT_TIERS list in
  // the same order with the same per-row height.
  function buildInvestmentSoulsColumn() {
    const col = document.createElement("div");
    col.className = "investment-souls-col";
    for (let i = INVESTMENT_TIERS.length - 1; i >= 0; i--) {
      const tierRow = INVESTMENT_TIERS[i];
      const row = document.createElement("div");
      row.className = "investment-souls-row";
      if (tierRow.milestone) row.classList.add("is-milestone");
      row.textContent = tierRow.souls.toLocaleString();
      if (tierRow.milestone) {
        const star = document.createElement("span");
        star.className = "investment-souls-star";
        star.textContent = "★";
        row.appendChild(star);
      }
      col.appendChild(row);
    }
    return col;
  }

  function buildInvestmentBarsUI() {
    // .investment-bars is the panel background — stretches to fill
    // .shop-builds-right's full (grown) width. .investment-bars-content
    // holds the actual souls column + pills at native size, scaled down
    // (via CSS transform, see style.css) only once the panel gets
    // squeezed narrower than that native size, and centered inside the
    // panel the rest of the time.
    const wrap = document.createElement("div");
    wrap.className = "investment-bars";

    // Header matches .build-section-header's styling (see style.css) —
    // just a title, no drag handle/optional badge/delete button since
    // this panel isn't a reorderable/deletable build section.
    const header = document.createElement("div");
    header.className = "investment-bars-header";
    const title = document.createElement("div");
    title.className = "investment-bars-title";
    title.textContent = "Investments";
    header.appendChild(title);
    wrap.appendChild(header);

    const body = document.createElement("div");
    body.className = "investment-bars-body";
    wrap.appendChild(body);

    investmentBarsViewportEl = document.createElement("div");
    investmentBarsViewportEl.className = "investment-bars-viewport";
    body.appendChild(investmentBarsViewportEl);

    const content = document.createElement("div");
    content.className = "investment-bars-content";
    investmentBarsViewportEl.appendChild(content);
    investmentBarsContentEl = content;

    investmentBarEls = {};

    content.appendChild(buildInvestmentSoulsColumn());

    CATEGORY_ORDER.forEach((cat) => {
      const col = document.createElement("div");
      col.className = "investment-bar-col";

      const pillRow = document.createElement("div");
      pillRow.className = "investment-bar-pill-row";

      // A pill: overflow:hidden + strongly rounded corners on this outer
      // wrapper is what turns the 11 stacked segment rows into one
      // continuous rounded capsule shape, rather than each row being
      // independently rounded.
      const pill = document.createElement("div");
      pill.className = "investment-bar is-" + cat;

      // Tick labels sit outside the pill (to its right), one per row —
      // kept as a separate column rather than overlaid on the segments,
      // so they're never clipped by the pill's own overflow:hidden and
      // don't need to fight for contrast against the fill color.
      const labelsCol = document.createElement("div");
      labelsCol.className = "investment-bar-labels";

      const segments = [];
      const labels = [];
      for (let i = INVESTMENT_TIERS.length - 1; i >= 0; i--) {
        const tierRow = INVESTMENT_TIERS[i];

        const row = document.createElement("div");
        row.className = "investment-bar-row";
        if (tierRow.milestone) row.classList.add("is-milestone");
        const seg = document.createElement("div");
        seg.className = "investment-bar-segment";
        row.appendChild(seg);
        pill.appendChild(row);
        segments[i] = seg;

        const labelRow = document.createElement("div");
        labelRow.className = "investment-bar-label-row";
        if (tierRow.milestone) labelRow.classList.add("is-milestone");
        const label = document.createElement("span");
        label.className = "investment-bar-tick-label";
        label.textContent = tierBonusText(cat, tierRow);
        labelRow.appendChild(label);
        labelsCol.appendChild(labelRow);
        labels[i] = labelRow;
      }
      pillRow.appendChild(pill);
      pillRow.appendChild(labelsCol);
      col.appendChild(pillRow);

      const iconWrap = document.createElement("div");
      iconWrap.className = "investment-bar-icon-wrap";
      const icon = document.createElement("img");
      icon.className = "investment-bar-icon";
      icon.src = "stat_icons/icon-" + cat + ".webp";
      icon.alt = "";
      iconWrap.appendChild(icon);
      col.appendChild(iconWrap);

      content.appendChild(col);
      investmentBarEls[cat] = { bar: pill, segments, labels };
    });

    return wrap;
  }

  function renderInvestmentBars() {
    if (!investmentBarEls) return;
    const totals = calculateInvestmentTotals();
    CATEGORY_ORDER.forEach((cat) => {
      const total = totals[cat];
      const reached = getInvestmentTier(total);
      const filledCount = reached ? reached.index + 1 : 0;
      investmentBarEls[cat].segments.forEach((seg, i) => {
        seg.classList.toggle("is-filled", i < filledCount);
      });
      investmentBarEls[cat].labels.forEach((labelRow, i) => {
        labelRow.classList.toggle("is-filled", i < filledCount);
      });
      const bonusText = reached ? tierBonusText(cat, reached.tier) : "none yet";
      investmentBarEls[cat].bar.title =
        SHOP_DATA[cat].label + " Investment: " + total.toLocaleString() + " / 28,800 souls — " + bonusText;
    });
  }

  // Flattens every placed item across all non-optional sections into buy
  // order — first section to last, first item to last within a section —
  // same ordering rule as the investment-bar hover attribution above.
  // Each item also carries `cumulative`: the running total of every
  // same-category item at or before it in that order (so e.g. a second
  // weapon item's bar reaches its own cost PLUS every earlier weapon
  // item's cost, tracking that category's investment progress rather
  // than just this one item's own price) — same per-category summing
  // calculateInvestmentTotals does, just tracked as a running list
  // instead of collapsed into one final total. Capped at 28,800 to match
  // that same function's cap (the investment mechanic's own ceiling).
  function collectGraphTimelineItems() {
    const list = [];
    const runningTotals = { weapon: 0, vitality: 0, spirit: 0 };
    buildState.sections.forEach((section) => {
      if (section.optional) return;
      section.items.forEach((it) => {
        const resolved = resolveBuildItem(it.category, it.file);
        if (!resolved) return;
        runningTotals[it.category] = Math.min(runningTotals[it.category] + resolved.tier, 28800);
        list.push({
          category: it.category,
          file: it.file,
          tier: resolved.tier,
          name: resolved.item.name,
          cumulative: runningTotals[it.category],
        });
      });
    });
    return list;
  }

  // Soul-cost milestones shown on the chart's y-axis — the investment
  // mechanic's own INVESTMENT_TIERS milestones (items-data.js), minus
  // 2,400 (not a round enough milestone to bother labeling) and with a 0
  // baseline added.
  const GRAPH_AXIS_TIERS = [0, 800, 1600, 3200, 4800, 6400, 8000, 11200, 16000, 22400, 28800];

  // Leaves headroom above the tallest possible bar for its icon (see
  // .graph-bar-icon) — bars/gridlines both scale against this reduced
  // ceiling rather than the plot's full 100% height, so a max-tier item's
  // icon never pokes out above the plot's own top edge.
  const GRAPH_BAR_MAX_HEIGHT_PCT = 82;

  // Breakpoints defining the y-axis's scale, as [soul value, vertical %
  // position] pairs. 0 and 11,200 anchor the low end at their TRUE
  // proportional positions (against the 28,800 max); the milestones
  // between them (800–8,000) are then spaced evenly across that same
  // span instead of by their real value gaps, which crowd together low
  // on a true linear scale. Everything above 11,200 stays a true
  // proportional reading, unchanged.
  const GRAPH_AXIS_BREAKPOINTS = (function () {
    const axisMax = GRAPH_AXIS_TIERS[GRAPH_AXIS_TIERS.length - 1];
    const truePct = (v) => (v / axisMax) * GRAPH_BAR_MAX_HEIGHT_PCT;
    const lowerTiers = GRAPH_AXIS_TIERS.filter((v) => v <= 11200);
    const lowerEndPct = truePct(11200);
    const lowerStepPct = lowerEndPct / (lowerTiers.length - 1);
    const points = lowerTiers.map((v, i) => ({ value: v, pct: i * lowerStepPct }));
    GRAPH_AXIS_TIERS.filter((v) => v > 11200).forEach((v) => points.push({ value: v, pct: truePct(v) }));
    return points;
  })();

  // Maps a soul value to a vertical % position via GRAPH_AXIS_BREAKPOINTS
  // above, interpolating between whichever two breakpoints it falls
  // between — so a bar's height still lines up meaningfully with the
  // gridlines on either side of it even though the scale isn't uniformly
  // linear end to end.
  function graphAxisPercent(value) {
    const points = GRAPH_AXIS_BREAKPOINTS;
    if (value <= points[0].value) return points[0].pct;
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      if (value <= b.value) {
        const frac = (value - a.value) / (b.value - a.value);
        return a.pct + frac * (b.pct - a.pct);
      }
    }
    return points[points.length - 1].pct;
  }

  function renderGraphsChart() {
    if (!shopGraphsEl) return;
    shopGraphsEl.innerHTML = "";

    const items = collectGraphTimelineItems();

    const viewport = document.createElement("div");
    viewport.className = "graph-chart-viewport";

    const chart = document.createElement("div");
    chart.className = "graph-chart";

    const axis = document.createElement("div");
    axis.className = "graph-axis";
    GRAPH_AXIS_TIERS.forEach((tier) => {
      const label = document.createElement("div");
      // 4,800 is the game's own "milestone" investment threshold (see
      // items-data.js) — called out in yellow so it stands out from the
      // other axis tiers as the one that actually matters mechanically.
      label.className = "graph-axis-label" + (tier === 4800 ? " is-milestone" : "");
      label.style.bottom = graphAxisPercent(tier) + "%";
      label.textContent = tier.toLocaleString();
      axis.appendChild(label);
    });
    chart.appendChild(axis);

    const plot = document.createElement("div");
    plot.className = "graph-plot";

    GRAPH_AXIS_TIERS.forEach((tier) => {
      const line = document.createElement("div");
      line.className = "graph-gridline" + (tier === 4800 ? " is-milestone" : "");
      line.style.bottom = graphAxisPercent(tier) + "%";
      plot.appendChild(line);
    });

    const barsRow = document.createElement("div");
    barsRow.className = "graph-bars";
    items.forEach((it) => {
      const bar = document.createElement("div");
      bar.className = "graph-bar";
      bar.title = it.name + " — " + it.tier.toLocaleString() + " souls (running total: " + it.cumulative.toLocaleString() + ")";

      const icon = document.createElement("img");
      icon.className = "graph-bar-icon";
      icon.src = iconPath(it.category, it.file);
      icon.alt = "";
      bar.appendChild(icon);

      const rect = document.createElement("div");
      rect.className = "graph-bar-rect is-" + it.category;
      rect.style.height = graphAxisPercent(it.cumulative) + "%";
      bar.appendChild(rect);

      barsRow.appendChild(bar);
    });
    plot.appendChild(barsRow);

    chart.appendChild(plot);
    viewport.appendChild(chart);
    shopGraphsEl.appendChild(viewport);
  }

  // Hovering a placed item highlights the segment range on its category's
  // bar that this ONE item's soul cost accounts for, attributed by
  // placement order (first section to last, first item to last within a
  // section) rather than by removing this item from the grand total —
  // e.g. with Spirit Burn (6,400 souls) placed before Lightning Scroll
  // (6,400 souls), Spirit Burn accounts for the 0-6,400 range and
  // Lightning Scroll accounts for the 6,400-12,800 range, even though
  // both cost the same. Tier indices (not raw soul amounts) are compared
  // since segments represent tier thresholds, not a proportional/
  // continuous scale. Optional sections are skipped entirely (same as
  // calculateInvestmentTotals) — hovering an item in one never
  // highlights anything, since it isn't contributing to the total.
  function highlightInvestmentContribution(category, file) {
    if (!investmentBarEls) return;
    let runningTotal = 0;
    let fromTotal = null;
    let toTotal = null;
    buildState.sections.some((section) => {
      if (section.optional) return false;
      return section.items.some((it) => {
        if (it.category !== category) return false;
        const resolved = resolveBuildItem(it.category, it.file);
        if (!resolved) return false;
        const before = runningTotal;
        runningTotal = Math.min(28800, runningTotal + resolved.tier);
        if (it.file === file) {
          fromTotal = before;
          toTotal = runningTotal;
          return true; // stop — found the hovered item
        }
        return false;
      });
    });
    if (fromTotal === null) return;
    const beforeTier = getInvestmentTier(fromTotal);
    const afterTier = getInvestmentTier(toTotal);
    const fromIndex = beforeTier ? beforeTier.index + 1 : 0;
    const toIndex = afterTier ? afterTier.index : -1;
    investmentBarEls[category].segments.forEach((seg, i) => {
      seg.classList.toggle("is-highlighted", i >= fromIndex && i <= toIndex);
    });
  }

  function clearInvestmentHighlight() {
    if (!investmentBarEls) return;
    CATEGORY_ORDER.forEach((cat) => {
      investmentBarEls[cat].segments.forEach((seg) => seg.classList.remove("is-highlighted"));
    });
  }

  function buildShopBuildsUI() {
    if (!shopBuildsEl) return;
    buildState = loadBuildFromStorage();
    savedBuilds = loadSavedBuilds();

    const inner = document.createElement("div");
    inner.className = "shop-builds-inner";

    const left = document.createElement("div");
    left.className = "shop-builds-left";

    // Full-width header for .shop-builds-inner (not scoped to just the
    // left column) — appended to inner directly, before the left/right
    // columns below it, rather than into `left`.
    addSectionBtnViewportEl = document.createElement("div");
    addSectionBtnViewportEl.className = "build-add-section-viewport";
    inner.appendChild(addSectionBtnViewportEl);

    sectionActionsRowEl = document.createElement("div");
    sectionActionsRowEl.className = "build-section-actions-row";
    addSectionBtnViewportEl.appendChild(sectionActionsRowEl);

    // Save Build (Builds tab only) and the saved-builds search box (Saves
    // tab only) share the row's left slot — only one is ever visible at a
    // time (see .shop-builds.is-saves-tab .build-actions-left-viewport/
    // .build-actions-search-viewport in style.css), so whichever is
    // display:none simply collapses out of the flex layout and the other
    // sits at the row's left edge in its place. Add Section/Clear sit on
    // the right in both cases (see .build-actions-right-viewport's
    // margin-left:auto in style.css). Each cluster is its own small
    // native-pixel-design unit, scaled by the SAME ratio .shop-builds' own
    // background art scales by (see --shop-builds-content-native-w in
    // style.css) — not each cluster's own width — so the controls visibly
    // track the background instead of just staying at native size while
    // it scales independently. Save Build opens the confirm-name/hero
    // modal (see buildSaveBuildModal) rather than a dropdown — the saved
    // builds themselves now live as cards in the Saved Builds tab (see
    // renderSavedBuildsList), not a list attached to this button. The
    // title input further right (see setBuildTitle) is a second, faster
    // way to rename an already-in-progress build without opening that
    // modal at all — both stay in sync with buildState.title.
    const actionsLeftViewport = document.createElement("div");
    actionsLeftViewport.className = "build-actions-left-viewport";
    const actionsLeft = document.createElement("div");
    actionsLeft.className = "build-actions-left";
    actionsLeftViewport.appendChild(actionsLeft);
    sectionActionsRowEl.appendChild(actionsLeftViewport);

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "build-save-btn";
    saveBtn.title = "Save Build";
    saveBtn.appendChild(document.createTextNode("Save Build"));
    saveBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openSaveBuildModal();
    });
    actionsLeft.appendChild(saveBtn);
    buildSaveBtnEl = saveBtn;

    // Resets the canvas to a blank build (unlike Clear, which only empties
    // the current build's sections — this also drops its title/hero and
    // unlinks it from whatever library entry it came from) without
    // touching that entry's own saved data, same "unlink before writing"
    // ordering clearAllSections already uses for the same reason.
    const newBuildBtn = document.createElement("button");
    newBuildBtn.type = "button";
    newBuildBtn.className = "build-new-build-btn";
    newBuildBtn.title = "New Build";
    newBuildBtn.appendChild(document.createTextNode("New Build"));
    newBuildBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openNewBuildConfirmModal();
    });
    actionsLeft.appendChild(newBuildBtn);

    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.className = "build-title-input";
    titleInput.placeholder = "Unnamed Build";
    titleInput.value = buildState.title || "";
    titleInput.addEventListener("input", () => setBuildTitle(titleInput.value));
    actionsLeft.appendChild(titleInput);
    buildTitleInputEl = titleInput;

    const actionsSearchViewport = document.createElement("div");
    actionsSearchViewport.className = "build-actions-search-viewport";
    const actionsSearch = document.createElement("div");
    actionsSearch.className = "build-actions-search";
    actionsSearchViewport.appendChild(actionsSearch);
    sectionActionsRowEl.appendChild(actionsSearchViewport);

    const savedBuildsSearchInput = document.createElement("input");
    savedBuildsSearchInput.type = "text";
    savedBuildsSearchInput.className = "saved-builds-search-input";
    savedBuildsSearchInput.placeholder = "Search builds...";
    savedBuildsSearchInput.addEventListener("input", () => {
      savedBuildsSearchQuery = savedBuildsSearchInput.value;
      renderSavedBuildsList();
    });
    actionsSearch.appendChild(savedBuildsSearchInput);
    savedBuildsSearchInputEl = savedBuildsSearchInput;

    const actionsRightViewport = document.createElement("div");
    actionsRightViewport.className = "build-actions-right-viewport";
    const actionsRight = document.createElement("div");
    actionsRight.className = "build-actions-right";
    actionsRightViewport.appendChild(actionsRight);
    sectionActionsRowEl.appendChild(actionsRightViewport);

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "build-add-section-btn";
    const addBtnIcon = document.createElement("span");
    addBtnIcon.className = "build-add-section-icon";
    addBtn.appendChild(addBtnIcon);
    addBtn.appendChild(document.createTextNode("Add Section"));
    addBtn.addEventListener("click", addBuildSection);
    actionsRight.appendChild(addBtn);
    addSectionBtnEl = addBtn;

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "build-clear-sections-btn";
    clearBtn.appendChild(document.createTextNode("Clear"));
    clearBtn.addEventListener("click", clearAllSections);
    actionsRight.appendChild(clearBtn);

    buildSectionsViewportEl = document.createElement("div");
    buildSectionsViewportEl.className = "build-sections-viewport";
    left.appendChild(buildSectionsViewportEl);

    sectionsContainerEl = document.createElement("div");
    sectionsContainerEl.className = "build-sections-container";
    buildSectionsViewportEl.appendChild(sectionsContainerEl);

    // Left/right columns sit together in their own row, below the
    // full-width header — same layout .shop-builds-inner used to provide
    // directly, now one level deeper since the header needs to span both
    // of them rather than just sitting inside `left`.
    const columns = document.createElement("div");
    columns.className = "shop-builds-columns";
    columns.appendChild(left);

    // Right column — investment bars for now, room for more build-summary
    // info alongside them later.
    const right = document.createElement("div");
    right.className = "shop-builds-right";

    investmentBarsEl = buildInvestmentBarsUI();
    right.appendChild(investmentBarsEl);

    columns.appendChild(right);
    shopBuildsRightEl = right;

    inner.appendChild(columns);

    // Saved Builds tab content — a sibling of `columns` (not nested
    // inside it) so it inherits .shop-builds-inner's own padding/gap the
    // same way `columns` (and .build-sections-container within it) does,
    // rather than needing its own copy of that spacing. Hidden by default;
    // .shop-builds.is-saves-tab toggles which of the two is visible. Two
    // columns: a portrait grid of every hero (left 2/3 — click one to
    // browse its builds) and a panel showing the selected hero's saved
    // builds (right 1/3) — see renderSavedBuildsHeroGrid/
    // renderSavedBuildsHeroPanel below.
    const savedBuildsViewport = document.createElement("div");
    savedBuildsViewport.className = "saved-builds-viewport";

    const savedBuildsHeroes = document.createElement("div");
    savedBuildsHeroes.className = "saved-builds-heroes";
    savedBuildsViewport.appendChild(savedBuildsHeroes);
    savedBuildsHeroesEl = savedBuildsHeroes;

    const savedBuildsHeroPanel = document.createElement("div");
    savedBuildsHeroPanel.className = "saved-builds-hero-panel";
    savedBuildsViewport.appendChild(savedBuildsHeroPanel);
    savedBuildsHeroPanelEl = savedBuildsHeroPanel;

    inner.appendChild(savedBuildsViewport);

    // Info tab content — explanations of topics around the site; same
    // sibling-of-`columns` pattern as savedBuildsViewport above, hidden by
    // default and toggled by .shop-builds.is-info-tab. Populated once here
    // (not per tab-switch) since buildInfoTabHtml's content is static.
    const infoTabViewport = document.createElement("div");
    infoTabViewport.className = "info-tab-viewport";
    infoTabViewport.innerHTML = buildInfoTabHtml();
    inner.appendChild(infoTabViewport);
    infoTabViewportEl = infoTabViewport;

    shopBuildsEl.appendChild(inner);

    // One delegated listener set on shopBuildsEl — the stable, outermost
    // build panel — rather than sectionsContainerEl itself, since its
    // contents get fully rebuilt on every add/remove/rename/reorder (same
    // rationale as the tooltip desc delegation above, just applied more
    // aggressively since builds change far more often than a hover).
    // Attaching this high (instead of on sectionsContainerEl, which is
    // position:absolute with no padding of its own) matters specifically
    // for drag/drop: a dragover whose target lands just outside
    // sectionsContainerEl's tight bounds (e.g. in the gap/padding around
    // sections, easy to clip into while dragging a section toward the very
    // front of the row) would never get preventDefault() called on it,
    // which makes the browser reject the drop and snap the drag back to
    // its origin instead of reordering.
    shopBuildsEl.addEventListener("click", handleSectionsClick);
    shopBuildsEl.addEventListener("focusout", handleSectionsFocusOut);
    shopBuildsEl.addEventListener("keydown", handleSectionsKeyDown);
    shopBuildsEl.addEventListener("mousedown", handleSectionsMouseDown);
    shopBuildsEl.addEventListener("dragstart", handleSectionsDragStart);
    shopBuildsEl.addEventListener("dragover", handleSectionsDragOver);
    shopBuildsEl.addEventListener("dragleave", handleSectionsDragLeave);
    shopBuildsEl.addEventListener("drop", handleSectionsDrop);
    shopBuildsEl.addEventListener("dragend", () => {
      hideBuildSlotPlaceholder();
      hideSectionReorderPreview();
      const draggingEl = sectionsContainerEl.querySelector(".dragging");
      if (draggingEl) draggingEl.classList.remove("dragging");
    });

    // On document (not shopBuildsEl) since a click anywhere else on the
    // page — not just elsewhere in the build panel — should close an open
    // section settings dropdown.
    document.addEventListener("click", (e) => {
      if (!openSectionSettingsId) return;
      if (e.target.closest(".build-section-settings-btn, .build-section-settings-dropdown")) return;
      closeSectionSettingsDropdown();
    });

    renderSavedBuildsList();
    renderBuildSections();
    updateShopItemUsedState();
  }

  function renderBuildSections() {
    sectionsContainerEl.innerHTML = "";
    const frag = document.createDocumentFragment();
    buildState.sections.forEach((section, index) => frag.appendChild(buildSectionEl(section, index)));
    sectionsContainerEl.appendChild(frag);
    renderInvestmentBars();
    renderGraphsChart();
    updateAddSectionBtnAvailability();
  }

  function buildSectionEl(section) {
    const el = document.createElement("div");
    el.className = "build-section" + (section.optional ? " optional" : "");
    el.dataset.sectionId = section.id;
    if (section.width) el.style.width = section.width + "px";
    // min-height, not height: a fixed height combined with more items
    // than fit would clip/scroll instead of growing, which reads as
    // items getting silently cut off. min-height keeps a resized
    // section's chosen floor size while still letting it grow taller
    // automatically once content needs more room than that.
    if (section.height) el.style.minHeight = section.height + "px";

    const scroll = document.createElement("div");
    scroll.className = "build-section-scroll";

    const header = document.createElement("div");
    header.className = "build-section-header";

    const handle = document.createElement("div");
    handle.className = "build-section-drag-handle";
    handle.draggable = true;
    handle.dataset.dragHandle = "1";
    header.appendChild(handle);

    const title = document.createElement("div");
    title.className = "build-section-title";
    title.contentEditable = "true";
    title.spellcheck = false;
    title.textContent = section.name;
    title.dataset.action = "rename-section";
    header.appendChild(title);

    if (section.color) header.style.backgroundColor = section.color;

    const settingsBtn = document.createElement("div");
    settingsBtn.className = "build-section-settings-btn";
    settingsBtn.dataset.action = "toggle-section-settings";
    header.appendChild(settingsBtn);

    const deleteBtn = document.createElement("div");
    deleteBtn.className = "build-section-delete-btn";
    deleteBtn.dataset.action = "delete-section";
    header.appendChild(deleteBtn);

    scroll.appendChild(header);

    const itemsEl = document.createElement("div");
    itemsEl.className = "build-section-items";
    section.items.forEach((it) => itemsEl.appendChild(buildBuildItemCard(it.category, it.file)));
    scroll.appendChild(itemsEl);

    el.appendChild(scroll);

    // A sibling of .build-section-scroll (not a child of it) so the
    // dropdown isn't clipped/scrolled away by the scroll wrapper's own
    // overflow:auto when a section is shorter than its content — same
    // reasoning as .build-section-resize-handle below.
    const settingsDropdown = document.createElement("div");
    settingsDropdown.className = "build-section-settings-dropdown";
    if (openSectionSettingsId === section.id) settingsDropdown.classList.add("is-open");

    const settingsTitle = document.createElement("div");
    settingsTitle.className = "build-section-settings-title";
    settingsTitle.textContent = "Section Options";
    settingsDropdown.appendChild(settingsTitle);

    const optionalRow = document.createElement("label");
    optionalRow.className = "build-section-settings-optional-row";
    const optionalCheckbox = document.createElement("input");
    optionalCheckbox.type = "checkbox";
    optionalCheckbox.checked = !!section.optional;
    optionalCheckbox.dataset.action = "toggle-optional";
    optionalRow.appendChild(optionalCheckbox);
    const optionalText = document.createElement("span");
    optionalText.className = "build-section-settings-optional-text";
    const optionalLabel = document.createElement("span");
    optionalLabel.className = "build-section-settings-optional-label";
    optionalLabel.textContent = "Optional";
    optionalText.appendChild(optionalLabel);
    const optionalDesc = document.createElement("span");
    optionalDesc.className = "build-section-settings-optional-desc";
    optionalDesc.textContent = "Excludes this section from investment calculations.";
    optionalText.appendChild(optionalDesc);
    optionalRow.appendChild(optionalText);
    settingsDropdown.appendChild(optionalRow);

    const colorsRow = document.createElement("div");
    colorsRow.className = "build-section-settings-colors";
    SECTION_COLORS.forEach((color) => {
      const swatch = document.createElement("div");
      swatch.className = "build-section-color-swatch" + (section.color === color ? " is-selected" : "");
      swatch.style.backgroundColor = color;
      swatch.dataset.action = "set-section-color";
      swatch.dataset.color = color;
      colorsRow.appendChild(swatch);
    });
    settingsDropdown.appendChild(colorsRow);

    el.appendChild(settingsDropdown);

    const resizeHandle = document.createElement("div");
    resizeHandle.className = "build-section-resize-handle";
    resizeHandle.dataset.action = "resize-section";
    el.appendChild(resizeHandle);

    return el;
  }

  function buildBuildItemCard(category, file) {
    const resolved = resolveBuildItem(category, file);
    const wrap = document.createElement("div");
    wrap.className = "build-item-card";
    wrap.draggable = true;
    wrap.dataset.category = category;
    wrap.dataset.file = file;

    if (resolved) {
      wrap.appendChild(buildItemCard(category, resolved.tier, resolved.item));
    }

    const removeBtn = document.createElement("div");
    removeBtn.className = "build-item-remove-btn";
    removeBtn.dataset.action = "remove-item";
    wrap.appendChild(removeBtn);

    wrap.addEventListener("mouseenter", () => highlightInvestmentContribution(category, file));
    wrap.addEventListener("mouseleave", clearInvestmentHighlight);

    return wrap;
  }

  function addBuildSection() {
    // 276x190 = widthForColumns(3) x heightForRows(1, ~37px header) — a new
    // section starts already snapped to the slot grid (3 columns, 1 row).
    const section = { id: makeId("sec"), name: "New Section", optional: false, items: [], width: 276, height: 190 };
    buildState.sections.push(section);
    saveBuildToStorage(buildState);
    renderBuildSections();
    const titleEl = sectionsContainerEl.querySelector('.build-section[data-section-id="' + section.id + '"] .build-section-title');
    if (titleEl) {
      titleEl.focus();
      document.execCommand("selectAll", false, null);
    }
  }

  function renameBuildSection(id, newName) {
    const section = findSection(id);
    if (!section) return;
    const trimmed = newName.trim();
    section.name = trimmed || section.name;
    saveBuildToStorage(buildState);
    renderBuildSections();
  }

  function deleteBuildSection(id) {
    buildState.sections = buildState.sections.filter((s) => s.id !== id);
    saveBuildToStorage(buildState);
    renderBuildSections();
    updateShopItemUsedState();
    clearInvestmentHighlight();
  }

  function clearAllSections() {
    buildState.sections = [];
    // Clear reads as "start a fresh build" — unlink it from whatever
    // library entry was loaded, so the next Save creates a new entry
    // instead of silently overwriting the one just cleared away.
    buildState.savedBuildId = null;
    openSectionSettingsId = null;
    saveBuildToStorage(buildState);
    renderBuildSections();
    updateShopItemUsedState();
    clearInvestmentHighlight();
    renderSavedBuildsList();
  }

  function setBuildTitle(title) {
    buildState.title = title;
    saveBuildToStorage(buildState);
  }

  // Like clearAllSections, but resets the build's whole identity (title,
  // hero) too, not just its sections — "start a brand new build" rather
  // than "empty out the one I'm on". Unlinks savedBuildId BEFORE writing
  // to storage for the same reason clearAllSections does: so the
  // library entry this build used to be linked to (if any) isn't
  // silently overwritten with the now-blank state.
  function startNewBuild() {
    buildState.sections = [];
    buildState.title = "";
    buildState.hero = null;
    buildState.savedBuildId = null;
    openSectionSettingsId = null;
    saveBuildToStorage(buildState);
    if (buildTitleInputEl) buildTitleInputEl.value = "";
    renderBuildSections();
    updateShopItemUsedState();
    clearInvestmentHighlight();
    renderSavedBuildsList();
  }

  // Builds the "Save Build" confirmation popup once at init — a name
  // field (pre-filled from the current title) and a hero list (using
  // .build-hero-option/.build-hero-option-name markup), so the user can
  // set either right before the snapshot is taken.
  function buildSaveBuildModal() {
    const overlay = document.createElement("div");
    overlay.className = "save-build-modal-overlay";
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeSaveBuildModal();
    });

    const modal = document.createElement("div");
    modal.className = "save-build-modal";
    overlay.appendChild(modal);

    const title = document.createElement("div");
    title.className = "save-build-modal-title";
    title.textContent = "Save Build";
    modal.appendChild(title);

    const nameLabel = document.createElement("label");
    nameLabel.className = "save-build-modal-label";
    nameLabel.textContent = "Build Name";
    modal.appendChild(nameLabel);

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "save-build-name-input";
    nameInput.placeholder = "Unnamed Build";
    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") confirmSaveBuild();
    });
    modal.appendChild(nameInput);
    saveBuildNameInputEl = nameInput;

    const heroLabel = document.createElement("label");
    heroLabel.className = "save-build-modal-label";
    heroLabel.textContent = "Hero";
    modal.appendChild(heroLabel);

    const heroList = document.createElement("div");
    heroList.className = "save-build-hero-list";
    modal.appendChild(heroList);
    saveBuildHeroListEl = heroList;

    const actions = document.createElement("div");
    actions.className = "save-build-modal-actions";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "save-build-cancel-btn";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", closeSaveBuildModal);
    actions.appendChild(cancelBtn);

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "save-build-confirm-btn";
    confirmBtn.textContent = "Save";
    confirmBtn.addEventListener("click", confirmSaveBuild);
    actions.appendChild(confirmBtn);

    modal.appendChild(actions);
    document.body.appendChild(overlay);
    saveBuildModalEl = overlay;

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) closeSaveBuildModal();
    });
  }

  function openSaveBuildModal() {
    if (!saveBuildModalEl) return;
    saveBuildModalHero = buildState.hero;
    saveBuildNameInputEl.value = buildState.title || "";
    renderSaveBuildHeroOptions();
    saveBuildModalEl.classList.add("is-open");
    saveBuildNameInputEl.focus();
  }

  function closeSaveBuildModal() {
    if (saveBuildModalEl) saveBuildModalEl.classList.remove("is-open");
  }

  // Confirmation popup for New Build (see startNewBuild) — same visual
  // shell as the Save Build modal (shares its CSS, see .save-build-modal
  // in style.css) since it's the same "small dialog over the build
  // panel" idea, just a plain confirm/cancel instead of a form.
  function buildNewBuildConfirmModal() {
    const overlay = document.createElement("div");
    overlay.className = "save-build-modal-overlay new-build-confirm-overlay";
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeNewBuildConfirmModal();
    });

    const modal = document.createElement("div");
    modal.className = "save-build-modal new-build-confirm-modal";
    overlay.appendChild(modal);

    const title = document.createElement("div");
    title.className = "save-build-modal-title";
    title.textContent = "Start a New Build?";
    modal.appendChild(title);

    const message = document.createElement("div");
    message.className = "new-build-confirm-message";
    message.textContent = "Your current build is saved in your browser's local storage.";
    modal.appendChild(message);

    const actions = document.createElement("div");
    actions.className = "save-build-modal-actions";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "save-build-cancel-btn";
    cancelBtn.textContent = "Cancel";
    cancelBtn.addEventListener("click", closeNewBuildConfirmModal);
    actions.appendChild(cancelBtn);

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.className = "save-build-confirm-btn";
    confirmBtn.textContent = "Start New Build";
    confirmBtn.addEventListener("click", () => {
      startNewBuild();
      closeNewBuildConfirmModal();
    });
    actions.appendChild(confirmBtn);

    modal.appendChild(actions);
    document.body.appendChild(overlay);
    newBuildConfirmModalEl = overlay;

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) closeNewBuildConfirmModal();
    });
  }

  function openNewBuildConfirmModal() {
    if (newBuildConfirmModalEl) newBuildConfirmModalEl.classList.add("is-open");
  }

  function closeNewBuildConfirmModal() {
    if (newBuildConfirmModalEl) newBuildConfirmModalEl.classList.remove("is-open");
  }

  // Applies the modal's name/hero fields to the canvas, then snapshots it
  // into the library exactly like the old "+ Save Current Build" action
  // did — see saveCurrentBuildToLibrary below.
  function confirmSaveBuild() {
    buildState.title = saveBuildNameInputEl.value.trim();
    buildState.hero = saveBuildModalHero;
    if (buildTitleInputEl) buildTitleInputEl.value = buildState.title;
    saveCurrentBuildToLibrary();
    closeSaveBuildModal();
  }

  function renderSaveBuildHeroOptions() {
    if (!saveBuildHeroListEl) return;
    saveBuildHeroListEl.innerHTML = "";
    HERO_LIST.forEach((hero) => {
      const opt = document.createElement("div");
      opt.className = "build-hero-option" + (saveBuildModalHero === hero.slug ? " is-selected" : "");
      opt.title = hero.name;
      const img = document.createElement("img");
      img.src = "hero_icons/" + hero.file;
      img.alt = hero.name;
      opt.appendChild(img);
      const label = document.createElement("span");
      label.className = "build-hero-option-name";
      label.textContent = hero.name;
      opt.appendChild(label);
      opt.addEventListener("click", () => {
        saveBuildModalHero = hero.slug;
        renderSaveBuildHeroOptions();
      });
      saveBuildHeroListEl.appendChild(opt);
    });
  }

  // Snapshots the current canvas (title/hero/sections) into the saved-
  // builds library, always as a new entry (see the comment just below on
  // why). After saving, the Saved Builds tab jumps to showing this hero's
  // builds so the new save is immediately visible rather than requiring
  // the user to go find it.
  function saveCurrentBuildToLibrary() {
    const name = (buildState.title || "").trim() || "Unnamed Build";
    // Always a new entry — this used to update buildState.savedBuildId's
    // existing entry in place instead, which silently overwrote whatever
    // build had last been saved/loaded any time Save was pressed again
    // (surprising and easy to lose work to). Loading/clearing still update
    // savedBuildId purely for the "is-current" highlight below.
    const id = makeId("build");
    const snapshot = {
      id,
      name,
      hero: buildState.hero,
      sections: JSON.parse(JSON.stringify(buildState.sections)),
      savedAt: Date.now(),
    };
    savedBuilds.push(snapshot);
    buildState.savedBuildId = id;
    saveBuildToStorage(buildState);
    persistSavedBuilds();
    if (snapshot.hero) selectedSavedHeroSlug = snapshot.hero;
    renderSavedBuildsList();
  }

  // Replaces the whole canvas with a saved snapshot — same shape of work
  // as loadBuildFromStorage's initial hydration, just re-running it
  // mid-session against a library entry instead of the last-open build.
  function loadBuildFromLibrary(id) {
    const saved = savedBuilds.find((b) => b.id === id);
    if (!saved) return;
    buildState = {
      version: BUILD_STORAGE_VERSION,
      title: saved.name,
      hero: saved.hero,
      sections: JSON.parse(JSON.stringify(saved.sections)),
      savedBuildId: saved.id,
    };
    saveBuildToStorage(buildState);
    openSectionSettingsId = null;
    if (buildTitleInputEl) buildTitleInputEl.value = buildState.title;
    renderBuildSections();
    updateShopItemUsedState();
    clearInvestmentHighlight();
    renderSavedBuildsList();
    // Loading a build implies wanting to see/edit it — without this,
    // clicking a card while on the Saved Builds tab would load the data
    // but the (still-hidden) sections/investment-bars columns wouldn't
    // become visible, reading as if nothing happened.
    setActiveBuildTab("builds");
  }

  // Removes a snapshot from the library only — the live canvas (even if it
  // was loaded from this same entry) is left exactly as it is, just no
  // longer considered "linked" to a (now-gone) saved entry.
  function deleteBuildFromLibrary(id) {
    savedBuilds = savedBuilds.filter((b) => b.id !== id);
    if (buildState.savedBuildId === id) {
      buildState.savedBuildId = null;
      saveBuildToStorage(buildState);
    }
    persistSavedBuilds();
    renderSavedBuildsList();
  }

  // Entry point for refreshing the whole Saved Builds tab — the portrait
  // grid (every hero, left 2/3) and the panel for whichever hero is
  // currently selected (their saved builds, right 1/3). Called after any
  // change that could affect either (save/delete/load a build, search).
  function renderSavedBuildsList() {
    renderSavedBuildsHeroGrid();
    renderSavedBuildsHeroPanel();
  }

  // One portrait per hero (not just heroes with saved builds — the whole
  // roster is always browsable). Clicking one selects it (or, if it's
  // already selected, deselects it — see selectSavedHero), which drives
  // renderSavedBuildsHeroPanel below. Each portrait also shows: a badge
  // with that hero's saved-build count (hidden entirely at 0, rather than
  // showing "0"), and a dimmed state whenever either the search box has a
  // query this hero has no matching build for, OR some OTHER hero is
  // currently selected — same .is-dimmed class either way (visually
  // identical, opacity 0.5), just two different reasons to apply it.
  function renderSavedBuildsHeroGrid() {
    if (!savedBuildsHeroesEl) return;
    savedBuildsHeroesEl.innerHTML = "";

    const query = savedBuildsSearchQuery.trim().toLowerCase();

    HERO_LIST.forEach((hero) => {
      const heroBuilds = savedBuilds.filter((b) => b.hero === hero.slug);
      const matchesQuery = !query || heroBuilds.some((b) => (b.name || "").toLowerCase().includes(query));
      const isSelected = selectedSavedHeroSlug === hero.slug;
      const dimmedByOtherSelection = !!selectedSavedHeroSlug && !isSelected;

      const portrait = document.createElement("div");
      portrait.className =
        "saved-builds-hero-portrait" +
        (isSelected ? " is-selected" : "") +
        (!matchesQuery || dimmedByOtherSelection ? " is-dimmed" : "");
      portrait.title = hero.name;
      portrait.addEventListener("click", () => selectSavedHero(hero.slug));

      const img = document.createElement("img");
      img.src = "hero_icons/" + hero.file;
      img.alt = hero.name;
      portrait.appendChild(img);

      if (heroBuilds.length) {
        const badge = document.createElement("div");
        badge.className = "saved-builds-hero-badge";
        badge.textContent = String(heroBuilds.length);
        portrait.appendChild(badge);
      }

      savedBuildsHeroesEl.appendChild(portrait);
    });
  }

  // Selects which hero's builds renderSavedBuildsHeroPanel shows —
  // clicking the already-selected hero deselects instead (toggle, not a
  // one-way pick). Re-renders the whole grid (not just the clicked
  // portrait's own selection highlight) since every OTHER portrait's
  // dimmed state also depends on whether a selection exists now.
  function selectSavedHero(slug) {
    selectedSavedHeroSlug = selectedSavedHeroSlug === slug ? null : slug;
    renderSavedBuildsList();
  }

  // The right-hand list for whichever hero is selected (name + delete per
  // build, filtered by the search box same as the old flat list was).
  // Click loads that build; the small delete control removes it from the
  // library without touching whatever's currently on the canvas.
  function renderSavedBuildsHeroPanel() {
    if (!savedBuildsHeroPanelEl) return;
    savedBuildsHeroPanelEl.innerHTML = "";

    if (!selectedSavedHeroSlug) {
      const empty = document.createElement("div");
      empty.className = "saved-builds-empty";
      empty.textContent = "Select a hero to view their saved builds";
      savedBuildsHeroPanelEl.appendChild(empty);
      return;
    }

    const hero = HERO_LIST.find((h) => h.slug === selectedSavedHeroSlug);

    const header = document.createElement("div");
    header.className = "saved-builds-hero-panel-header";
    const headerName = document.createElement("div");
    headerName.className = "saved-builds-hero-panel-name";
    const logoImg = document.createElement("img");
    logoImg.src = heroLogoFile(hero);
    logoImg.alt = hero.name;
    headerName.appendChild(logoImg);
    header.appendChild(headerName);
    savedBuildsHeroPanelEl.appendChild(header);

    let heroBuilds = savedBuilds.filter((b) => b.hero === selectedSavedHeroSlug);
    const query = savedBuildsSearchQuery.trim().toLowerCase();
    if (query) heroBuilds = heroBuilds.filter((b) => (b.name || "").toLowerCase().includes(query));

    if (!heroBuilds.length) {
      const empty = document.createElement("div");
      empty.className = "saved-builds-empty";
      empty.textContent = query
        ? "No builds match \"" + savedBuildsSearchQuery.trim() + "\""
        : "No saved builds for " + hero.name + " yet";
      savedBuildsHeroPanelEl.appendChild(empty);
      return;
    }

    const list = document.createElement("div");
    list.className = "saved-builds-hero-build-list";
    heroBuilds
      .slice()
      .sort((a, b) => b.savedAt - a.savedAt)
      .forEach((saved) => {
        const row = document.createElement("div");
        row.className = "saved-builds-hero-build-row" + (buildState.savedBuildId === saved.id ? " is-current" : "");
        row.title = saved.name;

        const miniIcon = document.createElement("img");
        miniIcon.className = "saved-builds-hero-build-mini-icon";
        miniIcon.src = heroMiniFile(hero);
        miniIcon.alt = "";
        row.appendChild(miniIcon);

        const name = document.createElement("span");
        name.className = "saved-builds-hero-build-name";
        name.textContent = saved.name;
        row.appendChild(name);

        const date = document.createElement("span");
        date.className = "saved-builds-hero-build-date";
        date.textContent = new Date(saved.savedAt).toLocaleDateString("en-US");
        row.appendChild(date);

        const deleteBtn = document.createElement("div");
        deleteBtn.className = "saved-builds-hero-build-delete";
        deleteBtn.title = "Delete";
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          deleteBuildFromLibrary(saved.id);
        });
        row.appendChild(deleteBtn);

        row.addEventListener("click", () => loadBuildFromLibrary(saved.id));
        list.appendChild(row);
      });
    savedBuildsHeroPanelEl.appendChild(list);
  }

  function toggleSectionOptional(id) {
    const section = findSection(id);
    if (!section) return;
    section.optional = !section.optional;
    saveBuildToStorage(buildState);
    renderBuildSections();
  }

  function setSectionColor(id, color) {
    const section = findSection(id);
    if (!section) return;
    section.color = color;
    saveBuildToStorage(buildState);
    renderBuildSections();
  }

  // Only one section's settings dropdown is open at a time. The open id is
  // ambient UI state (not part of buildState/localStorage) that survives
  // renderBuildSections() rebuilding the section DOM — buildSectionEl
  // re-applies .is-open to whichever section matches this id, so toggling
  // the "Optional" checkbox or picking a color (both of which trigger a
  // full re-render) doesn't visually close the dropdown out from under
  // the user mid-interaction.
  function openSectionSettingsDropdown(id) {
    openSectionSettingsId = id;
    const dropdown = sectionsContainerEl.querySelector('.build-section[data-section-id="' + id + '"] .build-section-settings-dropdown');
    if (dropdown) dropdown.classList.add("is-open");
  }

  function closeSectionSettingsDropdown() {
    if (!openSectionSettingsId) return;
    const dropdown = sectionsContainerEl.querySelector(
      '.build-section[data-section-id="' + openSectionSettingsId + '"] .build-section-settings-dropdown'
    );
    if (dropdown) dropdown.classList.remove("is-open");
    openSectionSettingsId = null;
  }

  // toIndex is "insert before this position in the array as it stood
  // before removal" — since removing fromIndex shifts everything after it
  // back by one, that needs correcting before the insert when moving a
  // section rightward (same subtlety as moveItemInBuild below).
  function reorderSections(fromIndex, toIndex) {
    if (fromIndex < 0 || toIndex < 0) return;
    let insertAt = toIndex;
    if (fromIndex < insertAt) insertAt -= 1;
    if (fromIndex === insertAt) return;
    const [moved] = buildState.sections.splice(fromIndex, 1);
    buildState.sections.splice(insertAt, 0, moved);
    saveBuildToStorage(buildState);
    renderBuildSections();
  }

  function resizeSection(id, width, height) {
    const section = findSection(id);
    if (!section) return;
    section.width = width;
    section.height = height;
    saveBuildToStorage(buildState);
  }

  function addItemToBuild(sectionId, category, file, atIndex) {
    if (getPlacedItemKeys(buildState).has(category + ":" + file)) return;
    const section = findSection(sectionId);
    if (!section) return;
    const index = atIndex == null || atIndex > section.items.length ? section.items.length : atIndex;
    section.items.splice(index, 0, { category, file });
    saveBuildToStorage(buildState);
    renderBuildSections();
    updateShopItemUsedState();
  }

  // "Add Item" badge on a shop-grid card — adds to whichever section is
  // last in the list (i.e. the most recently added one), matching the
  // user-facing convention "section two if there are two sections".
  // No-op if there are no sections yet, same as any other guarded no-op
  // in this file rather than silently creating one on the user's behalf.
  function addItemToLastSection(category, file) {
    if (!buildState.sections.length) return;
    const lastSection = buildState.sections[buildState.sections.length - 1];
    addItemToBuild(lastSection.id, category, file, null);
  }

  function moveItemInBuild(fromSectionId, fromIndex, toSectionId, toIndex) {
    const fromSection = findSection(fromSectionId);
    const toSection = findSection(toSectionId);
    if (!fromSection || !toSection) return;
    const [moved] = fromSection.items.splice(fromIndex, 1);
    if (!moved) return;
    let insertAt = toIndex;
    // Removing from the same array before inserting shifts indices after
    // the removal point back by one, so the target index needs adjusting
    // when reordering within a single section.
    if (fromSection === toSection && fromIndex < insertAt) insertAt -= 1;
    if (insertAt == null || insertAt > toSection.items.length) insertAt = toSection.items.length;
    toSection.items.splice(insertAt, 0, moved);
    saveBuildToStorage(buildState);
    renderBuildSections();
  }

  function removeItemFromBuild(sectionId, index) {
    const section = findSection(sectionId);
    if (!section) return;
    section.items.splice(index, 1);
    saveBuildToStorage(buildState);
    renderBuildSections();
    updateShopItemUsedState();
    // The removed card's mouseleave never fires (it's gone from the DOM
    // before the mouse actually moves off it), which otherwise left a
    // stale .is-highlighted overlay glowing on the bar for a tier range
    // that no longer corresponds to any placed item.
    clearInvestmentHighlight();
  }

  function updateShopItemUsedState() {
    const used = getPlacedItemKeys(buildState);
    document.querySelectorAll("#shop-panels .mod-box").forEach((card) => {
      const isUsed = used.has(card.dataset.category + ":" + card.dataset.file);
      card.classList.toggle("used", isUsed);
      card.draggable = !isUsed;
    });
  }

  function computeItemInsertionIndex(containerEl, clientX, clientY) {
    const cards = [].slice.call(containerEl.querySelectorAll(":scope > .build-item-card"));
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      const rowMatch = clientY >= rect.top && clientY <= rect.bottom;
      if (rowMatch && clientX < rect.left + rect.width / 2) return i;
      if (!rowMatch && clientY < rect.top) return i;
    }
    return cards.length;
  }

  function showBuildSlotPlaceholder(containerEl, atIndex) {
    hideBuildSlotPlaceholder();
    const placeholder = document.createElement("div");
    placeholder.className = "build-slot-placeholder";
    placeholder.dataset.placeholder = "1";
    const cards = [].slice.call(containerEl.querySelectorAll(":scope > .build-item-card"));
    if (atIndex >= cards.length) {
      containerEl.appendChild(placeholder);
    } else {
      containerEl.insertBefore(placeholder, cards[atIndex]);
    }
  }

  function hideBuildSlotPlaceholder() {
    const existing = sectionsContainerEl && sectionsContainerEl.querySelector(".build-slot-placeholder");
    if (existing) existing.remove();
  }

  // Section-reorder insertion index is computed from a snapshot of the
  // OTHER sections' positions taken once at dragstart (dragPayload.
  // otherSectionRects), not by re-querying live rects on every dragover.
  // Re-querying live would measure positions AFTER the preview placeholder
  // has already been inserted and shifted everything past it — so the
  // very act of showing the preview at index i could make the next
  // dragover compute a different index than i, and the index used at
  // drop time (also live-queried, after however many preview shuffles
  // happened) could end up not matching what was actually shown,
  // requiring the user to overshoot past it to get a drop to register.
  // Coordinates are stored/compared in document space (rect + scroll
  // offset) rather than viewport space, so this also stays correct if
  // the page auto-scrolls mid-drag.
  function computeSectionInsertionIndexFromSnapshot(clientX, clientY) {
    if (!dragPayload || !dragPayload.otherSectionRects) return 0;
    const docX = clientX + window.scrollX;
    const docY = clientY + window.scrollY;
    for (const entry of dragPayload.otherSectionRects) {
      const rowMatch = docY >= entry.top && docY <= entry.bottom;
      if (rowMatch && docX < entry.left + entry.width / 2) return entry.index;
      if (!rowMatch && docY < entry.top) return entry.index;
    }
    return dragPayload.totalSectionCount;
  }

  // Only actually touches the DOM when the target index changes — a real
  // mouse drag fires dragover dozens of times a second, and re-inserting
  // the placeholder on every single one (even while sitting over the same
  // spot) means constant layout churn: it feels sluggish, and worse, it
  // creates a window on every single frame where the element under the
  // cursor is mid-shuffle, which is exactly when a drop can land on the
  // wrong thing (or nothing at all) and get silently rejected.
  function showSectionReorderPreview(atIndex, width, height) {
    if (atIndex === lastSectionPreviewIndex) return;
    lastSectionPreviewIndex = atIndex;
    const sections = [].slice.call(sectionsContainerEl.querySelectorAll(":scope > .build-section"));
    let preview = sectionsContainerEl.querySelector(".build-section-reorder-preview");
    if (!preview) {
      preview = document.createElement("div");
      preview.className = "build-section-reorder-preview";
      preview.dataset.reorderPreview = "1";
    }
    preview.style.width = width + "px";
    preview.style.height = height + "px";
    if (atIndex >= sections.length) {
      sectionsContainerEl.appendChild(preview);
    } else {
      sectionsContainerEl.insertBefore(preview, sections[atIndex]);
    }
  }

  function hideSectionReorderPreview() {
    lastSectionPreviewIndex = null;
    const existing = sectionsContainerEl && sectionsContainerEl.querySelector(".build-section-reorder-preview");
    if (existing) existing.remove();
  }

  // Resizing is a plain pointer drag (not native DnD like everything
  // else here) — mousedown on the handle captures the section's starting
  // size, then document-level mousemove/mouseup track the gesture since
  // the pointer will move outside the handle itself while dragging.
  // Section width/height snap to whatever size holds a whole number of
  // item columns/rows — these convert between "N columns/rows" and the
  // exact pixel size that fits them (inverses of each other).
  function widthForColumns(n) {
    n = Math.max(1, n);
    return 2 * SECTION_BORDER + 2 * ITEMS_PADDING + n * ITEM_SLOT_W + (n - 1) * ITEM_SLOT_GAP;
  }

  function columnsForWidth(px) {
    const usable = px - 2 * SECTION_BORDER - 2 * ITEMS_PADDING + ITEM_SLOT_GAP;
    return Math.max(1, Math.round(usable / (ITEM_SLOT_W + ITEM_SLOT_GAP)));
  }

  function heightForRows(n, headerHeight) {
    n = Math.max(1, n);
    return 2 * SECTION_BORDER + headerHeight + 2 * ITEMS_PADDING + n * ITEM_SLOT_H + (n - 1) * ITEM_SLOT_GAP;
  }

  function rowsForHeight(px, headerHeight) {
    const usable = px - 2 * SECTION_BORDER - headerHeight - 2 * ITEMS_PADDING + ITEM_SLOT_GAP;
    return Math.max(1, Math.round(usable / (ITEM_SLOT_H + ITEM_SLOT_GAP)));
  }

  function startSectionResize(e, handleEl) {
    const sectionEl = handleEl.closest(".build-section");
    if (!sectionEl) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    // .build-sections-container (sectionEl's ancestor) is transform:scale'd
    // — see its CSS — so getBoundingClientRect() here returns RENDERED
    // (post-scale) pixels, while widthForColumns/heightForRows and
    // whatever resizeSection ultimately saves are all in NATIVE
    // (pre-scale) design-space pixels, the same space section.width/
    // height are always interpreted in elsewhere (buildSectionEl applies
    // them as literal inline styles read back into this same scaled
    // container). Mixing the two used to save a rendered-pixel value as
    // if it were native — harmless-looking at ~100% scale (a couple px
    // off) but a real, visible jump at any other scale — so everything
    // below is measured/computed in rendered pixels only for the parts
    // that must be (mouse deltas), then divided by scale before it ever
    // reaches the native-unit column/row math.
    const scale = sectionsContainerEl.getBoundingClientRect().width / sectionsContainerEl.offsetWidth;
    const startRect = sectionEl.getBoundingClientRect();
    const headerEl = sectionEl.querySelector(".build-section-header");
    const headerHeight = headerEl.getBoundingClientRect().height / scale;

    function onMouseMove(moveEvent) {
      // Self-heals a resize session whose mouseup never reached this
      // document (e.g. the button was released outside the browser
      // window, or focus left mid-drag) — moveEvent.buttons reflects
      // which buttons are ACTUALLY held right now, regardless of where
      // they were released, so a leftover, never-cleaned-up listener
      // stops itself on the very next mouse movement instead of staying
      // stuck and resizing the section again the next time the mouse
      // happens to move (e.g. double-clicking the section title).
      if (moveEvent.buttons !== 1) {
        onMouseUp();
        return;
      }
      const rawWidth = (startRect.width + (moveEvent.clientX - startX)) / scale;
      const rawHeight = (startRect.height + (moveEvent.clientY - startY)) / scale;
      const snappedWidth = widthForColumns(columnsForWidth(rawWidth));
      const snappedHeight = heightForRows(rowsForHeight(rawHeight, headerHeight), headerHeight);
      sectionEl.style.width = snappedWidth + "px";
      sectionEl.style.minHeight = snappedHeight + "px";
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("blur", onMouseUp);
      // Read back the native-unit values onMouseMove already computed
      // and applied as inline styles (or, if the mouse never moved, the
      // section's pre-existing native size) — not another
      // getBoundingClientRect(), which would reintroduce the same
      // rendered-vs-native mismatch this whole function exists to avoid.
      resizeSection(sectionEl.dataset.sectionId, parseFloat(sectionEl.style.width), parseFloat(sectionEl.style.minHeight));
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    // Covers the case where the window loses focus mid-drag (e.g.
    // alt-tab) with no further mousemove ever reaching this document to
    // trigger the buttons-check above.
    window.addEventListener("blur", onMouseUp);
  }

  function handleSectionsClick(e) {
    const deleteBtn = e.target.closest('[data-action="delete-section"]');
    if (deleteBtn) {
      const section = deleteBtn.closest(".build-section");
      if (section) deleteBuildSection(section.dataset.sectionId);
      return;
    }
    const optionalBtn = e.target.closest('[data-action="toggle-optional"]');
    if (optionalBtn) {
      const section = optionalBtn.closest(".build-section");
      if (section) toggleSectionOptional(section.dataset.sectionId);
      return;
    }
    const settingsBtn = e.target.closest('[data-action="toggle-section-settings"]');
    if (settingsBtn) {
      const section = settingsBtn.closest(".build-section");
      if (section) {
        const id = section.dataset.sectionId;
        if (openSectionSettingsId === id) closeSectionSettingsDropdown();
        else openSectionSettingsDropdown(id);
      }
      return;
    }
    const colorSwatch = e.target.closest('[data-action="set-section-color"]');
    if (colorSwatch) {
      const section = colorSwatch.closest(".build-section");
      if (section) setSectionColor(section.dataset.sectionId, colorSwatch.dataset.color);
      return;
    }
    const removeBtn = e.target.closest('[data-action="remove-item"]');
    if (removeBtn) {
      const itemCard = removeBtn.closest(".build-item-card");
      const section = removeBtn.closest(".build-section");
      if (itemCard && section) {
        const items = [].slice.call(section.querySelectorAll(".build-section-items > .build-item-card"));
        removeItemFromBuild(section.dataset.sectionId, items.indexOf(itemCard));
      }
    }
  }

  function handleSectionsFocusOut(e) {
    const title = e.target.closest(".build-section-title");
    if (!title) return;
    const section = title.closest(".build-section");
    if (section) renameBuildSection(section.dataset.sectionId, title.textContent);
  }

  function handleSectionsKeyDown(e) {
    if (e.key !== "Enter") return;
    const title = e.target.closest(".build-section-title");
    if (!title) return;
    e.preventDefault();
    title.blur();
  }

  function handleSectionsMouseDown(e) {
    const handle = e.target.closest('[data-action="resize-section"]');
    if (handle) startSectionResize(e, handle);
  }

  function handleSectionsDragStart(e) {
    const handle = e.target.closest('[data-drag-handle="1"]');
    if (handle) {
      const section = handle.closest(".build-section");
      const allSections = [].slice.call(sectionsContainerEl.querySelectorAll(":scope > .build-section"));
      const index = allSections.indexOf(section);
      const rect = section.getBoundingClientRect();
      // Snapshot every OTHER section's position now, before the reorder
      // preview placeholder can ever be inserted and shift them — see
      // computeSectionInsertionIndexFromSnapshot for why this has to be
      // captured once up front rather than re-measured live.
      const otherSectionRects = [];
      allSections.forEach((el, i) => {
        if (i === index) return;
        const r = el.getBoundingClientRect();
        otherSectionRects.push({
          index: i,
          top: r.top + window.scrollY,
          bottom: r.bottom + window.scrollY,
          left: r.left + window.scrollX,
          width: r.width,
        });
      });
      dragPayload = {
        source: "section",
        sectionId: section.dataset.sectionId,
        index,
        width: rect.width,
        height: rect.height,
        otherSectionRects,
        totalSectionCount: allSections.length,
      };
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", section.dataset.sectionId);
      return;
    }
    const itemCard = e.target.closest(".build-item-card");
    if (itemCard) {
      const section = itemCard.closest(".build-section");
      const items = [].slice.call(section.querySelectorAll(".build-section-items > .build-item-card"));
      dragPayload = {
        source: "build",
        sectionId: section.dataset.sectionId,
        index: items.indexOf(itemCard),
        category: itemCard.dataset.category,
        file: itemCard.dataset.file,
      };
      itemCard.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", itemCard.dataset.file);
    }
  }

  function handleSectionsDragOver(e) {
    if (!dragPayload) return;
    if (dragPayload.source === "section") {
      // Checked against shopBuildsEl (the whole panel), not
      // sectionsContainerEl — that box is tightly fitted around the
      // sections themselves with no padding of its own, so a cursor
      // drifting into the gap/padding around them (easy to do when
      // dragging toward the very front of the row) would otherwise never
      // get preventDefault() called, and the browser would reject the
      // drop and snap the drag back instead of reordering.
      if (!shopBuildsEl.contains(e.target)) return;
      e.preventDefault();
      const index = computeSectionInsertionIndexFromSnapshot(e.clientX, e.clientY);
      showSectionReorderPreview(index, dragPayload.width, dragPayload.height);
      return;
    }
    const itemsEl = e.target.closest(".build-section-items");
    if (!itemsEl) return;
    e.preventDefault();
    const index = computeItemInsertionIndex(itemsEl, e.clientX, e.clientY);
    showBuildSlotPlaceholder(itemsEl, index);
  }

  function handleSectionsDragLeave(e) {
    const itemsEl = e.target.closest(".build-section-items");
    if (itemsEl && !itemsEl.contains(e.relatedTarget)) hideBuildSlotPlaceholder();
    if (dragPayload && dragPayload.source === "section" && !shopBuildsEl.contains(e.relatedTarget)) {
      hideSectionReorderPreview();
    }
  }

  function handleSectionsDrop(e) {
    if (!dragPayload) return;
    if (dragPayload.source === "section") {
      e.preventDefault();
      const toIndex = computeSectionInsertionIndexFromSnapshot(e.clientX, e.clientY);
      hideSectionReorderPreview();
      reorderSections(dragPayload.index, toIndex);
      dragPayload = null;
      return;
    }

    const itemsEl = e.target.closest(".build-section-items");
    hideBuildSlotPlaceholder();
    if (!itemsEl) {
      dragPayload = null;
      return;
    }
    e.preventDefault();
    const targetSection = itemsEl.closest(".build-section");
    const toIndex = computeItemInsertionIndex(itemsEl, e.clientX, e.clientY);

    if (dragPayload.source === "shop") {
      addItemToBuild(targetSection.dataset.sectionId, dragPayload.category, dragPayload.file, toIndex);
    } else if (dragPayload.source === "build") {
      moveItemInBuild(dragPayload.sectionId, dragPayload.index, targetSection.dataset.sectionId, toIndex);
    }
    dragPayload = null;
  }

  // Auto-scrolls the page while dragging an item/section near the top or
  // bottom edge of the viewport, so a section below the fold (or the shop
  // grid above it) can be reached without letting go mid-drag. Listens on
  // document (not sectionsContainerEl/shopEl individually) since dragover
  // bubbles from wherever the cursor currently is, and this needs to keep
  // working across the whole page regardless of which element that is.
  const AUTO_SCROLL_EDGE = 90; // px from the viewport edge that starts scrolling
  const AUTO_SCROLL_MAX_SPEED = 22; // px per frame right at the very edge

  function handleGlobalDragOver(e) {
    if (!dragPayload) return;
    const y = e.clientY;
    const vh = window.innerHeight;
    let speed = 0;
    if (y < AUTO_SCROLL_EDGE) {
      speed = -AUTO_SCROLL_MAX_SPEED * (1 - y / AUTO_SCROLL_EDGE);
    } else if (y > vh - AUTO_SCROLL_EDGE) {
      speed = AUTO_SCROLL_MAX_SPEED * (1 - (vh - y) / AUTO_SCROLL_EDGE);
    }
    autoScrollSpeed = speed;
    if (speed !== 0 && autoScrollRAF === null) {
      autoScrollRAF = requestAnimationFrame(autoScrollStep);
    }
  }

  function autoScrollStep() {
    if (autoScrollSpeed !== 0 && dragPayload) {
      window.scrollBy(0, autoScrollSpeed);
      autoScrollRAF = requestAnimationFrame(autoScrollStep);
    } else {
      autoScrollRAF = null;
    }
  }

  function stopAutoScroll() {
    autoScrollSpeed = 0;
    if (autoScrollRAF !== null) {
      cancelAnimationFrame(autoScrollRAF);
      autoScrollRAF = null;
    }
  }

  // Browsers suppress normal wheel-scrolling while a native drag session is
  // active, so this takes over scrolling manually whenever one of our own
  // drags (item or section) is in progress.
  function handleGlobalWheel(e) {
    if (!dragPayload) return;
    e.preventDefault();
    window.scrollBy(0, e.deltaY);
  }

  function setupDragAutoScroll() {
    document.addEventListener("dragover", handleGlobalDragOver);
    document.addEventListener("drop", stopAutoScroll);
    document.addEventListener("dragend", stopAutoScroll);
    document.addEventListener("wheel", handleGlobalWheel, { passive: false });
  }

  function syncTooltipDisplayHeight() {
    const ro = new ResizeObserver((entries) => {
      const h = entries[0].contentRect.height;
      if (h > 0) {
        document.documentElement.style.setProperty("--tooltip-display-h", h + "px");
      }
    });
    ro.observe(shopEl);
  }

  // Keeps .shop-builds' left/right edges aligned with #shop-panels and
  // .tooltip-display combined (i.e. everything except .category-tabs),
  // since that combined region isn't a single element we can just copy
  // width/position from — it has to be measured and kept in sync as the
  // panels/tooltip-display scale with the viewport.
  function syncShopBuildsAlignment() {
    if (!shopBuildsEl) return;
    function update() {
      const panelsRect = shopEl.getBoundingClientRect();
      const tooltipRect = tooltipDisplayEl.getBoundingClientRect();
      const width = tooltipRect.right - panelsRect.left;
      if (width > 0) {
        const marginLeft = panelsRect.left + window.scrollX + "px";
        shopBuildsEl.style.width = width + "px";
        // Exposes #shop-builds' own actual rendered width for CSS to
        // compute a scale ratio from (see --shop-builds-w/-native-w in
        // style.css) — used by .build-tabs to scale in step with
        // #shop-builds, the same way --tooltip-display-h already lets
        // .category-tabs scale in step with #shop-panels.
        document.documentElement.style.setProperty("--shop-builds-w", width + "px");
        // Margin-left moved to the wrapper (rather than #shop-builds
        // itself) so .build-tabs — a sibling of #shop-builds inside that
        // wrapper, positioned via right:100% — has a correctly-positioned
        // containing block to measure against. #shop-builds itself is a
        // plain block child with no margin of its own now (see
        // .shop-builds-wrap in style.css), so it still lands at the exact
        // same final x position either way.
        if (shopBuildsWrapEl) shopBuildsWrapEl.style.marginLeft = marginLeft;
        if (shopGraphsEl) {
          shopGraphsEl.style.width = width + "px";
          shopGraphsEl.style.marginLeft = marginLeft;
        }
      }
      // .shop-builds-inner's width (and therefore .build-sections-container's
      // scale factor, and .shop-builds-right's own width, which
      // updateInvestmentBarsContentScale's width cap depends on) changes
      // right along with this, so everything downstream needs recomputing
      // too. Content scale must run before its own viewport height sync,
      // since that reads the content's just-updated rendered size.
      updateBuildSectionsViewportHeight();
      updateInvestmentBarsContentScale();
      updateInvestmentBarsViewportHeight();
      updateInvestmentBarsTopAlign();
      updateAddSectionBtnAvailability();
    }
    const ro = new ResizeObserver(update);
    ro.observe(shopEl);
    ro.observe(tooltipDisplayEl);
    window.addEventListener("resize", update);
    update();
  }

  // Keeps .site-header-credit's right edge aligned with .tooltip-display's
  // own right edge — .tooltip-display sits inside the centered
  // .shop-layout flex row, so its right edge isn't a fixed offset from
  // the page edge and has to be measured and kept in sync as the layout
  // scales with the viewport, same rationale as syncShopBuildsAlignment
  // above (just a single edge instead of a whole width/position).
  function syncHeaderCreditAlignment() {
    const creditEl = document.querySelector(".site-header-credit");
    const headerEl = document.querySelector(".site-header");
    if (!creditEl || !headerEl || !tooltipDisplayEl) return;
    function update() {
      const headerRect = headerEl.getBoundingClientRect();
      const tooltipRect = tooltipDisplayEl.getBoundingClientRect();
      const right = headerRect.right - tooltipRect.right;
      creditEl.style.right = right + "px";
    }
    const ro = new ResizeObserver(update);
    ro.observe(headerEl);
    ro.observe(tooltipDisplayEl);
    window.addEventListener("resize", update);
    update();
  }

  // .build-sections-container is a fixed-native-width, transform:scale'd
  // block (same technique as .tier-grid) so build content shrinks
  // proportionally with the shop grid — but unlike .tier-grid, its height
  // isn't a fixed design constant (arbitrary number/size of sections), so
  // .build-sections-viewport's height has to be measured from the actual
  // rendered (post-transform) box and applied explicitly, the same way
  // syncTooltipDisplayHeight measures #shop-panels.
  function updateBuildSectionsViewportHeight() {
    if (!buildSectionsViewportEl || !sectionsContainerEl) return;
    const h = sectionsContainerEl.getBoundingClientRect().height;
    buildSectionsViewportEl.style.height = h + "px";
  }

  // Predicts whether one more default-size section would still fit inside
  // .shop-builds' SHOP_BUILDS_MAX_HEIGHT cap, so Add Section can be
  // disabled *before* a new section would silently get clipped by that
  // cap rather than after. Reads the already-laid-out DOM (which row
  // existing sections wrapped into, how much width is left in it)
  // instead of re-implementing flex-wrap's own packing algorithm.
  function updateAddSectionBtnAvailability() {
    if (!addSectionBtnEl || !shopBuildsEl || !sectionsContainerEl) return;
    const scale = sectionsContainerEl.offsetWidth ? sectionsContainerEl.getBoundingClientRect().width / sectionsContainerEl.offsetWidth : 1;
    const sections = Array.from(sectionsContainerEl.querySelectorAll(".build-section"));

    let addsNewRow;
    let rowGrowthNative;
    if (!sections.length) {
      // First section ever — nothing to wrap against, just grows from ~0.
      addsNewRow = true;
      rowGrowthNative = DEFAULT_SECTION_ROW_H;
    } else {
      let lastRowTop = -Infinity;
      sections.forEach((s) => {
        lastRowTop = Math.max(lastRowTop, Math.round(s.getBoundingClientRect().top));
      });
      const lastRow = sections.filter((s) => Math.round(s.getBoundingClientRect().top) === lastRowTop);
      const lastRowRight = Math.max(...lastRow.map((s) => s.getBoundingClientRect().right));
      const containerRight = sectionsContainerEl.getBoundingClientRect().right;
      const neededWidth = (DEFAULT_SECTION_ROW_W + SECTIONS_ROW_GAP) * scale;
      addsNewRow = containerRight - lastRowRight < neededWidth;
      rowGrowthNative = SECTIONS_ROW_GAP + DEFAULT_SECTION_ROW_H;
    }

    // Computed directly from .shop-builds-inner's padding/gap + its
    // children's own rects, rather than read off shopBuildsEl's own rect
    // — that outer box's height depends on .build-sections-viewport and
    // .investment-bars-viewport, both of which are synced by a
    // ResizeObserver (necessarily async) and would otherwise still
    // reflect the PREVIOUS render for one tick, undercounting height
    // across several adds in a row with no repaint in between.
    //
    // .build-section-actions-row is now a full-width header shared ABOVE
    // both columns (not just inside .shop-builds-left the way it used to
    // be), so its height/gap apply once, on top of whichever column ends
    // up taller — not added only to the left column's own total the way
    // the old single-column layout needed.
    if (!sectionActionsRowEl) return;
    const innerEl = shopBuildsEl.querySelector(".shop-builds-inner");
    if (!innerEl) return;
    const innerCs = getComputedStyle(innerEl);
    const paddingV = parseFloat(innerCs.paddingTop) + parseFloat(innerCs.paddingBottom);
    const headerGap = parseFloat(innerCs.rowGap) || 0;
    const actionsRowH = sectionActionsRowEl.getBoundingClientRect().height;
    const sectionsH = sectionsContainerEl.getBoundingClientRect().height;
    const rightColH = shopBuildsRightEl ? shopBuildsRightEl.getBoundingClientRect().height : 0;

    const columnsH = Math.max(sectionsH, rightColH);
    const currentHeight = paddingV + actionsRowH + headerGap + columnsH;
    const projectedHeight = currentHeight + (addsNewRow ? rowGrowthNative * scale : 0);
    addSectionBtnEl.disabled = projectedHeight > SHOP_BUILDS_MAX_HEIGHT;
  }

  function syncBuildSectionsScale() {
    if (!sectionsContainerEl) return;
    const ro = new ResizeObserver(() => {
      updateBuildSectionsViewportHeight();
      updateInvestmentBarsContentScale();
      updateInvestmentBarsViewportHeight();
      updateAddSectionBtnAvailability();
    });
    ro.observe(sectionsContainerEl);
    updateBuildSectionsViewportHeight();
  }

  // Solves for whatever scale makes .investment-bars-content's rendered
  // height match a fixed "2 full rows of default-size sections" target
  // (TWO_ROW_SECTIONS_NATIVE_H, scaled down in lockstep with the sections
  // beside it), once the panel's own non-scaling chrome (header +
  // .investment-bars-body padding + the panel's border) is accounted for
  // — see the CSS comment on .investment-bars-content for why a plain
  // cqw-based scale can't do this on its own. The target is locked to
  // that fixed reference rather than measured from
  // .build-sections-container's actual current height, so the panel
  // stays exactly this size regardless of how many rows of sections are
  // actually present — including a 3rd row, or a single section resized
  // taller than 2 rows — rather than growing to match them.
  // offsetWidth/offsetHeight (not getBoundingClientRect) give the
  // content's NATIVE pre-transform size, since CSS transforms don't
  // affect layout box size the way they affect the painted rect.
  function updateInvestmentBarsContentScale() {
    if (!investmentBarsContentEl || !investmentBarsEl || !sectionsContainerEl) return;
    const headerEl = investmentBarsEl.querySelector(".investment-bars-header");
    const bodyEl = investmentBarsEl.querySelector(".investment-bars-body");
    if (!headerEl || !bodyEl) return;
    const headerH = headerEl.getBoundingClientRect().height;
    const bodyCs = getComputedStyle(bodyEl);
    const panelCs = getComputedStyle(investmentBarsEl);
    const chromeH = headerH + parseFloat(bodyCs.paddingTop) + parseFloat(bodyCs.paddingBottom) + parseFloat(panelCs.borderTopWidth) + parseFloat(panelCs.borderBottomWidth);
    const chromeW = parseFloat(bodyCs.paddingLeft) + parseFloat(bodyCs.paddingRight) + parseFloat(panelCs.borderLeftWidth) + parseFloat(panelCs.borderRightWidth);

    const nativeContentH = investmentBarsContentEl.offsetHeight;
    const nativeContentW = investmentBarsContentEl.offsetWidth;
    if (!nativeContentH || !nativeContentW) return;

    // Native-to-rendered scale of .build-sections-container itself (same
    // technique as startSectionResize) — used to convert the fixed "2 full
    // rows" target into the same rendered-pixel space as the sections
    // beside it, so it shrinks/grows right along with them instead of
    // staying pinned at a fixed pixel size.
    const sectionsScale = sectionsContainerEl.offsetWidth ? sectionsContainerEl.getBoundingClientRect().width / sectionsContainerEl.offsetWidth : 1;
    const targetH = TWO_ROW_SECTIONS_NATIVE_H * sectionsScale;
    const scaleY = Math.max(0, targetH - chromeH) / nativeContentH;
    const availableW = investmentBarsEl.getBoundingClientRect().width - chromeW;
    const scaleX = Math.max(0, availableW) / nativeContentW;
    const scale = Math.min(1, scaleY, scaleX);

    investmentBarsContentEl.style.transform = "scale(" + scale + ")";
  }

// Same technique as updateBuildSectionsViewportHeight/syncBuildSectionsScale,
  // applied to .investment-bars-content (also a fixed-native-width,
  // transform:scale'd block — see the CSS comment on it — but unlike the
  // build sections, its native size is a fixed design constant rather
  // than content-driven, so this could in principle use a CSS
  // aspect-ratio instead; kept as a ResizeObserver for consistency with
  // the rest of the site's scaling widgets and in case future content
  // varies its size). Sets both width and height (not just height, unlike
  // the build-sections case) since .investment-bars-content can also
  // shrink narrower than its native width now that .investment-bars — the
  // panel around it — stretches wider than that native width; the
  // reserved viewport box needs to match its actual rendered footprint so
  // .investment-bars' justify-content:center centers it correctly.
  function updateInvestmentBarsViewportHeight() {
    if (!investmentBarsViewportEl || !investmentBarsContentEl) return;
    const r = investmentBarsContentEl.getBoundingClientRect();
    investmentBarsViewportEl.style.width = r.width + "px";
    investmentBarsViewportEl.style.height = r.height + "px";
  }

  function syncInvestmentBarsScale() {
    if (!investmentBarsContentEl) return;
    const ro = new ResizeObserver(updateInvestmentBarsViewportHeight);
    ro.observe(investmentBarsContentEl);
    updateInvestmentBarsViewportHeight();
  }

  // Shifts .shop-builds-right down (via margin-top) so .investment-bars'
  // own top lines up with .build-sections-container's top — i.e. where
  // sections actually start, below the Add Section button — rather than
  // with .shop-builds-left's own top (the button's top). Resets
  // margin-top to 0 before each measurement so repeated calls (on
  // resize) don't compound the offset.
  function updateInvestmentBarsTopAlign() {
    if (!shopBuildsRightEl || !investmentBarsEl || !sectionsContainerEl) return;
    shopBuildsRightEl.style.marginTop = "0px";
    const targetTop = sectionsContainerEl.getBoundingClientRect().top;
    const currentTop = investmentBarsEl.getBoundingClientRect().top;
    shopBuildsRightEl.style.marginTop = targetTop - currentTop + "px";
  }

  buildTooltipDisplay();
  buildTabs();
  buildPanels();
  buildSearchPanel();
  buildShopBuildsUI();
  buildBuildTabsUI();
  buildSaveBuildModal();
  buildNewBuildConfirmModal();
  syncTooltipDisplayHeight();
  syncShopBuildsAlignment();
  syncHeaderCreditAlignment();
  syncBuildSectionsScale();
  syncInvestmentBarsScale();
  setupDragAutoScroll();
})();
