(function () {
  "use strict";

  const CATEGORY_ORDER = ["weapon", "vitality", "spirit"];
  const TIER_ORDER = [800, 1600, 3200, 6400];
  const BUILD_STORAGE_KEY = "deadlockShopBuild";
  const BUILD_STORAGE_VERSION = 1;

  // Mirrors the .mod-box / .build-section-items sizing in style.css (80x125
  // cards, 4px gap, 12px padding on the items row, 2px section border) —
  // used to snap section resizing to whole numbers of item columns/rows
  // rather than arbitrary pixel sizes.
  const ITEM_SLOT_W = 80;
  const ITEM_SLOT_H = 125;
  const ITEM_SLOT_GAP = 4;
  const ITEMS_PADDING = 12; // each side of .build-section-items
  const SECTION_BORDER = 2; // each side of .build-section

  const shopEl = document.getElementById("shop-panels");
  const tabsEl = document.getElementById("category-tabs");
  const tooltipDisplayEl = document.getElementById("tooltip-display");
  const shopBuildsEl = document.getElementById("shop-builds");
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
    const input = document.createElement("input");
    input.type = "text";
    input.id = "item-search-input";
    input.placeholder = "Search items...";
    input.addEventListener("input", (e) => applySearchFilter(e.target.value));
    inputWrap.appendChild(input);
    panel.appendChild(inputWrap);
    searchInputEl = input;

    const results = document.createElement("div");
    results.className = "search-results";

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

      results.appendChild(section);
    });

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
      showTooltipDisplay(cat, tier, item);
      card.classList.add("is-hovered");
      updatePanelDimming(card.closest(".shop-panel"));
    });
    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-hovered");
      updatePanelDimming(card.closest(".shop-panel"));
      if (selectedCard) {
        showTooltipDisplay(selectedCard.cat, selectedCard.tier, selectedCard.item);
      } else {
        hideTooltipDisplay();
      }
    });
    card.addEventListener("click", () => {
      if (selectedCard && selectedCard.el === card) {
        deselectCard();
        hideTooltipDisplay();
        updatePanelDimming(card.closest(".shop-panel"));
        return;
      }
      if (selectedCard) selectedCard.el.classList.remove("selected");
      card.classList.add("selected");
      selectedCard = { el: card, cat, tier, item };
      showTooltipDisplay(cat, tier, item);
      updatePanelDimming(card.closest(".shop-panel"));
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

    tooltipDisplayEl.appendChild(card);

    tooltipCard = { root: card, top, name, costValue, body, desc };
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

  function buildTooltipBodyHtml(details) {
    const innateHtml = (details.innateStats || []).length
      ? '<div class="tooltip-innate-stats">' + details.innateStats.map(renderInnateStat).join("") + "</div>"
      : "";

    const sectionsHtml = (details.abilities || []).map(buildAbilitySectionHtml).join("");
    const upgradesHtml = buildUpgradesHtml(details);

    return innateHtml + sectionsHtml + upgradesHtml;
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

  function applySearchFilter(query) {
    const q = query.trim().toLowerCase();
    document.querySelectorAll(".mod-box").forEach((card) => {
      const match = !q || card.dataset.name.toLowerCase().includes(q);
      card.classList.toggle("search-hidden", !match);
    });
  }

  // ---------- Build creator ----------

  function makeId(prefix) {
    return prefix + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  function loadBuildFromStorage() {
    const fallback = { version: BUILD_STORAGE_VERSION, sections: [] };
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
    return { version: BUILD_STORAGE_VERSION, sections: parsed.sections };
  }

  function saveBuildToStorage(state) {
    try {
      localStorage.setItem(BUILD_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // Storage full/unavailable (e.g. private browsing) — the build stays
      // usable for the rest of the session, it just won't persist.
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
  // resolveBuildItem) grouped by category, across ALL sections — the
  // investment mechanic is a single global total per category, not a
  // per-section one, matching how it actually works in-game.
  function calculateInvestmentTotals() {
    const totals = { weapon: 0, vitality: 0, spirit: 0 };
    buildState.sections.forEach((section) => {
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

  // Hovering a placed item highlights the segment range on its category's
  // bar that this ONE item's soul cost accounts for, attributed by
  // placement order (first section to last, first item to last within a
  // section) rather than by removing this item from the grand total —
  // e.g. with Spirit Burn (6,400 souls) placed before Lightning Scroll
  // (6,400 souls), Spirit Burn accounts for the 0-6,400 range and
  // Lightning Scroll accounts for the 6,400-12,800 range, even though
  // both cost the same. Tier indices (not raw soul amounts) are compared
  // since segments represent tier thresholds, not a proportional/
  // continuous scale.
  function highlightInvestmentContribution(category, file) {
    if (!investmentBarEls) return;
    let runningTotal = 0;
    let fromTotal = null;
    let toTotal = null;
    buildState.sections.some((section) => {
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

    const inner = document.createElement("div");
    inner.className = "shop-builds-inner";

    const left = document.createElement("div");
    left.className = "shop-builds-left";

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "build-add-section-btn";
    const addBtnIcon = document.createElement("span");
    addBtnIcon.className = "build-add-section-icon";
    addBtn.appendChild(addBtnIcon);
    addBtn.appendChild(document.createTextNode("Add Section"));
    addBtn.addEventListener("click", addBuildSection);
    left.appendChild(addBtn);

    buildSectionsViewportEl = document.createElement("div");
    buildSectionsViewportEl.className = "build-sections-viewport";
    left.appendChild(buildSectionsViewportEl);

    sectionsContainerEl = document.createElement("div");
    sectionsContainerEl.className = "build-sections-container";
    buildSectionsViewportEl.appendChild(sectionsContainerEl);

    inner.appendChild(left);

    // Right column — investment bars for now, room for more build-summary
    // info alongside them later.
    const right = document.createElement("div");
    right.className = "shop-builds-right";

    investmentBarsEl = buildInvestmentBarsUI();
    right.appendChild(investmentBarsEl);

    inner.appendChild(right);
    shopBuildsRightEl = right;

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

    renderBuildSections();
    updateShopItemUsedState();
  }

  function renderBuildSections() {
    sectionsContainerEl.innerHTML = "";
    const frag = document.createDocumentFragment();
    buildState.sections.forEach((section, index) => frag.appendChild(buildSectionEl(section, index)));
    sectionsContainerEl.appendChild(frag);
    renderInvestmentBars();
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

    const optionalBadge = document.createElement("div");
    optionalBadge.className = "build-section-optional-badge";
    optionalBadge.textContent = "Optional";
    optionalBadge.dataset.action = "toggle-optional";
    header.appendChild(optionalBadge);

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

  function toggleSectionOptional(id) {
    const section = findSection(id);
    if (!section) return;
    section.optional = !section.optional;
    saveBuildToStorage(buildState);
    renderBuildSections();
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
    const startRect = sectionEl.getBoundingClientRect();
    const headerEl = sectionEl.querySelector(".build-section-header");
    const headerHeight = headerEl.getBoundingClientRect().height;

    function onMouseMove(moveEvent) {
      const rawWidth = startRect.width + (moveEvent.clientX - startX);
      const rawHeight = startRect.height + (moveEvent.clientY - startY);
      const snappedWidth = widthForColumns(columnsForWidth(rawWidth));
      const snappedHeight = heightForRows(rowsForHeight(rawHeight, headerHeight), headerHeight);
      sectionEl.style.width = snappedWidth + "px";
      sectionEl.style.minHeight = snappedHeight + "px";
    }

    function onMouseUp() {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      const finalRect = sectionEl.getBoundingClientRect();
      resizeSection(sectionEl.dataset.sectionId, Math.round(finalRect.width), Math.round(finalRect.height));
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
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
        shopBuildsEl.style.marginLeft = marginLeft;
        if (shopGraphsEl) {
          shopGraphsEl.style.width = width + "px";
          shopGraphsEl.style.marginLeft = marginLeft;
        }
      }
      // .shop-builds-inner's width (and therefore .build-sections-container's
      // and .investment-bars-content's scale factors, both keyed off that
      // same cqw) changes right along with this, so both viewport heights
      // need recomputing too.
      updateBuildSectionsViewportHeight();
      updateInvestmentBarsViewportHeight();
      updateInvestmentBarsTopAlign();
    }
    const ro = new ResizeObserver(update);
    ro.observe(shopEl);
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

  function syncBuildSectionsScale() {
    if (!sectionsContainerEl) return;
    const ro = new ResizeObserver(updateBuildSectionsViewportHeight);
    ro.observe(sectionsContainerEl);
    updateBuildSectionsViewportHeight();
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
  syncTooltipDisplayHeight();
  syncShopBuildsAlignment();
  syncBuildSectionsScale();
  syncInvestmentBarsScale();
  setupDragAutoScroll();
})();
