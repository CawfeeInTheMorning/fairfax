(function () {
  "use strict";

  const CATEGORY_ORDER = ["weapon", "vitality", "spirit"];
  const TIER_ORDER = [800, 1600, 3200, 6400];

  const shopEl = document.getElementById("shop-panels");
  const tabsEl = document.getElementById("category-tabs");
  const tooltipDisplayEl = document.getElementById("tooltip-display");
  const searchTab = document.getElementById("tab-search");

  let searchInputEl = null;
  let tooltipCard = null;
  let selectedCard = null;
  let activeCategory = "weapon";

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
          grid.appendChild(buildItemCard(cat, tier, item));
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
    items.forEach((item) => grid.appendChild(buildItemCard(cat, tier, item)));
    quad.appendChild(grid);

    return quad;
  }

  function buildItemCard(cat, tier, item) {
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
    return escapeHtml(text || "").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
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
    const direction = details.upgradesFrom ? "From" : details.upgradesTo ? "To" : null;
    if (!direction) return "";
    // A base-tier item commonly upgrades into more than one higher-tier
    // option (e.g. Extra Spirit -> Improved Spirit + Surge of Power), so
    // this accepts either a single name or an array of names.
    const names = [].concat(details.upgradesFrom || details.upgradesTo);
    const itemsHtml = names.map(renderUpgradeItem).join("");

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

  function syncTooltipDisplayHeight() {
    const ro = new ResizeObserver((entries) => {
      const h = entries[0].contentRect.height;
      if (h > 0) {
        document.documentElement.style.setProperty("--tooltip-display-h", h + "px");
      }
    });
    ro.observe(shopEl);
  }

  buildTooltipDisplay();
  buildTabs();
  buildPanels();
  buildSearchPanel();
  syncTooltipDisplayHeight();
})();
